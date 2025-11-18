import apiInstance from '@/api/apiInstance';
import { ImageCategory, ServerResponse } from '@/api/types';

type PresignedUrlResponse = {
  fileName: string;
  presignedUrl: string;
  contentType: string;
};

type GetPresignedArgs = {
  files: File[];
  category: ImageCategory;
};

export const getImagePresigned = async ({
  files,
  category,
}: GetPresignedArgs) => {
  if (files.length === 1) {
    const file = files[0];
    const imagePayload = {
      fileName: file.name,
      contentType: file.type,
    };

    const res = await apiInstance.post<ServerResponse<PresignedUrlResponse>>(
      '/v1/image/presigned-url',
      imagePayload,
      {
        params: { imageCategory: category },
      }
    );

    return res.data.data;
  }

  const imagesPayload = files.map((file) => ({
    fileName: file.name,
    contentType: file.type,
  }));

  const res = await apiInstance.post<ServerResponse<PresignedUrlResponse[]>>(
    '/v1/image/presigned-url/list',
    imagesPayload,
    {
      params: { imageCategory: category },
    }
  );

  return res.data.data;
};

export const getImagePresignedUrls = async ({
  files,
  category,
}: {
  files: File[];
  category: ImageCategory;
}): Promise<PresignedUrlResponse[]> => {
  const body = files.map((file) => ({
    fileName: file.name,
    contentType: file.type,
  }));

  const res = await apiInstance.post<ServerResponse<PresignedUrlResponse[]>>(
    '/v1/image/presigned-url/list',
    body,
    {
      params: { imageCategory: category },
    }
  );

  return res.data.data;
};

export const uploadWithPresigned = async ({
  presigned,
  file,
}: {
  presigned: PresignedUrlResponse;
  file: File;
}): Promise<void> => {
  const res = await fetch(presigned.presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': presigned.contentType },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`S3 PUT failed: ${res.status}`);
  }
};

export const getPublicUrlFromPresigned = (
  p: PresignedUrlResponse[]
): string | string[] => {
  if (p.length === 1) return p[0].presignedUrl.split('?')[0];
  return p.map((item) => item.presignedUrl.split('?')[0]);
};
