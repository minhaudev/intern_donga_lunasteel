import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator from '../../helpers/validator';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../auth/authentication';
import permission from '../../helpers/permissionGeneral';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// router.use(authentication);
/*-------------------------------------------------------------------------*/

router.post(
  '',
  // permission(),
  asyncHandler(async (req: any, res) => {}),
);

export default router;
