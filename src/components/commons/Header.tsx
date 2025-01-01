import { checkRemainingCookies } from '@/utils/cookie';

import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { HeaderInfoModal } from '@/components/features/Header/HeaderInfoModal';
import { HeightInNumber } from '@/components/types';

import { Fragment, useEffect, useRef, useState } from 'react';
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
  }
`;

const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
  margin-right: 53px;
  position: relative;

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

type ModalControl = {
  modal: HTMLDivElement | null;
  isClicked: boolean;
};

export const Header: React.FC<HeightInNumber> = ({ h }) => {
  const [isLoggedIn] = useState<boolean>(checkRemainingCookies());
  const containerRef = useRef<HTMLDivElement | null>(null);
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
    if (modalControlRef && modalControlRef.current && isLoggedIn) {
      const { modal } = modalControlRef.current;
      if (modal) {
        const onClick = (e: DocumentEventMap['click']) => {
          const target = e.target as HTMLElement;
          if (target && target.textContent !== '내정보') {
            modal.style.opacity = '0';
            modal.style.zIndex = '-100';
            modalControlRef.current.isClicked = false;
            return;
          }

          if (modalControlRef.current.isClicked) {
            modal.style.opacity = '1';
            modal.style.zIndex = '100';
            return;
          }
          modal.style.opacity = '0';
          modal.style.zIndex = '-100';
        };
        document.addEventListener('click', onClick);

        return () => {
          document.removeEventListener('click', onClick);
        };
      }
    }
  }, [isLoggedIn]);

  const onClickHome = () => navigate(PATH.HOME);
  const onClickLogout = () =>
    logout()
      .then(() => {
        sessionStorage.removeItem('Authorization');
        alert('로그아웃 되었습니다!');
        navigate(PATH.HOME);
        window.location.reload();
      })
      .catch((err) => console.error(err));

  return (
    <HeaderContainer h={h} ref={containerRef}>
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
          <Fragment>
            <button
              onClick={() => {
                modalControlRef.current.isClicked =
                  !modalControlRef.current.isClicked;
              }}
            >
              내정보
            </button>
            <HeaderInfoModal
              setModalRef={setModalRef}
              onClickLogout={onClickLogout}
            />
          </Fragment>
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
    </HeaderContainer>
  );
};
