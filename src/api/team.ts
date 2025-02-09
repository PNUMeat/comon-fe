// import { isDevMode } from '@/utils/cookie.ts';
import apiInstance from '@/api/apiInstance';
// import { teamCombinedMock, teamSearchMock } from '@/api/mocks.ts';
// import { teamCombinedMock } from '@/api/mocks.ts';
import { ServerResponse } from '@/api/types';

// 생성
interface ITeamCommon {
  teamName: string;
  teamExplain: string;
  topic: string;
  // TODO: 정수로 넘어옴
  memberLimit: number;
}

interface ICreateTeamRequest extends ITeamCommon {
  password: string;
  image?: File | null;
}

interface IMPutTeamRequest extends ITeamCommon {
  teamId: number;
  image?: File | null;
  password: string | null;
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
  // successMemberCount: number;
  teamAnnouncement: string;
  createdAt: string;

  members: ITeamMember[];
  // TODO: 서버에서 실제로 주는 데이터 속성
  memberLimit: number;
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

// 검색
export interface ITeamSearchResponse {
  content: ITeamInfo[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface TeamAdminResponse {
  teamId: number;
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: number;
  password: string;
  teamIconUrl: string;
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
  formData.append('memberLimit', memberLimit.toString());

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

  return res.data.data;
};

export const modifyTeam = async ({
  teamName,
  teamExplain,
  topic,
  memberLimit,
  password,
  image,
  teamId,
}: IMPutTeamRequest) => {
  const formData = new FormData();

  formData.append('teamName', teamName);
  formData.append('teamExplain', teamExplain);
  formData.append('topic', topic);
  formData.append('memberLimit', memberLimit.toString());
  if (image) {
    formData.append('image', image);
  }
  if (password) {
    formData.append('password', password);
  }

  const res = await apiInstance.put<ServerResponse<ICreateTeamResponse>>(
    `v1/teams/${teamId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.data;
};

export const getTeamList = async (
  sort: string = 'recent',
  page: number = 0,
  size: number = 6
): Promise<ITeamListResponse> => {
  // 개발시 주석 해제 필요. 목데이터랑 타입이 안맞음
  // if (isDevMode()) {
  //   return teamCombinedMock.data;
  // }

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
): Promise<ITeamSearchResponse> => {
  // if (isDevMode()) {
  //   return teamSearchMock.data;
  // }

  const res = await apiInstance.get<ServerResponse<ITeamSearchResponse>>(
    `/v1/teams/search`,
    {
      params: { keyword, sort, page, size },
    }
  );

  return res.data.data;
};

export const withdrawTeam = async (teamId: number) => {
  const res = await apiInstance.delete<ServerResponse<null>>(
    `v1/teams/${teamId}/members/me`
  );

  return res.data;
};

export const getTeamInfoAdmin = async (teamId: number) => {
  const res = await apiInstance.get<ServerResponse<TeamAdminResponse>>(
    `v1/teams/${teamId}`
  );

  return res.data.data;
};

export const deleteTeam = async (teamId: number) => {
  const res = await apiInstance.delete<ServerResponse<null>>(
    `/v1/teams/${teamId}`
  );

  return res.data;
};
