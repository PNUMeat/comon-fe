import apiInstance from '@/api/apiInstance';

export const kakaoOauth2LoginUrl = `/oauth2/authorization/kakao`;

type CreateProfileArgs = {
  memberName: string;
  image: string | null;
  memberExplain: string;
};

export const createProfile = async ({
  memberName,
  memberExplain,
  image,
}: CreateProfileArgs) => {
  const formData = new FormData();

  formData.append('memberName', memberName);
  formData.append('memberExplain', memberExplain);
  formData.append('image', image || '');

  const res = await apiInstance.post('v1/members', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
