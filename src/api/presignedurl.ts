import apiInstance from '@/api/apiInstance.ts';
import { ServerResponse } from '@/api/types.ts';
import axios from 'axios';

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
};

export const requestPresignedUrl = async ({
  requests,
  imageCategory,
}: RequestPresignedUrlParam) => {
  const res = await apiInstance.post<ServerResponse<PresignedUrlRes>>(
    `v1/image/presigned-url?imageCategory=${imageCategory}`,
    { ...requests }
  );

  return res.data.data;
};

type S3RequestParam = {
  url: string;
  contentType: string;
  body: File;
};

export const toS3 = async ({ url, contentType, body }: S3RequestParam) => {
  const res = await axios.put(url, body, {
    headers: {
      'Content-Type': contentType,
    },
  });

  return res;
};
