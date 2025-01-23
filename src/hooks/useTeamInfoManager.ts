import { useEffect, useState } from 'react';

import { ICalendarTag, getTeamInfoAndTags } from '@/api/dashboard.ts';
import { useQuery } from '@tanstack/react-query';

type TeamCalendarTagArg = {
  year: number;
  month: number;
  teamId?: string;
};

export const useTeamInfoManager = ({
  year,
  month,
  teamId,
}: TeamCalendarTagArg) => {
  const [tagsMap, setTagsMap] = useState<Map<string, ICalendarTag[]>>(
    new Map()
  );
  const [announcement, setAnnouncement] = useState('');

  const { data: teamInfoData, isSuccess } = useQuery({
    queryKey: ['team-info', teamId, year, month],
    queryFn: () => getTeamInfoAndTags(Number(teamId), year, month),
    enabled: !!teamId,
  });

  const addTags = (teamId: string, newTags: ICalendarTag[]) => {
    setTagsMap((prevMap) => {
      const updatedMap = new Map(prevMap);
      const prevTags = updatedMap.get(teamId) || [];

      const updatedTags = [...prevTags];

      newTags.forEach((newTag) => {
        const existingIndex = updatedTags.findIndex(
          (tag) => tag.subjectDate === newTag.subjectDate
        );
        if (existingIndex !== -1) {
          updatedTags[existingIndex] = newTag;
        } else {
          updatedTags.push(newTag);
        }
      });

      updatedMap.set(teamId, updatedTags);
      return updatedMap;
    });
  };

  useEffect(() => {
    if (isSuccess && teamInfoData && teamId) {
      addTags(teamId, teamInfoData.subjectArticleDateAndTagResponses);
      setAnnouncement(teamInfoData.myTeamResponse.teamAnnouncement);
    }
  }, [isSuccess, teamId]);

  return {
    tagsMap: tagsMap,
    announcement: announcement,
    myTeamResponse: teamInfoData?.myTeamResponse,
    isTeamManager: teamInfoData?.teamManager || false,
  };
};
