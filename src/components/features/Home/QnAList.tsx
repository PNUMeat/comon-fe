import { SText } from '@/components/commons/SText';

import { useState } from 'react';

import arrowDownIcon from '@/assets/Home/arrow-faq.svg';
import styled from '@emotion/styled';

export const QnAList = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const qnaData = [
    {
      question: '코드몬스터에서 자체적으로 코딩테스트 문제를 제공하나요?',
      answer:
        '아쉽게도 서비스 자체적으로 코딩테스트 문제를 제공해 드리진 않고 있어요. 하지만 현재 코몬 팀에서 직접 스터디를 운영하며, 일주일에 많게는 6일까지 문제를 올려드리고 풀이를 공유하고 있어요. 약 200명의 팀원과 함께 코테 풀이를 시작해 보아요!',
    },
    {
      question: '팀원 없이 혼자 코테 문제를 풀고 풀이를 작성해도 되나요?',
      answer:
        '그럼요! 코몬은 팀을 만들어 풀이를 공유하는 기능을 가지고 있지만, 본질은 자신의 풀이를 아카이빙하는 데 있어요. 혼자 풀이를 작성하면서 좋은 습관을 만들어 보세요. 그리고 혹시 팀원이 필요하다면, 모집글 작성 후 언제든 팀원을 모집할 수 있어요.',
    },
    {
      question: '기존에 운영 중인 팀에 참여하고 싶으면 어떻게 하면 되나요?',
      answer:
        '알려드릴게요! 페이지 상단에 있는 [팀원 모집] 메뉴에 들어가면 모집 중인 팀 리스트가 있어요. 여기서 "모집중"과 "운영중" 태그가 같이 붙어 있는 팀은 현재 팀 운영도 하고 모집도 열어둔 상태예요. 모집글을 자세히 읽어보시고, 안내에 따라 신청글을 간단히 작성하면 팀장이 곧 연락드릴 거예요.',
    },
    {
      question: '이때까지 내가 쓴 글만 따로 모아서 볼 수 있나요?',
      answer:
        '가능해요. 페이지 상단 [내정보] → [마이페이지] → [내 팀 관리]에서 이때까지 쓴 모든 글을 확인할 수 있어요.',
    },
    {
      question: '방장이나 운영자에게 더 묻고 싶은 질문이 있어요.',
      answer:
        '추가적인 질문은 화면 우측 아래에 있는 채널톡을 통해 남겨주시면, 담당자가 신속하게 답장을 보내드릴게요. 어떤 문의든 괜찮으니, 편하게 남겨주세요!',
    },
  ];

  return (
    <div style={{ maxWidth: '840px' }}>
      {qnaData.map((item, index) => (
        <ItemWrapper key={index} onClick={() => toggle(index)}>
          <Header>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SText
                color={openIndex === index ? "#333" : "#767676"}
                fontFamily="Pretendard"
                fontSize="18px"
                fontStyle="normal"
                fontWeight={400}
                lineHeight="normal"
                letterSpacing="-0.18px"
              >
                Q.
              </SText>
            <SText
              color={openIndex === index ? "#333" : "#767676"}
              fontFamily="Pretendard"
              fontSize="18px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="normal"
              letterSpacing="-0.18px"
            >
              {item.question}
            </SText>
            </div>
            {openIndex === index ? (
              <img
                src={arrowDownIcon}
                alt="접기"
                style={{ transform: 'rotate(180deg)' }}
              />
            ) : (
              <img src={arrowDownIcon} alt="펼치기" />
            )}
          </Header>

          <Answer isOpen={openIndex === index}><SText>A.</SText>{item.answer}</Answer>
        </ItemWrapper>
      ))}
    </div>
  );
};

const ItemWrapper = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 2px 2px 20px 0px rgba(94, 96, 153, 0.2);
  padding: 20px 24px 20px 40px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    transition: 0.3s;
  }
`;

const Answer = styled.div<{ isOpen: boolean }>`
  display: flex;
  gap: 12px;
  padding-right: 30px;
  font-size: 18px;
  color: #767676;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.18px;
  max-height: ${({ isOpen }) => (isOpen ? '100px' : '0')};
  overflow: hidden;
  margin-top: ${({ isOpen }) => (isOpen ? '12px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease,
    margin-top 0.3s ease;
`;
