import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

import { uploadImages } from './image';

// 생성
interface ITeamCommon {
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: number;
}

interface ICreateTeamRequest extends ITeamCommon {
  password: string;
  image?: File | null;
  teamMemberUuids?: string[];
  teamRecruitId: number | null;
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
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: number;
  memberCount: number;
  streakDays: number;
  imageUrl: string;
  createdAt: string;
  teamRecruitId?: number | null;
  teamAnnouncement?: string;
  members?: ITeamMember[];
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

interface CreateTeamBody {
  teamName: string;
  teamExplain: string;
  topic: string;
  password: string;
  memberLimit: number;
  teamRecruitId: number | null;
  teamMemberUuids?: string[];
  teamIconUrl?: string;
}

interface ModifyTeamBody {
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: number;
  password?: string | null;
  teamIconUrl?: string;
}

export const createTeam = async ({
  teamName,
  teamExplain,
  topic,
  memberLimit,
  password,
  image,
  teamMemberUuids,
  teamRecruitId,
}: ICreateTeamRequest) => {
  let teamIconUrl: string | undefined;

  if (image) {
    const uploadedUrl = await uploadImages({
      files: [image],
      category: 'TEAM',
    });
    teamIconUrl = uploadedUrl[0];
  }

  const body: CreateTeamBody = {
    teamName,
    teamExplain,
    topic,
    password,
    memberLimit,
    teamRecruitId,
    teamIconUrl,
  };

  if (teamMemberUuids && teamMemberUuids.length > 0) {
    body.teamMemberUuids = teamMemberUuids;
  }

  if (teamIconUrl) {
    body.teamIconUrl = teamIconUrl;
  }

  const res = await apiInstance.post<ServerResponse<ICreateTeamResponse>>(
    'v1/teams',
    body
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
  let teamIconUrl: string | undefined;

  if (image) {
    const uploadedUrl = await uploadImages({
      files: [image],
      category: 'TEAM',
    });
    teamIconUrl = uploadedUrl[0];
  }

  const body: ModifyTeamBody = {
    teamName,
    teamExplain,
    topic,
    memberLimit,
  };

  if (password !== null) {
    body.password = password;
  }

  if (teamIconUrl) {
    body.teamIconUrl = teamIconUrl;
  }

  const res = await apiInstance.put<ServerResponse<ICreateTeamResponse>>(
    `v1/teams/${teamId}`,
    body
  );

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
): Promise<ITeamSearchResponse> => {
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

export const getTeamInfoAdmin = async (teamId: string) => {
  const res = await apiInstance.get<ServerResponse<TeamAdminResponse>>(
    `v1/teams/${teamId}`
  );

  return res.data.data;
};

export const deleteTeam = async (teamId: string) => {
  const res = await apiInstance.delete<ServerResponse<null>>(
    `/v1/teams/${teamId}`
  );

  return res.data;
};
