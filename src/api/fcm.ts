import apiInstance from '@/api/apiInstance';

export const registerFcmToken = async (token: string) => {
  const res = await apiInstance.post('fcm/tokens', { token });

  return res.data;
};
