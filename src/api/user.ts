import { isDevMode } from '@/utils/cookie.ts';

import apiInstance from '@/api/apiInstance';
import { membersInfoMock } from '@/api/mocks.ts';
import { ServerResponse } from '@/api/types';

export const kakaoOauth2LoginUrl = `/oauth2/authorization/kakao`;

type ProfileCommonArgs = {
  memberName: string;
  memberExplain: string;
};

type ProfileMutationArgs = ProfileCommonArgs & {
  imageUrl?: string;
};

export type ProfileQueryResp = ProfileCommonArgs & {
  imageUrl: string;
  uuid: string;
};

export const createProfile = async ({
  memberName,
  memberExplain,
  imageUrl,
}: ProfileMutationArgs) => {
  const res = await apiInstance.post('v1/members', {
    memberName: memberName,
    memberExplain: memberExplain,
    imageUrl: imageUrl,
  });

  return res.data;
};

export const changeProfile = async ({
  memberName,
  memberExplain,
  imageUrl,
}: ProfileMutationArgs) => {
  const res = await apiInstance.put('v1/members', {
    memberName: memberName,
    memberExplain: memberExplain,
    imageUrl: imageUrl,
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
  if (isDevMode()) {
    return membersInfoMock.data;
  }

  const res =
    await apiInstance.get<ServerResponse<MemberInfoResp>>('v1/members/info');

  return res.data.data;
};

export const withdrawMember = async () => {
  const res = await apiInstance.delete('v1/members');

  return res.data;
};
