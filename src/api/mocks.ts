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
        teamName: '코딩테스트트트',
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
        articleId: 242,
        articleTitle: '14일에씀',
        articleBody: '<p><span style="white-space: pre-wrap;">????</span></p>',
        createdDate: '2025-01-13 20:33:36',
        imageUrl: null,
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
        imageUrl: null,
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
        imageUrl: null,
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
        imageUrl: null,
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
        imageUrl: null,
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
      totalPages: 1,
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
      teamName: '코딩테스트트트',
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
        teamName: '코딩테스트트트',
        teamExplain: '코딩테스트 입니당~~',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 11,
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
          teamId: 28,
          teamName: '테스트테스트',
          teamExplain: '.',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 2,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2025-01-12',
          members: [
            {
              memberName: '민경',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: '하이하이',
              uuid: '73cce880-e310-4632-b546-9b30cb7e843e',
            },
          ],
        },
        {
          teamId: 27,
          teamName: 'asdfafsdfs',
          teamExplain: 'sadfsadfsdaf',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 2,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2025-01-12',
          members: [
            {
              memberName: 'ddy',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'hjjuiiiuououououo',
              uuid: '51021d92-eefe-41a7-962a-d0fc029bb866',
            },
          ],
        },
        {
          teamId: 25,
          teamName: '123',
          teamExplain: '123',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 2,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2025-01-02',
          members: [
            {
              memberName: '12312312312',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'qkrwjwhd ',
              uuid: '8834ddd2-cfbf-482b-9260-d69ba49700b8',
            },
          ],
        },
        {
          teamId: 26,
          teamName: '123',
          teamExplain: '123',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 2,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2025-01-02',
          members: [
            {
              memberName: '12312312312',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'qkrwjwhd ',
              uuid: '8834ddd2-cfbf-482b-9260-d69ba49700b8',
            },
          ],
        },
        {
          teamId: 17,
          teamName: '한재안',
          teamExplain: '한재안',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 3,
          memberCount: 4,
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
              memberName: '김민욱',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: '.',
              uuid: '11114201-2411-48cf-a6aa-e6de4607956d',
            },
            {
              memberName: '12312312312',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'qkrwjwhd ',
              uuid: '8834ddd2-cfbf-482b-9260-d69ba49700b8',
            },
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
      ],
      page: {
        size: 6,
        number: 0,
        totalElements: 20,
        totalPages: 4,
      },
    },
  },
};
