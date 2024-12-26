import apiInstance from '@/api/apiInstance';

type SubjectMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  articleCategory: string;
  selectedDate: string;
  image: File | null;
};

export const createSubject = async ({
  teamId,
  articleTitle,
  articleBody,
  image,
  articleCategory,
  selectedDate,
}: SubjectMutationArg) => {
  const formData = new FormData();

  formData.append('teamId', teamId.toString());
  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  formData.append('articleCategory', articleCategory);
  formData.append('selectedDate', selectedDate);
  if (image) {
    formData.append('image', image);
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
