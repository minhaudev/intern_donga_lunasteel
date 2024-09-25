import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId;
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  avatar: string;
  roles: number;
  teams: number;
  emailVerifiedAt?: Date | null;
  accessToken: string;
  refreshToken: string;
  status?: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    employeeId: {
      type: Schema.Types.String,
      required: true,
      unique: false,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: Schema.Types.String,
      unique: false,
      required: true,
      trim: true,
      maxlength: 255,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 255,
    },
    firstName: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 255,
    },
    lastName: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 255,
    },
    birthday: {
      type: Schema.Types.Date,
    },
    gender: {
      type: Schema.Types.String,
      enum: ['male', 'female', 'other'],
    },
    phone: {
      type: Schema.Types.String,
      maxlength: 15,
    },
    avatar: {
      type: Schema.Types.String,
      maxlength: 255,
    },
    roles: {
      type: Schema.Types.Number,
      required: true,
      maxlength: 255,
    },
    teams: {
      type: Schema.Types.Number,
      required: true,
      maxlength: 255,
    },

    emailVerifiedAt: {
      type: Schema.Types.Date,
      maxlength: 255,
      default: null,
    },
    accessToken: {
      type: Schema.Types.String,
      required: true,
      maxlength: 255,
      minlength: 1,
    },
    refreshToken: {
      type: Schema.Types.String,
      required: true,
      maxlength: 255,
      minlength: 1,
    },
    status: {
      type: Schema.Types.String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
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

userSchema.index({ employeeId: 1 });
userSchema.index({ email: 1 });

export const UserModel = model<User>(
  DOCUMENT_NAME,
  userSchema,
  COLLECTION_NAME,
);
