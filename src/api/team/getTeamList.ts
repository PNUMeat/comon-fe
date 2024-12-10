import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

interface TeamMember {
  memberName: string;
  imageUrl: string;
  memberExplain: string;
  uuid: string;
}

export interface Team {
  teamId: number;
  teamName: string;
  teamExplain: string;
  imageUrl: string;
  topic: string;
  memberLimit: number;
  memberCount: number;
  streakDays: number;
  successMemberCount?: number;
  createdAt: string;
  members: TeamMember[];
}

export interface TeamListResponse {
  myTeams: Team[];
  allTeams: {
    content: Team[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };
}

export const getTeamList = async (
  sort: string = 'recent', // TODO: 수정
  page: number = 0, // TODO: 수정
  size: number = 6 // TODO: 수정
): Promise<TeamListResponse> => {
  const res = await apiInstance.get<ServerResponse<TeamListResponse>>(
    `/v1/teams/combined`,
    {
      params: { sort, page, size },
    }
  );
  console.log(res.data); // TODO: 삭제

  return res.data.data;
};
