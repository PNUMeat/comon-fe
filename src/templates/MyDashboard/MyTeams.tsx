import { Flex } from '@/components/commons/Flex';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useEffect, useMemo, useState } from 'react';

import {
  MyArticle,
  MyArticleResponse,
  TeamAbstraction,
  queryMyArticles,
  queryMyTeamInfo,
} from '@/api/mypage';
import announcement from '@/assets/TeamDashboard/announcement.png';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const ModeButtonsWrapper = styled.div`
  margin-bottom: 54px;
  display: flex;
  height: 30px;
  align-items: center;
  margin-left: 15px;
  position: relative;

  &::before {
    position: absolute;
    content: '📋';
    font-size: 24px;
    transform: translateX(-30px);
  }

  &::after {
    position: absolute;
    content: '.';
    color: transparent;
    display: inline-block;
    border-radius: 2px;
    height: 3px;
    bottom: 0;
    width: 214px;
    background-color: #c8c8c8;
    transform: translateX(5px);
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
  leading-trim: both;
  text-edge: cap;
  font-family: 'Pretendard Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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
  /* drop shadow ver 1 */
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
`;

const ArticleHeader = styled.div`
  margin-bottom: 24px;
  width: 100%;
  height: 29px;
  display: flex;
  gap: 8px;

  color: #333;

  font-family: 'Pretendard Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ArticleGrid = styled.div`
  margin-bottom: 29px;
  width: 100%;
  height: 216px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ArticlePreview = styled.div<{
  isSelected: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 20px 0px 7px 21px;
  border-radius: 10px;
  border: 1px solid #cdcfff;
  ${(props) =>
    props.isSelected
      ? `
  background: #D9D9D9;
box-shadow: 3px 6px 8.3px 0px rgba(63, 63, 77, 0.07) inset`
      : ` background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07)`};

  padding-bottom: 10px;
  cursor: pointer;
`;

const ArticlePreviewTitle = styled.div`
  width: 100%;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const ArticleWriter = styled.div`
  width: 100%;
  height: 16px;
  display: flex;
  gap: 7px;
  align-items: center;
`;

const MyArticles: React.FC<{
  content: MyArticle[];
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ selectedId, setSelectedId, content }) => {
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
            <SText
              color={'#333'}
              fontFamily={'Pretendard Variable'}
              fontSize={'16px'}
              fontWeight={600}
            >
              {c.articleTitle}
            </SText>
            <SText
              color={'#777'}
              fontFamily={'Pretendard Variable'}
              fontSize={'10px'}
              fontWeight={400}
            >
              {c.createdDate}
            </SText>
          </ArticlePreviewTitle>
          <ArticleWriter>
            <img
              src={c.memberImage}
              alt={'profile picture'}
              style={{ width: '16px', height: '16px', objectFit: 'contain' }}
            />
            <SText fontSize={'12px'} fontWeight={600}>
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
}> = ({ selectedId, setSelectedId, teamId, page, setPage }) => {
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
            fontSize={'20px'}
            fontWeight={200}
            fontFamily={'Pretendard Variable'}
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
        <div style={{ transform: 'translate(0, -18px)' }}>
          <Pagination
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            currentPageProp={page}
          />
        </div>
      )}
    </ArticleWrapper>
  );
};

const InformationHeader = styled.div`
  height: 24px;
  font-size: 20px;
  font-weight: 700;
  font-family: Pretendard Variable;
  margin-bottom: 48px;
`;

const InformationContent = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
`;

const InformationLabel = styled.div`
  color: #000;
  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px; /* 105.556% */
  letter-spacing: -0.36px;
`;

const InformationValue = styled.div`
  color: #727272;

  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px; /* 105.556% */
  letter-spacing: -0.36px;
`;

const InformationViewer: React.FC<{
  teamId: number;
}> = ({ teamId }) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    'my-page-status',
  ]) as TeamAbstraction[];

  const selectedTeamData = data.find((team) => team.teamId === teamId);
  const teamName = selectedTeamData?.teamName ?? '';
  const teamDate = selectedTeamData?.registerDate ?? '';
  const role = selectedTeamData?.teamManager ? '방장' : '일반 회원';

  return (
    <ArticleWrapper height={'178px'}>
      <InformationHeader>Team {teamName}</InformationHeader>
      <InformationContent>
        <InformationLabel>
          <SText whiteSpace={'nowrap'}>가입일</SText>
        </InformationLabel>
        <InformationValue>{teamDate}</InformationValue>

        <InformationLabel>
          <SText whiteSpace={'nowrap'}>상태</SText>
        </InformationLabel>
        <InformationValue>{role}</InformationValue>
      </InformationContent>
    </ArticleWrapper>
  );
};

const ModeSwitcher: React.FC<{
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ mode, setMode }) => {
  return (
    <ModeButtonsWrapper>
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
  // width: 700px;
  width: 699px;
  min-height: 672px;
  padding: 31px 21px 20px 21px;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  border-radius: 20px;
  border: 1px solid #ffd482;
  background: #fff;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);

  &:before {
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
`;

const ArticleDetailHeader = styled.div`
  margin-bottom: 33px;
  display: flex;
  width: 639px;
  flex-direction: column;
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

  const selectedArticleBody = useMemo(
    () =>
      selectedArticle?.imageUrl
        ? selectedArticle?.articleBody.replace(
            /(<img[^>]*src=")\?("[^>]*>)/g,
            `$1${selectedArticle?.imageUrl}$2`
          )
        : selectedArticle?.articleBody,
    [data]
  );

  return (
    <GradationArticleDetail>
      <ArticleDetailHeader>
        <Flex gap={'8px'} align={'center'} padding={'0 0 4px 0'}>
          <img
            src={announcement}
            alt={'announcement icon'}
            width={24}
            height={24}
            style={{ objectFit: 'contain' }}
          />
          <SText
            fontSize={'24px'}
            fontWeight={700}
            fontFamily={'Pretendard Variable'}
          >
            {selectedArticle?.articleTitle ?? ''}
          </SText>
        </Flex>
        <SText
          color={'#777'}
          fontSize={'14px'}
          fontWeight={400}
          lineHeight={'19px'}
        >
          {selectedArticle?.createdDate ?? ''}
        </SText>
        <Spacer h={46} />
        <ArticleWriter>
          <img
            src={selectedArticle?.memberImage ?? ''}
            alt={'profile picture'}
            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          />
          <SText fontSize={'12px'} fontWeight={600}>
            {selectedArticle?.memberName ?? ''}
          </SText>
        </ArticleWriter>
      </ArticleDetailHeader>
      <div
        style={{ lineHeight: 1.5 }}
        dangerouslySetInnerHTML={{ __html: selectedArticleBody ?? '' }}
      />
    </GradationArticleDetail>
  );
};

const modes = [
  { label: '내가 쓴 글', value: 'history' },
  { label: '정보 관리', value: 'information' },
];

export const MyTeams = () => {
  const [mode, setMode] = useState('history');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(() => 0);

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

  return (
    <Flex direction={'column'}>
      <ModeSwitcher mode={mode} setMode={setMode} />
      <Flex gap={'8px'}>
        {data &&
          data.map((team: TeamAbstraction) => (
            <button
              key={team.teamId}
              style={{
                borderRadius: '10px',
                border: '1px solid black',
              }}
              onClick={() => {
                setTeamId(team.teamId);
                setPage(0);
              }}
            >
              {team.teamName}
            </button>
          ))}
      </Flex>
      {mode === 'history' && teamId != null && (
        <ArticlesViewer
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          teamId={teamId}
          page={page}
          setPage={setPage}
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
            minHeight: '672px',
          }}
        />
      )}
    </Flex>
  );
};
