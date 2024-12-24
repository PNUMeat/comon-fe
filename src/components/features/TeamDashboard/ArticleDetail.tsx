import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { IArticle, IArticlesByDateResponse } from '@/api/dashboard';

interface ArticleDetailProps {
  data: IArticlesByDateResponse;
  articleId: number;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  data,
  articleId,
}) => {
  const article = data?.content.find(
    (item: IArticle) => item.articleId === articleId
  );

  return (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <SText color="#333" fontSize="24px" fontWeight={700}>
          {article?.articleTitle}
        </SText>
        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          {article?.createdDate.slice(0, -3)}
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          <LazyImage
            src={article?.memberImage || ''}
            altText={article?.memberName || ''}
            w={16}
            h={16}
            maxW={16}
            style={{ borderRadius: '50%' }}
          />
          <SText color="#333" fontSize="12px" fontWeight={600}>
            {article?.memberName}
          </SText>
        </Flex>
        <Spacer h={36} />
        {article?.imageUrl && (
          <>
            <LazyImage
              src={article?.imageUrl}
              altText="이미지 불러오기 실패"
              w={600}
              h={300}
              maxW={600}
              style={{ padding: '0px 20px' }}
            />
            <Spacer h={36} />
          </>
        )}
        <div dangerouslySetInnerHTML={{ __html: article?.articleBody || '' }} />
      </Flex>
    </Box>
  );
};
