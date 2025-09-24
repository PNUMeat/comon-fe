import apiInstance from '@/api/apiInstance';

// todo
interface PresignedItem {
  fileName: string;
  presignedUrl: string;
  contentType: string;
}

interface PresignedResponseSingle {
  data: PresignedItem;
}

interface PresignedResponseMultiple {
  data: PresignedItem[];
}

export const uploadSingleImage = async (file: File) => {
  const res = await apiInstance.post<PresignedResponseSingle>(
    'v1/image/presigned-url',
    {
      fileName: file.name,
      contentType: file.type,
    }
  );
  const item = res.data.data;
  await fetch(item.presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': item.contentType },
    body: file,
  });
  return item.presignedUrl.split('?')[0];
};

export const uploadMultipleImages = async (files: File[]) => {
  const res = await apiInstance.post<PresignedResponseMultiple>(
    'v1/image/presigned-url/list',
    {
      files: files.map((f) => ({ fileName: f.name, contentType: f.type })),
    }
  );
  const items = res.data.data;

  const urls = await Promise.all(
    items.map((item, i) =>
      fetch(item.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': item.contentType },
        body: files[i],
      }).then(() => item.presignedUrl.split('?')[0])
    )
  );

  return urls; // 업로드된 이미지 배열
};
