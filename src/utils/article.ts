import { IArticle } from '@/api/dashboard';

export const getCreatedTime = (createdDate: string) => {
  const normalizedDate = createdDate.replaceAll('.', '-').replace(' ', 'T');
  const createdTime = new Date(normalizedDate).getTime();

  return Number.isNaN(createdTime) ? 0 : createdTime;
};

export const getLatestOwnArticle = (articles: IArticle[]) => {
  return articles
    .filter((article) => article.isAuthor)
    .sort(
      (a, b) => getCreatedTime(b.createdDate) - getCreatedTime(a.createdDate)
    )[0];
};
