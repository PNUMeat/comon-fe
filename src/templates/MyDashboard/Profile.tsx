import { useWindowWidth } from '@/hooks/useWindowWidth';

import { Flex } from '@/components/commons/Flex';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';

import { Fragment, Suspense, useState } from 'react';

import { s3 } from '@/api/presignedurl.ts';
import {
  ProfileQueryResp,
  changeProfile,
  getMyProfile,
  withdrawMember,
} from '@/api/user';
import comon from '@/assets/Home/comon500x500.png';
import Alarm from '@/assets/MyDashboard/alarm.svg';
import WithdrawIcon from '@/assets/MyDashboard/danger.svg';
import UserIcon from '@/assets/MyDashboard/user.svg';
import { breakpoints } from '@/constants/breakpoints';
import { imageAtom } from '@/store/form';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

// margin-bottom이 하단 여백
const ProfileWrap = styled.div<{ doBlur: boolean }>`
  box-sizing: border-box;
  margin-bottom: 400px;
  display: flex;
  position: relative;
  align-items: flex-end;
  background-color: ${(props) =>
    props.doBlur
      ? 'rgba(255, 255, 255, 0.3); backdrop-filter: blur(20px);'
      : '#fff'};

  width: 700px;
  min-height: 370px;
  padding: 32px 51px 28px 51px;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 20px;
  border: 1px solid #8488ec;
  box-shadow: 5px 7px 11.6px 0px rgba(63, 63, 77, 0.07);
  backdrop-filter: blur(20px);

  @media (max-width: ${breakpoints.mobile}px) {
    border: 1px solid #f0f1ff;
    width: 100%;
    margin-bottom: 100px;
    padding: 28px;
  }
`;

const SubHeader = styled.div`
  margin-bottom: 50px;
  color: #333;
  display: flex;
  gap: 14px;
  align-items: center;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  .withdraw {
    width: 21.5px;
  }

  .profile {
    width: 14px;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    margin-top: 50px;
    margin-bottom: 20px;
    padding-left: 12px;

    .withdraw {
      width: 14px;
    }

    .profile {
      width: 10px;
    }
  }
`;

const Heading = styled.div`
  width: 100%;
  color: #333;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 30px;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const ProfileInfoGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 31px;
  margin-bottom: 60px;

  @media (max-width: ${breakpoints.mobile}px) {
    grid-template-columns: 50px 1fr;
  }
`;

const PInfoLabel = styled.div`
  color: #333;
  font-family: 'Pretendard';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const ProfileTextValue = styled.div<{
  fontWeight: number;
  hasExplain?: boolean;
}>`
  color: ${({ hasExplain }) => (hasExplain ? '#333' : '#ccc')};
  font-family: 'Pretendard';
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => props.fontWeight};
  line-height: normal;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const ModifyButton = styled.button`
  display: flex;
  width: 89px;
  height: 31px;
  padding: 9px 34px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  border-radius: 40px;
  background-color: #6e74fa;
  color: #fff;
  text-align: center;
  font-family: 'Pretendard';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: -0.28px;
  white-space: nowrap;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
    letter-spacing: -0.24px;
  }
`;

const FallbackImg = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(146deg, #fda2d0 6.57%, #8488ec 93.43%);
  border-radius: 10px;
`;

const TextInput = styled.input<{ fontWeight: number }>`
  color: #333;
  font-family: 'Pretendard';
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => props.fontWeight};
  line-height: normal;
  box-sizing: border-box;
  outline: none;
  border: none;
  padding-bottom: 4px;

  &:focus {
    box-shadow: 0 1px 0 0 #ccc;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 14px;
    letter-spacing: -0.24px;

    &::placeholder {
      color: #ccc;
    }
  }
`;

const ProfileForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const WithdrawButtonWrap = styled.button`
  width: 89px;
  position: absolute;
  bottom: 0;
  transform: translate(9px, 40px);
`;

const WithdrawButton: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  return (
    <WithdrawButtonWrap onClick={() => setMode('withdraw')}>
      <SText
        color={'#777'}
        fontFamily={'Pretendard'}
        fontSize={'14px'}
        fontWeight={500}
      >
        계정 탈퇴 {'>'}
      </SText>
    </WithdrawButtonWrap>
  );
};

// const profileModes = ['query', 'modify', 'withdraw'];

export const Profile = () => {
  const queryClient = useQueryClient();
  useQuery({
    queryKey: ['my-profile-query'],
    queryFn: getMyProfile,
  });
  const [mode, setMode] = useState<string>('query');
  const setImage = useSetAtom(imageAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: FormData = new FormData(e.target as HTMLFormElement);
    const formValues: { [key: string]: string | File | null } = {};

    formData.forEach((value, key) => {
      formValues[key] = value;
    });

    const image = (formValues['image'] ?? null) as File;
    const mutateProfile = (url: string) =>
      changeProfile({
        memberName: formValues['memberName'] as string,
        memberExplain: formValues['memberExplain'] as string,
        imageUrl: url,
      })
        .then(() => {
          queryClient
            .refetchQueries({
              queryKey: ['my-profile-query'],
            })
            .then(() => {
              setMode('query');
              if (url) {
                setImage(url);
              }
              alert('프로필 변환에 성공했습니다');
            })
            .catch(() => alert('변환된 프로필 조회를 실패했습니다'));
        })
        .catch(() => alert('프로필 변환에 실패했습니다'));
    if (image.size > 0) {
      s3('PROFILE', image, mutateProfile);
    } else {
      mutateProfile('');
    }
  };

  return (
    <Flex direction={'column'}>
      <SubHeader>
        <img
          src={mode === 'withdraw' ? WithdrawIcon : UserIcon}
          alt="icon"
          className={mode === 'withdraw' ? 'withdraw' : 'profile'}
        />
        <span> {mode === 'withdraw' ? '회원탈퇴' : '프로필'}</span>
      </SubHeader>
      <ProfileWrap doBlur={mode === 'withdraw'}>
        {mode !== 'withdraw' && <Heading>내 프로필</Heading>}

        {mode === 'withdraw' && <WithdrawTemplate setMode={setMode} />}
        {mode === 'modify' && (
          <ProfileForm onSubmit={handleSubmit}>
            <ProfileModifier />
            <ModifyButton type={'submit'}>저장하기</ModifyButton>
          </ProfileForm>
        )}
        {mode === 'query' && (
          <Fragment>
            <ProfileViewer />
            <ModifyButton onClick={() => setMode('modify')} type={'button'}>
              수정하기
            </ModifyButton>
          </Fragment>
        )}
        {mode !== 'withdraw' && <WithdrawButton setMode={setMode} />}
      </ProfileWrap>
    </Flex>
  );
};

const ProfileViewer = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    'my-profile-query',
  ]) as ProfileQueryResp;

  const imageUrl = data?.imageUrl;
  const memberName = data?.memberName;
  const memberExplain = data?.memberExplain;

  return (
    <ProfileInfoGrid>
      <PInfoLabel>이미지</PInfoLabel>
      {imageUrl ? (
        <Suspense fallback={<FallbackImg />}>
          <LazyImage
            altText={'profile image'}
            w={80}
            maxW={80}
            h={80}
            src={imageUrl}
          />
        </Suspense>
      ) : (
        <FallbackImg />
      )}
      <PInfoLabel>이름</PInfoLabel>
      <ProfileTextValue fontWeight={700}>
        {memberName ?? '이름을 알려주세요'}
      </ProfileTextValue>

      <PInfoLabel>자기소개</PInfoLabel>
      <ProfileTextValue fontWeight={500} hasExplain={!!memberExplain}>
        {memberExplain ?? '나의 관심분야, 목표 등으로 소개글을 채워보세요!'}
      </ProfileTextValue>
    </ProfileInfoGrid>
  );
};

const ProfileModifier = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    'my-profile-query',
  ]) as ProfileQueryResp;

  const imageUrl = data?.imageUrl;
  const memberName = data?.memberName;
  const memberExplain = data?.memberExplain;

  return (
    <ProfileInfoGrid>
      <PInfoLabel>이미지</PInfoLabel>
      <ComonImageInput
        key={`${imageUrl}`}
        imageUrl={imageUrl}
        h={80}
        imageCategory={'PROFILE'}
      />

      <PInfoLabel>이름</PInfoLabel>
      <TextInput
        fontWeight={700}
        defaultValue={memberName ?? ''}
        name={'memberName'}
        placeholder={'이름을 작성해 주세요'}
        maxLength={10}
      />

      <PInfoLabel>자기소개</PInfoLabel>
      <TextInput
        fontWeight={500}
        defaultValue={memberExplain ?? ''}
        name={'memberExplain'}
        placeholder={'나의 관심분야, 목표 등으로 소개글을 채워보세요'}
        maxLength={50}
      />
    </ProfileInfoGrid>
  );
};

const WithdrawTemplateWrapper = styled.div`
  margin: 50px auto;
  width: 334px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    margin: 20px auto;
    width: 100%;
  }
`;

const LittleComonLogo = styled.img`
  width: 126px;
  height: 126px;
  object-fit: contain;
  border-radius: 50%;
  margin-bottom: 11px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
`;

const WithdrawAlarm = styled.div`
  margin-bottom: 42px;
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 20px;
  }
`;

const WithdrawLabel = styled.div`
  width: 181px;
  height: 38px;

  @media (max-width: ${breakpoints.mobile}px) {
    width: fit-content;
    height: fit-content;
  }
`;

const Desc = styled.div`
  margin-top: 26px;
  margin-bottom: 26px;
  text-align: center;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-top: 20px;
    margin-bottom: 40px;
  }
`;

const StrongWrapper = styled.div`
  margin-bottom: 48px;
  height: 64px;
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  justify-content: center;

  ul li {
    color: #b82222;
    font-size: 14px;
    line-height: 1.5;
    position: relative;
    padding-left: 12px;
    white-space: nowrap;
    line-height: 14px;
    margin: 8px 0;
  }

  ul li::before {
    content: '•';
    color: #b82222;
    font-size: 20px;
    position: absolute;
    left: -2px;
    top: -2px;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 40px;
    padding: 18px 10px;

    ul li {
      font-size: 12px;
    }

    ul li::before {
      font-size: 12px;
      left: 0;
      top: 0;
    }
  }
`;

const AgreementWrap = styled.div`
  margin-bottom: 32px;
  display: flex;
  gap: 10px;
  height: 22px;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 18px;
  }
`;

const SubmitWithdrawButton = styled.button<{ isEnabled: boolean }>`
  margin-bottom: 21px;
  display: flex;
  width: 148px;
  height: 38px;
  padding: 9px 46px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 24px;
  border: 1px solid #919191;
  background: ${(props) => (props.isEnabled ? '#EF2528' : '#e4e4e4')};

  @media (max-width: ${breakpoints.mobile}px) {
    margin-bottom: 30px;
    width: 110px;
    height: 32px;
  }
`;

const WithdrawTemplate: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  const onClickWithdraw = () => {
    const isConfirmed = window.confirm(
      '코몬을 탈퇴하시겠습니까?\n모든 정보와 게시글은 복구되지 않아요'
    );
    if (isConfirmed) {
      withdrawMember()
        .then(() => {
          sessionStorage.removeItem('Authorization');
          alert('계정 탈퇴에 성공했습니다.');
          window.location.href = '/';
        })
        .catch(() => alert('계정 탈퇴 요청에 실패했습니다.'));
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <WithdrawTemplateWrapper>
      <LittleComonLogo src={comon} />
      <WithdrawAlarm>
        <img
          src={Alarm}
          width={isMobile ? '20px' : '36px'}
          height={isMobile ? '18px' : '30px'}
          alt={'warning image'}
        />
        <WithdrawLabel>
          <SText
            fontSize={isMobile ? '18px' : '32px'}
            fontWeight={700}
            fontFamily={'Pretendard'}
            whiteSpace={'nowrap'}
          >
            회원 탈퇴 알림
          </SText>
        </WithdrawLabel>
      </WithdrawAlarm>
      <SText
        fontSize={isMobile ? '14px' : '24px'}
        fontWeight={500}
        fontFamily={'Pretendard'}
        whiteSpace={'nowrap'}
        style={{
          textDecorationLine: 'underline',
          textDecorationStyle: 'solid',
        }}
      >
        코몬 탈퇴 전에 꼭 확인하세요
      </SText>
      <Desc>
        <SText
          fontFamily={'Pretendard'}
          fontSize={isMobile ? '12px' : '15px'}
          fontWeight={500}
          lineHeight={'20px'}
        >
          탈퇴하시면 이용 중인 계정이 폐쇄되며 <br /> 모든 데이터는 복구가
          불가능합니다.
        </SText>
      </Desc>
      <StrongWrapper>
        <ul>
          <li>게시글, 프로필 등 모든 정보가 삭제됩니다.</li>
          <li>이후에는 모든정보에 접근이 불가능합니다.</li>
        </ul>
      </StrongWrapper>
      <AgreementWrap>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <SText
          color={'#777'}
          fontSize={isMobile ? '12px' : '16px'}
          fontWeight={500}
          fontFamily={'Pretendard'}
          whiteSpace={'nowrap'}
        >
          안내사항을 모두 확인하였으며, 이에 동의합니다.
        </SText>
      </AgreementWrap>
      <SubmitWithdrawButton
        isEnabled={isChecked}
        disabled={!isChecked}
        onClick={onClickWithdraw}
      >
        <SText
          whiteSpace={'nowrap'}
          color={isChecked ? '#fff' : '#919191'}
          fontSize={isMobile ? '14px' : '16px'}
          fontWeight={500}
          fontFamily={'Pretendard'}
        >
          탈퇴하기
        </SText>
      </SubmitWithdrawButton>
      <div onClick={() => setMode('query')} style={{ cursor: 'pointer' }}>
        <SText
          color={'#777'}
          fontFamily={'Pretendard'}
          fontSize={'14px'}
          fontWeight={500}
        >
          {'<'} 프로필로 돌아가기
        </SText>
      </div>
    </WithdrawTemplateWrapper>
  );
};
