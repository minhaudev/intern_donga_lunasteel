import express from 'express';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import { send } from 'process';
import { sendMail } from '../../helpers/sendMail';
import { sign, verify } from 'jsonwebtoken';
import { UserModel } from '../../database/model/User';
import {
  forgetPasswordSchema,
  checkPasswordSchema,
  updatePasswordSchema,
} from '../../auth/schema';
import Joi from 'joi';

const router = express.Router();
// ====
const validateSchema =
  (schema: Joi.ObjectSchema<any>) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return new BadRequestResponse(error.details[0].message).send(res);
    }
    next();
  };
// ===
router.post(
  '/recover',
  validateSchema(forgetPasswordSchema),
  async (req, res) => {
    const { email } = req.body;
    const user = await UserRepo.findByEmail(email);
    if (!user) {
      return new BadRequestResponse('Email not found').send(res);
    }
    const token = sign({ userId: user._id, email: user.email }, 'secret', {
      expiresIn: '60m',
    });

    const link = `${process.env.RECOVER_PASSWORD}/${token}`;

    const result = await sendMail({
      sender: `${process.env.SEENDER}`,
      recipient: email,
      subject: 'recover password',
      text: 'thay doi mat khau LUNA',
      html: ` 
      <p>Chào bạn,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào liên kết dưới đây để tiếp tục quá trình đặt lại mật khẩu:</p>
            <p><a href=${link}>Click here</a></p>
            <p>Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email này. Xin cảm ơn!</p>
            <p>Trân trọng,<br/>[Lunasteel]</p>
          `,
    });
    return new SuccessResponse('Send email success', {
      result,
      link,
    }).send(res);
  },
);
router.get('/checkpassword/:token', async (req, res) => {
  // Validate token parameter
  const { error } = checkPasswordSchema.validate(req.params);
  if (error) {
    return new BadRequestResponse(error.details[0].message).send(res);
  }

  try {
    const { token } = req.params;
    // Verify token
    const decoded = verify(token, 'secret') as {
      userId: string;
      email: string;
    };
    const { email } = decoded;
    const user = await UserRepo.findByEmail(email);

    if (!user) {
      return new BadRequestResponse('Email not found').send(res);
    }

    // If email is found, respond with success
    return new SuccessResponse('Email found', {
      token,
    }).send(res);
  } catch (error) {
    // Handle errors thrown by verify function
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return new BadRequestResponse('Invalid token').send(res);
    } else if (error instanceof Error && error.name === 'TokenExpiredError') {
      return new BadRequestResponse('Token expired').send(res);
    } else {
      // Handle other errors
      return new BadRequestResponse('Invalid token or error').send(res);
    }
  }
});

router.post(
  '/reset-password/:token',
  validateSchema(updatePasswordSchema),
  async (req, res) => {
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      return new BadRequestResponse(error.details[0].message).send(res);
    }
    try {
      const { token } = req.params;
      const { newPassword, conformPassword } = req.body;

      const { email } = verify(token, 'secret') as {
        userId: string;
        email: string;
      };
      const user = await UserRepo.findByEmail(email);
      if (!user) {
        return new BadRequestResponse('User not found').send(res);
      }

      if (newPassword === conformPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        // Update the user's password in the database
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
    } catch (error) {
      return new BadRequestError('Updated password failed');
    }
  },
);

export default router;
