import { SText } from '@/components/commons/SText';
import {
  GrayDivider,
  LogoutWrap,
  MyTeamNav,
  SimpleProfile,
  SimpleProfileWrap,
} from '@/components/features/Header/segments';

import { getMemberInfo } from '@/api/user';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const InfoModal = styled.div`
  width: 326px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #8488ec;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  position: absolute;
  top: 46px;
  right: -26px;
  opacity: 0;
  z-index: 99999999;
  box-sizing: border-box;
  padding: 9px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderInfoModal: React.FC<{
  setModalRef: (el: HTMLDivElement | null) => void;
  onClickLogout: () => void;
}> = ({ setModalRef, onClickLogout }) => {
  const { data } = useQuery({
    queryFn: getMemberInfo,
    queryKey: ['membersInfo'],
  });
  const myName = data?.memberName;
  const myImg = data?.memberImageUrl;
  const teams = data?.teamAbstractResponses ?? [];

  return (
    <InfoModal ref={setModalRef}>
      <SimpleProfileWrap>
        <SimpleProfile name={myName} img={myImg} />
        <SText
          color={'#777'}
          lineHeight={'48px'}
          fontSize={'12px'}
          fontWeight={400}
        >
          마이페이지
        </SText>
      </SimpleProfileWrap>
      <GrayDivider />

      {teams &&
        teams.map((team) => (
          <MyTeamNav
            key={team.teamId}
            teamImg={team.teamImageUrl}
            teamName={team.teamName}
            teamId={team.teamId}
          />
        ))}

      <GrayDivider />
      <LogoutWrap>
        <button onClick={onClickLogout}>
          <SText
            color={'#505050'}
            fontSize={'12px'}
            fontWeight={500}
            fontFamily={'Pretendard'}
          >
            로그아웃
          </SText>
        </button>
      </LogoutWrap>
    </InfoModal>
  );
};
