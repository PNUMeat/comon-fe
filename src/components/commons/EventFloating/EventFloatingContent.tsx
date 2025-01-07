import SpeechBubble from '@/assets/EventFloating/speech_bubble.png';
import styled from '@emotion/styled';

import { SText } from '../SText';

const Bubble = styled.div`
  position: absolute;
  bottom: 70px;
  left: -225px;
  background-image: url(${SpeechBubble});
  background-repeat: no-repeat;
  background-size: cover;
  width: 340px;
  height: 380px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0px 0px 24px;
  font-size: 10px;
  line-height: 1.4;
  width: 312px;
`;

const ButtonStyle = styled.button`
  position: absolute;
  font-size: 12px;
  right: 32px;
  bottom: 30px;
  width: 100px;
  height: 30px;
  border-radius: 20px;
  color: #fff;
  background: #6e74fa;
`;

const BoldText = styled.p`
  font-weight: 700;
`;

const TitleText = styled.div`
  display: flex;
  gap: 8px;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
`;

const Link = styled.a`
  text-decoration: none;
  font-weight: 800;
  cursor: pointer;
  color: #333;
`;

interface EventFloatingContentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EventFloatingContent: React.FC<EventFloatingContentProps> = ({
  open,
  setOpen,
}) => {
  return (
    <div>
      {open && (
        <Bubble>
          <ContentWrapper>
            <TitleText>
              <SText color="#ff377f" fontWeight={700}>
                공지
              </SText>
              <SText fontSize="16px" fontWeight={700}>
                버그 찾기 이벤트
              </SText>
            </TitleText>
            <br />
            <p>안녕하세요. 코몬 운영진입니다.</p>
            <br />
            <p>
              서비스의 사용성을 개선하기 위해 사용자분들이{' '}
              <UnderlinedText>
                서비스에서 발견한
                <br /> 버그를 신고받고 있어요.{' '}
              </UnderlinedText>
              중요한 결점부터 사소한 에러까지의 정도에 <br />
              따라{' '}
              <UnderlinedText>커피 기프티콘을 전송해 드릴 예정</UnderlinedText>
              입니다.
            </p>
            <br />
            <p>
              대학생들이 만든 프로젝트이기에 미흡한 점이 있음을 널리 이해 부탁
              <br />
              드리고, 소중한 의견을 통해 점차 보완해 나갈 것을 약속드립니다.
            </p>
            <br />
            <BoldText>
              참여 조건: 1개 이상의 팀에 참여 & 1개 이상 게시글 작성한 사용자
            </BoldText>
            <BoldText>문의 방법: 하단의 구글 폼 이용</BoldText>
            <br />
            <p>감사합니다. 좋은 하루 보내세요!</p>
            <br />
            <Link href="https://forms.gle/6KqTsqQxbvZwAizU9" target="_blank">
              https://forms.gle/6KqTsqQxbvZwAizU9
            </Link>
            <br />
            <ButtonStyle onClick={() => setOpen(!open)}>
              확인했어요!
            </ButtonStyle>
          </ContentWrapper>
        </Bubble>
      )}
    </div>
  );
};
