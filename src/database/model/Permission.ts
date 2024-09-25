import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Permission';
export const COLLECTION_NAME = 'permissions';

export default interface Permission {
  _id: Types.ObjectId;
  name: string;
  value: number;
  description: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Permission>(
  {
    name: {
      type: Schema.Types.String,
      maxlength: 255,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Number,
      maxlength: 255,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      maxlength: 255,
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

export const PermissionModel = model<Permission>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
