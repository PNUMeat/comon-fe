import apiInstance from './apiInstance';

export const updateAnnouncement = async (
  teamId: number,
  teamAnnouncement: string
): Promise<void> => {
  await apiInstance.patch(`/v1/teams/${teamId}/announcement`, {
    teamAnnouncement,
  });
};
