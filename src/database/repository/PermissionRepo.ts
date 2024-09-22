import Permission, { PermissionModel } from '../model/Permission';

async function findByName(name: string): Promise<Permission | null> {
  return PermissionModel.findOne({ name: name }).lean().exec();
}

async function findByValue(value: number): Promise<Permission[]> {
  return PermissionModel.find({ value: value })
    .lean()
    .exec();
}

export default {
  findByName,
  findByValue,
};
