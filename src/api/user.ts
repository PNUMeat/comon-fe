import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

export const kakaoOauth2LoginUrl = `/oauth2/authorization/kakao`;

type ProfileCommonArgs = {
  memberName: string;
  memberExplain: string;
};

type ProfileMutationArgs = ProfileCommonArgs & {
  image: File | null;
};

type ProfileQueryResp = ProfileCommonArgs & {
  imageUrl: string;
  uuid: string;
};

export const createProfile = async ({
  memberName,
  memberExplain,
  image,
}: ProfileMutationArgs) => {
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
}: ProfileMutationArgs) => {
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

export const getMyProfile = async (): Promise<ProfileQueryResp> => {
  const res = await apiInstance.get<ServerResponse<ProfileQueryResp>>(
    'v1/members/own-profile'
  );

  return res.data.data;
};

export const getProfile = async (uuid: string): Promise<ProfileQueryResp> => {
  const res = await apiInstance.get<ServerResponse<ProfileQueryResp>>(
    `v1/members/profile/${uuid}`
  );

  return res.data.data;
};
