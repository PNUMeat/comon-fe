import { checkRemainingCookies } from '@/utils/cookie';

import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { HeightInNumber } from '@/components/types';

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { logout } from '@/api/user';
import { colors } from '@/constants/colors';
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
    linear-gradient(to right, #5f419f 0%, ${colors.buttonPink} 100%);
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
  gap: 52px;
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

const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
  margin-right: 53px;

  a,
  button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    font-weight: 800;
    text-decoration: none;
  }
`;

const ComonLogoWrap = styled.div`
  cursor: pointer;
`;

const modalInitPos = '9999px';
export const MyInfoModal = styled.div`
  width: 301px;
  height: 189px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #7f7f7f;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  position: fixed;
  top: ${modalInitPos};
`;

type ModalControl = {
  modal: HTMLDivElement | null;
  isClicked: boolean;
};

export const Header: React.FC<HeightInNumber> = ({ h }) => {
  const [isLoggedIn] = useState<boolean>(checkRemainingCookies());
  const modalControlRef = useRef<ModalControl>({
    modal: null,
    isClicked: false,
  });
  const location = useLocation();
  const navigate = useNavigate();

  const setModalRef = (el: HTMLDivElement | null) => {
    if (el) {
      modalControlRef.current.modal = el;
    }
  };

  useEffect(() => {
    if (modalControlRef && modalControlRef.current) {
      const { modal } = modalControlRef.current;
      if (modal) {
        const onClick = (e: DocumentEventMap['click']) => {
          const target = e.target as HTMLElement;
          if (target && target.textContent !== '내정보') {
            modal.style.top = modalInitPos;
            modalControlRef.current.isClicked = false;
            return;
          }

          if (modalControlRef.current.isClicked) {
            modal.style.top = `${72 + 52 + 10}px`;
            modal.style.left = `${1190}px`;
            return;
          }
          modal.style.top = modalInitPos;
        };
        document.addEventListener('click', onClick);

        return () => {
          document.removeEventListener('click', onClick);
        };
      }
    }
  }, []);

  const onClickHome = () => navigate(PATH.HOME);
  const onClickLogout = () =>
    logout()
      .then(() => {
        sessionStorage.removeItem('Authorization');
        alert('로그아웃 되었습니다!');
        window.location.reload();
      })
      .catch((err) => console.error(err));

  return (
    <HeaderContainer h={h}>
      <Flex>
        <ComonLogoWrap onClick={onClickHome}>
          <ComonSLogo>
            C<SText color={'#8488EC'}>O</SText>M
            <SText color={'#F15CA7'}>O</SText>N 코몬
          </ComonSLogo>
        </ComonLogoWrap>
        <NavMenu>
          <a href={PATH.HOME}>서비스 소개</a>
          <a href={PATH.TEAMS}>활동 팀</a>
        </NavMenu>
      </Flex>
      <UserMenu>
        {isLoggedIn ? (
          // <Link to={PATH.PROFILE}>프로필 수정</Link>
          <button
            onClick={() => {
              modalControlRef.current.isClicked =
                !modalControlRef.current.isClicked;
            }}
          >
            내정보
          </button>
        ) : (
          <Link
            to={{
              pathname: PATH.LOGIN,
            }}
            state={{ redirect: location.pathname }}
          >
            로그인
          </Link>
        )}
      </UserMenu>
      {createPortal(
        <MyInfoModal
          ref={setModalRef}
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
          }}
        >
          <button onClick={onClickLogout}>로그아웃</button>
        </MyInfoModal>,
        document.body
      )}
    </HeaderContainer>
  );
};
