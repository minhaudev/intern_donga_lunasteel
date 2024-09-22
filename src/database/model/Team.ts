import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Team';
export const COLLECTION_NAME = 'teams';

export default interface Team {
  _id: Types.ObjectId;
  name: string;
  value: number;
  description: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Team>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 255,
    },
    value: {
      type: Schema.Types.Number,
      required: true,
      maxlength: 255,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 255,
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

export const TeamModel = model<Team>(DOCUMENT_NAME, schema, COLLECTION_NAME);
