import { Types } from 'mongoose';
import { getSelectFields } from '../../helpers/utils';
import Warehouse, { WarehouseModel } from '../model/Warehouse';
async function getAll(fields?: string[]): Promise<Warehouse[] | null> {
  const selectFields = getSelectFields(fields);
  return WarehouseModel.find().select(selectFields).lean().exec();
}
async function getRowsByItemId(
  itemId: number,
  fields?: string[],
): Promise<Warehouse[] | null> {
  const selectFields = getSelectFields(fields);
  return WarehouseModel.find({ itemId: itemId })
    .select(selectFields)
    .lean()
    .exec();
}
export default {
  getAll,
  getRowsByItemId,
};
