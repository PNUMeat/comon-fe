import apiInstance from '@/api/apiInstance';

type PostingMutationArg = {
  teamId: string;
  articleTitle: string;
  articleBody: string;
  image: File | null;
  articleCategory?: string;
};

export const createPost = async ({
  teamId,
  articleTitle,
  articleBody,
  image,
  articleCategory = '스터디 전',
}: PostingMutationArg) => {
  const formData = new FormData();

  formData.append('teamId', teamId);
  formData.append('articleTitle', articleTitle);
  formData.append('articleBody', articleBody);
  formData.append('articleCategory', articleCategory);
  if (image) {
    formData.append('image', image);
  }

  const res = await apiInstance.post('v1/articles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};