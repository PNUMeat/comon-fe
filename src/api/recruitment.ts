import { isDevMode } from '@/utils/cookie';

import apiInstance from './apiInstance';
import { teamRecruitDetailMock, teamRecruitListMock } from './mocks';
import { ServerResponse } from './types';

// 팀 모집글 생성
interface ICreateRecuitmentRequest {
  teamId?: string | null;
  teamRecruitTitle: string;
  teamRecruitBody: string;
  image?: File[] | null;
  chatUrl: string;
}

interface ICreateRecuitmentResponse {
  teamRecruitId: number;
}

// 전체 팀 모집글을 조회
interface ITeamRecruitPost {
  teamRecruitId: number;
  teamRecruitTitle: string;
  teamRecruitBody: string;
  memberNickName: string;
  isRecruiting: boolean;
  createdAt: string;
}

interface ITeamRecruitListResponse {
  content: ITeamRecruitPost[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// 특정 팀 모집글 조회
interface ITeamRecruitApplyResponse {
  teamApplyId: number;
  teamApplyBody: string | null;
  memberName: string;
  isMyApply: boolean;
}

export interface ITeamRecruitDetailResponse {
  teamRecruitId: number;
  teamRecruitTitle: string;
  teamRecruitBody: string;
  chatUrl: string;
  isRecruiting: boolean;
  memberNickName: string;
  isAuthor: boolean;
  imageUrl: string | null;
  createdAt: string;
  teamId: number | null;
  teamApplyResponses: ITeamRecruitApplyResponse[];
  teamMemberUuids: string[];
}

// 팀 모집글 모집 상태 변경
interface IUpdateRecruitmentStatusRequest {
  isRecruiting: boolean;
}

// 팀 지원글 생성
interface ITeamApplyRequest {
  recruitmentId: string;
  teamApplyBody: string;
}

// 팀 지원글 수정
interface IUpdateTeamApplicationRequest {
  teamApplyBody: string;
}

// 팀 모집글에서 팀원 초대
interface IInviteTeamMembersRequest {
  teamId: number;
  recruitId: number;
  memberUuids: string[];
}

// 모집글 관련
export const createRecruitPost = async ({
  teamId,
  teamRecruitTitle,
  teamRecruitBody,
  image,
  chatUrl,
}: ICreateRecuitmentRequest) => {
  const formData = new FormData();

  if (teamId) {
    formData.append('teamId', teamId);
  }
  formData.append('teamRecruitTitle', teamRecruitTitle);
  formData.append('teamRecruitBody', teamRecruitBody);
  formData.append('chatUrl', chatUrl);
  if (image) {
    image.forEach((img) => {
      formData.append('image', img);
    });
  }

  const res = await apiInstance.post<ServerResponse<ICreateRecuitmentResponse>>(
    'v1/recruitments',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.data;
};

export const modifyRecruitPost = async ({
  teamRecruitTitle,
  teamRecruitBody,
  image,
  chatUrl,
  recruitmentId,
}: ICreateRecuitmentRequest & {
  recruitmentId: number;
}) => {
  const formData = new FormData();
  formData.append('teamRecruitTitle', teamRecruitTitle);
  formData.append('teamRecruitBody', teamRecruitBody);
  formData.append('chatUrl', chatUrl);
  if (image) {
    image.forEach((img) => {
      formData.append('image', img);
    });
  }

  const res = await apiInstance.put<ServerResponse<ICreateRecuitmentResponse>>(
    `v1/recruitments/${recruitmentId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return res.data.data;
};

export const getTeamRecruitList = async (
  status: string = 'all',
  page: number = 0,
  size: number = 5
): Promise<ITeamRecruitListResponse> => {
  if (isDevMode()) {
    return teamRecruitListMock.data;
  }

  const res = await apiInstance.get<ServerResponse<ITeamRecruitListResponse>>(
    `/v1/recruitments`,
    {
      params: { status, page, size },
    }
  );

  return res.data.data;
};

export const getTeamRecruitById = async (
  recruitId: number
): Promise<ITeamRecruitDetailResponse> => {
  if (isDevMode()) {
    return teamRecruitDetailMock.data;
  }

  const res = await apiInstance.get<ServerResponse<ITeamRecruitDetailResponse>>(
    `/v1/recruitments/${recruitId}`
  );

  return res.data.data;
};

export const deleteTeamRecruit = async (
  recruitmentId: string
): Promise<void> => {
  await apiInstance.delete<ServerResponse<null>>(
    `/v1/recruitments/${recruitmentId}`
  );
};

export const updateRecruitmentStatus = async (
  recruitmentId: number,
  requestData: IUpdateRecruitmentStatusRequest
): Promise<void> => {
  await apiInstance.patch(`/v1/recruitments/${recruitmentId}`, requestData);
};

// 지원글 관련
export const applyForTeam = async (
  requestData: ITeamApplyRequest
): Promise<void> => {
  await apiInstance.post<ServerResponse<null>>('/v1/apply', requestData);
};

export const deleteTeamApplication = async (applyId: number): Promise<void> => {
  await apiInstance.delete<ServerResponse<null>>(`/v1/apply/${applyId}`);
};

export const updateTeamApplication = async (
  applyId: number,
  requestData: IUpdateTeamApplicationRequest
): Promise<void> => {
  await apiInstance.patch(`/v1/apply/${applyId}`, requestData);
};

// 신청자 초대 관련
export const inviteTeamMembers = async ({
  teamId,
  recruitId,
  memberUuids,
}: IInviteTeamMembersRequest): Promise<void> => {
  await apiInstance.post('/v1/recruitments/invite', {
    teamId,
    recruitId,
    memberUuids,
  });
};
