import { checkRemainingCookies, isDevMode } from '@/utils/cookie';

import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { Label } from '@/components/commons/Label';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { LoginPrompt } from '@/components/features/TeamRecruit/LoginPrompt';

import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  ITeamRecruitDetailResponse,
  applyForTeam,
  deleteTeamApplication,
  deleteTeamRecruit,
  getTeamRecruitById,
  inviteTeamMembers,
  updateRecruitmentStatus,
  updateTeamApplication,
} from '@/api/recruitment';
import Click from '@/assets/TeamJoin/click.png';
import Pencil from '@/assets/TeamRecruit/pencil.svg';
import Send from '@/assets/TeamRecruit/send.svg';
import Trash from '@/assets/TeamRecruit/trash.svg';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import { alertAtom } from '@/store/modal';
import styled from '@emotion/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { StyledButton } from './TeamRecruitList';

// 신청자 0명일 때
const EmptyState = ({
  isAuthor,
  teamId,
  isMobile,
}: {
  isAuthor: boolean;
  isMobile: boolean;
  teamId: number | null;
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
        {teamId === null
          ? '최소 1명의 사용자가 신청해야 팀을 생성할 수 있어요'
          : '대기 중인 모든 신청자를 팀에 바로 초대할 수 있어요'}
      </SText>
      <Spacer h={isMobile ? 12 : 14} />
      <RegistrationButton disabled={true}>
        <img src={Click} style={{ width: '24px', height: '24px' }} />
        {teamId === null ? '팀 생성하기' : '팀 초대하기'}
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
  data,
  isAuthor,
  teamId,
  isMobile,
  recruitId,
}: {
  data: ITeamRecruitDetailResponse;
  isAuthor: boolean;
  teamId: number | null;
  isMobile: boolean;
  recruitId: string;
}) => {
  const setAlert = useSetAtom(alertAtom);
  const queryClient = useQueryClient();

  // 팀 지원글 삭제
  const { mutate: deleteApply } = useMutation({
    mutationFn: deleteTeamApplication,
    onSuccess: () => {
      setAlert({
        message: isAuthor
          ? '내보내기가 완료되었어요'
          : '팀 지원글이 삭제되었어요',
        isVisible: true,
        onConfirm: () => {},
      });

      queryClient.invalidateQueries({
        queryKey: ['teamRecruitDetail', recruitId],
      });
    },
    onError: (error) => {
      console.error('팀 지원글 삭제 실패:', error);
      setAlert({
        message: isAuthor
          ? '사용자 내보내기 중 오류가 발생했어요'
          : '팀 지원글 삭제 중 오류가 발생했어요',
        isVisible: true,
        onConfirm: () => {},
      });
    },
  });

  // 팀 지원글 수정
  const [editingApplyId, setEditingApplyId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const { mutate: updateApply } = useMutation({
    mutationFn: ({
      applyId,
      teamApplyBody,
    }: {
      applyId: number;
      teamApplyBody: string;
    }) => updateTeamApplication(applyId, { teamApplyBody }),
    onSuccess: () => {
      setAlert({
        message: '신청글이 수정되었어요',
        isVisible: true,
        onConfirm: () => {},
      });

      queryClient.invalidateQueries({
        queryKey: ['teamRecruitDetail', recruitId],
      });

      setEditingApplyId(null);
    },
    onError: (error) => {
      console.error('신청글 수정 실패:', error);
      setAlert({
        message: '신청글 수정 중 오류가 발생했어요.',
        isVisible: true,
        onConfirm: () => {},
      });
    },
  });

  // 팀 모집글에서 팀원 초대하기
  const { mutate: inviteApplicants } = useMutation({
    mutationFn: inviteTeamMembers,
    onSuccess: () => {
      setAlert({
        message: '신청자들을 팀에 성공적으로 초대했어요',
        isVisible: true,
        onConfirm: () => {},
      });

      queryClient.invalidateQueries({
        queryKey: ['teamRecruitDetail', recruitId],
      });
    },
    onError: (error) => {
      console.error('신청자 초대 실패:', error);
      setAlert({
        message: '신청자 초대 중 오류가 발생했어요',
        isVisible: true,
        onConfirm: () => {},
      });
    },
  });

  const navigate = useNavigate();

  // 운영 중인 팀이 없는 경우 (팀 최초 생성)
  const createTeamWithApplicants = () => {
    if (window.confirm('신청자과 함께 팀을 생성하시겠어요?')) {
      navigate(PATH.TEAM_REGISTRATION, {
        state: {
          teamMemberUuids: data.teamMemberUuids,
          teamRecruitId: data.teamRecruitId,
        },
      });
    }
  };

  // 운영 중인 팀이 있는 경우 (팀에 신청자 초대)
  const inviteApplicantsToTeam = (teamId: number, recruitId: number) => {
    if (window.confirm('신청자 모두를 팀에 초대하시겠어요?')) {
      inviteApplicants({
        teamId: teamId,
        recruitId: recruitId,
        memberUuids: data.teamMemberUuids,
      });
    }
  };

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
                width: isMobile ? '60px' : '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
                  style={{ flex: 1 }}
                >
                  {applicant.teamApplyBody}
                </SText>
                <Flex
                  justify="flex-end"
                  style={{ width: isMobile ? '60px' : '100px' }}
                >
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
                      onClick={() => {
                        if (window.confirm('해당 사용자를 내보내시겠어요?')) {
                          deleteApply(applicant.teamApplyId);
                        }
                      }}
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
                    {editingApplyId === applicant.teamApplyId ? (
                      // 수정 모드일 때
                      <>
                        <ApplyFormContainer style={{ width: '100%' }}>
                          <ApplyInput
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            style={{ height: 'auto' }}
                          />
                          <Flex justify="flex-end">
                            <StyledButton
                              backgroundColor="#6E74FA"
                              color="#fff"
                              style={{
                                width: isMobile ? '64px' : '90px',
                                height: isMobile ? '24px' : '32px',
                                borderRadius: '40px',
                              }}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    '수정된 내용을 저장하시겠어요?'
                                  )
                                ) {
                                  updateApply({
                                    applyId: applicant.teamApplyId,
                                    teamApplyBody: editingText,
                                  });
                                }
                              }}
                            >
                              저장하기
                            </StyledButton>
                          </Flex>
                        </ApplyFormContainer>
                      </>
                    ) : (
                      // 수정 모드 아닐 때
                      <>
                        <SText
                          color="#333"
                          fontSize={isMobile ? '10px' : '14px'}
                          fontWeight={500}
                          fontFamily="Pretendard"
                          lineHeight={isMobile ? 'normal' : '20px'}
                          style={{ flex: 1 }}
                        >
                          {applicant.teamApplyBody}
                        </SText>
                        <Flex
                          gap={isMobile ? '6px' : '10px'}
                          justify="flex-end"
                          style={{ width: '70px' }}
                        >
                          <img
                            src={Pencil}
                            alt="수정"
                            style={{
                              width: isMobile ? '20px' : '',
                              height: isMobile ? '20px' : '',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setEditingApplyId(applicant.teamApplyId);
                              setEditingText(applicant.teamApplyBody || '');
                            }}
                          />
                          <img
                            src={Trash}
                            alt="삭제"
                            style={{
                              width: isMobile ? '18px' : '',
                              height: isMobile ? '18px' : '',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              if (window.confirm('신청글을 삭제하시겠어요?')) {
                                deleteApply(applicant.teamApplyId);
                              }
                            }}
                          />
                        </Flex>
                      </>
                    )}
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
            {teamId === null
              ? ' 신청자들과 함께 팀을 시작할 준비가 되었다면,'
              : '대기 중인 모든 신청자를 팀에 바로 초대할 수 있어요'}
          </SText>
          <Spacer h={14} />
          <RegistrationButton
            disabled={false}
            onClick={
              teamId === null
                ? createTeamWithApplicants
                : () => inviteApplicantsToTeam(teamId, Number(recruitId))
            }
          >
            <img src={Click} style={{ width: '24px', height: '24px' }} />
            {teamId === null ? '팀 생성하기' : '팀 초대하기'}
          </RegistrationButton>
        </>
      )}
    </>
  );
};

export const TeamRecruitDetail = () => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;
  const { recruitId } = useParams();

  if (!recruitId) {
    throw new Error('recruitId가 존재하지 않습니다.');
    // navigate(`${PATH.TEAM_RECRUIT}`);
  }

  const { data } = useQuery({
    queryKey: ['teamRecruitDetail', recruitId],
    queryFn: () => getTeamRecruitById(Number(recruitId)),
    enabled: !!recruitId,
  });

  const updatedTeamRecruitBody = useMemo(() => {
    if (data?.imageUrl) {
      return data.teamRecruitBody.replace(
        /src="\?"/g,
        `src="${data.imageUrl}"`
      );
    }
    return data?.teamRecruitBody;
  }, [data?.imageUrl, data?.teamRecruitBody]);

  // 팀 지원글 생성
  const [applyText, setApplyText] = useState('');
  const setAlert = useSetAtom(alertAtom);

  const queryClient = useQueryClient();

  const { mutate: apply } = useMutation({
    mutationFn: applyForTeam,
    onSuccess: () => {
      setAlert({
        message: '가입 신청을 완료했어요',
        isVisible: true,
        onConfirm: () => {},
      });

      queryClient.invalidateQueries({ queryKey: ['teamRecruitDetail'] });

      setApplyText('');
    },
    onError: (error) => {
      console.error('가입 신청 실패:', error);
      setAlert({
        message: '가입 신청 중 오류가 발생했어요',
        isVisible: true,
        onConfirm: () => {},
      });
    },
  });

  const submitApplication = () => {
    if (!applyText.trim()) {
      alert('신청 내용을 입력해주세요.');
      return;
    }

    if (!recruitId) {
      console.error('recruitmentId가 존재하지 않습니다.');
      return;
    }

    apply({ recruitmentId: recruitId, teamApplyBody: applyText });
  };

  // 팀 모집글 삭제
  const { mutate: deleteRecruit } = useMutation({
    mutationFn: deleteTeamRecruit,
    onSuccess: () => {
      setAlert({
        message: '팀 모집글이 삭제되었어요',
        isVisible: true,
        onConfirm: () => {},
      });
    },
    onError: (error) => {
      console.error('팀 모집글 삭제 실패:', error);
      setAlert({
        message: '팀 모집글 삭제 중 오류가 발생했어요',
        isVisible: true,
        onConfirm: () => {},
      });
    },
  });

  // 팀 모집글 상태 변경
  const { mutate: toggleRecruitmentStatus } = useMutation({
    mutationFn: (isRecruiting: boolean) =>
      updateRecruitmentStatus(Number(recruitId), { isRecruiting }),
    onSuccess: () => {
      setAlert({
        message: '모집 상태가 변경되었습니다.',
        isVisible: true,
        onConfirm: () => {},
      });

      queryClient.invalidateQueries({
        queryKey: ['teamRecruitDetail', recruitId],
      });
    },
    onError: (error) => {
      console.error('모집 상태 변경 실패:', error);
      setAlert({
        message: '모집 상태 변경 중 오류가 발생했습니다.',
        isVisible: true,
        onConfirm: () => {},
      });
    },
  });

  // 로그인 여부
  const [isLoggedIn] = useState<boolean>(
    checkRemainingCookies() || isDevMode()
  );

  return (
    <div style={{ padding: isMobile ? '16px 20px' : '30px 20px' }}>
      <Flex height={isMobile ? 26 : 36}>
        <Link to={`${PATH.TEAM_RECRUIT}/list`}>
          <StyledButton backgroundColor="#e5e6ed" color="#333">
            목록
          </StyledButton>
        </Link>
        {data?.isAuthor ? (
          <Flex gap={isMobile ? '4px' : '12px'} justify="flex-end">
            <StyledButton
              backgroundColor={data.isRecruiting ? '#FB676A' : '#6E74FA'}
              color="#fff"
              style={{ width: 'auto' }}
              onClick={() => toggleRecruitmentStatus(!data.isRecruiting)}
            >
              {data.isRecruiting ? '모집중단' : '모집재개'}
            </StyledButton>
            <Link
              to={`${PATH.TEAM_RECRUIT}/posting`}
              style={{ textDecoration: 'none' }}
              state={{
                recruitId: recruitId,
                teamRecruitTitle: data.teamRecruitTitle,
                teamRecruitBody: updatedTeamRecruitBody,
                chatUrl: data.chatUrl,
              }}
            >
              <StyledButton backgroundColor="#e5e6ed" color="#333">
                수정
              </StyledButton>
            </Link>
            <StyledButton
              backgroundColor="#e5e6ed"
              color="#333"
              onClick={() => {
                if (window.confirm('정말로 삭제하시겠습니까?')) {
                  deleteRecruit(recruitId);
                }
              }}
            >
              삭제
            </StyledButton>
          </Flex>
        ) : (
          <>
            {data?.teamId !== null &&
              data?.teamId !== undefined &&
              data?.isRecruiting && (
                <Flex gap={isMobile ? '4px' : '12px'} justify="flex-end">
                  <Link to={`${PATH.TEAM_DASHBOARD}/${data.teamId}`}>
                    <StyledButton
                      backgroundColor="#6E74FA"
                      color="#fff"
                      style={{ width: 'auto' }}
                    >
                      팀 둘러보기
                    </StyledButton>
                  </Link>
                </Flex>
              )}
          </>
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
            background={data?.isRecruiting ? colors.buttonPurple : '#8E8E8E'}
            padding="4px 10px"
            style={{ border: 'none', height: isMobile ? '18px' : '24px' }}
          >
            <SText
              color="#fff"
              fontSize={isMobile ? '10px' : '14px'}
              fontWeight={700}
              fontFamily="Pretendard"
            >
              {data?.isRecruiting ? '모집중' : '모집완료'}
            </SText>
          </Label>
          <SText
            fontSize={isMobile ? '14px' : '18px'}
            fontWeight={700}
            fontFamily="Pretendard"
          >
            {data?.teamRecruitTitle}
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
          {data?.memberNickName}
          <br />
          {data?.createdAt}
        </SText>
        <Spacer h={isMobile ? 0 : 20} />
        <div
          dangerouslySetInnerHTML={{ __html: updatedTeamRecruitBody ?? '' }}
          style={{ lineHeight: 'normal' }}
        />
      </ContentBox>
      <Spacer h={24} />
      {!(!data?.isRecruiting && !data?.isAuthor) && (
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
            <Spacer h={isMobile ? 4 : 8} />
            <ChatLink
              href={data.chatUrl}
              target="_blank"
              // rel="noopener noreferrer"
            >
              {data.chatUrl}
            </ChatLink>
          </ContentBox>
          <Spacer h={isMobile ? 48 : 70} />

          {/* 하단 (신청 관련) */}
          {/* 신청하기 */}
          {!data.isAuthor &&
            !data.teamApplyResponses.some(
              (applicant) => applicant.isMyApply
            ) && (
              <>
                <Flex align="center" gap={isMobile ? '4px' : '8px'}>
                  <img
                    src={Pencil}
                    alt="신청하기"
                    style={{
                      width: isMobile ? '20px' : '',
                      height: isMobile ? '20px' : '',
                    }}
                  />
                  <SText
                    color="#333"
                    fontSize={isMobile ? '14px' : '18px'}
                    fontWeight={700}
                    fontFamily="Pretendard"
                  >
                    신청하기
                  </SText>
                  <Spacer h={0} width={isMobile ? 4 : 16} />
                  <SText
                    color="#8B8B8B"
                    fontSize={isMobile ? '10px' : '14px'}
                    fontWeight={500}
                    fontFamily="Pretendard"
                  >
                    가입 신청 전에 꼭 연락 방법을 확인해 주세요
                  </SText>
                </Flex>
                <Spacer h={isMobile ? 12 : 24} />
                <ApplyFormContainer>
                  {!isLoggedIn && <LoginPrompt />}

                  <ApplyInput
                    placeholder="방장이 제시하는 정보를 자세히 적으면 멋진 팀원들과 함께할 수 있을 거예요 "
                    value={applyText}
                    onChange={(e) => setApplyText(e.target.value)}
                    disabled={!isLoggedIn}
                  />
                  <Flex justify="flex-end">
                    <StyledButton
                      backgroundColor="#6E74FA"
                      color="#fff"
                      style={{
                        width: '100px',
                        height: '32px',
                        borderRadius: '40px',
                      }}
                      onClick={submitApplication}
                      disabled={!isLoggedIn}
                    >
                      가입 신청
                    </StyledButton>
                  </Flex>
                </ApplyFormContainer>
                <Spacer h={isMobile ? 32 : 50} />
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
            <EmptyState
              isAuthor={data.isAuthor}
              teamId={data.teamId}
              isMobile={isMobile}
            />
          ) : (
            <ApplicantList
              data={data}
              isAuthor={data.isAuthor}
              teamId={data.teamId}
              isMobile={isMobile}
              recruitId={recruitId}
            />
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

const ChatLink = styled.a`
  color: #333;
  font-size: 16px;
  font-weight: 400;
  font-family: 'Pretendard';
  line-height: normal;
  word-break: break-word;
  text-decoration: none;

  &:hover {
    color: #6e74fa;
    text-decoration: underline;
    cursor: pointer;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
  }
`;

const ApplyFormContainer = styled.div`
  position: relative;
  width: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 14px 20px;
  background: #fff;

  &:focus-within {
    border-color: ${colors.borderPurple};
  }
`;

const ApplyInput = styled.textarea`
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

  &:disabled {
    background: #fff;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
    font-weight: 500;
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
