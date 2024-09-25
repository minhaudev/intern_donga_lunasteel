import User, { UserModel } from '../model/User';
import mongoose, { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { v4 as uuidv4 } from 'uuid';
import { getSelectFields } from '../../helpers/utils';
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
async function findById(
  id: Types.ObjectId,
  fields?: string[],
): Promise<User | null> {
  const selectFields = getSelectFields(fields);
  return UserModel.findOne({ _id: id, isDeleted: false })
    .select(selectFields)
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
  const selectFields = getSelectFields(fields);
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
    birthday: user.birthday || '',
    gender: user.gender || '',
    phone: user.phone || '',
    avatar: user.avatar || '',
    status: user.status || 'active',
    roles: user.roles,
    teams: user.teams,
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
  await UserModel.updateOne(
    { _id: user._id, isDeleted: false },
    { $set: { ...user } },
  )
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    user,
    accessTokenKey,
    refreshTokenKey,
  );
  return { user: user, keystore: keystore };
}

async function updateInfo(
  userId: object | Types.ObjectId,
  updateData: Partial<User>,
  fields?: string[],
): Promise<any> {
  const updatedAt = new Date();
  const selectFields = getSelectFields(fields);
  return UserModel.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: { ...updateData, updatedAt } },
    { new: true },
  )
    .select(selectFields)
    .populate({
      path: 'roles',
      select: 'code',
    })
    .lean()
    .exec();
}

async function deleteUser(userId: Types.ObjectId): Promise<any> {
  return UserModel.updateOne(
    { _id: userId, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true },
  )

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
  deleteUser,
};
