import express, { query } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import asyncHandler from '../../helpers/asyncHandler';

const router = express.Router();

//----------------------------------------------------------------
// API GET để lấy tất cả người dùng mà không cần xác thực hoặc quyền truy cập
//----------------------------------------------------------------
router.get(
  '/allusers/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const users = await UserRepo.findById(id); // Sử dụng phương thức findAll từ UserRepo để lấy tất cả user
    new SuccessResponse('User found', users).send(res);
  }
)
)
export default router;

