import { isDevMode } from '@/utils/cookie.ts';

import apiInstance, { navigate } from '@/api/apiInstance';
import { teamMemberMock } from '@/api/mocks';
import { ServerResponse } from '@/api/types';
import { AxiosError } from 'axios';

export interface IMemberCommon {
  uuid: string;
  memberName: string;
  memberExplain: string;
  imageUrl: string;
  registerDate: string;
  isTeamManager: boolean;
}

interface IPostMemberRequest {
  teamId?: string;
  memberInfo: string;
}

export const getTeamMembers = async (
  teamId: string
): Promise<IMemberCommon[]> => {
  if (isDevMode()) {
    return teamMemberMock.data;
  }

  try {
    const res = await apiInstance.get<ServerResponse<IMemberCommon[]>>(
      `v1/teams/${teamId}/members`
    );

    return res.data.data;
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err?.response?.data?.message === '팀의 매니저가 옳지 않습니다.'
    ) {
      navigate(`/team-dashboard/${teamId}`);
    }
    throw err;
  }
};

// 강퇴
export const removeTeamMember = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  try {
    await apiInstance.post(
      `v1/teams/${teamId}/remove/team-member`,
      { memberInfo: memberInfo },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err?.response?.data?.message === '팀의 매니저가 옳지 않습니다.'
    ) {
      navigate(`/team-dashboard/${teamId}`);
    }
    throw err;
  }
};

// 팀장 추가
export const addTeamManager = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  try {
    await apiInstance.post(
      `v1/teams/${teamId}/team-manager`,
      { memberInfo: memberInfo },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err?.response?.data?.message === '팀의 매니저가 옳지 않습니다.'
    ) {
      navigate(`/team-dashboard/${teamId}`);
    }
    throw err;
  }
};

// 일반 회원 강등
export const demotionManager = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }
  try {
    await apiInstance.post(
      `v1/teams/${teamId}/team-manager/demotion`,
      { memberInfo: memberInfo },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err?.response?.data?.message === '팀의 매니저가 옳지 않습니다.'
    ) {
      navigate(`/team-dashboard/${teamId}`);
    }
    throw err;
  }
};

// 팀장 위임
export const delegationManager = async ({
  teamId,
  memberInfo,
}: IPostMemberRequest): Promise<void> => {
  // if (isDevMode()) {
  //   return;
  // }

  try {
    await apiInstance.put(
      `v1/teams/${teamId}/team-manager`,
      { memberInfo: memberInfo },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err?.response?.data?.message === '팀의 매니저가 옳지 않습니다.'
    ) {
      navigate(`/team-dashboard/${teamId}`);
    }
    throw err;
  }
};
