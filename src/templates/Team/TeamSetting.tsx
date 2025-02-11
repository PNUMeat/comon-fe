import { Spacer } from '@/components/commons/Spacer';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';
import { BackgroundGradient } from '@/components/commons/BackgroundGradient';

type DashboardCategories = {
  label: string;
  path: string;
};

const categories: DashboardCategories[] = [
  { label: '팀 관리', path: 'team' },
  { label: '멤버 관리', path: 'members' },
];

const TeamSetting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location.pathname.split('/')[2];

  const { teamId } = useParams();

  const handleNavigation = (path: string) => {
    navigate(path, { state: { teamId } });
  };

  return (
    <DashboardGird>
      <DSidebar>
        {categories.map((c) => (
          <Category
            key={c.path}
            isSelected={c.path === category}
            onClick={() =>
              handleNavigation(`/team-setting/${c.path}/${teamId}`)
            }
          >
            {c.label}
          </Category>
        ))}
      </DSidebar>
      <DContent>
        <BackgroundGradient
          count={1}
          positions={[{ top: '50%', left: '50%' }]}
          height="470px"
          transform='translate(-50%, -50%)'
        />
        <Outlet />
        <Spacer h={312} />
      </DContent>
    </DashboardGird>
  );
};

const DashboardGird = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 100%;
  grid-template-areas: 'sidebar main';
  gap: 121px;
  margin-top: 54px;

  @media (max-width: ${breakpoints.mobile}px) {
    display: block;
    margin-top: 0px;
  }
`;

const DSidebar = styled.aside`
  grid-area: sidebar;
  width: 100%;
  min-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 13px;

  @media (max-width: ${breakpoints.mobile}px) {
    min-height: fit-content;
    gap: 4px;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    padding: 8px 12px;
    width: auto;
  }
`;

const DContent = styled.div`
  grid-area: main;
  // margin-left: 121px;
  display: flex;
  width: 100%;
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
  background-color: ${({ isSelected }) => (isSelected ? '#e5e5e5' : '#fff')};
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
  font-family: 'Pretendard';
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 100%;
    height: 26px;

    font-size: 12px;

    ${(props) =>
      props.isSelected
        ? `&::after {
    width: 2px;
    height: 16px;
    left: 7px;
  }`
        : ''}
  }
`;

export default TeamSetting;
