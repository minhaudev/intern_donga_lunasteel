import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';
export enum RoleCode {
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_EXECUTIVE = 'SALES_EXECUTIVE',
  MARKETING_MANAGER = 'MARKETING_MANAGER',
  MARKETING_EXECUTIVE = 'MARKETING_EXECUTIVE',
  HR_MANAGER = 'HR_MANAGER',
  HR_EXECUTIVE = 'HR_EXECUTIVE',
  IT_SUPPORT = 'IT_SUPPORT',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  ADMIN = 'ADMIN',
}

export default interface Role {
  _id: Types.ObjectId;
  code: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Role>(
  {
    code: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(RoleCode),
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

schema.index({ code: 1, status: 1 });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
