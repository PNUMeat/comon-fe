import { useEffect, useState } from 'react';

import { ICalendarTag, getTeamInfoAndTags } from '@/api/dashboard.ts';
import { ITeamInfo } from '@/api/team.ts';
import { useQuery } from '@tanstack/react-query';

type TeamCalendarTagArg = {
  year: number;
  month: number;
  teamId?: string;
  // 주간 보기가 두 달에 걸칠 때(저번주+이번주) 추가로 fetch할 달
  secondYear?: number;
  secondMonth?: number;
};

type TeamInfoSegment = { teamInfo: ITeamInfo | null; isManager: boolean };

const teamInfoCacheMap = new Map<string, TeamInfoSegment>();

teamInfoCacheMap.set('-1', {
  teamInfo: null,
  isManager: false,
});

export const useTeamInfoManager = ({
  year,
  month,
  teamId,
  secondYear,
  secondMonth,
}: TeamCalendarTagArg) => {
  const [tagsMap, setTagsMap] = useState<Map<string, ICalendarTag[]>>(
    new Map()
  );

  const {
    data: teamInfoData,
    isSuccess,
    isPending,
  } = useQuery({
    queryKey: ['team-info', teamId, year, month],
    queryFn: () => getTeamInfoAndTags(Number(teamId), year, month),
    enabled: !!teamId,
  });

  const hasSecond =
    secondYear !== undefined &&
    secondMonth !== undefined &&
    !(secondYear === year && secondMonth === month);

  const { data: secondData, isSuccess: secondSuccess } = useQuery({
    queryKey: ['team-info', teamId, secondYear, secondMonth],
    queryFn: () => getTeamInfoAndTags(Number(teamId), secondYear!, secondMonth!),
    enabled: !!teamId && hasSecond,
  });

  if (isSuccess && teamId) {
    teamInfoCacheMap.set(teamId, {
      teamInfo: teamInfoData.myTeamResponse,
      isManager: teamInfoData.teamManager,
    });
  }

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
    }
  }, [isSuccess, teamId]);

  useEffect(() => {
    if (secondSuccess && secondData && teamId) {
      addTags(teamId, secondData.subjectArticleDateAndTagResponses);
    }
  }, [secondSuccess, teamId, secondYear, secondMonth]);

  const teamCache = teamInfoCacheMap.get(teamId ?? '-1') as TeamInfoSegment;

  return {
    tagsMap: tagsMap,
    myTeamResponse: teamInfoData?.myTeamResponse ?? teamCache?.teamInfo ?? null,
    isTeamManager: teamInfoData?.teamManager ?? teamCache?.isManager ?? false,
    isPending: isPending,
  };
};
