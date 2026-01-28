import apiInstance from '@/api/apiInstance';
import { API_BASE_URL } from '@/api/config.ts';
import { ServerResponse } from '@/api/types';

import { uploadImages } from './image';

export const kakaoOauth2LoginUrl = `${API_BASE_URL}/oauth2/authorization/kakao`;

type ProfileCommonArgs = {
  memberName: string;
  memberExplain: string;
};

type ProfileMutationArgs = ProfileCommonArgs & {
  image: File | null;
};

export type ProfileQueryResp = ProfileCommonArgs & {
  imageUrl: string;
  uuid: string;
};

export const createProfile = async ({
  memberName,
  memberExplain,
  image,
}: ProfileMutationArgs) => {
  let imageUrl: string | undefined;

  if (image) {
    const uploadedUrls = await uploadImages({
      files: [image],
      category: 'PROFILE',
    });
    imageUrl = uploadedUrls[0];
  }

  const body: {
    memberName: string;
    memberExplain: string;
    imageUrl?: string;
  } = {
    memberName,
    memberExplain,
    ...(imageUrl && { imageUrl }),
  };

  const res = await apiInstance.post('/v1/members', body);

  return res.data;
};

export const changeProfile = async ({
  memberName,
  memberExplain,
  image,
}: ProfileMutationArgs) => {
  let imageUrl: string | undefined;

  if (image) {
    const uploadedUrls = await uploadImages({
      files: [image],
      category: 'PROFILE',
    });
    imageUrl = uploadedUrls[0];
  }

  const body: {
    memberName: string;
    memberExplain: string;
    imageUrl?: string;
  } = {
    memberName,
    memberExplain,
    ...(imageUrl && { imageUrl }),
  };

  const res = await apiInstance.put('/v1/members', body);

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

export const logout = async () => {
  const res = await apiInstance.post(`v1/logout`);

  return res.data;
};

type TeamAbsInfo = {
  teamId: number;
  teamName: string;
  teamImageUrl: string;
};

type MemberInfoResp = {
  memberName: string;
  memberImageUrl: string;
  teamAbstractResponses: TeamAbsInfo[];
};

export const getMemberInfo = async () => {
  const res =
    await apiInstance.get<ServerResponse<MemberInfoResp>>('v1/members/info');

  return res.data.data;
};

export const withdrawMember = async () => {
  const res = await apiInstance.delete('v1/members');

  return res.data;
};
