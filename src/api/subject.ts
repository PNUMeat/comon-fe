import apiInstance from '@/api/apiInstance';

type SubjectMutationArg = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  articleCategory: string;
  selectedDate: string;
};

export const createSubject = async ({
  teamId,
  articleTitle,
  articleBody,
  articleCategory,
  selectedDate,
}: SubjectMutationArg) => {
  const res = await apiInstance.post(`/v1/articles/teams/${teamId}/subjects`, {
    teamId,
    articleTitle,
    articleBody,
    articleCategory,
    selectedDate,
  });

  return res.data;
};

type PutSubjectArgs = {
  teamId: number;
  articleTitle: string;
  articleBody: string;
  articleCategory: string;
  articleId: number;
};

export const mutateSubject = async ({
  teamId,
  articleTitle,
  articleBody,
  articleCategory,
  articleId,
}: PutSubjectArgs) => {
  const res = await apiInstance.put(
    `/v1/articles/teams/${teamId}/subjects/${articleId}`,
    {
      articleTitle,
      articleBody,
      articleCategory,
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
