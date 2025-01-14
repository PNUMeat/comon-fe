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
