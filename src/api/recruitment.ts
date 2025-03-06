import { isDevMode } from '@/utils/cookie';

import apiInstance from './apiInstance';
import { teamRecruitListMock } from './mocks';
import { ServerResponse } from './types';

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

export interface ITeamRecruitListResponse {
  content: ITeamRecruitPost[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

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
