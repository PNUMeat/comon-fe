import { ServerResponse } from '@/api/types';
import apiInstance from "./apiInstance";

interface ICreateRecuitmentRequest {
  teamId?: string | null;
  teamRecruitTitle: string;
  teamRecruitBody: string;
  image?: File[] | null;
  chatUrl: string;
}

interface ICreateRecuitmentResponse {
  teamRecruitId: number;
}

export const createRecruitPost = async ({
  teamId,
  teamRecruitTitle,
  teamRecruitBody,
  image,
  chatUrl,
}: ICreateRecuitmentRequest) => {
  const formData = new FormData();

  if (teamId) {
    formData.append('teamId', teamId);
  }
  formData.append('teamRecruitTitle', teamRecruitTitle);
  formData.append('teamRecruitBody', teamRecruitBody);
  formData.append('chatUrl', chatUrl);
  if (image) {
    image.forEach((img) => {
      formData.append('image', img);
    });
  }

  const res = await apiInstance.post<ServerResponse<ICreateRecuitmentResponse>>(
    'v1/recruitments',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.data;
}

export const modifyRecruitPost = async ({
  teamRecruitTitle,
  teamRecruitBody,
  image,
  chatUrl,
}: ICreateRecuitmentRequest & {
    recruitmentId: number;
  }) => {
  const formData = new FormData();
  formData.append('teamRecruitTitle', teamRecruitTitle);
  formData.append('teamRecruitBody', teamRecruitBody);
  formData.append('chatUrl', chatUrl);
  if (image) {
    image.forEach((img) => {
      formData.append('image', img);
    });
  }
  const res = await apiInstance.put<ServerResponse<ICreateRecuitmentResponse>>(
    'v1/recruitments/${recruitmentId}',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.data;
}
