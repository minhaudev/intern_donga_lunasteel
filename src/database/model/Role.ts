import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';
export enum RoleCode {
  GENERAL = 'GENERAL',
  ADMIN = 'ADMIN',
}

export default interface Role {
  _id: Types.ObjectId;
  name: string;
  value: number;
  description: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Role>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Number,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ name: 1, status: 1 });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
