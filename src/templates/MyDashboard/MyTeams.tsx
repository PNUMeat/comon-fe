import { viewStyle } from '@/utils/viewStyle';

import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect, useState } from 'react';

import {
  MyArticle,
  MyArticleResponse,
  TeamAbstraction,
  queryMyArticles,
  queryMyTeamInfo,
} from '@/api/mypage';
import { withdrawTeam } from '@/api/team';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import leftArrow from '@/assets/MyDashboard/leftArrow.png';
import rightArrow from '@/assets/MyDashboard/rightArrow.png';

const ModeButtonsWrapper = styled.div`
  margin-bottom: 54px;
  display: flex;
  height: 30px;
  align-items: center;
  margin-left: 15px;
  position: relative;

  &::after {
    position: absolute;
    content: '.';
    color: transparent;
    display: inline-block;
    border-radius: 2px;
    height: 3px;
    bottom: 0;
    width: 184px;
    background-color: #c8c8c8;
    transform: translateX(5px);
  }

  @media (max-width: ${breakpoints.mobile}px) {
    margin-top: 50px;
    margin-bottom: 24px;
    margin-left: 0px;

    &::after {
      width: 180px;
    }
  }
`;

const ModeButton = styled.button<{ isSelected: boolean }>`
  white-space: nowrap;
  box-sizing: border-box;
  display: inline-flex;
  height: 30px;
  padding: 2px 10px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;

  ${(props) =>
    props.isSelected
      ? `&::before {
    width: 95%;
    position: absolute;
    border-radius: 2px;
    content: '';
    height: 3px;
    bottom: 0;
    display: block;
    z-index: 2;
    background-color: #8488ec;
  }`
      : ''}

  color: ${(props) => (props.isSelected ? '#333' : '#777')};
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    padding: 2px 20px;
  }
`;

const ArticleWrapper = styled.div<{
  height?: string;
}>`
  margin-bottom: 20px;
  display: flex;
  width: 700px;
  height: ${(props) => (props.height ? props.height : '360px')};
  padding: 18px 27px;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  box-sizing: border-box;
  border-radius: 20px;
  border: 1px solid #cdcfff;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    height: ${(props) => (props.height ? props.height : '430px')};
    padding: 30px 28px;
    position: relative;
  }
`;

const ArticleHeader = styled.div`
  margin-bottom: 24px;
  width: 100%;
  height: 29px;
  display: flex;
  gap: 8px;
  color: #333;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 16px;
    height: fit-content;
    margin-bottom: 20px;
  }
`;

const ArticleGrid = styled.div`
  margin-bottom: 29px;
  width: 100%;
  height: 216px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: fit-content;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ArticlePreview = styled.div<{
  isSelected: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 20px 0px 7px 21px;
  border-radius: 10px;
  max-height: 108px;
  box-sizing: border-box;
  border: 1px solid #cdcfff;
  ${(props) =>
    props.isSelected
      ? `
    box-shadow: 3px 6px 8.3px 0px rgba(63, 63, 77, 0.07) inset`
      : `
    box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07)`};
  padding-bottom: 10px;
  cursor: pointer;
  background-color: #fff;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 140px;
    height: 86px;
    padding: 12px 14px;
    gap: 16px;
  }
`;

const ArticlePreviewTitle = styled.div`
  width: 100%;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 0px;
    gap: 6px;
  }
`;

const ArticleTitleWrap = styled.div`
  width: 100%;
  max-width: 180px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleWriter = styled.div`
  width: 100%;
  height: 16px;
  display: flex;
  gap: 7px;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 8px;
    height: 14px;
  }
`;

const WriterProfile = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: contain;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 14px;
    height: 14px;
  }
`;

const PaginationWrapper = styled.div`
  transform: translate(0, -18px);

  @media (max-width: ${breakpoints.mobile}px) {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const MyArticles: React.FC<{
  content: MyArticle[];
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ selectedId, setSelectedId, content }) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <ArticleGrid>
      {content.map((c) => (
        <ArticlePreview
          key={c.articleId}
          isSelected={c.articleId === selectedId}
          onClick={() =>
            setSelectedId((prev) => (prev !== c.articleId ? c.articleId : prev))
          }
        >
          <ArticlePreviewTitle>
            <ArticleTitleWrap>
              <SText
                color={'#333'}
                fontFamily={'Pretendard'}
                fontSize={isMobile ? '14px' : '16px'}
                fontWeight={600}
              >
                {c.articleTitle}
              </SText>
            </ArticleTitleWrap>
            <SText
              color={'#777'}
              fontFamily={'Pretendard'}
              fontSize={'10px'}
              fontWeight={400}
            >
              {c.createdDate}
            </SText>
          </ArticlePreviewTitle>
          <ArticleWriter>
            <WriterProfile src={c.memberImage} alt={'profile picture'} />
            <SText fontSize={isMobile ? '10px' : '12px'} fontWeight={600}>
              {c.memberName}
            </SText>
          </ArticleWriter>
        </ArticlePreview>
      ))}
    </ArticleGrid>
  );
};

const ArticlesViewer: React.FC<{
  selectedId: number | null;
  teamId: number;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
}> = ({ selectedId, setSelectedId, teamId, page, setPage, isMobile }) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: [`my-articles`, teamId, page],
    queryFn: () => queryMyArticles(teamId, page),
    enabled: teamId !== -1,
  });

  if (teamId === -1) {
    return <ArticleWrapper>팀에 가입해 보세요</ArticleWrapper>;
  }

  const teams = (queryClient.getQueryData(['my-page-status']) ??
    []) as TeamAbstraction[];

  const onPageChange = (page: number) => setPage(page);

  const myArticles: MyArticle[] = data?.content ?? [];
  const pagination = data?.page;
  const selectedTeam = teams.find((team) => team.teamId === teamId);

  return (
    <ArticleWrapper>
      <ArticleHeader>
        <span>Team {selectedTeam?.teamName ?? ''}</span>
        {pagination && (
          <SText
            color={'#6e74fa'}
            fontSize={isMobile ? '16px' : '20px'}
            fontWeight={200}
            fontFamily={'Pretendard'}
          >
            {pagination.totalElements}
          </SText>
        )}
      </ArticleHeader>
      <MyArticles
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        content={myArticles}
      />
      {pagination && (
        <PaginationWrapper>
          <Pagination
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            currentPageProp={page}
            hideShadow
          />
        </PaginationWrapper>
      )}
    </ArticleWrapper>
  );
};

const InformationContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 68px 1fr;
  gap: 16px;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 10px;
    grid-template-columns: 50px 1fr;
  }
`;

const InformationLabel = styled.div`
  color: #000;
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.36px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    letter-spacing: -0.28px;
  }
`;

const InformationValue = styled.div`
  color: #727272;
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.36px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    letter-spacing: -0.28px;
  }
`;

const TeamWithdrawButton = styled.button`
  color: #aa3232;
  text-align: right;
  font-family: 'Pretendard';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: -0.28px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const InformationViewer: React.FC<{
  teamId: number;
}> = ({ teamId }) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    'my-page-status',
  ]) as TeamAbstraction[];

  const onClickTeamWithdraw = () => {
    const isConfirmed = confirm('팀을 정말 탈퇴하시겠습니까?');
    if (isConfirmed) {
      withdrawTeam(teamId)
        .then((res) => {
          queryClient.refetchQueries({ queryKey: ['my-page-status'] });
          alert(res.message);
        })
        .catch((res) => alert(res.message));
    }
  };

  const selectedTeamData = data.find((team) => team.teamId === teamId);
  const teamName = selectedTeamData?.teamName ?? '';
  const date = selectedTeamData?.registerDate;
  const teamDate = date ? date.split('T')[0].replace(/-/g, '.') : '';
  const role = selectedTeamData?.teamManager ? '방장' : '일반 회원';

  return (
    <ArticleWrapper height={'178px'}>
      <ArticleHeader>
        <span>Team {teamName}</span>
      </ArticleHeader>
      <InformationContent>
        <InformationLabel>가입일</InformationLabel>
        <InformationValue>{teamDate}</InformationValue>

        <InformationLabel>
          <SText whiteSpace={'nowrap'}>상태</SText>
        </InformationLabel>
        <InformationValue>{role}</InformationValue>
      </InformationContent>
      {!selectedTeamData?.teamManager && (
        <TeamWithdrawButton onClick={() => onClickTeamWithdraw()}>
          팀 나가기
        </TeamWithdrawButton>
      )}
    </ArticleWrapper>
  );
};

const ModeSwitcher: React.FC<{
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mode, setMode }) => {
  return (
    <ModeButtonsWrapper>
      {/* 배포떄 적용 */}
      {/*{modes.slice(0, 5).map((m) => (*/}
      {modes.map((m) => (
        <ModeButton
          key={m.value}
          isSelected={m.value === mode}
          onClick={() => setMode(m.value)}
        >
          {m.label}
        </ModeButton>
      ))}
    </ModeButtonsWrapper>
  );
};

const GradationArticleDetail = styled.div`
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  width: 700px;
  padding: 31px 21px 20px 21px;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  border-radius: 20px;
  border: 1px solid #ffd482;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 20px;
    background: linear-gradient(90deg, #ffd482, #ff377f);
    z-index: -1;
  }

  & img {
    max-width: 600px;
    object-fit: contain;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    border: 1px solid ${colors.borderPurple};
    padding: 30px 24px;
    margin-bottom: 30px;

    &::before {
      background: none;
    }

    & img {
      max-width: 300px;
    }
  }
`;

const ArticleDetailHeader = styled.div`
  margin-bottom: 33px;
  display: flex;
  width: 639px;
  flex-direction: column;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    margin-bottom: 36px;
  }
`;

const TeamArticleViewer = styled.div`
  line-height: 1.5;

  & img {
    max-width: 600px;
    object-fit: contain;
  }

  ${viewStyle}

  @media(max-width: ${breakpoints.mobile}px) {
    line-height: 18px;

    & img {
      max-width: 300px;
    }
  }
`;

const ArticleDetailViewer: React.FC<{
  selectedId: number;
  teamId: number;
  page: number;
}> = ({ selectedId, teamId, page }) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    `my-articles`,
    teamId,
    page,
  ]) as MyArticleResponse;

  const articles = data?.content ?? [];
  const selectedArticle = articles.find(
    (article) => article.articleId === selectedId
  ) as MyArticle;

  const selectedArticleBody = selectedArticle?.imageUrl
    ? selectedArticle?.articleBody.replace(
        /src="\?"/,
        `src="${selectedArticle.imageUrl}"`
      )
    : selectedArticle?.articleBody;

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <GradationArticleDetail>
      <ArticleDetailHeader>
        <Flex
          gap={'8px'}
          align={'center'}
          padding={isMobile ? '0 0 8px 0' : '0 0 4px 0'}
        >
          {selectedArticle?.articleTitle && (
            <Fragment>
              <SText
                fontSize={isMobile ? '18px' : '24px'}
                fontWeight={700}
                fontFamily={'Pretendard'}
                color="#333"
                whiteSpace={'normal'}
                wordBreak={'break-word'}
              >
                {selectedArticle.articleTitle}
              </SText>
            </Fragment>
          )}
        </Flex>
        <SText
          color={'#777'}
          fontSize={isMobile ? '10px' : '14px'}
          fontWeight={400}
        >
          {selectedArticle?.createdDate ?? ''}
        </SText>
        <Spacer h={isMobile ? 18 : 46} />
        <ArticleWriter>
          {selectedArticle?.memberImage && (
            <WriterProfile
              src={selectedArticle?.memberImage ?? ''}
              alt={'profile picture'}
            />
          )}
          <SText fontSize={isMobile ? '10px' : '12px'} fontWeight={600}>
            {selectedArticle?.memberName ?? ''}
          </SText>
        </ArticleWriter>
      </ArticleDetailHeader>
      <TeamArticleViewer
        dangerouslySetInnerHTML={{ __html: selectedArticleBody ?? '' }}
      />
    </GradationArticleDetail>
  );
};

const modes = [
  { label: '내가 쓴 글', value: 'history' },
  { label: '정보 관리', value: 'information' },
];

const TeamButtonWrap = styled.div<{ isSelected: boolean }>`
  display: flex;
  width: 121px;
  height: 45px;
  padding: 7px 18px;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 16px 16px 0px 0px;
  background: ${(props) => (props.isSelected ? '#6e74fa' : '#3D3F6A')};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 60px;
    height: 30px;
    border-radius: 12px 12px 0 0;
    padding: 8px 8px 4px 8px;
    gap: 2px;
  }
`;

const TeamButtonLabel = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  color: #fff;
  text-align: center;
  font-family: 'Pretendard';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px;
  white-space: nowrap;
  text-overflow: ellipsis;

  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 10px;
    overflow: hidden;
    display: block;
    line-height: 10px;
  }
`;

const TeamButton: React.FC<{
  isSelected: boolean;
  onClick: () => void;
  teamName: string;
}> = ({ isSelected, onClick, teamName }) => {
  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <TeamButtonWrap onClick={onClick} isSelected={isSelected}>
      <SText
        color={'#fff'}
        fontFamily={'Pretendard'}
        fontSize={isMobile ? '8px' : '10px'}
        fontWeight={500}
        lineHeight={isMobile ? '6px' : '12px'}
      >
        Team
      </SText>
      <TeamButtonLabel>{teamName}</TeamButtonLabel>
    </TeamButtonWrap>
  );
};

const MoveButtonWrap = styled.div<{disabled : boolean}>`
  display: flex;
  width: 30px;
  height: 45px;
  padding: 7px 18px;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 12px 12px 0px 0px;
  background: ${(props) => (props.disabled ? 'transparent' : '#3D3F6A')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  @media (max-width: ${breakpoints.mobile}px) {
    width: 25px;
    height: 30px;
    border-radius: 8px 8px 0 0;
    padding: 8px 8px 4px 8px;
    gap: 2px;
  }
`;

const MoveButtonIcon = styled.img`
  width: 7px;
  height: 14px;
`;

const MoveButton: React.FC<{
  onClick: () => void;
  src : string;
  disabled: boolean;
}> = ({ onClick, src, disabled}) => {
  return (
    <MoveButtonWrap
      onClick={onClick}
      disabled={disabled}
    >
      { !disabled && (
        <MoveButtonIcon src={src} alt='move button' />
      )}
    </MoveButtonWrap>
  );
}

const TEAMS_PER_VIEW = 5;

export const MyTeams = () => {
  const [mode, setMode] = useState('history');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(() => 0);
  const [startIndex, setStartIndex] = useState(0);

  const { data } = useQuery({
    queryKey: ['my-page-status'],
    queryFn: queryMyTeamInfo,
  });

  useEffect(() => {
    if (data && teamId === null) {
      if (data.length === 0) {
        setTeamId(-1);
        return;
      }
      setTeamId(data[0].teamId);
    }
  }, [data]);

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  const teamsLength = data?.length || 0;
  const visibleTeams = data?.slice(startIndex, startIndex + TEAMS_PER_VIEW) || [];

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + TEAMS_PER_VIEW < teamsLength;

  

  const goPrev = () => {
    if (!canGoPrev) return;
    setStartIndex((prev) => Math.max(0, prev - 1));
  }

  const goNext = () => {
    if (!canGoNext) return;
    setStartIndex((prev) => Math.min(teamsLength - TEAMS_PER_VIEW, prev + 1));
  }

  return (
    <Flex direction={'column'}>
      <ModeSwitcher mode={mode} setMode={setMode} />
      <Flex padding={'0 0 0 50px'} width={90}>
        <MoveButton
          onClick={goPrev}
          src={leftArrow}
          disabled={!canGoPrev}
        >
        </MoveButton>
        { data &&
          visibleTeams.map((team: TeamAbstraction) => (
            <TeamButton
              key={team.teamId}
              isSelected={teamId === team.teamId}
              onClick={() => {
                setTeamId(team.teamId);
                setPage(0);
              }}
              teamName={team.teamName}
            />
          ))}
        <MoveButton
          onClick={goNext}
          src={rightArrow}
          disabled={!canGoNext}
          >
        </MoveButton>
      </Flex>

      {mode === 'history' && teamId != null && (
        <ArticlesViewer
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          teamId={teamId}
          page={page}
          setPage={setPage}
          isMobile={isMobile}
        />
      )}
      {mode === 'information' && teamId && (
        <InformationViewer teamId={teamId} />
      )}
      {mode === 'history' && selectedId !== null && teamId !== null ? (
        <ArticleDetailViewer
          selectedId={selectedId}
          teamId={teamId}
          page={page}
        />
      ) : (
        <div
          style={{
            minHeight: isMobile ? '200px' : '672px',
          }}
        />
      )}
    </Flex>
  );
};
