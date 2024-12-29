import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

import { ITopicResponse } from './dashboard';

// 생성
interface ITeamCommon {
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: string;
}

interface ICreateTeamRequest extends ITeamCommon {
  password: string;
  image?: File | null;
}

interface ICreateTeamResponse {
  teamId: number;
}

// 조회
interface ITeamMember {
  memberName: string;
  imageUrl: string;
  memberExplain: string;
  uuid: string;
}

export interface ITeamInfo extends ITeamCommon {
  teamId: number;
  imageUrl: string;
  memberCount: number;
  streakDays: number;
  successMemberCount: number;
  teamAnnouncement: string;
  createdAt: string;
  members: ITeamMember[];
}

interface ITeamListResponse {
  myTeams: ITeamInfo[];
  allTeams: {
    content: ITeamInfo[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };
}

export const createTeam = async ({
  teamName,
  teamExplain,
  topic,
  memberLimit,
  password,
  image,
}: ICreateTeamRequest) => {
  const formData = new FormData();

  formData.append('teamName', teamName);
  formData.append('teamExplain', teamExplain);
  formData.append('topic', topic);
  formData.append('password', password);
  formData.append('memberLimit', memberLimit);

  if (image) {
    formData.append('image', image);
  }

  const res = await apiInstance.post<ServerResponse<ICreateTeamResponse>>(
    'v1/teams',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.error('??', res.data);

  return res.data.data;
};

export const getTeamList = async (
  sort: string = 'recent',
  page: number = 0,
  size: number = 6
): Promise<ITeamListResponse> => {
  const res = await apiInstance.get<ServerResponse<ITeamListResponse>>(
    `/v1/teams/combined`,
    {
      params: { sort, page, size },
    }
  );

  return res.data.data;
};

type TeamJoinResp = {
  teamId: number;
};

export const joinTeam = async (teamId: number, password: string) => {
  const res = await apiInstance.post<ServerResponse<TeamJoinResp>>(
    `/v1/teams/${teamId}/join`,
    { password }
  );

  return res.data.data;
};

export const searchTeams = async (
  keyword: string,
  sort: string = 'recent',
  page: number = 0,
  size: number = 6
): Promise<ITopicResponse> => {
  const res = await apiInstance.get<ServerResponse<ITopicResponse>>(
    `/v1/teams/search`,
    {
      params: { keyword, sort, page, size },
    }
  );

  return res.data.data;
};
