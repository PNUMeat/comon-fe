import { useMemo } from 'react';

import { IArticle, ITopicResponse } from '@/api/dashboard.ts';
import { MyArticle } from '@/api/mypage.ts';

const regroupArticle = (data: IArticle | ITopicResponse | MyArticle) => {
  console.error('data??', data);

  if (data.articleBody === null) {
    return 'put mock data';
  }

  if (!data.imageUrls || data.imageUrls.length === 0) {
    return data.articleBody;
  }

  let imgIndex = 0;

  const images = data.imageUrls;

  const articleWithImages = data.articleBody.replace(
    /(<img[^>]*src=")\?("[^>]*>)/g,
    (match, prefix, suffix) => {
      if (imgIndex < images.length) {
        return `${prefix}${images[imgIndex++]}${suffix}`;
      }
      return match;
    }
  );

  console.error('img topics', articleWithImages);

  return articleWithImages;
};

export const useRegroupImageAndArticle = (
  data: IArticle | ITopicResponse | MyArticle | undefined | null
) => {
  const result = useMemo(() => {
    if (data === undefined || data === null) {
      return '';
    }

    return regroupArticle(data);
  }, [data]);

  return {
    result,
  };
};
