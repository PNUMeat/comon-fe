import { CommonLayout } from '@/components/commons/CommonLayout';
import { PageSectionHeader } from '@/components/commons/PageSectionHeader';

export const Home = () => {
  return (
    <CommonLayout>
      <div>코드몬스터 랜딩페이지</div>
      <PageSectionHeader h={40}>타이틀</PageSectionHeader>
    </CommonLayout>
  );
};
