import User, { UserModel } from '../model/User';
import { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import mongoose, { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { random } from 'lodash';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}

async function findPrivateProfileById(
  id: Types.ObjectId,
): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select('+email')
    .populate({
      path: 'roles',
      match: { status: true },
      select: { code: 1 },
    })
    .lean<User>()
    .exec();
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id })
    .select('+email +password +roles')
    .populate({
      path: 'roles',
    })
    .lean()
    .exec();
}

async function findByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email: email })
    .select('+email +password +roles +gender')
    .populate({
      path: 'roles',
      // match: { status: true },
      select: { code: 1 },
    })
    .lean()
    .exec();
}

async function findFieldsById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id })
    .lean() // Chuyển đổi tài liệu Mongoose thành đối tượng đơn giản
    .exec(); // Thực thi truy vấn và trả về một promise
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }).lean().exec();
}

// Import mongoose để sử dụng ObjectId

async function create(
  user: Partial<User>,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
  const now = new Date();

  // Mảng các ID vai trò
  const roleIds = ['66e14a63af099de6bc59948a', '66e14a63af099de6bc59948b'];

  // Chuyển đổi mảng chuỗi thành mảng ObjectId
  const roleObjectIds = roleIds.map((id) => new mongoose.Types.ObjectId(id));
  console.log('roleObjectIds', roleObjectIds);
  // Cập nhật thông tin người dùng với các giá trị mặc định
  const updatedUser = {
    ...user,
    roles: roleObjectIds,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    emailVerifiedAt: null,
    accessToken: accessTokenKey,
    refreshToken: refreshTokenKey,
    employeeId: user.employeeId || random(1, 10000),
    fullname: user.fullname || '',
    password: user.password || '',
    birthday: user.birthday || now,
    gender: user.gender || 'male', // Đặt giá trị mặc định là 'male' hoặc 'female'
    phone: user.phone || '',
    avatar: user.avatar || '',
    status: user.status || 'inactive',
    leftBranch: user.leftBranch || '',
    rightBranch: user.rightBranch || '',
    departmentId: user.departmentId || null,
  };

  // Tạo người dùng mới
  const createdUser = await UserModel.create(updatedUser);
  // console.log("createdUser",createdUser)
  // Tạo keystore cho người dùng
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );
  console.log(createdUser);
  return {
    user: createdUser.toObject(), // Chuyển đối tượng người dùng thành JSON
    keystore: keystore,
  };
}

async function update(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
  user.updatedAt = new Date();
  await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    user,
    accessTokenKey,
    refreshTokenKey,
  );
  return { user: user, keystore: keystore };
}

async function updateInfo(user: User): Promise<any> {
  user.updatedAt = new Date();
  return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
}
async function findAll(): Promise<User[]> {
  return UserModel.find().lean().exec();
}

export default {
  exists,
  findPrivateProfileById,
  findById,
  findByEmail,
  findFieldsById,
  findPublicProfileById,
  create,
  update,
  updateInfo,
  findAll,
};
