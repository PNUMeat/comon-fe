import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';

import { useRef } from 'react';

import arrowLeftIcon from '@/assets/Home/arrow-review.svg';
import styled from '@emotion/styled';

export const ReviewSlider = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const colors = ['#6E74FA', '#FF5780', '#F15CA7'];

  return (
    <Wrapper>
      <ArrowButtonLeft onClick={scrollLeft}>
        <img src={arrowLeftIcon} />
      </ArrowButtonLeft>

      <ScrollContainer ref={containerRef}>
        {[...Array(7)].map((_, i) => (
          <Card key={i}>
            <SText
              color="#767676"
              font-family="Pretendard"
              fontSize="14px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="19px"
              letterSpacing="-0.28px"
            >
              "원래 일주일에 한두 문제 풀던 제가, 코몬 4days 팀에 합류하니
              일주일 4회는 기본이 되더라고요. 처음엔 벅찼지만, 팀원들과 서로
              리마인드하고 피드백 주고받으니 2달 만에 목표했던 실버 등급
              달성까지 성공했어요!"
            </SText>
            <Flex gap="8px">
              <Dot color={colors[i % colors.length]} />
              <SText
                color="#333"
                fontFamily="Pretendard"
                fontSize="16px"
                fontStyle="normal"
                fontWeight={600}
                lineHeight="19px"
                letterSpacing="-0.32px"
              >
                홍길동
              </SText>
              <SText
                color="#111"
                fontFamily="Pretendard"
                fontSize="14px"
                fontStyle="normal"
                fontWeight={600}
                lineHeight="19px"
                letterSpacing="-0.28px"
              >
                코몬_4days
              </SText>
            </Flex>
          </Card>
        ))}
      </ScrollContainer>

      <ArrowButtonRight onClick={scrollRight}>
        <img src={arrowLeftIcon} style={{ transform: 'rotate(180deg)' }} />
      </ArrowButtonRight>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 20px 0;
  max-width: 100%;
  min-width: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  display: flex;
  width: 300px;
  height: 180px;
  padding: 30px 40px;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  background: #fff;
  border-radius: 20px;
  box-shadow: 2px 2px 20px 0px rgba(94, 96, 153, 0.2);
  transition: 0.3s;
`;

const Dot = styled.span<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const ArrowBase = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
`;

const ArrowButtonLeft = styled(ArrowBase)`
  left: 100px;
`;

const ArrowButtonRight = styled(ArrowBase)`
  right: 100px;
`;
