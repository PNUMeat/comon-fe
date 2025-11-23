import apiInstance from '@/api/apiInstance';
import { ImageCategory, ServerResponse } from '@/api/types';

type PresignedUrlResponse = {
  fileName: string;
  presignedUrl: string;
  contentType: string;
};

type UploadArgs = {
  files: File[];
  category: ImageCategory;
};

class ImageUploader {
  private category: ImageCategory;

  constructor(category: ImageCategory) {
    this.category = category;
  }

  private async createPresignedUrls(
    files: File[]
  ): Promise<PresignedUrlResponse[]> {
    const isSingle = files.length === 1;
    const payload = files.map((file) => ({
      fileName: file.name,
      contentType: file.type,
    }));
    const endpoint = isSingle
      ? '/v1/image/presigned-url'
      : '/v1/image/presigned-url/list';
    const res = await apiInstance.post<
      ServerResponse<PresignedUrlResponse | PresignedUrlResponse[]>
    >(endpoint, payload, {
      params: { imageCategory: this.category },
    });

    const data = res.data.data;
    return Array.isArray(data) ? data : [data];
  }

  private async uploadSingleFile(
    presigned: PresignedUrlResponse,
    file: File
  ): Promise<void> {
    const res = await fetch(presigned.presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': presigned.contentType },
      body: file,
    });
    if (!res.ok) {
      throw new Error(`${presigned.fileName} 업로드에 실패했습니다.`);
    }
  }

  private async uploadFiles(
    presignedList: PresignedUrlResponse[],
    files: File[]
  ): Promise<void> {
    if (presignedList.length !== files.length) {
      throw new Error('URL과 파일의 개수가 일치하지 않습니다.');
    }
    await Promise.all(
      presignedList.map((presigned, index) =>
        this.uploadSingleFile(presigned, files[index])
      )
    );
  }

  private getPublicUrls(presignedList: PresignedUrlResponse[]): string[] {
    return presignedList.map((item) => item.presignedUrl.split('?')[0]);
  }

  public async processUpload(files: File[]): Promise<string[]> {
    if (files.length === 0) return [];
    const presignedList = await this.createPresignedUrls(files);
    await this.uploadFiles(presignedList, files);
    return this.getPublicUrls(presignedList);
  }
}

export const uploadImages = async ({
  files,
  category,
}: UploadArgs): Promise<string[]> => {
  const uploader = new ImageUploader(category);
  return uploader.processUpload(files);
};
