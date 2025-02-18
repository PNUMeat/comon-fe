import { Spacer } from '@/components/commons/Spacer';
import styled from '@emotion/styled';

export const RecruitExampleData = () => {
  return (
    <>
    <div>
      <Spacer h={30} />
      <Title>📣 스터디 이름 및 소개</Title>
      <Spacer h={21} />
      <Content>
        안녕하세요! 기업 코테 실전 대비반 팀을 만들려고 하는 학부 4학년 백엔드 개발자 Paul입니다!! 
      </Content>
      <Content>
        대기업 코딩 테스트를 대비하고, 알고리즘 실력을 키우고 싶은 분들을 위한 비대면 문제 풀이 스터디입니다.
      </Content>
      <Content>
        각자 문제를 풀고 풀이를 공유하며, 꾸준한 연습을 통해 빠르고 정확한 문제 해결 능력을 기르는 것이 목표입니다.
      </Content>
    </div>
    <Spacer h={30} />
    <div>
      <Title>📌 스터디 진행방식</Title>
      <Spacer h={21} />
      <List>
        <ListContent>방장이 일요일에 일주일치 문제를 올릴 예정입니다.</ListContent>
        <ListContent>매일 정해진 코딩 테스트 문제를 오후 11시까지 풉니다.</ListContent>
        <ListContent>다음 날 낮 12시까지 서로의 풀이를 보고 피드백을 남깁니다.</ListContent>
        <ListContent>정기적으로 모의 코딩 테스트(타이머 설정 후 문제 풀이 + 리뷰)를 진행합니다.</ListContent>
      </List>
    </div>
    <Spacer h={30} />
    <div>
      <Title>🗓️ 스터디 일정(횟수)</Title>
      <Spacer h={21} />
      <List>
        <ListContent>주 5회(월-금요일)</ListContent>
        <ListContent>All 비대면 진행(오픈 채팅) & 모의 코테를 풀 때는 구글 미트 활용</ListContent>
      </List>
    </div>
    <Spacer h={30} />
    <div>
      <Title>✅ 참여 조건</Title>
      <Spacer h={21} />
      <List>
        <ListContent>백준 실버 1 ~ 골드 5 수준의 문제를 풀어본 경험이 있는 분(없어도 노력한다면 괜찮아요!)</ListContent>
        <ListContent>알고리즘/자료구조 기본 개념 숙지 (DFS/BFS, DP, 이분 탐색 등)</ListContent>
        <ListContent>비대면 환경에서 적극적으로 소통 가능하신 분 (오픈채팅 활용)</ListContent>
        <ListContent>최소 주 4회 이상 문제 풀이 & 코드 리뷰 참여 가능하신 분</ListContent>
      </List>
    </div>
    <Spacer h={30} />
    <div>
      <Title>📃 신청 시 작성 내용</Title>
      <Spacer h={21} />
      <List>
        <ListContent>간단한 자기소개 (경력, 현재 코테 준비 상황 등)</ListContent>
        <ListContent>코딩 테스트 경험 (백준/프로그래머스 레벨, 최근 본 기업 코테 경험 등</ListContent>
        <ListContent>스터디를 통해 이루고 싶은 목표, 다짐 😀</ListContent>
      </List>
    </div>
    </>
  );
};

export const RecruitDefaultData = `<p dir="ltr"><span style="">📣 스터디 이름 및 소개</span></p><ul><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ul><p><br></p><p dir="ltr"><span style="">📌 스터디 진행방식</span></p><ul><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ul><p><br></p><p dir="ltr"><span style="">🗓️ 스터디 일정(횟수)</span></p><ul><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ul><p><br></p><p dir="ltr"><span style="">✅ 참여 조건</span></p><ul><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ul><p><br></p><p dir="ltr"><span style="">📃 신청 시 작성 내용</span></p><ul><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ul><p><br></p><p><br></p><p><br></p><p><br></p>`;

const Title = styled.h3`
  font-weight: 600;
`;

const Content = styled.p`
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
`;

const List = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  font-family: 'Pretendard';
  font-size: 18px;
  font-weight: 500;
`;

const ListContent = styled.li`
  line-height: 19px;
  font-size: 16px;
`;