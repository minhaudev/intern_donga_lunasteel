import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator, { validateIds } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
// import { RoleCode } from '../../database/model/Role';
import { getUserData } from './utils';
import { ApiKeyModel } from '../../database/model/ApiKey';
import calculateField from '../../helpers/calculateField';
import TeamRepo from '../../database/repository/TeamRepo';
import permission from '../../helpers/permissionRoute';
import authentication from '../../auth/authentication';
import Role, { RoleModel } from '../../database/model/Role';
import Team, { TeamModel } from '../../database/model/Team';
const router = express.Router();
const date = new Date();

router.post(
  '/basic',
  authentication,
  permission(),
  validator(schema.signup),
  // clame_role
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, gender, password, roles, teams } =
      req.body;
    console.log('data sign up', req.body);

    const user = await UserRepo.findByEmail(req.body.email, ['email']);
    if (user?.email === email) {
      throw new BadRequestError('Email already exists!');
    }

    await validateIds(roles, RoleModel);
    await validateIds(teams, TeamModel);

    const rolesData = await calculateField.findByValue(roles, 'roles');
    const teamsData = await calculateField.findByValue(teams, 'teams');

    if (!rolesData) throw new BadRequestError('Invalid role');
    if (!teamsData) throw new BadRequestError('Invalid team');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        firstName,
        lastName,
        email,
        gender,
        password: passwordHash,
        roles: rolesData,
        teams: teamsData,
      },
      accessTokenKey,
      refreshTokenKey,
    );

    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );
    const userData = await getUserData(createdUser, [
      '_id',
      'firstName',
      'lastName',
      'gender',
      'avatar',
      'email',
      'roles',
    ]);

    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
