import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

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

  const res = await apiInstance.post('v1/teams', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
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

export const joinTeam = async (teamId: number, password: string) => {
  return apiInstance
    .post<ServerResponse<null>>(`/v1/teams/${teamId}/join`, { password })
    .then((res) => {
      alert(res.data.message);
    })
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || '팀 참가에 실패했습니다.';
      alert(errorMessage);
      throw error;
    });
};
