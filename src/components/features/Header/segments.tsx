import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { GlassCard } from '@/components/commons/GlassCard';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useNavigate } from 'react-router-dom';

import EmptyTeamImg from '@/assets/Header/empty-team-img.png';
import fourDaysImg from '@/assets/Overview/4days.png';
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
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
    gap: 12px;
    align-items: center;
  }
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 24px;
    height: 24px;
  }
`;

export const SimpleProfileWrap = styled.div`
  width: 100%;
  padding: 24px 30px;
  box-sizing: border-box;
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
          fontSize={isMobile ? '12px' : '32px'}
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
  padding: 30px 60px 70px 60px;
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

const TeamNavCard = styled(GlassCard)`
  width: 100%;
  min-height: auto;
  border-radius: 20px;
  padding: 0 0 16px 0;
  gap: 12px;
  overflow: hidden;
  justify-content: flex-start;
`;

export const MyTeamNav: React.FC<{
  teamImg: string;
  teamName: string;
  teamId: number;
}> = ({ teamName, teamId }) => {
  const navigate = useNavigate();

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const teamImgSrc = fourDaysImg;

  return (
    <TeamNavWrapper
      onClick={() => {
        navigate(`${PATH.TEAM_DASHBOARD}/${teamId}`);
      }}
    >
      <Flex width="100%" direction="column">
        <SText fontSize="24px" fontWeight={700} color="#777">
          참여중인 스터디
        </SText>
        <Spacer h={30} />
        <TeamNavCard>
          <TeamImg src={teamImgSrc} />
          <Flex direction="column" gap="27px" padding="40px">
            <SText
              fontFamily={'Pretendard'}
              fontSize={isMobile ? '24px' : '32px'}
              fontWeight={700}
              lineHeight={isMobile ? '' : '30px'}
              color="#333"
            >
              {teamName}
            </SText>
            <SText fontSize="18px" fontWeight={500} color="#777">
              가벼운 마음으로 습관을 시작해보세요. 스터디 주 2일 풀어요.
            </SText>
            <Flex gap="8px">
              <Badge>
                <span style={{ color: '#8488EC' }}>124 members</span>
              </Badge>
              <Badge>
                🔥 &nbsp;누적{' '}
                <span style={{ color: '#8488EC', fontWeight: 500 }}>4500</span>
                풀이
              </Badge>
            </Flex>
            <button
              style={{
                backgroundColor: '#8488EC',
                color: '#fff',
                fontSize: '20px',
                border: '1px solid #CDCFFF',
                padding: '19px 0',
                borderRadius: '20px',
              }}
            >
              <SText>팀 메인으로</SText>
            </button>
          </Flex>
        </TeamNavCard>
      </Flex>
    </TeamNavWrapper>
  );
};

export const EmptyTeamNav: React.FC = () => {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <TeamNavWrapper
      onClick={() => {
        navigate(`${PATH.TEAMS}`);
      }}
    >
      <Flex width="100%" direction="column">
        <SText fontSize="24px" fontWeight={700} color="#777">
          참여중인 스터디
        </SText>
        <Spacer h={30} />
        <TeamNavCard>
          <TeamImg src={EmptyTeamImg} style={{ objectFit: 'fill' }} />
          <Flex direction="column" gap="27px" padding="40px">
            <SText
              fontFamily={'Pretendard'}
              fontSize={isMobile ? '24px' : '32px'}
              fontWeight={700}
              lineHeight={isMobile ? '' : '30px'}
              color="#333"
            >
              스터디 방
            </SText>
            <SText
              fontSize="18px"
              fontWeight={500}
              color="#777"
              lineHeight="30px"
            >
              현재 참여중인 스터디가 없습니다.
              <br />
              스터디 모집에서 팀에 참여해보세요.
            </SText>
          </Flex>
        </TeamNavCard>
      </Flex>
    </TeamNavWrapper>
  );
};

const TeamImg = styled.img`
  width: 100%;
  height: 248px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 20px;
    height: 20px;
  }
`;

export const LogoutWrap = styled.div`
  width: calc(100% - 48px);
  padding: 24px 46px;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 2px;
    margin-top: 0;
  }
`;

const Badge = styled.div`
  backgrount-color: #f4f4f4;
  border: 1px solid #cdcfff;
  padding: 5.5px 14px;
  border-radius: 5px;
  font-weight: 400;
  color: #777777;
`;
