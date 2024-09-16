import { model, Schema, Types } from 'mongoose';

// Tên tài liệu và bộ sưu tập MongoDB
export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

// Định nghĩa giao diện cho User
export default interface User {
  _id: Types.ObjectId;
  employeeId: string;
  email: string;
  password: string;
  fullname: string;
  birthday: Date;
  gender: 'male' | 'female';
  phone: string;
  avatar: string;
    departmentId: Types.ObjectId;
    roles: Types.ObjectId[];
  emailVerifiedAt?: Date | null;
  accessToken: string;
  refreshToken: string;
  status: 'active' | 'inactive';
  leftBranch: string;
  rightBranch: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa schema cho User
const userSchema = new Schema<User>(
  {
    employeeId: {
      type: Schema.Types.String,
      // required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    fullname: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    birthday: {
      type: Schema.Types.Date,
      // required: true,
    },
    gender: {
      type: Schema.Types.String,
      enum: ['male', 'female'],
      // required: true,
    },
    phone: {
      type: Schema.Types.String,
      // required: true,
    },
    avatar: {
      type: Schema.Types.String,
      // required: true,
    },
  
    departmentId: {
         type: Schema.Types.ObjectId,
          ref: 'Department',
          // required: true,
        },
        roles: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
          },
        ],
  
    emailVerifiedAt: {
      type: Schema.Types.Date,
      default: null,
    },
    accessToken: {
      type: Schema.Types.String,
      required: true,
    },
    refreshToken: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ['active', 'inactive'],
      // required: true,
    },
    leftBranch: {
      type: Schema.Types.String,
      // required: true,
    },
    rightBranch: {
      type: Schema.Types.String,
      // required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      // default: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

// Indexes để tối ưu hóa truy vấn
userSchema.index({ employeeId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ isDeleted: 1 });

// Xuất mô hình User
export const UserModel = model<User>(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
