import Setting, { SettingModel } from '../model/Setting';

async function findByName(name: string): Promise<Setting | null> {
  return SettingModel.findOne({ name: name }).lean().exec();
}
async function findUrlByName(
  name: string,
  path: string,
  method: string,
): Promise<number | null> {
  const setting = await SettingModel.findOne({ name: name }).lean().exec();

  if (setting && setting.data) {
    const match = setting.data.find(
      (item: any) => item.path === path && item.method === method,
    );

    if (match) {
      return match.value;
    }
  }
  // If no match or setting is found, return null
  return null;
}

export default {
  findByName,
  findUrlByName,
};
