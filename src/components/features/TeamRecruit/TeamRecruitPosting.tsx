import { SText } from "@/components/commons/SText";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import PostEditor from "@/components/features/Post/PostEditor";
import { Spacer } from "@/components/commons/Spacer";
import { colors } from "@/constants/colors";
import { breakpoints } from "@/constants/breakpoints";
import click from '@/assets/TeamJoin/click.png';
import { RecruitExampleData } from "@/components/features/TeamRecruit/RecruitExampleData";
import { getRecruitDefaultData } from "@/components/features/TeamRecruit/RecruitExampleData";
import sendIcon from '@/assets/TeamRecruit/send.svg';
import TeamRecruitInput from "@/components/features/TeamRecruit/TeamRecruitInput";
import grayClickIcon from '@/assets/TeamRecruit/grayClick.svg';
import { createRecruitPost, modifyRecruitPost } from "@/api/recruitment";
import { useLocation } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { alertAtom } from "@/store/modal";
import { postImagesAtom } from "@/store/posting";
import { navigate } from "@/api/apiInstance";
import { usePrompt } from "@/hooks/usePrompt";

export const TeamRecruitPosting = () => {
  const isMobile = window.innerWidth < breakpoints.mobile;
  const location = useLocation();
  const { teamRecruitBody, teamRecruitTitle, chatUrl, teamId, recruitId} = location?.state ?? {
    teamRecruitBody: getRecruitDefaultData(isMobile ? "14px" : "18px"),
    teamRecruitTitle: '',
    chatUrl: '',
    teamId: null,
    recruitId: null,
  };

  const [content, setContent] = useState<string>(() => teamRecruitBody);
  const [title, setTitle] = useState(teamRecruitTitle);
  const [url, setUrl] = useState(chatUrl);
  const [postImages, setPostImages] = useAtom(postImagesAtom);
  const chatUrlRef = useRef<HTMLTextAreaElement>(null);
  const setAlert = useSetAtom(alertAtom);
  const [disablePrompt, setDisablePrompt] = useState(false);

  const isButtonDisabled = !title.trim() || !content.trim() || !url.trim();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(e.target.value);
  }

  usePrompt(!disablePrompt);

  const onClick = () => {

    const teamRecruitBodyTrim = content.trim();

    const teamRecruitBody =
      postImages.length > 0
      ? teamRecruitBodyTrim.replace(/(<img[^>]*src=")[^"]*(")/g, '$1?$2')
      : teamRecruitBodyTrim;

    if (recruitId) {
      modifyRecruitPost({
        teamRecruitTitle: title,
        teamRecruitBody: teamRecruitBody,
        image: 
        postImages.length > 0
        ? postImages
            .sort((a, b) => {
              if (a.line !== b.line) {
                return a.line - b.line;
              }
              return a.idx - b.idx;
            })
            .map((imgObj) => imgObj.img)
        : null,
        chatUrl: url,
        recruitmentId: recruitId,
      })
      .then(() => {
        setPostImages([]);
        setDisablePrompt(true);
        navigate(`/team-recruit/detail/${recruitId}`);
      })
      .catch((err) => {
        setAlert({
          message: err.response.data.message ?? '포스팅 작성에 실패했습니다.',
          isVisible: true,
          onConfirm: () => {},
        });
      });
      return;
    } else {
  
    createRecruitPost({
      teamId: teamId,
      teamRecruitTitle : title,
      teamRecruitBody : teamRecruitBody,
      image : 
      postImages.length > 0
      ? postImages
          .sort((a, b) => {
            if (a.line !== b.line) {
              return a.line - b.line;
            }
            return a.idx - b.idx;
          })
          .map((imgObj) => imgObj.img)
      : null,
      chatUrl: url,
    })
    .then((res) => {
      setPostImages([]);
      setDisablePrompt(true);
      navigate(`/team-recruit/detail/${res.teamRecruitId}`);
    })
    .catch((err) => {
      setAlert({
        message: err.response.data.message ?? '포스팅 작성에 실패했습니다.',
        isVisible: true,
        onConfirm: () => {},
      });
    });
  }
  };

  
  return (
    <ContentWrapper>
      <PostSubjectViewer />
        <PostEditor
            forwardContent={setContent}
            forwardTitle={setTitle}
            content={content}
            title={title}
          />
          <Spacer h={10} />
          <ContactWrapper>
            <Contact>
              <IconTitleWrapper>
                <SendIconStyle src={sendIcon} />
                <ContactTitle>연락 방법</ContactTitle>
              </IconTitleWrapper>
              <ContactText>(필수) 방장은 팀 관리와 운영을 위해 연락 방법을 반드시 기재해야 해요</ContactText>
            </Contact>
            <TeamRecruitInput
              value={url}
              ref={chatUrlRef}
              onChange={onChange}
            />
            </ContactWrapper>
            <Spacer h={30} />
            <ConfirmButtonWrap
            disabled={isButtonDisabled}
            isPending={false}
            onClick={onClick}
          >
          <ClickImage src={isButtonDisabled ? grayClickIcon : click} />
          <ActionText>
            <SText fontSize={isMobile ? '16px' : '20px'} fontWeight={700}>
              {recruitId ? '수정 완료' : '작성 완료'}
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

  @media (max-width: ${breakpoints.mobile}px) {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }
`;

const IconTitleWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SendIconStyle = styled.img`
  width: 24px;
  height: 24px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 14px;
    height: 14px;
  }
`;

const ContactTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333; 
  margin-top: 5px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    margin-top: 3px;
  }
`;

const ContactText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #B5B5B5;
  margin-top: 5px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
  }
`;


const PostSubjectViewer: React.FC = () => {
  const [show, setShow] = useState(false);
  const [height, setHeight] = useState(57);
  const contentRef = useRef<{getHeight: () => number}>(null);
  const isMobile = window.innerWidth < breakpoints.mobile;

  useEffect(() => {
    if (show && contentRef.current) {
      const content = contentRef.current;
      const resizeObserver = new ResizeObserver(() => {
        // 제목 57 + 하단 57
        setHeight(content.getHeight() + 114);
      });
      resizeObserver.observe(document.body);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [show]);

  return (
    <PostSubjectViewWrap
      height={height}
      show={show}
    >
      <GapFlex gap={20}>
        <SText
          color={show ? "#E5E6ED" : "#333"}
          fontSize={isMobile ? '18px' : '20px'}
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
      {show && <RecruitExampleData ref={contentRef}/>}
      <GapFlex
        gap={12}
        padding={'0 10px'}
        cursor={'pointer'}
        onClick={() => setShow((prev) => !prev)}
        justifyContent={'end'}
      >
        <SText
          color={'#D9D9D9'}
          fontSize={isMobile ? '14px' : '16px'}
          fontWeight={400}
          fontFamily={'Pretendard'}
        >
          {show ? '예시 접기' : '펼쳐서 확인하기'}
        </SText>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isMobile ? '13' : '17'}
          height={isMobile ? '6.5' : '10'}
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
  max-height: ${({ show, height }) => (show ? `${height}px` : '57px')}; 
  border: 1px solid #f15ca7;
  border-radius: 10px;
  margin: 20px 0;
  padding: 0 40px;
  box-sizing: border-box;
  transition: max-height 0.5s ease-in-out;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 0 20px;
  }
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
  height: auto;
  width: calc(100% - 12px);
  border-radius: 16px;
  box-sizing: border-box;
  border: 1px solid #CDCFFF;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 14px 15px;
    gap: 8px;
  }
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
