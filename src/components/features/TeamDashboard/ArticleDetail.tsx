import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

export const ArticleDetail = () => {
  return (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <SText color="#333" fontSize="24px" fontWeight={700}>
          게시글
        </SText>
        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          2024.11.01 14:39
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          <img src="https://via.placeholder.com/16x16" />
          {/* <LazyImage
            src="https://via.placeholder.com/16x16"
            altText="https://via.placeholder.com/600x400"
            w={16}
            h={16}
            maxW={16}
          /> */}
          <SText color="#333" fontSize="12px" fontWeight={600}>
            파댕이2
          </SText>
        </Flex>

        <Spacer h={36} />
        <img
          src="https://via.placeholder.com/600x300"
          style={{ padding: '0px 20px' }}
        />
        {/* <LazyImage
          src="https://via.placeholder.com/600x400"
          altText="Sample Image"
          w={100}
          h={100}
          maxW={100}
        /> */}
        <Spacer h={36} />
        <div></div>
      </Flex>
    </Box>
  );
};
