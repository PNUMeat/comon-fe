import { isDevMode } from '@/utils/cookie.ts';

import apiInstance from '@/api/apiInstance';
import { teamMemberMock } from '@/api/mocks';
import { ServerResponse } from '@/api/types';

interface IMemberCommon {
  uuid: string;
  memberName: string;
  memberExplain: string;
  imageUrl: string;
  registerDate: string;
  isTeamManager: boolean;
}

interface IPostMemberRequest {
  teamId: string;
  memberInfo: string;
}

export const getTeamMembers = async (
  teamId: string
): Promise<IMemberCommon[]> => {
  if (isDevMode()) {
    return teamMemberMock.data;
  }
  const res = await apiInstance.get<ServerResponse<IMemberCommon[]>>(
    `v1/teams/${teamId}/members`
  );

  return res.data.data;
};

// 강퇴
export const removeTeamMember = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  await apiInstance.post(`v1/teams/${teamId}/remove/team-member`, {memberInfo : memberInfo}, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 팀장 추가
export const addTeamManager = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  await apiInstance.post(`v1/teams/${teamId}/team-manager`, { memberInfo : memberInfo }, { 
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 일반 회원 강등
export const demotionManager = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  await apiInstance.post(`v1/teams/${teamId}/team-manager/demotion`, { memberInfo : memberInfo }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 팀장 위임
export const delegationManager = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  await apiInstance.put(`v1/teams/${teamId}/team-manager`, { memberInfo: memberInfo }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
