import { Flex } from '@/components/commons/Flex';
import { Pagination } from '@/components/commons/Pagination';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useState } from 'react';

import announcement from '@/assets/TeamDashboard/announcement.png';
import styled from '@emotion/styled';

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

const ArticleWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  width: 700px;
  height: 360px;
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
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ selectedId, setSelectedId }) => {
  return (
    <ArticleGrid>
      {Array.from({ length: 6 }, (_, index) => index).map((d) => (
        <ArticlePreview
          isSelected={d === selectedId}
          onClick={() => setSelectedId((prev) => (prev !== d ? d : prev))}
        >
          <ArticlePreviewTitle>
            <SText
              color={'#333'}
              fontFamily={'Pretendard Variable'}
              fontSize={'16px'}
              fontWeight={600}
            >
              타이틀
            </SText>
            <SText
              color={'#777'}
              fontFamily={'Pretendard Variable'}
              fontSize={'10px'}
              fontWeight={400}
            >
              2024.11.01 14:39
            </SText>
          </ArticlePreviewTitle>
          <ArticleWriter>
            <img
              src={'a'}
              alt={'profile picture'}
              style={{ width: '16px', height: '16px', objectFit: 'contain' }}
            />
            <SText fontSize={'12px'} fontWeight={600}>
              한재안
            </SText>
          </ArticleWriter>
        </ArticlePreview>
      ))}
    </ArticleGrid>
  );
};

const ArticlesViewer: React.FC<{
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ selectedId, setSelectedId }) => {
  const selectedTeam = '티리티리팀';
  const myArticles = 32;

  return (
    <ArticleWrapper>
      <ArticleHeader>
        <span>Team {selectedTeam}</span>
        <SText
          color={'#6e74fa'}
          fontSize={'20px'}
          fontWeight={200}
          fontFamily={'Pretendard Variable'}
        >
          {myArticles}
        </SText>
      </ArticleHeader>
      <MyArticles selectedId={selectedId} setSelectedId={setSelectedId} />
      <Pagination totalPages={0} onPageChange={() => {}} currentPageProp={1} />
    </ArticleWrapper>
  );
};

const InformationViewer = () => {
  return <ArticleWrapper></ArticleWrapper>;
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
}> = ({ selectedId }) => {
  console.log(selectedId);
  const title = '11/26 코테풀이';
  const date = '2024.10.31  14:39';

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
            {title}
          </SText>
        </Flex>
        <SText
          color={'#777'}
          fontSize={'14px'}
          fontWeight={400}
          lineHeight={'19px'}
        >
          {date}
        </SText>
        <Spacer h={46} />
        <ArticleWriter>
          <img
            src={'a'}
            alt={'profile picture'}
            style={{ width: '16px', height: '16px', objectFit: 'contain' }}
          />
          <SText fontSize={'12px'} fontWeight={600}>
            한재안
          </SText>
        </ArticleWriter>
      </ArticleDetailHeader>
      <div
        style={{ lineHeight: 1.5 }}
        // dangerouslySetInnerHTML={{ __html: data?.articleBody || '' }}
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
  const [selectedId, setSelectedId] = useState<number | null>(0);

  return (
    <Flex direction={'column'}>
      <ModeSwitcher mode={mode} setMode={setMode} />
      {mode === 'history' && (
        <ArticlesViewer selectedId={selectedId} setSelectedId={setSelectedId} />
      )}
      {mode === 'information' && <InformationViewer />}
      {mode === 'history' && selectedId !== null && (
        <ArticleDetailViewer selectedId={selectedId} />
      )}
    </Flex>
  );
};
