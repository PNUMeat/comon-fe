import { SText } from "@/components/commons/SText";
import styled from "@emotion/styled";
import { useState } from "react";
import PostEditor from "../Post/PostEditor";
import { Spacer } from "@/components/commons/Spacer";
import { colors } from "@/constants/colors";
import { breakpoints } from "@/constants/breakpoints";
import click from '@/assets/TeamJoin/click.png';
import { RecruitExampleData } from "@/components/features/TeamRecruit/RecruitExampleData";
import { RecruitDefaultData } from "@/components/features/TeamRecruit/RecruitExampleData";
import sendIcon from '@/assets/TeamRecruit/send.svg';
import TeamRecruitInput from "@/components/features/TeamRecruit/TeamRecruitInput";
import grayClickIcon from '@/assets/TeamRecruit/grayClick.svg';

export const TeamRecruitPosting = () => {
  const [content, setContent] = useState<string>(RecruitDefaultData);
  const [postTitle, setPostTitle] = useState('');
  const [contact, setContact] = useState<string>('');

  const isButtonDisabled = !postTitle.trim() || !content.trim() || !contact.trim();
  
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
            <Contact>
              <SendIconStyle src={sendIcon} />
              <ContactTitle>연락 방법</ContactTitle>
              <ContactText>(필수) 방장은 팀 관리와 운영을 위해 연락 방법을 반드시 기재해야 해요</ContactText>
            </Contact>
            <TeamRecruitInput 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            </ContactWrapper>
            <Spacer h={30} />
            <ConfirmButtonWrap
            disabled={isButtonDisabled}
            isPending={false}
            onClick={() => {}}
          >
          <ClickImage src={isButtonDisabled ? grayClickIcon : click} />
          <ActionText>
            <SText fontSize={'20px'} fontWeight={700}>
              작성 완료
            </SText>
          </ActionText>
        </ConfirmButtonWrap>
    </ContentWrapper>
  );
}

const Contact = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SendIconStyle = styled.img`
  width: 24px;
  height: 24px;
`;

const ContactTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333; 
  margin-top: 5px;
`;

const ContactText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #B5B5B5;
  margin-top: 5px;
`;


const PostSubjectViewer: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <PostSubjectViewWrap
      height={show ? "auto" : 57}
      show={show}
    >
      <GapFlex gap={20}>
        <SText
          color={show ? "#E5E6ED" : "#333"}
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
      {show && <RecruitExampleData />}
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
  height: string | number;
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

const ContactWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  padding: 20px 40px;
  height: 100px;
  width: calc(100% - 12px);
  border-radius: 16px;
  box-sizing: border-box;
  border: 1px solid #CDCFFF;
`;

const ConfirmButtonWrap = styled.button<{ disabled: boolean, isPending: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: ${({ isPending, disabled }) =>
    disabled ? '#E0E0E0' : isPending ? '#919191' : '#fff'};
  color: ${({ disabled }) => (disabled ? '#A0A0A0' : '#000')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  width: 712px;
  height: 80px;
  padding: 0;
  border: ${({ disabled }) => (disabled ? "none" : `3px solid ${colors.borderPurple}`)};
  font-size: 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 312px;
    border-radius: 20px;
    height: 50px;
    border: 2px solid ${colors.borderPurple};
  }
`;

const ClickImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ActionText = styled.div`
  margin-left: 8px;
`;

export default TeamRecruitPosting;