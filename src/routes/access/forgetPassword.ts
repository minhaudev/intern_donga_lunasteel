import express from 'express';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Joi from 'joi';
import UserRepo from '../../database/repository/UserRepo';
import {
  forgetPasswordSchema,
  checkPasswordSchema,
  updatePasswordSchema,
} from '../../auth/schema';
import { OAuth2Client } from 'google-auth-library';
import { BadRequestError } from '../../core/ApiError';
import { UserModel } from '../../database/model/User';

// Khởi tạo router
const router = express.Router();

// Thông tin OAuth2 và cấu hình email
const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN;
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;
const HOST_EMAIL_SMTP = process.env.HOST_EMAIL_SMTP;
const HOST_EMAIL_PASSWORD = process.env.HOST_EMAIL_PASSWORD;
const HOST_EMAIL_EMAIL = process.env.HOST_EMAIL_EMAIL;
// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET,
);

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

// Middleware để validate schema
const validateSchema =
  (schema: Joi.ObjectSchema<any>) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return new BadRequestResponse(error.details[0].message).send(res);
    }
    next();
  };

// Route /recover để gửi email khôi phục mật khẩu
router.post(
  '/recover',
  validateSchema(forgetPasswordSchema),
  async (req, res) => {
    try {
      const { email } = req.body;

      // Tìm user theo email
      const user = await UserRepo.findByEmail(email, [
        'email',
        'password',
        'roles',
        'gender',
      ]);
      if (!user) {
        return new BadRequestResponse('Email not found').send(res);
      }

      // Tạo token
      const token = sign({ userId: user._id, email: user.email }, 'secret', {
        expiresIn: '30m',
      });

      // Tạo link khôi phục
      const link = `${process.env.RECOVER_PASSWORD}/${token}`;

      // Lấy AccessToken từ OAuth2Client
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      const myAccessToken = myAccessTokenObject?.token;

      if (!myAccessToken) {
        return new BadRequestResponse('can not take token!').send(res);
      }

      // Cấu hình Nodemailer với OAuth2
      const transport =
        process.env.USE_GMAIL === 'true'
          ? nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user: ADMIN_EMAIL_ADDRESS,
                clientId: GOOGLE_MAILER_CLIENT_ID,
                clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
                refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: myAccessToken,
              },
            })
          : nodemailer.createTransport({
              host: HOST_EMAIL_SMTP,
              port: 465, // Cổng SMTP
              secure: true, // true nếu sử dụng SSL/TLS
              auth: {
                user: HOST_EMAIL_EMAIL, // Email đăng nhập
                pass: HOST_EMAIL_PASSWORD, // Mật khẩu
              },
            });

      // Tạo thông tin email
      const mailOptions = {
        from:
          process.env.USE_GMAIL === 'true'
            ? ADMIN_EMAIL_ADDRESS
            : HOST_EMAIL_EMAIL,
        to: email,
        subject: 'Recover Password',
        text: 'Thay đổi mật khẩu LUNA',
        html: `
          <p>Chào bạn,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào liên kết dưới đây để tiếp tục quá trình đặt lại mật khẩu:</p>
          <p><a href=${link}>Click here</a></p>
          <p>Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email này. Xin cảm ơn!</p>
          <p>Trân trọng,<br/>[Lunasteel]</p>
        `,
      };

      // Gửi email
      await transport.sendMail(mailOptions);

      // Trả về response success
      return new SuccessResponse('Send email success', {
        link,
      }).send(res);
    } catch (error) {
      return new BadRequestResponse('failed send email!').send(res);
    }
  },
);

// Route /checkpassword để kiểm tra token
router.get('/checkpassword/:token', async (req, res) => {
  const { error } = checkPasswordSchema.validate(req.params);
  if (error) {
    return new BadRequestResponse(error.details[0].message).send(res);
  }

  try {
    const { token } = req.params;

    const decoded = verify(token, 'secret') as {
      userId: string;
      email: string;
    };
    const { email } = decoded;
    const user = await UserRepo.findByEmail(email, [
      'email',
      'password',
      'roles',
      'gender',
    ]);

    if (!user) {
      return new BadRequestResponse('Email not found').send(res);
    }

    // Nếu tìm thấy email, phản hồi thành công
    return new SuccessResponse('Email found', {
      token,
    }).send(res);
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return new BadRequestResponse('Invalid token').send(res);
    } else if (error instanceof Error && error.name === 'TokenExpiredError') {
      return new BadRequestResponse('Token expired').send(res);
    } else {
      return new BadRequestResponse('Invalid token or error').send(res);
    }
  }
});

// Route /reset-password để đặt lại mật khẩu
router.post(
  '/reset-password/:token',
  validateSchema(updatePasswordSchema),
  async (req, res) => {
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      return new BadRequestResponse(error.details[0].message).send(res);
    }
    const { token } = req.params;
    const { newPassword, conformPassword } = req.body;

    const { email } = verify(token, 'secret') as {
      userId: string;
      email: string;
    };
    const user = await UserRepo.findByEmail(email, ['email', 'roles']);
    if (!user) {
      return new BadRequestResponse('User not found').send(res);
    }

    if (newPassword === conformPassword) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      // Cập nhật mật khẩu mới của người dùng trong cơ sở dữ liệu
      const newUser = await UserModel.findOneAndUpdate(
        { email },
        { password: passwordHash },
        { new: true },
      );

      if (newUser) {
        return new SuccessResponse('Updated password success', {
          newUser,
        }).send(res);
      }
    } else {
      return new BadRequestResponse('Passwords do not match').send(res);
    }
  },
);

export default router;
