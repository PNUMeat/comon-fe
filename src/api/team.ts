import apiInstance from '@/api/apiInstance';

type TeamArgs = {
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: string;
  password: string;
  image?: File | null;
};

export const createTeam = async ({
  teamName,
  teamExplain,
  topic,
  memberLimit,
  password,
  image,
}: TeamArgs) => {
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
