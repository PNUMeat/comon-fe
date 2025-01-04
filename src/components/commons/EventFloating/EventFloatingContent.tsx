import styled from "@emotion/styled";
import BubbleIcon from "@/assets/EventFloating/BubbleIcon.svg";

const Bubble = styled.div`
  position: absolute;
  bottom: 70px;
  left: -220px;
  background-image: url(${BubbleIcon});
  background-repeat: no-repeat;
  background-size: cover;
  width: 335px;
  height: 372px;
`;

const ContentWrapper = styled.div`
  padding: 25px;
  font-size: 10px;
  line-height: 1.4;
`;

const ButtonStyle = styled.button`
  position: absolute;
  font-size: 12px;
  right: 30px;
  bottom: 25px;
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

const HighlightText = styled.p`
  color: #FF377F;
  font-weight: 800;
`;

const Heading = styled.h1`
  font-size: 16px;
  font-weight: 700;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
`;

const Link = styled.a`
  text-decoration: none;
  font-weight: 800;
  cursor: pointer;
`;

interface EventFloatingContentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EventFloatingContent: React.FC<EventFloatingContentProps> = ({ open, setOpen }) => {
  return (
    <div>
      {open && (
        <Bubble>
          <ContentWrapper>
            <TitleText>
              <HighlightText>공지</HighlightText>
              <Heading>버그찾기 이벤트</Heading>
            </TitleText>
            <br />
            <p>안녕하세요. 코몬 운영진입니다.</p>
            <br />
            <p>
              서비스의 사용성을 개선하기 위해 사용자분들이{" "}
              <UnderlinedText>서비스에서 발견한 버그를 신고받고 있어요.</UnderlinedText>
              중요한 결점부터 사소한 에러까지의 정도에 따라{" "}
              <UnderlinedText>커피 기프티콘을 전송해 드릴 예정</UnderlinedText>
              입니다.
            </p>
            <br />
            <p>
              대학생들이 만든 프로젝트이기에 미흡한 점이 있음을 널리 이해 부탁드리고, 소중한
              의견을 통해 점차 보완해 나갈 것을 약속드립니다.
            </p>
            <br />
            <BoldText>참여 조건: 1개 이상의 팀에 참여 & 1개 이상 게시글 작성한 사용자</BoldText>
            <BoldText>문의 방법: 하단의 구글 폼 이용</BoldText>
            <br />
            <p>감사합니다. 좋은 하루 보내세요!</p>
            <br />
            <Link href="https://forms.gle/6KqTsqQxbvZwAizU9" target="_blank">https://forms.gle/6KqTsqQxbvZwAizU9</Link>
            <br/>
            <ButtonStyle onClick={() => setOpen(!open)}>확인했어요!</ButtonStyle>
          </ContentWrapper>
        </Bubble>
      )}
    </div>
  );
};
