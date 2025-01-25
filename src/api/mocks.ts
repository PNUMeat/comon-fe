export const teamInfoMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeamResponse: {
      teamId: 16,
      teamName: 'aa',
      teamExplain: '11',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      topic: '스터디',
      memberLimit: 12,
      memberCount: 1,
      streakDays: 0,
      successMemberCount: 0,
      teamAnnouncement: '',
      createdAt: '2024-12-26',
    },
    teamManager: true,
    subjectArticleDateAndTagResponses: [
      {
        subjectDate: '2025-01-02',
        articleCategory: '스터디 예습',
      },
      {
        subjectDate: '2025-01-13',
        articleCategory: '스터디 복습',
      },
    ],
  },
};

export const membersInfoMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    memberName: '하내안',
    memberImageUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
    teamAbstractResponses: [
      {
        teamId: 16,
        teamName: 'aa',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 15,
        teamName: 'scroll',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 14,
        teamName: 'asd',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 13,
        teamName: 'asd',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 10,
        teamName: 'Team QA',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 3,
        teamName: '파댕이 밥주기',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bae6cb5b-2772-41a7-b56f-808766d0dc50',
      },
      {
        teamId: 2,
        teamName: '장진영팀',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 1,
        teamName: '제목제목제목제목제목',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
    ],
  },
};

export const teamArticlesMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    content: [
      {
        articleId: 456,
        articleTitle: '글자 export 제대로 되나?',
        articleBody:
          '<p dir="ltr"><span class="editor-text-bold" style="font-family: Noto Sans KR;color: #6E74FA;font-size: 26px;">노토 산스</span></p><p><br></p><p dir="ltr"><span class="editor-text-italic" style="font-family: Nanum Gothic;color: #EF2528;font-size: 28px;">나눔고딕</span></p><p><br></p><p dir="ltr"><span class="editor-text-strikethrough" style="font-family: Times New Roman;color: #FF377F;font-size: 24px;">Times New Roman</span></p><p><br></p><p dir="ltr"><span class="editor-text-bold editor-text-italic" style="">다른거는?</span></p><p dir="ltr"><span class="editor-text-italic editor-text-strikethrough" style="">다른거는?</span></p><p dir="ltr"><span class="editor-text-bold editor-text-strikethrough" style="">다른거는?</span></p><p dir="ltr"><span class="editor-text-bold editor-text-italic editor-text-strikethrough" style="">다른거는?</span></p><p dir="ltr"><br></p><p dir="ltr"><br></p><p><br></p>',
        createdDate: '2025-01-25 04:09:53',
        imageUrls: [],
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 242,
        articleTitle: '14일에씀',
        articleBody: '<p><span style="white-space: pre-wrap;">????</span></p>',
        createdDate: '2025-01-13 20:33:36',
        imageUrls: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 241,
        articleTitle: '아니',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅁㄴㅇ</span></p>',
        createdDate: '2025-01-13 20:29:10',
        imageUrls: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 240,
        articleTitle:
          '두줄이 넘어가는 제목입니다~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">그러네요!!!!</span></p>',
        createdDate: '2025-01-13 19:44:29',
        imageUrls: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 239,
        articleTitle: '확인했습니다~!',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:37:18',
        imageUrls: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 238,
        articleTitle: '네 알겠습니다~~',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:36:57',
        imageUrls: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
    ],
    page: {
      size: 6,
      number: 0,
      totalElements: 5,
      totalPages: 4,
    },
  },
};

export const myPageTeamMock = {
  status: 'success',
  code: 200,
  message: null,
  data: [
    {
      teamId: 16,
      teamName: 'aa',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 15,
      teamName: 'scroll',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 14,
      teamName: 'asd',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 13,
      teamName: 'asd',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 10,
      teamName: 'Team QA',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 3,
      teamName: '파댕이 밥주기',
      teamManager: false,
      registerDate: null,
    },
    {
      teamId: 2,
      teamName: '장진영팀',
      teamManager: false,
      registerDate: null,
    },
    {
      teamId: 1,
      teamName: '제목제목제목제목제목',
      teamManager: false,
      registerDate: null,
    },
  ],
};

export const myArticlesMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    content: [
      {
        articleId: 242,
        articleTitle: '14일에씀',
        articleBody: '<p><span style="white-space: pre-wrap;">????</span></p>',
        createdDate: '2025-01-13 20:33:36',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 241,
        articleTitle: '아니',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅁㄴㅇ</span></p>',
        createdDate: '2025-01-13 20:29:10',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 240,
        articleTitle:
          '두줄이 넘어가는 제목입니다~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">그러네요!!!!</span></p>',
        createdDate: '2025-01-13 19:44:29',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 239,
        articleTitle: '확인했습니다~!',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:37:18',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 238,
        articleTitle: '네 알겠습니다~~',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:36:57',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 228,
        articleTitle: 'asdasd',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">asdasd</span></p>',
        createdDate: '2025-01-02 02:08:25',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
    ],
    page: {
      size: 6,
      number: 0,
      totalElements: 21,
      totalPages: 4,
    },
  },
};

export const teamCombinedMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeams: [
      {
        teamId: 16,
        teamName: 'aa',
        teamExplain: '11',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 15,
        teamName: 'scroll',
        teamExplain: 'scsc',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 14,
        teamName: 'asd',
        teamExplain: 'qqqq',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 13,
        teamName: 'asd',
        teamExplain: 'qqqq',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 10,
        teamName: 'Team QA',
        teamExplain: 'qa',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 5,
        memberCount: 1,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-27',
      },
      {
        teamId: 3,
        teamName: '파댕이 밥주기',
        teamExplain: '파댕이 밥',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bae6cb5b-2772-41a7-b56f-808766d0dc50',
        topic: '코딩테스트',
        memberLimit: 10,
        memberCount: 6,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '수정테스트(2025/01/02)',
        createdAt: '2024-12-23',
      },
      {
        teamId: 2,
        teamName: '장진영팀',
        teamExplain: '코딩테스트 입니당~~',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 11,
        memberCount: 4,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '안녕하세요 공지입니다.',
        createdAt: '2024-12-22',
      },
      {
        teamId: 1,
        teamName: '제육돈까스햄버거파티',
        teamExplain: '',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 20,
        memberCount: 4,
        streakDays: 0,
        successMemberCount: 0,
        teamAnnouncement: '하이하이하이하이',
        createdAt: '2024-12-22',
      },
    ],
    allTeams: {
      content: [
        {
          teamId: 12,
          teamName: '티리티리팀',
          teamExplain: '티리티리팀이에요',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 5,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: '장진영',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/dbda7287-20e9-486a-b17c-6c24f35ac1d8.png',
              memberExplain: '내 이름은 장진영',
              uuid: '358e0577-696f-418a-a0fc-80d63dbfe587',
            },
          ],
        },
        {
          teamId: 11,
          teamName: '티리티리팀',
          teamExplain: '티리티리팀이에요',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 5,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: '장진영',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/dbda7287-20e9-486a-b17c-6c24f35ac1d8.png',
              memberExplain: '내 이름은 장진영',
              uuid: '358e0577-696f-418a-a0fc-80d63dbfe587',
            },
          ],
        },
        {
          teamId: 10,
          teamName: 'Team QA',
          teamExplain: 'qa',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 5,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: '하내안',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
        {
          teamId: 9,
          teamName: '현빈 테스트',
          teamExplain: '기모띵',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 4,
          memberCount: 2,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: 'ddy',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'hjjuiiiuououououo',
              uuid: '51021d92-eefe-41a7-962a-d0fc029bb866',
            },
            {
              memberName: '강수민',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: null,
              uuid: 'aec0d712-8382-456e-8331-58d705900d98',
            },
          ],
        },
        {
          teamId: 16,
          teamName: 'aa',
          teamExplain: '11',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 12,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-26',
          members: [
            {
              memberName: '하내안',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
        {
          teamId: 15,
          teamName: 'scroll',
          teamExplain: 'scsc',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 12,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-26',
          members: [
            {
              memberName: '하내안',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
      ],
      page: {
        size: 6,
        number: 2,
        totalElements: 27,
        totalPages: 5,
      },
    },
  },
};

export const subjectMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    articleId: 394,
    articleCategory: '스터디 복습',
    articleTitle: '주제주제',
    articleBody: '<p dir="ltr"><span>이밎이없이</span></p>',
    createdDate: '2025-01-21 23:26:34',
    imageUrls: [],
    authorName: '하내안',
    authorImageUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
  },
};
// {
//   status: 'success',
//   code: 200,
//   message: null,
//   data: {
//     articleId: 98,
//     articleCategory: '코딩 테스트',
//     articleTitle: '1/15 오늘의 문제',
//     articleBody:
//       '<p dir="ltr"><span style="white-space: pre-wrap;">안녕하세요~ 평일의 가운데 수요일이네요\uD83D\uDE0A</span></p><p dir="ltr"><span style="white-space: pre-wrap;">오늘도 코딩테스트 풀이를 위해 이 곳까지 오셨다니! 아주 잘하고 있습니다\uD83D\uDC4D</span></p><p><br></p><p dir="ltr"><span style="white-space: pre-wrap;">오늘은 어제보다 쉬운 난이도의 문제 입니다! (힌트: ✨♥️\uD83D\uDC9E♥️✨)</span></p><p dir="ltr"><span style="white-space: pre-wrap;">얼른 빨리 쓱 풀고 쉬러갑시다!! 파이팅\uD83D\uDC23\uD83D\uDC23</span></p><p><br></p><p dir="ltr"><span style="white-space: pre-wrap;">\uD83D\uDCE2</span><b><strong class="editor-text-bold" style="white-space: pre-wrap;"> 1/15 오늘의 문제</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">class2 - 백준 1259번 : </span><a href="https://www.acmicpc.net/problem/1259" target="_blank" rel="noopener noreferrer" class="editor-link"><span style="white-space: pre-wrap;">펠린드롬수</span></a></p><p dir="ltr"><span style="white-space: pre-wrap;">class4 - 백준 1043번 : </span><a href="https://www.acmicpc.net/problem/1043" target="_blank" rel="noopener noreferrer" class="editor-link"><span style="white-space: pre-wrap;">거짓말</span></a></p><p><br></p><p><span style="white-space: pre-wrap;">-----------------------------------------------------------------------------------------------------------</span></p><p dir="ltr"><span style="white-space: pre-wrap;">\uD83D\uDD17</span><b><strong class="editor-text-bold" style="white-space: pre-wrap;"> 문제 풀이 예시 (복사해서 가져가세요!)</strong></b></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">제목 (예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">1/7 class2 - 백준 1003번 : 피보나치 함수</span></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">문제 유형 (예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">2중 for문을 활용한 브루트포스</span></p><p dir="ltr"><span style="white-space: pre-wrap;">DFS, BFS를 이용한 완전탐색</span></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">풀이 방법 도출 과정 (예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">입력 Size가 1000이기 때문에 완전탐색을 활용하여 1초 내에 문제를 해결할 수 있고 판단, 이를 바탕으로 2중 for문을 활용했다.</span></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">문제 풀이 핵심 코드 이미지 삽입 및 간단 설명(예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">2차원 배열을 활용하여 Dynamic Programming을 활용했다.</span></p><p><br></p><p dir="ltr"><img src="https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/article/0f83fdc5-e72d-4d84-a0cc-3222f1b15e18.png" alt="이미지"></p>',
//     createdDate: '2025-01-13 00:22:38',
//     imageUrl:
//       'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/article/0f83fdc5-e72d-4d84-a0cc-3222f1b15e18.png',
//     authorName: '강수밈밈',
//     authorImageUrl:
//       'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/d3ac6803-3e66-438b-ac07-1e5091891ea5.png',
//   },
// };

export const teamPageMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeamResponse: {
      teamId: 16,
      teamName: 'aa',
      teamExplain: '11',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      topic: '스터디',
      memberLimit: 12,
      memberCount: 1,
      streakDays: 0,
      successMemberCount: 0,
      teamAnnouncement: '',
      createdAt: '2024-12-26',
    },
    teamManager: true,
    subjectArticleDateAndTagResponses: [
      {
        subjectDate: '2025-01-02',
        articleCategory: '스터디 예습',
      },
      {
        subjectDate: '2025-01-13',
        articleCategory: '스터디 복습',
      },
      {
        subjectDate: '2025-01-15',
        articleCategory: '코딩 테스트',
      },
    ],
  },
};

export const createPostMock = {
  status: 'success',
  code: 201,
  message: '게시글이 성공적으로 생성되었습니다.',
  data: {
    articleId: 452,
  },
};

export const mutatePostMock = {
  status: 'success',
  code: 200,
  message: '게시글이 성공적으로 수정되었습니다.',
  data: null,
};

export const mutateTeamInfo = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    teamId: 16,
    teamName: 'aa11asd',
    teamExplain: '1122222바뿨보자zz',
    topic: '코딩테스트',
    memberLimit: 50,
    password: '1122',
    teamIconUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/eed4f55a-cf35-497a-bf4b-1f27fb8d1415',
  },
};
