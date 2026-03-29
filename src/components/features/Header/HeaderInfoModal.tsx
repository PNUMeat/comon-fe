import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import {
  Divider,
  EmptyTeamNav,
  LogoutWrap,
  MyTeamNav,
  SimpleProfile,
  SimpleProfileWrap,
} from '@/components/features/Header/segments';

import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import { ServerResponse } from '@/api/types';
import { getMemberInfo } from '@/api/user';
import navArrow from '@/assets/Header/jumpArrow.svg';
import MyPage from '@/assets/Header/mypage.png';
import Arrow from '@/assets/TeamJoin/carousel_arrow.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const InfoModal = styled.div`
  width: 645px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #8488ec;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  position: absolute;
  top: 46px;
  right: -26px;
  z-index: -100;
  box-sizing: border-box;
  padding: 9px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;

  border-radius: 10px;
  border: 1px solid #8488ec;
  background: #fff;

  box-shadow: 0px 6px 20px 0px rgba(48, 49, 67, 0.06);

  @media (max-width: ${breakpoints.mobile}px) {
    right: 2px;
    width: 230px;
  }
`;

const MyPageButton = styled.button`
  height: 48px;
  display: flex;
  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
  }
`;

const MyPageImage = styled.img`
  width: 21px;
  height: 25px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 8px;
    height: 10px;
  }
`;

export const HeaderInfoModal: React.FC<{
  isLoggedIn: boolean;
  setModalRef: (el: HTMLDivElement | null) => void;
  onClickLogout: () => void;
}> = ({ isLoggedIn, setModalRef, onClickLogout }) => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryFn: getMemberInfo,
    queryKey: ['membersInfo'],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: isLoggedIn,
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <InfoModal
      ref={setModalRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <SimpleProfileWrap>
        <SimpleProfile name={myName} img={myImg} />
        <MyPageButton onClick={() => navigate(`${PATH.MY_PAGE}/profile`)}>
          <Flex align="center" gap="12px">
            <MyPageImage src={MyPage} />
            <SText
              fontFamily="NanumSquareNeo"
              color={'#333'}
              lineHeight={isMobile ? '' : '48px'}
              fontSize={isMobile ? '8px' : '24px'}
              fontWeight={500}
            >
              마이페이지
            </SText>
            <img src={navArrow} alt="navigate" width={10} />
          </Flex>
        </MyPageButton>
      </SimpleProfileWrap>
      <Divider margin={'9px 0 0 0'} />

      {teams && teams.length > 0 ? (
        <TeamSliderWrapper>
          <Slider
            dots={teams.length > 1}
            infinite={teams.length > 1}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            prevArrow={<CustomArrow direction="left" />}
            nextArrow={<CustomArrow direction="right" />}
          >
            {teams.map((team) => (
              <div key={team.teamId}>
                <MyTeamNav
                  teamImg={team.teamImageUrl}
                  teamName={team.teamName}
                  teamId={team.teamId}
                />
              </div>
            ))}
          </Slider>
        </TeamSliderWrapper>
      ) : (
        <EmptyTeamNav />
      )}

      <Divider
        margin={isMobile ? '0 0 5px 0' : '0 0 9px 0'}
        color={colors.borderPurple}
      />
      <LogoutWrap>
        <button
          style={{
            backgroundColor: '#F4F4F4',
            padding: '8px 14px',
            borderRadius: '5px',
          }}
          onClick={onClickLogout}
        >
          <SText
            color={'#FF5557'}
            fontSize={isMobile ? '12px' : '16px'}
            fontWeight={600}
            fontFamily={'NanumSquareNeo'}
          >
            ← 로그아웃
          </SText>
        </button>
      </LogoutWrap>
    </InfoModal>
  );
};

interface CustomArrowProps {
  onClick?: () => void;
  direction: string;
}

const CustomArrow: React.FC<CustomArrowProps> = ({ onClick, direction }) => (
  <ArrowButton onClick={onClick} direction={direction}>
    <ArrowImage src={Arrow} direction={direction} />
  </ArrowButton>
);

const TeamSliderWrapper = styled.div`
  width: 100%;
  position: relative;

  .slick-dots {
    bottom: 30px;
    .slick-active {
      button:before {
        font-size: 10px;
        opacity: 1;
        color: ${colors.buttonPurple};
      }
    }
    li {
      button:before {
        font-size: 10px;
        opacity: 1;
        color: ${colors.borderPurple};
      }
    }
  }
`;

const ArrowButton = styled.div<{ direction: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 60px;
  border-radius: 6px;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  border: 1px solid rgba(205, 207, 255, 0.6);
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  ${({ direction }) => (direction === 'right' ? 'right: 14px;' : 'left: 14px;')}
`;

const ArrowImage = styled.img<{ direction: string }>`
  width: auto;
  height: 14px;
  transform: ${({ direction }) =>
    direction === 'right' ? 'rotate(180deg)' : 'none'};
`;
