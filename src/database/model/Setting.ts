import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Setting';
export const COLLECTION_NAME = 'settings';


export default interface Setting {
  _id: Types.ObjectId;
  name: string;
  data: any;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Setting>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true
    },
    data: {
      type: Schema.Types.Mixed,
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

export const SettingModel = model<Setting>(DOCUMENT_NAME, schema, COLLECTION_NAME);
