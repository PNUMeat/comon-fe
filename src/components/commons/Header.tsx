import { checkRemainingCookies, isDevMode } from '@/utils/cookie';

import { Flex } from '@/components/commons/Flex';
import { HeaderInfoModal } from '@/components/features/Header/HeaderInfoModal';
import { HeightInNumber } from '@/components/types';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { logout } from '@/api/user';
import headerLogo from '@/assets/Header/header_logo.png';
import user from '@/assets/Header/user.svg';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

const HeaderContainer = styled.header<HeightInNumber>`
  height: ${(props) => props.h}px;
  align-items: center;
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  justify-content: space-between;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding-left: 69px;
  padding-right: 48.5px;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  // border: 1px solid transparent;
  // background-image: linear-gradient(#333333, #333333),
  //   linear-gradient(to right, #5f419f 0%, ${colors.buttonPink} 100%);
  // background-origin: border-box;
  // background-clip: content-box, border-box;

  box-shadow: 0px 6px 20px 0px rgba(48, 49, 67, 0.06);
  border-radius: 2px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 50px;
    margin: 40px 0;
    max-width: 90%;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 30px;
  margin-left: 106px;
  align-items: center;

  a {
    // color: white;
    text-decoration: none;
    font-size: 18px;
    font-weight: 600;

    &:hover {
      text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
    }
  }

  @media (max-width: ${breakpoints.mobile}px) {
    margin-left: 30px;
    height: 100%;

    a {
      font-size: 14px;
    }

    a:first-of-type {
      display: none;
    }
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
    // color: white;
    font-size: 18px;
    cursor: pointer;
    font-weight: 800;
    text-decoration: none;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    margin-right: 32px;

    a,
    button {
      font-size: 14px;
      font-weight: 600;
    }
  }
`;

const ComonLogoWrap = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  // margin-left: 56px;

  @media (max-width: ${breakpoints.mobile}px) {
    // margin-left: 32px;
  }
`;

type ModalControl = {
  modal: HTMLDivElement | null;
  isClicked: boolean;
};

export const Header: React.FC<HeightInNumber> = ({ h }) => {
  const [isLoggedIn] = useState<boolean>(
    checkRemainingCookies() || isDevMode()
  );
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
      <Flex align="center" width={'368px'} gap={'57px'}>
        <ComonLogoWrap onClick={onClickHome}>
          <img
            src={headerLogo}
            alt={'코몬 헤더 로고'}
            width={'120px'}
            height={'18px'}
          />
        </ComonLogoWrap>
        <NavMenu>
          <a
            style={{
              color: location.pathname === PATH.TEAMS ? '#3D3D3D' : '#B0B0B0',
              fontSize: '16px',
              fontWeight: 700,
            }}
            href={PATH.TEAMS}
          >
            활동 중인 팀
          </a>
          <a
            style={{
              color:
                location.pathname === PATH.TEAM_RECRUIT ? '#3D3D3D' : '#B0B0B0',
              fontSize: '16px',
              fontWeight: 700,
            }}
            href={PATH.TEAM_RECRUIT}
          >
            팀원 모집
          </a>
        </NavMenu>
      </Flex>
      <UserMenu>
        <Fragment>
          {!isLoggedIn && (
            <LoginButton
              onClick={() => {
                navigate(PATH.LOGIN, {
                  state: { redirect: location.pathname },
                });
              }}
            >
              로그인
            </LoginButton>
          )}
          {isLoggedIn && (
            <MyPageButton
              onClick={() => {
                modalControlRef.current.isClicked =
                  !modalControlRef.current.isClicked;
              }}
            >
              <img src={user} alt={'user icon'} />
              내정보
            </MyPageButton>
          )}

          <HeaderInfoModal
            isLoggedIn={isLoggedIn}
            setModalRef={setModalRef}
            onClickLogout={onClickLogout}
          />
        </Fragment>
      </UserMenu>
    </HeaderContainer>
  );
};

const LoginButton = styled.div`
  width: 98px;
  height: 42px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #f15ca7;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  color: #fff;
  text-align: center;
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 140%;
`;

const MyPageButton = styled.div`
  cursor: pointer;
  display: flex;
  width: 97px;
  height: 42px;
  padding-right: 5px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  color: #636363;

  text-align: center;
  leading-trim: both;

  text-edge: cap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;
