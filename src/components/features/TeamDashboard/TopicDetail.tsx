import { Box } from '@/components/commons/Box';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import styled from '@emotion/styled';

export const TopicDetail = () => {
  return (
    <TopicDetailWrapper>
      <Box width="100%" padding="20px">
        <SText color="#333" fontSize="24px" fontWeight={700}>
          11/26 코테 풀이
        </SText>
        <Spacer h={8} />
        <SText color="#777" fontSize="12px" fontWeight={400}>
          2024.11.01 14:39
        </SText>
        <Spacer h={12} />
        <LazyImage
          src="https://via.placeholder.com/600x400" // 이미지 URL 대체
          altText="Sample Image"
          w={100}
          h={100}
          maxW={100}
        />
        <Spacer h={12} />
        <SText color="#333" fontSize="14px" fontWeight={400}>
          게시물 내용 상세 설명
        </SText>
      </Box>
    </TopicDetailWrapper>
  );
};

const TopicDetailWrapper = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;
