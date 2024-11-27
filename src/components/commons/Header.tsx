import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { HeightInNumber } from '@/components/types';

import { Link } from 'react-router-dom';

import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

// padding: 0 53px 사용하면 border gradient 이상해져서 자식의 margin으로 대체
const HeaderContainer = styled(Flex)<HeightInNumber>`
  height: ${(props) => props.h}px;
  align-items: center;
  justify-content: space-between;
  margin: 54px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 40px;
  box-sizing: border-box;

  border: 1px solid transparent;
  background-image: linear-gradient(#333333, #333333),
    linear-gradient(to right, #5f419f 0%, #f15ca7 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
`;

const ComonSLogo = styled.div`
  display: flex;
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-left: 53px;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 106px;
  align-items: center;

  a {
    color: white;
    text-decoration: none;
    font-size: 20px;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// TODO : 추후 DropDown으로 변경할 것
const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
  margin-right: 53px;

  a {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    font-weight: 800;
    text-decoration: none;
  }
`;

export const Header: React.FC<HeightInNumber> = ({ h }) => {
  const isLoggedIn = false;

  return (
    <HeaderContainer h={h}>
      <Flex>
        <Link to={PATH.HOME}>
          <ComonSLogo>
            C<SText color={'#8488EC'}>O</SText>M
            <SText color={'#F15CA7'}>O</SText>N 코몬
          </ComonSLogo>
        </Link>
        <NavMenu>
          <a href="#service">서비스 소개</a>
          <a href="#team">활동 팀</a>
        </NavMenu>
      </Flex>
      <UserMenu>
        {isLoggedIn ? (
          <button>마이 페이지</button>
        ) : (
          <Link to={'/login'}>로그인</Link>
        )}
      </UserMenu>
    </HeaderContainer>
  );
};
