import { isDevMode } from '@/utils/cookie.ts';
import apiInstance from '@/api/apiInstance';
// import { teamCombinedMock, teamSearchMock } from '@/api/mocks.ts';
//import { teamCombinedMock } from '@/api/mocks.ts';
import { ServerResponse } from '@/api/types';
import { teamMemberMock } from '@/api/mocks';

interface IMemberCommon {
  uuid: string;
  memberName: string;
  memberExplain: string;
  imageUrl: string;
  registerDate: string;
  isTeamManager: boolean;
}

interface IGetMemberRequest {
  teamId: number;
}

interface IPostMemberRequest {
  teamId: number;
  memberInfo: string;
}

export const getTeamMembers = async ({
  teamId,
}: IGetMemberRequest): Promise<IMemberCommon[]> => {

  if (isDevMode()) {
    return teamMemberMock.data;
  }
  const res = await apiInstance.get<ServerResponse<IMemberCommon[]>>(
    `v1/teams/${teamId}/members`
  );

  return res.data.data;
};

export const removeTeamMember = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  if (isDevMode()) {
    return;
  }
  await apiInstance.post(`v1/teams/${teamId}/remove/team-member`, memberInfo, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const addTeamLeader = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  if (isDevMode()) {
    return;
  }
  await apiInstance.post(`v1/teams/${teamId}/add/team-leader`, memberInfo);
}
