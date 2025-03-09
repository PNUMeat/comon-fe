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
  recruitmentId: number;
  teamRecruitTitle: string;
  teamRecruitBody: string;
  chatUrl: string;
  imageUrl: string;
  isRecruiting: boolean;
  memberName: string;
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
  createdAt: string;
  teamId: number | null;
  teamApplyResponses: ITeamRecruitApplyResponse[];
}

// 팀 지원글 생성
interface ITeamApplyRequest {
  recruitmentId: string;
  teamApplyBody: string;
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

// 지원글 관련
export const applyForTeam = async (
  requestData: ITeamApplyRequest
): Promise<void> => {
  await apiInstance.post<ServerResponse<null>>('/v1/apply', requestData);
};
