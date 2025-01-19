import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import {
  Divider,
  LogoutWrap,
  MyTeamNav,
  SimpleProfile,
  SimpleProfileWrap,
} from '@/components/features/Header/segments';

import { useNavigate } from 'react-router-dom';

import { ServerResponse } from '@/api/types';
import { getMemberInfo } from '@/api/user';
import MyPage from '@/assets/Header/mypage.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
  z-index: -100;
  box-sizing: border-box;
  padding: 9px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 230px;
  }
`;

const MyPageButton = styled.button`
  height: 48px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
  }
`;

const MyPageImage = styled.img`
  width: 11px;
  height: 13px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 8px;
    height: 10px;
  }
`;

export const HeaderInfoModal: React.FC<{
  setModalRef: (el: HTMLDivElement | null) => void;
  onClickLogout: () => void;
}> = ({ setModalRef, onClickLogout }) => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryFn: getMemberInfo,
    queryKey: ['membersInfo'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!sessionStorage.getItem('Authorization'),
    retry: (failureCount, error: AxiosError<ServerResponse<null>>) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === 100
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
  const myName = data?.memberName;
  const myImg = data?.memberImageUrl;
  const teams = data?.teamAbstractResponses ?? [];

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <InfoModal ref={setModalRef} onClick={(e) => e.stopPropagation()}>
      <SimpleProfileWrap>
        <SimpleProfile name={myName} img={myImg} />
        <MyPageButton onClick={() => navigate(`${PATH.MY_PAGE}/profile`)}>
          <Flex align="center" gap="5px">
            <MyPageImage src={MyPage} />
            <SText
              fontFamily="NanumSquareNeo"
              color={'#333'}
              lineHeight={isMobile ? '' : '48px'}
              fontSize={isMobile ? '8px' : '12px'}
              fontWeight={500}
            >
              마이페이지 &nbsp;&nbsp;&gt;
            </SText>
          </Flex>
        </MyPageButton>
      </SimpleProfileWrap>
      <Divider margin={'9px 0 0 0'} />

      {teams &&
        teams.map((team) => (
          <MyTeamNav
            key={team.teamId}
            teamImg={team.teamImageUrl}
            teamName={team.teamName}
            teamId={team.teamId}
          />
        ))}

      <Divider
        margin={isMobile ? '0 0 5px 0' : '0 0 9px 0'}
        color={colors.borderPurple}
      />
      <LogoutWrap>
        <button onClick={onClickLogout}>
          <SText
            color={'#CA2D2D'}
            fontSize={isMobile ? '8px' : '12px'}
            fontWeight={500}
            fontFamily={'NanumSquareNeo'}
          >
            로그아웃
          </SText>
        </button>
      </LogoutWrap>
    </InfoModal>
  );
};
