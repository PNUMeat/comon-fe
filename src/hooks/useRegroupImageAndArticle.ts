import { useMemo } from 'react';

import { IArticle, ITopicResponse } from '@/api/dashboard.ts';
import { MyArticle } from '@/api/mypage.ts';

const regroupArticle = (data: IArticle | ITopicResponse | MyArticle) => {
  console.log('data??', data);

  if (data.articleBody === null) {
    return 'put mock data';
  }

  // TODO: 백엔드 작업 완료되면 삭제
  if ('imageUrl' in data) {
    console.log('아직 적용 안됨');
    return data?.imageUrl
      ? data?.articleBody?.replace(/src="\?"/, `src="${data.imageUrl}"`)
      : data?.articleBody;
  }

  console.log('dddd', data);
  if (data.imageUrls === null || data.imageUrls.length === 0) {
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

  console.log('img topics', articleWithImages);

  return articleWithImages;
};

export const useRegroupImageAndArticle = (
  data: IArticle | ITopicResponse | MyArticle | undefined
) => {
  const result = useMemo(() => {
    if (data === undefined) {
      return '';
    }

    return regroupArticle(data);
  }, [data]);

  return {
    result,
  };
};
