import ApiKey, { ApiKeyModel } from '../model/ApiKey';

async function findByKey(key: string): Promise<ApiKey | null> {
  try {
    const apiKey = await ApiKeyModel.findOne({ key: key }).lean().exec(); // Dùng await để đợi kết quả
    console.log('apiKey3333', apiKey);
    return apiKey;
  } catch (error) {
    console.error('Error finding API key:', error); // Xử lý lỗi nếu có
    return null;
  }
}

export default {
  findByKey,
};
