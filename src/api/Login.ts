import apiInstance from '@/api/apiInstance';

export const kakaoOauth2LoginUrl = `/oauth2/authorization/kakao`;

type ProfileArgs = {
  memberName: string;
  image: File | null;
  memberExplain: string;
};

export const createProfile = async ({
  memberName,
  memberExplain,
  image,
}: ProfileArgs) => {
  const formData = new FormData();

  formData.append('memberName', memberName);
  formData.append('memberExplain', memberExplain);
  if (image) {
    formData.append('image', image);
  }

  const res = await apiInstance.post('v1/members', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const changeProfile = async ({
  memberName,
  memberExplain,
  image,
}: ProfileArgs) => {
  const formData = new FormData();

  formData.append('memberName', memberName);
  formData.append('memberExplain', memberExplain);
  if (image) {
    formData.append('image', image);
  }

  const res = await apiInstance.put('v1/members', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
