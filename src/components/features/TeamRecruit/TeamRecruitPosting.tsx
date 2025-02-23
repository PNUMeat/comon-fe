import { SText } from "@/components/commons/SText";
import { viewStyle } from "@/utils/viewStyle";
import styled from "@emotion/styled";
import { useState, useRef } from "react";
import PostEditor from "../Post/PostEditor";
import { Spacer } from "@/components/commons/Spacer";
import { colors } from "@/constants/colors";
import { breakpoints } from "@/constants/breakpoints";
import click from '@/assets/TeamJoin/click.png';

export const TeamRecruitPosting = () => {
  const [content, setContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState('');
  return (
    <ContentWrapper>
      <PostSubjectViewer />
        <PostEditor
            forwardContent={setContent}
            forwardTitle={setPostTitle}
            content={content}
            title={postTitle}
          />
          <Spacer h={10} />
          <ContactWrapper>
            연락 방법 칸
            </ContactWrapper>
            <Spacer h={30} />
            <ConfirmButtonWrap
            disabled={false}
            isPending={false}
            onClick={() => {}}
          >
          <ClickImage src={click} />
          <ActionText>
            <SText fontSize={'20px'} fontWeight={700}>
              작성 완료
            </SText>
          </ActionText>
        </ConfirmButtonWrap>
    </ContentWrapper>
  );
}

const minShowHeight = 790;

const PostSubjectViewer: React.FC = () => {
  const [height] = useState<number>(minShowHeight);
  const [show, setShow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const data = '데이터 데이터';

  return (
    <PostSubjectViewWrap
      height={show ? Math.max(height, minShowHeight) : 57}
      show={show}
    >
      <GapFlex gap={20}>
        <SText
          color={'#333'}
          fontSize={'20px'}
          fontWeight={700}
          fontFamily={'Pretendard'}
        >
          작성 예시
        </SText>
        <SText
          color={'#333'}
          fontSize={'20px'}
          fontWeight={700}
          fontFamily={'Pretendard'}
          whiteSpace={'normal'}
          wordBreak={'break-word'}
        >
        </SText>
      </GapFlex>
      {show && data ? (
        <TopicViewer
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      ) : null}
      <GapFlex
        gap={12}
        padding={'0 10px'}
        cursor={'pointer'}
        onClick={() => setShow((prev) => !prev)}
        justifyContent={'end'}
      >
        <SText
          color={'#777'}
          fontSize={'16px'}
          fontWeight={400}
          fontFamily={'Pretendard'}
        >
          {show ? '예시 접기' : '펼쳐서 확인하기'}
        </SText>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="10"
          viewBox="0 0 17 10"
          fill="none"
          style={{
            transform: show ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M0 0 L8.5 10 L17 0" stroke="#CCCCCC" strokeWidth="1.5" />
        </svg>
      </GapFlex>
    </PostSubjectViewWrap>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PostSubjectViewWrap = styled.div<{
  height: number;
  show: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ show }) => (show ? '1fr' : 'auto auto')};
  grid-template-rows: ${({ show }) => (show ? '1fr auto' : '1fr')};

  justify-content: space-between;

  width: 100%;
  min-height: 57px;
  height: ${(props) => props.height}px;
  border: 1px solid #f15ca7;
  border-radius: 10px;
  margin: 20px 0;
  padding: 0 40px;
  box-sizing: border-box;
  transition: height 0.5s ease;
  overflow: hidden;
`;

const GapFlex = styled.div<{
  gap?: number;
  padding?: string;
  cursor?: string;
  justifyContent?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyContent ?? 'start'};
  gap: ${(props) => props.gap ?? 0}px;
  ${(props) => (props.padding ? `padding: ${props.padding};` : '')}
  ${(props) => (props.cursor ? `cursor: ${props.cursor};` : '')}
  height: 57px;
  width: 100%;
`;

const TopicViewer = styled.div`
  line-height: 1.5;

  ${viewStyle}
`;

const ContactWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  padding: 20px 40px;
  height: 100px;
  width: 100%;
  border-radius: 16px;
  box-sizing: border-box;
  border: 1px solid #CDCFFF;
`;

const ConfirmButtonWrap = styled.button<{ isPending: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: ${(props) => (props.isPending ? '#919191' : '#fff')};
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  width: 712px;
  height: 80px;
  padding: 0;
  border: 3px solid ${colors.borderPurple};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 312px;
    border-radius: 40px;
    height: 50px;
    border: 2px solid ${colors.borderPurple};
  }
`;

// TODO: TeamJoin에서 가져옴
const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;
// TODO: TeamJoin에서 가져옴
const ActionText = styled.div`
  margin-left: 8px;
`;

export default TeamRecruitPosting;