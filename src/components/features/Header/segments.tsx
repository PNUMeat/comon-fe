import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { GlassCard } from '@/components/commons/GlassCard';
import { SText } from '@/components/commons/SText';

import { useNavigate } from 'react-router-dom';

import { ITeamInfo } from '@/api/team';
import EmptyTeamImg from '@/assets/Header/empty-team-img.png';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path.tsx';
import styled from '@emotion/styled';

export const ProfileBoxContainer = styled.div`
  width: 200px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
  }
`;

const ProfileUserWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 24px;
    gap: 10px;
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
  width: 100%;
  padding: 4px 30px;
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
          fontSize={isMobile ? '12px' : '14px'}
          fontWeight={500}
          fontFamily={'NanumSquareNeo'}
          lineHeight={isMobile ? '' : '24px'}
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
  justify-content: center;
  align-items: center;
  padding: 24px 32px 36px 30px;
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 10px 24px;
    align-items: center;
  }
`;

const TeamNavCard = styled(GlassCard)`
  width: 100%;
  min-height: auto;
  border-radius: 14px;
  padding: 0 0 10px 0;
  gap: 8px;
  overflow: hidden;
  justify-content: flex-start;
`;

export const MyTeamNav = ({
  imageUrl,
  teamName,
  teamId,
  teamAnnouncement,
  memberCount,
  totalSolveCount,
}: Pick<
  ITeamInfo,
  | 'imageUrl'
  | 'teamName'
  | 'teamId'
  | 'teamAnnouncement'
  | 'memberCount'
  | 'totalSolveCount'
>) => {
  const navigate = useNavigate();

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <TeamNavWrapper>
      <Flex direction="column" style={{ width: '320px' }}>
        <TeamNavCard>
          <TeamImg src={imageUrl} />
          <Flex direction="column" gap="14px" padding="16px">
            <SText
              fontFamily={'Pretendard'}
              fontSize={isMobile ? '16px' : '20px'}
              fontWeight={700}
              lineHeight={isMobile ? '' : '24px'}
              color="#333"
            >
              {teamName}
            </SText>
            <SText fontSize="12px" fontWeight={500} color="#777">
              {teamAnnouncement}
            </SText>
            <Flex gap="6px">
              <Badge>
                <span style={{ color: '#8488EC' }}>{memberCount} members</span>
              </Badge>
              <Badge>
                🔥 &nbsp;누적{' '}
                <span style={{ color: '#8488EC', fontWeight: 500 }}>
                  {totalSolveCount}
                </span>
                풀이
              </Badge>
            </Flex>
            <button
              style={{
                backgroundColor: '#8488EC',
                color: '#fff',
                fontSize: '14px',
                border: '1px solid #CDCFFF',
                padding: '12px 0',
                borderRadius: '10px',
              }}
              onClick={() => {
                navigate(`${PATH.TEAM_DASHBOARD}/${teamId}`);
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
      <Flex direction="column" style={{ width: '320px' }}>
        <TeamNavCard>
          <TeamImg src={EmptyTeamImg} style={{ objectFit: 'fill' }} />
          <Flex direction="column" gap="14px" padding="20px">
            <SText
              fontFamily={'Pretendard'}
              fontSize={isMobile ? '16px' : '20px'}
              fontWeight={700}
              lineHeight={isMobile ? '' : '24px'}
              color="#333"
            >
              스터디 방
            </SText>
            <SText
              fontSize="13px"
              fontWeight={500}
              color="#777"
              lineHeight="22px"
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
  height: 150px;
  object-fit: cover;
  border-radius: 14px 14px 0 0;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 20px;
    height: 20px;
  }
`;

export const LogoutWrap = styled.div`
  width: calc(100% - 40px);
  padding: 12px 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 2px;
    margin-top: 0;
  }
`;

const Badge = styled.div`
  backgrount-color: #f4f4f4;
  border: 1px solid #cdcfff;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400;
  color: #777777;
`;
