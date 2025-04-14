import { isDevMode } from '@/utils/cookie.ts';

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
  file: File;
};

export const requestPresignedUrl = async ({
  requests,
  imageCategory,
  file,
}: RequestPresignedUrlParam) => {
  if (isDevMode()) {
    return {
      contentType: file.type,
      fileName: file.name,
      presignedUrl:
        'https://pnu-comon-s3-bucket-v3.s3.ap-northeast-2.amazonaws.com/article/9ae59a88-f3f2-4c1a-a14e-31b29e127111_header_logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250329T104755Z&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Expires=600&X-Amz-Credential=AKIARWPFIQ2ROKFM4CEK%2F20250329%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=e056a362a9c1762525fa231fab8212012ab37e03cc875ca3be6fb328ec1d96b5',
    };
  }

  const res = await apiInstance.post<ServerResponse<PresignedUrlRes>>(
    `v1/image/presigned-url?imageCategory=${imageCategory}`,
    { ...requests }
  );

  return res.data.data;
};

type S3RequestParam = {
  url: string;
  contentType: string;
  file: File;
};

export const toS3 = async ({ url, contentType, file }: S3RequestParam) => {
  const res = await axios.put(url, file, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return res;
};

export const s3 = (
  imageCategory: string,
  file: File,
  onSuccess: (url: string) => void
) => {
  const contentType = file.type;
  const fileName = file.name;
  const req = {
    contentType: contentType,
    fileName: fileName,
  };

  requestPresignedUrl({
    imageCategory: imageCategory,
    requests: req,
    file: file,
  })
    .then(async (data) => {
      const { contentType, presignedUrl } = data;
      await toS3({
        url: presignedUrl,
        contentType: contentType,
        file: file,
      });

      return presignedUrl.split('?')[0];
    })
    .then((url) => {
      onSuccess(url);
    });
};
