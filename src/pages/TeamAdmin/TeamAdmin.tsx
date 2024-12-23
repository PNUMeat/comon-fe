import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { InputContainer } from '@/components/commons/Form/segments/InputContainer';
import { InputField } from '@/components/commons/Form/segments/InputField';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { Wrap } from '@/components/commons/Wrap';
import { HeightInNumber } from '@/components/types';

import { Fragment, forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import announcementTodayIcon from '@/assets/TeamAdmin/announcementToday.svg';
import AnnouncementIcon from '@/assets/TeamDashboard/announcement.png';
import PencilIcon from '@/assets/TeamDashboard/pencil.png';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    'sidebar announcement'
    'sidebar calendar';
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 24px 40px;
  height: 100vh;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
`;

const Announcement = styled.header`
  grid-area: announcement;
  display: flex;
  justify-content: space-between;
`;

const leftPadding = '32px';

const Image = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const AnnouncementImage = styled(Image)`
  position: absolute;
  transform: translate(-${leftPadding}, -4px);
`;

const SubjectImage = styled(Image)`
  position: absolute;
  transform: translate(-25px, 0);
`;

const SubjectControlButtonWrap = styled.button`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 24px 72px;
  border-radius: 20px;
  background: var(--1, linear-gradient(98deg, #fe82db 6.1%, #68e4ff 103.66%));
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  border: none;
`;

const SubjectControlButton = () => (
  <SubjectControlButtonWrap>
    <SubjectImage src={PencilIcon} alt={'pencil icon'} />
    <SText fontSize="18px" color="#fff" fontWeight={700}>
      주제 작성 및 수정
    </SText>
  </SubjectControlButtonWrap>
);

const AnnouncementAndSubject = forwardRef<
  HTMLDivElement,
  {
    onClick: () => void;
    announcementToday: string;
  }
>(({ announcementToday, onClick }, ref) => {
  return (
    <Announcement>
      <Box
        width="60%"
        height="70px"
        padding={`0 24px 0 ${leftPadding}`}
        ref={ref}
      >
        <Flex
          direction="column"
          gap="4px"
          justify="flex-start"
          padding="0 24px"
        >
          <AnnouncementImage src={AnnouncementIcon} />
          <SText color="#333" fontSize="18px" fontWeight={700}>
            Team announcement
          </SText>

          {announcementToday ? (
            <SText color="#333" fontSize="14px" fontWeight={500}>
              {announcementToday}
            </SText>
          ) : (
            <SText color="gray" fontSize="14px" fontWeight={500}>
              공지가 선언되지 않았어요.
            </SText>
          )}
        </Flex>

        <Image
          src={announcementTodayIcon}
          alt="announcement modify button"
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        />
      </Box>

      <SubjectControlButton />
    </Announcement>
  );
});
AnnouncementAndSubject.displayName = 'AnnouncementAndSubject';

export const TeamAdmin = () => {
  const announcementToday = '제목 양식: 00/00 코테 풀이로 작성 할 것!';
  const announcementRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const positionModal = () => {
    if (
      announcementRef &&
      'current' in announcementRef &&
      announcementRef.current
    ) {
      const announcement = announcementRef.current;
      const { top, left, width } = announcement.getBoundingClientRect();
      const modal = modalRef.current;
      if (modal) {
        modal.style.top = `${top}px`;
        modal.style.left = `${left}px`;
        modal.style.width = `${width}px`;
      }
    }
  };

  useEffect(() => {
    if (
      announcementRef &&
      'current' in announcementRef &&
      announcementRef.current
    ) {
      const announcement = announcementRef.current;
      const { top, left, width } = announcement.getBoundingClientRect();
      const modal = modalRef.current;
      if (modal) {
        if (show) {
          modal.style.top = `${top}px`;
          modal.style.left = `${left}px`;
          modal.style.width = `${width}px`;
          const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef?.current?.contains(e.target as Node)) {
              return;
            }
            setShow(false);
          };
          document.addEventListener('mousedown', handleOutsideClick);

          return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
          };
        } else {
          modal.style.top = `99999px`;
        }
      }
    }
  }, [show]);

  useEffect(() => {
    document.addEventListener('scroll', positionModal);

    return () => {
      document.removeEventListener('scroll', positionModal);
    };
  }, []);

  return (
    <Fragment>
      <Spacer h={28} />
      <Grid>
        <Sidebar>
          <Box width="100%" height="380px" borderWidth="3px"></Box>
        </Sidebar>

        <AnnouncementAndSubject
          announcementToday={announcementToday}
          onClick={() => setShow(true)}
          ref={announcementRef}
        />
      </Grid>
      {createPortal(<PromptModal ref={modalRef} />, document.body)}
    </Fragment>
  );
};

const ModalWrap = styled.div<HeightInNumber>`
  height: ${(props) => (props.h ? `${props.h}px` : '0')};
  position: fixed;
  background: #fff;
  color: #000;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid ${colors.borderPurple};
  border-radius: 20px;
  align-items: center;
`;

const PromptModal = forwardRef<HTMLDivElement>((_props, ref) => {
  const [announcement, setAnnouncement] = useState<string>('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncement(e.target.value);
  };
  return (
    <ModalWrap h={222} ref={ref}>
      <div style={{ padding: `0 24px 0 ${leftPadding}` }}>
        <AnnouncementImage src={AnnouncementIcon} />
        <SText color="#333" fontSize="18px" fontWeight={700}>
          Team announcement
        </SText>
      </div>
      <Spacer h={25} />
      <Wrap>
        <InputContainer>
          <InputField
            placeholder={'공지글 입력'}
            maxLength={50}
            value={announcement}
            onChange={onChange}
          />
        </InputContainer>
        <InputHelperText>
          {announcement.length}/{50}자
        </InputHelperText>
      </Wrap>
      <Spacer h={44} />
      <div
        style={{
          display: 'flex',
          gap: '14px',
          alignSelf: 'center',
        }}
      >
        <CancelButton>취소</CancelButton>
        <SaveButton>저장하기</SaveButton>
      </div>
    </ModalWrap>
  );
});

PromptModal.displayName = 'PromptModal';

const ButtonBase = styled.button`
  display: flex;
  height: 31px;
  padding: 9px 41px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
`;

export const CancelButton = styled(ButtonBase)`
  background: #d9d9d9;
  color: black;
`;

export const SaveButton = styled(ButtonBase)`
  padding: 9px 34px;
  background: #6e74fa;
  color: white;
`;
