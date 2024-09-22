import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../core/ApiError';
import { Types } from 'mongoose';
export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes('://')) return helpers.error('any.invalid');
    return value;
  }, 'Url Endpoint Validation');

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 'Authorization Header Validation');

export default (
    schema: Joi.AnySchema,
    source: ValidationSource = ValidationSource.BODY,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ''))
        .join(',');

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };

// validate id

async function findFieldsById(
  id: Types.ObjectId,
  model: any,
): Promise<any | null> {
  return model.findOne({ _id: id }).lean().exec();
}
export const validateIds = async (ids: string[], model: any) => {
  const invalidIds: string[] = [];

  for (const id of ids) {
    if (!Types.ObjectId.isValid(id)) {
      invalidIds.push(id);
      continue; // Bỏ qua kiểm tra tồn tại nếu ID không hợp lệ
    }

    const exists = await findFieldsById(new Types.ObjectId(id), model);
    if (!exists) {
      invalidIds.push(id);
    }
  }

  if (invalidIds.length > 0) {
    throw new BadRequestError(`Invalid IDs found: ${invalidIds.join(', ')}`);
  }
};
