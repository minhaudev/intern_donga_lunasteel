import express from 'express';
import {
  BadRequestResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from '../../core/ApiResponse';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import UserRepo from '../../database/repository/UserRepo';
import { OAuth2Client } from 'google-auth-library';
import validator from '../../helpers/validator';
import schema from './schema';
import { getValue, setValueRedis } from '../../cache/query';

const router = express.Router();
let myOAuth2Client: OAuth2Client;
if (process.env.USE_GMAIL === 'true') {
  const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET,
  );

  myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  });
}

const expireAt = 600 * 1000;
router.post(
  '/recover',
  validator(schema.sendemailforgetpassword),
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await UserRepo.findByEmail(email, ['email', '_id']);

      if (!user) {
        return new BadRequestResponse('Email not found').send(res);
      }
      const rediskey = `reverover_password_${user?._id}`;
      const redisToken = await getValue(rediskey);

      if (redisToken) {
        return new SuccessMsgResponse(
          'Please check your email for recovery instructions',
        ).send(res);
      }
      const token = sign({ userId: user._id, email: user.email }, 'secret', {
        expiresIn: '10m',
      });
      await setValueRedis(rediskey, token, expireAt);

      const link = `${process.env.DOMAIN}/${process.env.RECOVER_PASSWORD}/${token}`;

      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      const accessToken = myAccessTokenObject?.token;

      if (!accessToken) {
        return new BadRequestResponse('Error server').send(res);
      }
      const transport =
        process.env.USE_GMAIL === 'true'
          ? nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user: process.env.ADMIN_EMAIL_ADDRESS,
                clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: accessToken,
              },
            })
          : nodemailer.createTransport({
              host: process.env.HOST_EMAIL_SMTP,
              port: process.env.HOST_EMAIL_PORT as unknown as number,
              secure: true,
              auth: {
                user: process.env.HOST_EMAIL_EMAIL,
                pass: process.env.HOST_EMAIL_PASSWORD,
              },
            });

      const mailOptions = {
        from:
          process.env.USE_GMAIL === 'true'
            ? process.env.ADMIN_EMAIL_ADDRESS
            : process.env.HOST_EMAIL_EMAIL,
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

      await transport.sendMail(mailOptions);

      return new SuccessResponse('Send email success', {
        link,
      }).send(res);
    } catch (error) {
      return new BadRequestResponse('Failed send email').send(res);
    }
  },
);

router.post(
  '/reset-password/:token',
  validator(schema.newpassword),
  async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    verify(token, 'secret', (error) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') {
          return new BadRequestResponse('Invalid token').send(res);
        } else if (error.name === 'TokenExpiredError') {
          return new BadRequestResponse('Token expired').send(res);
        }
      }
    });
    const { email } = verify(token, 'secret') as {
      email: string;
    };
    const user = await UserRepo.findByEmail(email, ['email', 'password']);

    if (!user) {
      return new BadRequestResponse('User not found').send(res);
    }
    const match = await bcrypt.compare(newPassword, user?.password);
    if (match) {
      return new BadRequestResponse(
        'New password is same with old password',
      ).send(res);
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const newUser = await UserRepo.updateInfo(user?._id, {
      password: passwordHash,
    });

    if (newUser) {
      return new SuccessResponse('Updated password success', {
        newUser,
      }).send(res);
    }
  },
);

export default router;
