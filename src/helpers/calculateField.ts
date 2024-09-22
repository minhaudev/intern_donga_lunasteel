import { Types } from 'mongoose';
import Role, { RoleModel } from '../database/model/Role';
import Team, { TeamModel } from '../database/model/Team';
import { BadRequestError } from '../core/ApiError';
const mongoose = require('mongoose');

async function findByValue(
  ids: string[],
  type: 'roles' | 'teams',
): Promise<number> {
  const isValidObjectId = ids.every((id) => Types.ObjectId.isValid(id));
  if (!isValidObjectId) {
    if (!isValidObjectId) {
      throw new BadRequestError('Invalid ObjectId found in the input array.');
    }
  }
  const objectIds = ids.map((id) => new Types.ObjectId(id));

  const Model = type === 'roles' ? RoleModel : TeamModel;

  const result = await Model.aggregate([
    {
      $match: {
        _id: { $in: objectIds },
      },
    },
    {
      $project: {
        value: 1, // Chỉ lấy field `value`
        _id: 0, // Không lấy `_id`
      },
    },
    {
      $group: {
        _id: null,
        totalValue: { $sum: '$value' },
      },
    },
  ]);

  return result[0]?.totalValue || 0;
}

export default {
  findByValue,
};
