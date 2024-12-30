import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

import styled from '@emotion/styled';

const DashboardGird = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 100%;
  grid-template-areas: 'sidebar main';
  margin-top: 54px;
`;

const DSidebar = styled.aside`
  grid-area: sidebar;
  width: 100%;
  min-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const DContent = styled.div`
  grid-area: main;
  margin-left: 121px;
  display: flex;
`;

const Category = styled.div<{ isSelected?: boolean }>`
  box-sizing: border-box;
  width: 260px;
  height: 38px;
  padding: 12px 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? '#e5e5e5' : '#fff')};
  ${(props) =>
    props.isSelected
      ? `&::after {
    position: absolute;
    content: '';
    width: 4px;
    height: 24px;
    background-color: #6e74fa;
    border-radius: 3px;
    left: 7px;
  }`
      : ''}
  color: #333;
  leading-trim: both;
  text-edge: cap;
  font-family: 'Pretendard Variable';
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;
`;

type DashboardCategories = {
  label: string;
  path: string;
};

const categories: DashboardCategories[] = [
  { label: '프로필', path: 'profile' },
  { label: '내 팀 관리', path: 'teams' },
  { label: '계정 정보', path: 'account' },
];

export const MyDashboard = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  if (!categories.some((valid) => valid.path === category)) {
    return <Navigate to={'/my-dashboard-category-not-found'} />;
  }

  return (
    <DashboardGird>
      <DSidebar>
        {categories.map((c) => (
          <Category
            key={c.path}
            isSelected={c.path === category}
            onClick={() => navigate(`/my-dashboard/${c.path}`)}
          >
            {c.label}
          </Category>
        ))}
      </DSidebar>
      <DContent>
        <Outlet />
      </DContent>
    </DashboardGird>
  );
};
