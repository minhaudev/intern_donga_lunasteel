import User, { UserModel } from '../model/User';
import { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import mongoose, { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { random } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}
uuidv4();
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
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id })
    .select('+email +password +roles')
    .populate({
      path: 'roles',
    })
    .lean()
    .exec();
}

async function findByEmail(
  email: string,
  fields?: string[],
): Promise<User | null> {
  const selectFields = fields ? fields.join(' ') : '';
  return UserModel.findOne({ email: email, isDeleted: false })
    .select(selectFields)
    .populate({
      path: 'roles',
      select: 'code',
    })
    .lean()
    .exec();
}

async function findFieldsById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id }).lean().exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(
  user: Partial<User>,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
  const now = new Date();

  const createUserData = {
    ...user,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
    emailVerifiedAt: null,
    accessToken: accessTokenKey,
    refreshToken: refreshTokenKey,
    employeeId: user.employeeId || uuidv4(),
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    password: user.password || '',
    birthday: user.birthday || now,
    gender: user.gender || 'male',
    phone: user.phone || '',
    avatar: user.avatar || '',
    status: user.status || 'inactive',
    roles: user.roles || 0,
    teams: user.teams || 0,
  };

  const createdUser = await UserModel.create(createUserData);

  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );

  return {
    user: createdUser.toObject(),
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
};
