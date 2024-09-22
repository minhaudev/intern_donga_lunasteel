import ApiKey, { ApiKeyModel } from '../model/ApiKey';

async function findByKey(key: string): Promise<ApiKey | null> {
  try {
    return await ApiKeyModel.findOne({ key: key }).lean().exec();;
  } catch (error) {
    console.error('Error finding API key:', error);
    return null;
  }
}

export default {
  findByKey,
};
