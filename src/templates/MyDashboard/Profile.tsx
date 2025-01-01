import { Flex } from '@/components/commons/Flex';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';

import { Fragment, Suspense, useState } from 'react';

import { changeProfile, getMyProfile, withdrawMember } from '@/api/user';
import comon from '@/assets/Home/comon500x500.png';
import Alarm from '@/assets/Withdraw/alarm.svg';
import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
`;

const SubHeader = styled.div`
  margin-bottom: 50px;
  color: #333;
  display: flex;
  gap: 12px;
  align-items: center;

  leading-trim: both;

  text-edge: cap;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const Heading = styled.div`
  width: 100%;
  color: #333;

  leading-trim: both;

  text-edge: cap;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 33px;
`;

const ProfileInfoGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 31px;
  margin-bottom: 60px;
`;

const PInfoLabel = styled.div`
  color: #333;
  leading-trim: both;
  text-edge: cap;
  font-family: 'Pretendard';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ProfileTextValue = styled.div<{ fontWeight: number }>`
  color: #333;
  leading-trim: both;
  text-edge: cap;
  font-family: 'Pretendard';
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => props.fontWeight};
  line-height: normal;
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
`;
const FallbackImg = styled.div`
  width: 80px;
  height: 80px;
  background-color: #d9d9d9;
  border-radius: 10px;
`;

const TextInput = styled.input<{ fontWeight: number }>`
  color: #333;
  leading-trim: both;
  text-edge: cap;
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
  const { data } = useQuery({
    queryKey: ['my-profile-query'],
    queryFn: getMyProfile,
  });
  const [mode, setMode] = useState<string>('query');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: FormData = new FormData(e.target as HTMLFormElement);
    const formValues: { [key: string]: string | File | null } = {};

    formData.forEach((value, key) => {
      formValues[key] = value;
    });

    changeProfile({
      memberName: formValues['memberName'] as string,
      memberExplain: formValues['memberExplain'] as string,
      image: (formValues['image'] ?? null) as File | null,
    })
      .then(() => {
        queryClient
          .invalidateQueries({
            queryKey: ['my-profile-query'],
          })
          .then(() => {
            setMode('query');
            alert('프로필 변환에 성공했습니다');
          })
          .catch(() => alert('변환된 프로필 조회를 실패했습니다'));
      })
      .catch(() => alert('프로필 변환에 실패했습니다'));
  };

  return (
    <Flex direction={'column'}>
      <SubHeader>
        <span>📋</span>
        <span> {mode === 'withdraw' ? '회원탈퇴' : '프로필'}</span>
      </SubHeader>
      <ProfileWrap doBlur={mode === 'withdraw'}>
        {mode !== 'withdraw' && <Heading>내 프로필</Heading>}

        {mode === 'withdraw' && <WithdrawTemplate setMode={setMode} />}
        {mode === 'modify' && (
          <ProfileForm onSubmit={handleSubmit}>
            <ProfileModifier {...data} />
            <ModifyButton type={'submit'}>저장하기</ModifyButton>
          </ProfileForm>
        )}
        {mode === 'query' && (
          <Fragment>
            <ProfileViewer {...data} />
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

const ProfileViewer: React.FC<{
  imageUrl?: string;
  memberName?: string;
  memberExplain?: string;
}> = ({ memberName, memberExplain, imageUrl }) => (
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
    <ProfileTextValue fontWeight={500}>
      {memberExplain ?? '간단한 소개를 해주세요'}
    </ProfileTextValue>
  </ProfileInfoGrid>
);

const ProfileModifier: React.FC<{
  imageUrl?: string;
  memberName?: string;
  memberExplain?: string;
}> = ({ memberName, memberExplain, imageUrl }) => (
  <ProfileInfoGrid>
    <PInfoLabel>이미지</PInfoLabel>
    <ComonImageInput key={`${imageUrl}`} imageUrl={imageUrl} h={80} />

    <PInfoLabel>이름</PInfoLabel>
    <TextInput
      fontWeight={700}
      defaultValue={memberName ?? '홍길동'}
      name={'memberName'}
      maxLength={10}
    />

    <PInfoLabel>자기소개</PInfoLabel>
    <TextInput
      fontWeight={500}
      defaultValue={
        memberExplain ?? '나의 관심분야, 목표 등으로 소개글을 채워보세요'
      }
      name={'memberExplain'}
      maxLength={50}
    />
  </ProfileInfoGrid>
);

const WithdrawTemplateWrapper = styled.div`
  margin: 50px auto;
  width: 334px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LittleComonLogo = styled.img`
  width: 126px;
  height: 126px;
  object-fit: contain;
  border-radius: 50%;
  margin-bottom: 11px;
`;

const WithdrawAlarm = styled.div`
  margin-bottom: 42px;
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
`;

const WithdrawLabel = styled.div`
  width: 181px;
  height: 38px;
`;

const Desc = styled.div`
  margin-top: 26px;
  margin-bottom: 26px;
  text-align: center;
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
    color: #9e2a2f;
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
    color: #9e2a2f;
    font-size: 20px;
    position: absolute;
    left: -2px;
    top: -2px;
  }
`;

const AgreementWrap = styled.div`
  margin-bottom: 32px;
  display: flex;
  gap: 10px;
  height: 22px;
  align-items: center;
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
`;

const WithdrawTemplate: React.FC<{
  setMode: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setMode }) => {
  const onClickWithdraw = () =>
    withdrawMember()
      .then(() => {
        sessionStorage.removeItem('Authorization');
        alert('계정 탈퇴에 성공했습니다.');
        window.location.href = '/';
      })
      .catch(() => alert('계정 탈퇴 요청에 실패했습니다.'));

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <WithdrawTemplateWrapper>
      <LittleComonLogo src={comon} />
      <WithdrawAlarm>
        <img src={Alarm} width={'36px'} height={'30px'} alt={'warning image'} />
        <WithdrawLabel>
          <SText
            fontSize={'32px'}
            fontWeight={700}
            fontFamily={'Pretendard'}
            whiteSpace={'nowrap'}
          >
            회원 탈퇴 알림
          </SText>
        </WithdrawLabel>
      </WithdrawAlarm>
      <SText
        fontSize={'24px'}
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
          fontSize={'15px'}
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
          fontSize={'16px'}
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
          fontSize={'16px'}
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
