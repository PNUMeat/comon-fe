import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { IArticle } from '@/api/dashboard';

interface ArticleDetailProps {
  data: IArticle;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ data }) => {
  return (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <SText color="#333" fontSize="24px" fontWeight={700}>
          {data?.articleTitle}
        </SText>
        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          {data?.createdDate.slice(0, -3)}
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          <LazyImage
            src={data?.memberImage || ''}
            altText={data?.memberName || ''}
            w={16}
            h={16}
            maxW={16}
            style={{ borderRadius: '50%' }}
          />
          <SText color="#333" fontSize="12px" fontWeight={600}>
            {data?.memberName}
          </SText>
        </Flex>
        <Spacer h={36} />
        <div
          dangerouslySetInnerHTML={{
            __html: data?.imageUrl
              ? data?.articleBody.replace(
                  /(<img[^>]*src=")\?("[^>]*>)/g,
                  `$1${data?.imageUrl}$2`
                )
              : data?.articleBody,
          }}
        />
      </Flex>
    </Box>
  );
};
