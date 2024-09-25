import express from 'express';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import { model, Schema, Types } from 'mongoose';
import {
  delByKey,
  getValue,
  incrementLoginAttempts,
  setValueRedis,
} from '../../cache/query';

const router = express.Router();
// const
const expire = 10;
const expire_second = expire * 10 * 1000;
const maxAttempts = 4;
router.post(
  '/login',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const userAgent = req.headers['user-agent'];
    const redisKeyUserAgent = `login_attempts:${userAgent}`;
    const lockKeyUserAgent = `account_locked:${userAgent}`;

    const isLockedUserAgent = await getValue(lockKeyUserAgent);
    const user = await UserRepo.findByEmail(req.body.email, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'roles',
      'password',
    ]);

    const redisKeyUser = user ? `login_attempts:${user._id}` : '';
    const lockKeyUser = user ? `account_locked:${user._id}` : '';
    const isLockedUser = user ? await getValue(lockKeyUser) : null;

    if (isLockedUserAgent || isLockedUser) {
      return new BadRequestResponse(
        `Account is locked. Please wait ${expire} minutes.`,
      ).send(res);
    }

    const attemptsUserAgent = (await getValue(redisKeyUserAgent)) || '0';
    const attemptsUser = user ? (await getValue(redisKeyUser)) || '0' : '0';

    if (
      parseInt(attemptsUserAgent) >= maxAttempts ||
      parseInt(attemptsUser) >= maxAttempts
    ) {
      if (!isLockedUserAgent) {
        await setValueRedis(lockKeyUserAgent, 'locked', expire_second);
      }
      if (user && !isLockedUser) {
        await setValueRedis(lockKeyUser, 'locked', expire_second);
      }
      return new BadRequestResponse(
        `Too many login attempts. Your account is locked for ${expire} minutes.`,
      ).send(res);
    }

    if (!user) {
      await incrementLoginAttempts(redisKeyUserAgent);
      return new BadRequestResponse('Invalid email or password').send(res);
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      await incrementLoginAttempts(redisKeyUserAgent);
      await incrementLoginAttempts(redisKeyUser);
      return new BadRequestResponse('Invalid email or password').send(res);
    }

    await delByKey(redisKeyUserAgent);
    await delByKey(redisKeyUser);
    await delByKey(lockKeyUserAgent);
    await delByKey(lockKeyUser);

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
