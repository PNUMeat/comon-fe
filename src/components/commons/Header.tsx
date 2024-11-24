import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { HeightInNumber } from '@/components/types';

import styled from '@emotion/styled';

const HeaderContainer = styled(Flex)<HeightInNumber>`
  height: ${(props) => props.h}px;
  border-radius: 40px;
  background-color: #333333;
  align-items: center;
  padding: 0 53px;
  margin: 54px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #333333;
  box-sizing: border-box;
  justify-content: space-between;
`;

const ComonSLogo = styled.div`
  display: flex;
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 106px;

  a {
    color: white;
    text-decoration: none;
    font-size: 18px;
    font-weight: 500;

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

  button {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Header: React.FC<HeightInNumber> = ({ h }) => {
  const isLoggedIn = false;

  return (
    <HeaderContainer h={h}>
      <Flex>
        <ComonSLogo>
          C<SText color={'#8488EC'}>O</SText>M<SText color={'#F15CA7'}>O</SText>
          N 코몬
        </ComonSLogo>
        <NavMenu>
          <a href="#service">서비스 소개</a>
          <a href="#team">활동 팀</a>
        </NavMenu>
      </Flex>
      <UserMenu>
        {isLoggedIn ? <button>로그인</button> : <button>마이 페이지</button>}
      </UserMenu>
    </HeaderContainer>
  );
};
