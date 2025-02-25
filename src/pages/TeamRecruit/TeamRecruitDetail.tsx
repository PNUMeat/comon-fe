import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Link } from 'react-router-dom';

import Click from '@/assets/TeamJoin/click.png';
import Pencil from '@/assets/TeamRecruit/pencil.svg';
import Send from '@/assets/TeamRecruit/send.svg';
import Trash from '@/assets/TeamRecruit/trash.svg';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

import { StyledButton } from './TeamRecruitList';

// TODO:
const data = {
  teamRecruitId: 1,
  teamRecruitTitle: 'test',
  teamRecruitBody:
    "<h2>팀원을 모집합니다!</h2><p>우리 팀은 <strong>프론트엔드 개발자</strong>를 찾고 있습니다.</p><ul><li>React, TypeScript 경험자 우대</li><li>주 2회 온라인 미팅</li><li>프로젝트 기간: 3개월</li></ul><p>관심 있는 분은 <a href='mailto:recruit@example.com'>이메일</a>로 지원해주세요!</p>",
  chatUrl:
    'https://open.kakao.com/o/g9F1qXchopen.kakao.com/o/g9F1qXckakao.com/o/g9F1qXchopen.kakao.com/o/g9F1qXckakao.com/o/2d2g 9F1qXchopen.kakao.com/o/g9F1qXc',
  isRecruiting: false,
  memberNickName: 'test',
  isAuthor: true,
  createdAt: '2025.01.01',
  teamId: '팀 있으면 ID 없으면 null',
  teamApplyResponses: [
    {
      teamApplyId: 1,
      teamApplyBody:
        '안녕하세요, 스터디에 지원합니다! 저는 현재 대학교 3학년으로, 코딩 테스트를 준비 중인 학생입니다. 기본적인 알고리즘과 자료구조 지식은 갖추고 있으며, 이번 스터디를 통해 실전 대비 감각을 키우고, 다양한 문제 풀이 방법을 배워보고 싶습니다. 스터디에서 저는 꾸준히 참여하며, 적극적으로 문제 풀이와 피드백에 기여할 자신이 있습니다. 또한 팀원들과 협력하며 효율적인 학습 분위기를 만드는 데 힘쓰고 싶습니다. 목표는 3개월 안에 특정 난이도의 문제를 스스로 해결할 수 있는 실력을 갖추고, 기업 코딩 테스트를 자신 있게 치르는 것입니다. 감사합니다. 참여 기회를 주신다면 열정적으로 함께하겠습니다! 😊',
      memberName: 'test',
      isMyApply: true,
    },
    {
      teamApplyId: 2,
      teamApplyBody: 'test2',
      memberName: '파댕이',
      isMyApply: false,
    },
    {
      teamApplyId: 3,
      teamApplyBody: 'test3',
      memberName: '파댕이222',
      isMyApply: false,
    },
    {
      teamApplyId: 4,
      teamApplyBody: 'rsesfsdffsdas',
      memberName: '파댕이/6days',
      isMyApply: false,
    },
  ],
};

// 신청자 0명일 때
const EmptyState = ({
  isAuthor,
  isMobile,
}: {
  isAuthor: boolean;
  isMobile: boolean;
}) => {
  return isAuthor ? (
    <>
      <Spacer h={72} />
      <SText
        color="#777"
        fontWeight={isMobile ? 400 : 500}
        fontSize={isMobile ? '10px' : '12px'}
        textAlign="center"
      >
        대기 중인 모든 신청자를 팀에 바로 초대할 수 있어요
      </SText>
      <Spacer h={isMobile ? 12 : 14} />
      <RegistrationButton disabled={true}>
        <img src={Click} style={{ width: '24px', height: '24px' }} />팀 생성하기
      </RegistrationButton>
    </>
  ) : (
    <>
      <Spacer h={60} />
      <SText color="#ccc" fontSize="16px" fontWeight={600} textAlign="center">
        첫 번째 신청자가 되어보세요
      </SText>
    </>
  );
};

// 신청자 0명 아닐 때
const ApplicantList = ({
  isAuthor,
  isMobile,
}: {
  isAuthor: boolean;
  isMobile: boolean;
}) => {
  return (
    <>
      {data.teamApplyResponses.map((applicant) => (
        <ApplicantContainer key={applicant.teamApplyId}>
          <Flex align="center">
            <SText
              color="#000"
              fontSize={isMobile ? '12px' : '16px'}
              fontWeight={700}
              fontFamily="Pretendard"
              lineHeight="normal"
              style={{
                minWidth: isMobile ? '40px' : '100px',
              }}
            >
              {applicant.memberName}
            </SText>

            {isAuthor ? (
              <>
                <SText
                  color="#333"
                  fontSize={isMobile ? '10px' : '14px'}
                  fontWeight={500}
                  fontFamily="Pretendard"
                  lineHeight={isMobile ? 'normal' : '20px'}
                >
                  {applicant.teamApplyBody}
                </SText>
                <Flex justify="flex-end">
                  <StyledButton
                    backgroundColor="#FB676A"
                    color="#fff"
                    style={{
                      height: isMobile ? '26px' : '30px',
                      borderRadius: isMobile ? '16px' : '40px',
                    }}
                  >
                    <SText
                      fontSize={isMobile ? '10px' : '14px'}
                      fontWeight={400}
                      lineHeight="normal"
                    >
                      내보내기
                    </SText>
                  </StyledButton>
                </Flex>
              </>
            ) : (
              <>
                {applicant.isMyApply && (
                  <>
                    <SText
                      color="#333"
                      fontSize={isMobile ? '10px' : '14px'}
                      fontWeight={500}
                      fontFamily="Pretendard"
                      lineHeight={isMobile ? 'normal' : '20px'}
                    >
                      {applicant.teamApplyBody}
                    </SText>
                    <Flex gap="10px" justify="flex-end">
                      <img src={Pencil} alt="수정" />
                      <img src={Trash} alt="삭제" />
                    </Flex>
                  </>
                )}
              </>
            )}
          </Flex>
        </ApplicantContainer>
      ))}

      {isAuthor && (
        <>
          <Spacer h={isMobile ? 48 : 72} />
          <SText
            color="#777"
            fontWeight={isMobile ? 400 : 500}
            fontSize={isMobile ? '10px' : '12px'}
            textAlign="center"
          >
            신청자들과 함께 팀을 시작할 준비가 되었다면,
          </SText>
          <Spacer h={14} />
          <Link to={PATH.TEAM_REGISTRATION} style={{ textDecoration: 'none' }}>
            <RegistrationButton disabled={false}>
              <img src={Click} style={{ width: '24px', height: '24px' }} />팀
              생성하기
            </RegistrationButton>
          </Link>
        </>
      )}
    </>
  );
};

export const TeamRecruitDetail = () => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <div style={{ padding: isMobile ? '16px 20px' : '30px 20px' }}>
      <Flex height={isMobile ? 26 : 36}>
        <StyledButton backgroundColor="#e5e6ed" color="#333">
          목록
        </StyledButton>
        {data.isAuthor && (
          <Flex gap={isMobile ? '4px' : '12px'} justify="flex-end">
            <StyledButton
              backgroundColor={data.isRecruiting ? '#FB676A' : '#6E74FA'}
              color="#fff"
              style={{ width: 'auto' }}
            >
              {data.isRecruiting ? '모집중단' : '모집재개'}
            </StyledButton>
            <StyledButton backgroundColor="#e5e6ed" color="#333">
              수정
            </StyledButton>
            <StyledButton backgroundColor="#e5e6ed" color="#333">
              삭제
            </StyledButton>
          </Flex>
        )}
      </Flex>
      <Spacer h={24} />
      <ContentBox>
        <Flex
          gap={isMobile ? '14px' : '26px'}
          align={isMobile ? 'flex-start' : 'center'}
          direction={isMobile ? 'column' : 'row'}
        >
          <Label
            background={data.isRecruiting ? colors.buttonPurple : '#8E8E8E'}
            padding="4px 10px"
            style={{ border: 'none', height: isMobile ? '18px' : '24px' }}
          >
            <SText
              color="#fff"
              fontSize={isMobile ? '10px' : '14px'}
              fontWeight={700}
              fontFamily="Pretendard"
            >
              {data.isRecruiting ? '모집중' : '모집완료'}
            </SText>
          </Label>
          <SText
            fontSize={isMobile ? '14px' : '18px'}
            fontWeight={700}
            fontFamily="Pretendard"
          >
            {data.teamRecruitTitle}
          </SText>
        </Flex>
        <Spacer h={isMobile ? 0 : 8} />
        <SText
          color="#5C5C5C"
          fontSize={isMobile ? '10px' : '12px'}
          fontWeight={400}
          fontFamily="Pretendard"
          lineHeight="normal"
        >
          {data.memberNickName}
          <br />
          {data.createdAt}
        </SText>
        <Spacer h={isMobile ? 0 : 20} />
        <div
          dangerouslySetInnerHTML={{ __html: data.teamRecruitBody }}
          style={{ lineHeight: 'normal' }}
        />
      </ContentBox>
      <Spacer h={24} />

      {data.isRecruiting && (
        <>
          <ContentBox padding="24px 36px">
            <Flex align="center" gap={isMobile ? '6px' : '10px'}>
              <img
                src={Send}
                alt="연락 방법"
                style={{
                  width: isMobile ? '16px' : '',
                  height: isMobile ? '16px' : '',
                }}
              />
              <SText
                color="#333"
                fontSize={isMobile ? '14px' : '18px'}
                fontWeight={600}
                fontFamily="Pretendard"
              >
                연락 방법
              </SText>
            </Flex>
            <SText
              color="#333"
              fontSize={isMobile ? '10px' : '16px'}
              fontWeight={400}
              fontFamily="Pretendard"
              lineHeight="normal"
              wordBreak="break-word"
            >
              {data.chatUrl}
            </SText>
          </ContentBox>
          <Spacer h={isMobile ? 48 : 70} />

          {/* 하단 (신청 관련) */}
          {/* 신청하기 */}
          {!data.isAuthor && (
            <>
              <Flex align="center" gap="8px">
                <img src={Pencil} alt="신청하기" />
                <SText
                  color="#333"
                  fontSize="18px"
                  fontWeight={700}
                  fontFamily="Pretendard"
                >
                  신청하기
                </SText>
                <Spacer h={0} width={16} />
                <SText
                  color="#8B8B8B"
                  fontSize="14x"
                  fontWeight={500}
                  fontFamily="Pretendard"
                >
                  가입 신청 전에 꼭 연락 방법을 확인해 주세요
                </SText>
              </Flex>
              <Spacer h={24} />
              <ApplyFormContainer>
                <ApplyInput placeholder="방장이 제시하는 정보를 자세히 적으면 멋진 팀원들과 함께할 수 있을 거예요 " />
                <StyledButton
                  backgroundColor="#6E74FA"
                  color="#fff"
                  style={{
                    width: '100px',
                    height: '30px',
                    borderRadius: '40px',
                  }}
                >
                  가입 신청
                </StyledButton>
              </ApplyFormContainer>
              <Spacer h={50} />
            </>
          )}

          <Flex gap="8px" align="center">
            <SText
              color="#333"
              fontSize={isMobile ? '14px' : '18px'}
              fontWeight={700}
              fontFamily="Pretendard"
            >
              신청자
            </SText>
            <SText
              color="#6E74FA"
              fontSize={isMobile ? '16px' : '22px'}
              fontWeight={700}
              fontFamily="Pretendard"
            >
              {data.teamApplyResponses.length}
            </SText>
          </Flex>
          <Spacer h={isMobile ? 12 : 24} />

          {/* 신청자 */}
          {data.teamApplyResponses.length === 0 ? (
            <EmptyState isAuthor={data.isAuthor} isMobile={isMobile} />
          ) : (
            <ApplicantList isAuthor={data.isAuthor} isMobile={isMobile} />
          )}
        </>
      )}
    </div>
  );
};

const ContentBox = styled.div<{ padding?: string }>`
  display: flex;
  // min-height: 500px;
  padding: ${(props) => (props.padding ? props.padding : '30px 36px')};
  flex-direction: column;
  gap: 8px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 2px 2px 20px 0px rgba(94, 96, 153, 0.2);

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 20px 24px;
    border-radius: 12px;
  }
`;

const ApplyFormContainer = styled.div`
  width: auto;
  display: flex;
  align-items: flex-end;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 14px 20px;
  background: #fff;

  &:focus-within {
    border-color: ${colors.borderPurple};
  }
`;

const ApplyInput = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  color: #333;
  line-height: normal;
  font-family: 'Pretendard';
  height: 120px;

  &::placeholder {
    color: #ccc;
    font-weight: 600;
  }
`;

const ApplicantContainer = styled.div`
  width: auto;
  border-radius: 16px;
  border: 1px solid #ccc;
  background: #fff;
  padding: 20px 24px;
  margin-bottom: 4px;

  @media (max-width: ${breakpoints.mobile}px) {
    padding: 14px 16px;
  }
`;

const RegistrationButton = styled.div<{ disabled: boolean }>`
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  font-family: 'Pretendard';
  gap: 8px;
  background: ${(props) => (props.disabled ? '#f2f2f2' : '#fff')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  color: ${(props) => (props.disabled ? '#ccc' : '#333')};
  border: ${(props) =>
    props.disabled ? 'none' : `1px solid ${colors.borderPurple}`};

  img {
    filter: ${(props) =>
      props.disabled
        ? 'invert(0%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(90%)'
        : ''};
  }

  @media (max-width: ${breakpoints.mobile}px) {
    height: 48px;
    border-radius: 40px;
  }
`;
