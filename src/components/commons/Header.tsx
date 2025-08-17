import { checkRemainingCookies, isDevMode } from '@/utils/cookie';

import { useWindowWidth } from '@/hooks/useWindowWidth.ts';

import { Flex } from '@/components/commons/Flex';
import { HeaderInfoModal } from '@/components/features/Header/HeaderInfoModal';
import { HeightInNumber } from '@/components/types';

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { logout } from '@/api/user';
import logo from '@/assets/Header/logo.svg';
import user from '@/assets/Header/user.svg';
import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

const Blur = styled.div`
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  display: grid;
  align-items: center;
  grid-template-columns: 1fr 98px;
`;

const HeaderContainer = styled.header<HeightInNumber>`
  height: ${(props) => props.h}px;
  align-items: center;
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 40px 0 40px;

  // border: 1px solid transparent;
  // background-image: linear-gradient(#333333, #333333),
  //   linear-gradient(to right, #5f419f 0%, ${colors.buttonPink} 100%);
  // background-origin: border-box;
  // background-clip: content-box, border-box;

  box-shadow: 0px 6px 20px 0px rgba(48, 49, 67, 0.06);
  border-radius: 2px;

  @media (max-width: ${breakpoints.mobile}px) {
    height: 50px;
    padding: 0 5px 0 20px;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  a {
    text-decoration: none;
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
    }
  }

  @media (max-width: ${breakpoints.mobile}px) {
    height: 100%;
    gap: 19px;

    a {
      font-size: 14px;
    }
  }
`;

const UserMenu = styled.div`
  white-space: nowrap;
  position: relative;
  display: flex;
  width: 97px;
  height: 42px;
  padding-right: 5px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  a,
  button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    font-weight: 800;
    text-decoration: none;
  }

  @media (max-width: ${breakpoints.mobile}px) {
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
  height: 100%;
`;

const LogoImage = styled.img`
  height: 24px;

  @media (max-width: ${breakpoints.mobile}px) {
    transform: translateX(-84px);
  }
`;

const LogoWrap = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 124px;
  box-sizing: border-box;
  @media (max-width: ${breakpoints.mobile}px) {
    width: 41px;
  }
`;

const Logo: React.FC<{
  src: string;
  alt: string;
}> = ({ src, alt }) => {
  return (
    <LogoWrap>
      <LogoImage src={src} alt={alt} />
    </LogoWrap>
  );
};

type ModalControl = {
  modal: HTMLDivElement | null;
  // isClicked: boolean;
};

export const Header: React.FC<HeightInNumber> = ({ h }) => {
  const [isLoggedIn] = useState<boolean>(
    checkRemainingCookies() || isDevMode()
  );
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalControlRef = useRef<ModalControl>({
    modal: null,
    // isClicked: false,
  });
  const location = useLocation();
  const navigate = useNavigate();

  const setModalRef = (el: HTMLDivElement | null) => {
    if (el) {
      modalControlRef.current.modal = el;
    }
  };

  useEffect(() => {
    if (modalControlRef.current && isLoggedIn) {
      const { modal } = modalControlRef.current;
      if (modal) {
        const onClick = (e: DocumentEventMap['click']) => {
          const target = e.target as HTMLElement;
          if (target && target.textContent !== '내정보') {
            setOpen(false);
            return;
          }

          return;
        };
        document.addEventListener('click', onClick);

        return () => {
          document.removeEventListener('click', onClick);
        };
      }
    }
  }, [isLoggedIn, open]);

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

  const width = useWindowWidth();
  const isMobile = width < breakpoints.mobile;

  return (
    <HeaderContainer h={h} ref={containerRef}>
      <Blur>
        <Flex
          align="center"
          style={{ width: isMobile ? '100%' : '396px' }}
          gap={isMobile ? '24px' : '80px'}
          height={24}
          padding={isMobile ? '' : '0 8px'}
        >
          <ComonLogoWrap onClick={onClickHome}>
            <Logo src={logo} alt={'코몬 헤더 로고'} />
          </ComonLogoWrap>
          <NavMenu>
            <a
              style={{
                color: location.pathname === PATH.TEAMS ? '#3D3D3D' : '#B0B0B0',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 700,
              }}
              href={PATH.TEAMS}
            >
              활동 중인 팀
            </a>
            <a
              style={{
                color: location.pathname.includes('team-recruit')
                  ? '#3D3D3D'
                  : '#B0B0B0',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 700,
              }}
              href={`${PATH.TEAM_RECRUIT}/list`}
            >
              팀원 모집
            </a>
          </NavMenu>
        </Flex>
        <UserMenu>
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
            <MyPageButton onClick={() => setOpen(true)}>
              <img src={user} alt={'user icon'} />
              내정보
            </MyPageButton>
          )}
          {open && (
            <HeaderInfoModal
              isLoggedIn={isLoggedIn}
              setModalRef={setModalRef}
              onClickLogout={onClickLogout}
            />
          )}
        </UserMenu>
      </Blur>
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
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 140%;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    width: 78px;
    height: 32px;
    padding: 11px 20px;
    font-size: 14px;

    justify-content: center;
    align-items: center;
  }
`;

const MyPageButton = styled.div`
  cursor: pointer;
  display: flex;
  width: 98px;
  height: 42px;
  padding-right: 5px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: #636363;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    display: flex;
    width: 78px;
    height: 32px;
    padding: 11px 20px;
    font-size: 14px;

    justify-content: center;
    align-items: center;
  }
`;
