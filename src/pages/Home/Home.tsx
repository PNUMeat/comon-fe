import { CommonLayout } from '@/components/Layout/CommonLayout';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';

import { Link } from 'react-router-dom';

import { PATH } from '@/routes/path';

export const Home = () => {
  return (
    <CommonLayout>
      <PageSectionHeader h={40}>코드몬스터 랜딩페이지</PageSectionHeader>
      <ul>
        <li>
          <Link to={PATH.ENROLL}>프로필 생성</Link>
        </li>
        <li>
          <Link to={PATH.TEAM_REGISTRATION}>팀 생성</Link>
        </li>
        <li>
          <Link to={PATH.TEAM_MODIFICATION}>팀 수정</Link>
        </li>
      </ul>
    </CommonLayout>
  );
};
