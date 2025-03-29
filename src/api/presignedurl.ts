import apiInstance from '@/api/apiInstance.ts';
import { ServerResponse } from '@/api/types.ts';

export type PresignedUrlRequest = {
  fileName: string;
  contentType: string;
};

type PresignedUrlRes = {
  fileName: string;
  presignedUrl: string;
  contentType: string;
};

type RequestPresignedUrlParam = {
  requests: PresignedUrlRequest;
  imageCategory: string;
  file: File;
};

export const requestPresignedUrl = async ({
  requests,
  imageCategory,
  file,
}: RequestPresignedUrlParam) => {
  const res = await apiInstance.post<ServerResponse<PresignedUrlRes>>(
    `v1/image/presigned-url?imageCategory=${imageCategory}`,
    { ...requests }
  );

  return { ...res.data.data, file: file };
};

type S3RequestParam = {
  url: string;
  contentType: string;
  body: File;
};

export const toS3 = async ({ url, contentType, body }: S3RequestParam) => {
  // const res = await axios.put(url, body, {
  //   headers: {
  //     'Content-Type': contentType,
  //   },
  // });
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: body,
  });

  return res;
};
