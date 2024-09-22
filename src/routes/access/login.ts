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

import { createClient } from 'redis';

const router = express.Router();
const redisClient = createClient();

redisClient.on('error', (err) => {
  return new BadRequestResponse('Redis Client Error').send(err);
});

// Kết nối Redis Client
(async () => {
  await redisClient.connect();
})();
router.post(
  '/login',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const userAgent = req.headers['user-agent'];

    const redisKey = `login_attempts:${userAgent}`;
    const lockKey = `account_locked:${userAgent}`;

    // Kiểm tra xem tài khoản đã bị khóa chưa
    const isLocked = await redisClient.get(lockKey);
    if (isLocked) {
      return new BadRequestResponse(
        'Account is locked. Please wait 10 minutes.',
      ).send(res);
    }

    const attempts = await redisClient.get(redisKey);
    if (attempts && parseInt(attempts) >= 4) {
      await redisClient.set(lockKey, 'locked', { EX: 600 });
      return new BadRequestResponse(
        'Too many login attempts. Your account is locked for 10 minutes.',
      ).send(res);
    }

    const user = await UserRepo.findByEmail(req.body.email, [
      'firstName',
      'lastName',
      'email',
      'isDeleted',
      'roles',
      'password',
    ]);

    if (!user) {
      await redisClient.incr(redisKey);
      await redisClient.expire(redisKey, 600);
      return new BadRequestResponse('Invalid email or password').send(res);
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      await redisClient.incr(redisKey);
      await redisClient.expire(redisKey, 600);
      return new BadRequestResponse('Invalid email or password').send(res);
    }

    await redisClient.del(redisKey);
    await redisClient.del(lockKey);

    if (user.isDeleted) throw new BadRequestError('User has been banned');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user, [
      '_id',
      'firstName',
      'lastName',
      'avatar',
      'email',
      'roles',
    ]);

    new SuccessResponse('Login Success', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
