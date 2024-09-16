import Role, { RoleModel } from '../model/Role';

async function findByCode(code: string): Promise<Role | null> {
  return RoleModel.findOne({ code: code }).lean().exec();
}

async function findByCodes(codes: string[]): Promise<Role[]> {
  return RoleModel.find({ code: { $in: codes } })
    .lean()
    .exec();
}

export default {
  findByCode,
  findByCodes,
};
