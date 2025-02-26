import { useWindowWidth } from '@/hooks/useWindowWidth';

import { SText } from '@/components/commons/SText';

import { useNavigate } from 'react-router-dom';

import navArrow from '@/assets/Header/jumpArrow.svg';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path.tsx';
import styled from '@emotion/styled';

export const ProfileBoxContainer = styled.div`
  width: 280px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
  }
`;

const ProfileUserWrapper = styled.div`
  display: flex;
  gap: 18px;
  height: 48px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
    gap: 12px;
    align-items: center;
  }
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 24px;
    height: 24px;
  }
`;

export const SimpleProfileWrap = styled.div`
  width: 280px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 200px;
    height: 24px;
  }
`;

export const SimpleProfile: React.FC<{ img?: string; name?: string }> = ({
  img,
  name,
}) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <ProfileUserWrapper>
      {img && <ProfileImage src={img} alt={'profile image'} />}
      {name && (
        <SText
          fontSize={isMobile ? '12px' : '16px'}
          fontWeight={500}
          fontFamily={'NanumSquareNeo'}
          lineHeight={isMobile ? '' : '48px'}
          color="#333"
        >
          {name}
        </SText>
      )}
    </ProfileUserWrapper>
  );
};

export const Divider = styled.hr<{
  margin?: string;
  color?: string;
}>`
  margin: ${(props) => props.margin};
  width: 100%;
  border: 0.5px solid ${(props) => props.color || colors.buttonPurple};
`;

const TeamNavWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 28px;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 10px 24px;
    align-items: center;
  }
`;

export const MyTeamNav: React.FC<{
  teamImg: string;
  teamName: string;
  teamId: number;
}> = ({ teamImg, teamName, teamId }) => {
  const navigate = useNavigate();

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <TeamNavWrapper
      onClick={() => {
        navigate(`${PATH.TEAM_DASHBOARD}/${teamId}`);
      }}
    >
      <TeamInfoWrap>
        <TeamImg src={teamImg} />
        <SText
          fontFamily={'Pretendard'}
          fontSize={isMobile ? '10px' : '12px'}
          fontWeight={500}
          lineHeight={isMobile ? '' : '30px'}
          color="#333"
        >
          {teamName}
        </SText>
      </TeamInfoWrap>
      <TeamNavButton />
    </TeamNavWrapper>
  );
};

const TeamInfoWrap = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}px) {
    align-items: center;
  }
`;

const TeamImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 20px;
    height: 20px;
  }
`;

const Arrow = styled.img`
  @media (max-width: ${breakpoints.mobile}px) {
    width: 6px;
  }
`;

const TeamNavButton = () => {
  return <Arrow src={navArrow} alt={'jump button to team page'} />;
};

export const LogoutWrap = styled.div`
  width: calc(100% - 48px);
  margin-bottom: 6px;
  margin-top: 4px;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 2px;
    margin-top: 0;
  }
`;
