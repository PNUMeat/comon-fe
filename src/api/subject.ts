import apiInstance from '@/api/apiInstance';

type SubjectMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  articleCategory: string;
  selectedDate: string;
  images: File[] | null;
};

export const createSubject = async ({
  teamId,
  articleTitle,
  articleBody,
  images,
  articleCategory,
  selectedDate,
}: SubjectMutationArg) => {
  const formData = new FormData();

  formData.append('teamId', teamId.toString());
  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  formData.append('articleCategory', articleCategory);
  formData.append('selectedDate', selectedDate);
  if (images) {
    images.forEach((img) => {
      formData.append('images', img);
    });
  } else {
    formData.append('images', '');
  }

  const res = await apiInstance.post(
    `/v1/articles/teams/${teamId}/subjects`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};

type PutSubjectArgs = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  articleCategory: string;
  articleId: number;
  images: File[] | null;
};

export const mutateSubject = async ({
  teamId,
  articleTitle,
  articleBody,
  articleCategory,
  articleId,
  images,
}: PutSubjectArgs) => {
  const formData = new FormData();

  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  formData.append('articleCategory', articleCategory);
  if (images) {
    images.forEach((img) => {
      formData.append('images', img);
    });
  } else {
    formData.append('images', '');
  }

  const res = await apiInstance.put(
    `/v1/articles/teams/${teamId}/subjects/${articleId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};

export const deleteSubject = async (teamId: number, articleId: number) => {
  const res = await apiInstance.delete(
    `v1/articles/teams/${teamId}/subjects/${articleId}`
  );

  return res.data;
};
