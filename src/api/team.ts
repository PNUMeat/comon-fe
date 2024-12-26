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
  successMemberCount: number;
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

  const res = await apiInstance.post('v1/teams', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

const mock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeams: [
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
        teamAnnouncement: '',
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
        teamAnnouncement: '공지입니다!',
        createdAt: '2024-12-22',
      },
    ],
    allTeams: {
      content: [
        {
          teamId: 8,
          teamName: '파댕이 대장',
          teamExplain: '코딩테스트 입니당~~',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 11,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-24',
          members: [
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
          teamId: 7,
          teamName: '가짜 파댕이',
          teamExplain: '코딩테스트 입니당~~',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 11,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-24',
          members: [
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
          teamId: 6,
          teamName: 'test용 ',
          teamExplain: '코딩테스트 입니당~~',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 11,
          memberCount: 2,
          streakDays: 0,
          createdAt: '2024-12-24',
          members: [
            {
              memberName: '천원',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: '11',
              uuid: '0ddd55d3-9ac6-472f-abe9-47494054a4bb',
            },
            {
              memberName: '이지수',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/c75f81ab-5f9d-44d6-8966-84183a37e0d5',
              memberExplain: '난 파댕이가 좋아',
              uuid: 'cfa66118-65c9-4f54-8cc2-a90c71a05e1d',
            },
          ],
        },
        {
          teamId: 5,
          teamName: 'DesignTeam',
          teamExplain: '디자인디자인',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 10,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-24',
          members: [
            {
              memberName: '서혜성ㅇㅇㅇㅇㅇㅇㅇ',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'ㅇㅇㅇ',
              uuid: 'f8b00a79-7ee8-4f12-b837-d4f74e830ea3',
            },
          ],
        },
        {
          teamId: 4,
          teamName: 'DesignTeam',
          teamExplain: '디자인디자인',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 10,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-24',
          members: [
            {
              memberName: '서혜성ㅇㅇㅇㅇㅇㅇㅇ',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'ㅇㅇㅇ',
              uuid: 'f8b00a79-7ee8-4f12-b837-d4f74e830ea3',
            },
          ],
        },
        {
          teamId: 3,
          teamName: '파댕이 밥주기',
          teamExplain: '파댕이 밥',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bae6cb5b-2772-41a7-b56f-808766d0dc50',
          topic: '코딩테스트',
          memberLimit: 10,
          memberCount: 4,
          streakDays: 0,
          createdAt: '2024-12-23',
          members: [
            {
              memberName: '이지수',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/c75f81ab-5f9d-44d6-8966-84183a37e0d5',
              memberExplain: '난 파댕이가 좋아',
              uuid: 'cfa66118-65c9-4f54-8cc2-a90c71a05e1d',
            },
            {
              memberName: null,
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: null,
              uuid: '358e0577-696f-418a-a0fc-80d63dbfe587',
            },
            {
              memberName: '강수민',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: null,
              uuid: 'aec0d712-8382-456e-8331-58d705900d98',
            },
            {
              memberName: '천원',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: '11',
              uuid: '0ddd55d3-9ac6-472f-abe9-47494054a4bb',
            },
          ],
        },
      ],
      page: {
        size: 6,
        number: 0,
        totalElements: 8,
        totalPages: 2,
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
  const res = mock;

  // return res.data.data;
  return res.data;
};

export const joinTeam = async (teamId: number, password: string) => {
  return apiInstance
    .post<ServerResponse<null>>(`/v1/teams/${teamId}/join`, { password })
    .then((res) => {
      alert(res.data.message);
    })
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || '팀 참가에 실패했습니다.';
      alert(errorMessage);
      throw error;
    });
};
