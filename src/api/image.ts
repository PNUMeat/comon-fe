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

export const getSingleImagePresignedUrl = async ({
  file,
  category,
}: {
  file: File;
  category: ImageCategory;
}) => {
  const payload = {
    fileName: file.name,
    contentType: file.type,
  };

  const res = await apiInstance.post<ServerResponse<PresignedUrlResponse>>(
    '/v1/image/presigned-url',
    payload,
    {
      params: { imageCategory: category },
    }
  );

  return res.data.data;
};

export const getMultiImagesPresignedUrl = async ({
  files,
  category,
}: GetPresignedArgs): Promise<PresignedUrlResponse[]> => {
  const payload = files.map((file) => ({
    fileName: file.name,
    contentType: file.type,
  }));

  const res = await apiInstance.post<ServerResponse<PresignedUrlResponse[]>>(
    '/v1/image/presigned-url/list',
    payload,
    {
      params: { imageCategory: category },
    }
  );

  return res.data.data;
};

export const getImagePresignedUrl = async ({
  files,
  category,
}: GetPresignedArgs) => {
  if (files.length === 1) {
    const presigned = await getSingleImagePresignedUrl({
      file: files[0],
      category,
    });
    return [presigned];
  }

  const presignedList = await getMultiImagesPresignedUrl({
    files,
    category,
  });

  return presignedList;
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
    throw new Error();
  }
};

export const uploadManyWithPresigned = async ({
  presignedList,
  files,
}: {
  presignedList: PresignedUrlResponse[];
  files: File[];
}): Promise<void> => {
  if (presignedList.length !== files.length) {
    throw new Error();
  }

  await Promise.all(
    presignedList.map((p, i) =>
      uploadWithPresigned({ presigned: p, file: files[i] })
    )
  );
};

export const getPublicUrlFromPresigned = (
  p: PresignedUrlResponse[]
): string | string[] => {
  if (p.length === 1) return p[0].presignedUrl.split('?')[0];
  return p.map((item) => item.presignedUrl.split('?')[0]);
};
