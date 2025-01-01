import { SText } from '@/components/commons/SText';

import { useNavigate } from 'react-router-dom';

import navArrow from '@/assets/Header/jumpArrow.svg';
import styled from '@emotion/styled';

export const ProfileBoxContainer = styled.div`
  width: 280px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileUserWrapper = styled.div`
  display: flex;
  gap: 18px;
  height: 48px;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
`;

export const SimpleProfileWrap = styled.div`
  width: 280px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SimpleProfile: React.FC<{ img?: string; name?: string }> = ({
  img,
  name,
}) => {
  return (
    <ProfileUserWrapper>
      {img && <ProfileImage src={img} alt={'profile image'} />}
      {name && (
        <SText
          fontSize={'16px'}
          fontWeight={400}
          fontFamily={'Pretendard'}
          lineHeight={'48px'}
        >
          {name}
        </SText>
      )}
    </ProfileUserWrapper>
  );
};

export const GrayDivider = styled.hr<{
  margin?: string;
}>`
  margin: ${(props) => props.margin};
  // margin: 9px 0;
  width: 100%;
  background-color: #ccc;
`;

const TeamNavWrapper = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin: 4px 0;
  padding: 16px 23px;
  box-sizing: content-box;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const MyTeamNav: React.FC<{
  teamImg: string;
  teamName: string;
  teamId: number;
}> = ({ teamImg, teamName, teamId }) => {
  const navigate = useNavigate();

  return (
    <TeamNavWrapper
      onClick={() => {
        navigate(`/team-dashboard/${teamId}`);
      }}
    >
      <TeamInfoWrap>
        <TeamImg src={teamImg} />
        <SText
          fontFamily={'Pretendard'}
          fontSize={'12px'}
          fontWeight={500}
          lineHeight={'30px'}
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
`;

const TeamImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const TeamNavButton = () => {
  return <img src={navArrow} alt={'jump button to team page'} />;
};
export const LogoutWrap = styled.div`
  width: calc(100% - 34px);
  margin-bottom: 14px;
  margin-top: 10px;
`;
