import apiInstance from '@/api/apiInstance';
import { ServerResponse } from '@/api/types';

// 생성
interface ITeamCommon {
  teamName: string;
  teamExplain: string;
  topic: string;
  memberLimit: string;
}

interface ICreateTeamRequest extends ITeamCommon {
  password: string;
  image?: File | null;
}

interface ICreateTeamResponse {
  teamId: number;
}

// 조회
interface ITeamMember {
  memberName: string;
  imageUrl: string;
  memberExplain: string;
  uuid: string;
}

export interface ITeamInfo extends ITeamCommon {
  teamId: number;
  imageUrl: string;
  memberCount: number;
  streakDays: number;
  // successMemberCount: number;
  teamAnnouncement: string;
  createdAt: string;
  members: ITeamMember[];
}

interface ITeamListResponse {
  myTeams: ITeamInfo[];
  allTeams: {
    content: ITeamInfo[];
    page: {
      size: number;
      number: number;
      totalElements: number;
      totalPages: number;
    };
  };
}

// 검색
export interface ITeamSearchResponse {
  content: ITeamInfo[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const createTeam = async ({
  teamName,
  teamExplain,
  topic,
  memberLimit,
  password,
  image,
}: ICreateTeamRequest) => {
  const formData = new FormData();

  formData.append('teamName', teamName);
  formData.append('teamExplain', teamExplain);
  formData.append('topic', topic);
  formData.append('password', password);
  formData.append('memberLimit', memberLimit);

  if (image) {
    formData.append('image', image);
  }

  const res = await apiInstance.post<ServerResponse<ICreateTeamResponse>>(
    'v1/teams',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.error('??', res.data);

  return res.data.data;
};

const res = {
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
        teamAnnouncement: '공지수정222',
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
        memberCount: 3,
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
          teamId: 17,
          teamName: '한재안',
          teamExplain: '한재안',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 3,
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
              memberName: '김민욱',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: '.',
              uuid: '11114201-2411-48cf-a6aa-e6de4607956d',
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
              memberName: null,
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: null,
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
              memberName: null,
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: null,
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
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/f8f43af8-22c1-4885-a580-1f8233eec3d7',
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
          memberCount: 1,
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
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/f8f43af8-22c1-4885-a580-1f8233eec3d7',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
      ],
      page: {
        size: 6,
        number: 0,
        totalElements: 16,
        totalPages: 3,
      },
    },
  },
};

export const getTeamList = async (
  sort: string = 'recent',
  page: number = 0,
  size: number = 6
): Promise<ITeamListResponse> => {
  // const res = await apiInstance.get<ServerResponse<ITeamListResponse>>(
  //   `/v1/teams/combined`,
  //   {
  //     params: { sort, page, size },
  //   }
  // );
  //
  // return res.data.data;
  return res.data;
};

type TeamJoinResp = {
  teamId: number;
};

export const joinTeam = async (teamId: number, password: string) => {
  const res = await apiInstance.post<ServerResponse<TeamJoinResp>>(
    `/v1/teams/${teamId}/join`,
    { password }
  );

  return res.data.data;
};

export const searchTeams = async (
  keyword: string,
  sort: string = 'recent',
  page: number = 0,
  size: number = 6
): Promise<ITeamSearchResponse> => {
  const res = await apiInstance.get<ServerResponse<ITeamSearchResponse>>(
    `/v1/teams/search`,
    {
      params: { keyword, sort, page, size },
    }
  );

  return res.data.data;
};
