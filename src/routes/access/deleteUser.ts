import express from 'express';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';

import asyncHandler from '../../helpers/asyncHandler';
import permission from '../../helpers/permissionRoute';
import { PublicRequest } from '../../types/app-request';
import { Types } from 'mongoose';
import authentication from '../../auth/authentication';

const router = express.Router();

router.delete(
  '/user/:id',
  authentication,
  permission(),
  asyncHandler(async (req: PublicRequest, res) => {
    const userId = req.params.id;
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestResponse('Invalid ID');
    }
    const id = userId as unknown as Types.ObjectId;
    const user = await UserRepo.findById(id);
    if (!user) throw new BadRequestResponse('User not found');
    const userDeleted = await UserRepo.deleteUser(user._id);
    new SuccessResponse('User deleted', {
      user: userDeleted,
    }).send(res);
  }),
);

export default router;
