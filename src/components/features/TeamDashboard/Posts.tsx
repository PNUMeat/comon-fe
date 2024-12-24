import { Box } from '@/components/commons/Box';
import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import styled from '@emotion/styled';

interface PostsProps {
  selectedDate: string | null;
}

export const Posts: React.FC<PostsProps> = ({ selectedDate }) => {
  return (
    <div style={{ position: 'relative' }}>
      <Box width="100%" padding="20px 40px" style={{ zIndex: 2 }}>
        <Flex justify="space-between" align="center">
          <Flex width={35} justify="space-between" align="center">
            <SText color="#333" fontSize="24px" fontWeight={700}>
              {selectedDate}
            </SText>
            <Label background="#FF5780" padding="2px 10px">
              <SText fontSize="12px" fontWeight={600} color="#fff">
                코딩테스트
              </SText>
            </Label>
          </Flex>
          <Button padding="8px 14px">주제 확인하기</Button>
        </Flex>
      </Box>
      <List>
        <Box width="100%" height="104px" padding="20px">
          <Flex direction="column">
            <SText color="#333" fontSize="16px" fontWeight={600}>
              11/26 코테 풀이
            </SText>
            <Spacer h={4} />
            <SText color="#777" fontSize="12px" fontWeight={400}>
              2024.11.01 14:39
            </SText>
            <Spacer h={12} />
            <SText color="#333" fontSize="14px" fontWeight={600}>
              파댕이
            </SText>
          </Flex>
        </Box>
        <Box width="100%" height="104px" padding="20px">
          <Flex direction="column">
            <SText color="#333" fontSize="16px" fontWeight={600}>
              11/26 코테 풀이
            </SText>
            <Spacer h={4} />
            <SText color="#777" fontSize="12px" fontWeight={400}>
              2024.11.01 14:39
            </SText>
            <Spacer h={12} />
            <SText color="#333" fontSize="14px" fontWeight={600}>
              파댕이
            </SText>
          </Flex>
        </Box>
        <Box width="100%" height="104px" padding="20px">
          <Flex direction="column">
            <SText color="#333" fontSize="16px" fontWeight={600}>
              11/26 코테 풀이
            </SText>
            <Spacer h={4} />
            <SText color="#777" fontSize="12px" fontWeight={400}>
              2024.11.01 14:39
            </SText>
            <Spacer h={12} />
            <SText color="#333" fontSize="14px" fontWeight={600}>
              파댕이
            </SText>
          </Flex>
        </Box>
      </List>
      <Spacer h={260} />
      <Pagination totalPages={5} onPageChange={() => {}} /> {/* TODO: */}
    </div>
  );
};

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  position: absolute;
  top: 0px;
  left: 50%;
  padding: 90px 40px;
  min-height: 216px;
  transform: translateX(-50%);
  width: calc(100% - 80px);
  z-index: 1;
  border-radius: 20px;
  background: #fff;
`;
