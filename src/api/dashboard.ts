import apiInstance from './apiInstance';
import { ITeamInfo } from './team';
import { ServerResponse } from './types';

interface ICalendarTag {
  subjectDate: string;
  articleCategory: string;
}

export interface ITeamInfoAndTagsResponse {
  myTeamResponse: ITeamInfo;
  teamManager: boolean;
  subjectArticleDateAndTagResponses: ICalendarTag[];
}

export const getTeamInfoAndTags = async (
  teamId: number,
  year: number,
  month: number
): Promise<ITeamInfoAndTagsResponse> => {
  const res = await apiInstance.get<ServerResponse<ITeamInfoAndTagsResponse>>(
    `/api/v1/teams/${teamId}/team-page`,
    { params: { year, month } }
  );

  return res.data.data;
};
