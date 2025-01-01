import { Flex } from '@/components/commons/Flex';
import { ComonImageInput } from '@/components/commons/Form/ComonImageInput';
import { LazyImage } from '@/components/commons/LazyImage';

import { Fragment, Suspense, useState } from 'react';

import { changeProfile, getMyProfile } from '@/api/user';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

// margin-bottom이 하단 여백
const ProfileWrap = styled.div`
  box-sizing: border-box;
  margin-bottom: 400px;
  display: flex;

  width: 700px;
  min-height: 370px;
  padding: 32px 51px 28px 51px;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 20px;
  border: 1px solid #8488ec;

  background: #fff;

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
  font-family: 'Pretendard Variable';
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
  font-family: 'Pretendard Variable';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 33px;
`;

const ProfileInfoGrid = styled.form`
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
  font-family: 'Pretendard Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ProfileTextValue = styled.div<{ fontWeight: number }>`
  color: #333;
  leading-trim: both;
  text-edge: cap;
  font-family: 'Pretendard Variable';
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
  font-family: 'Pretendard Variable';
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
  font-family: 'Pretendard Variable';
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

export const Profile = () => {
  const { data } = useQuery({
    queryKey: ['my-profile-query'],
    queryFn: getMyProfile,
  });
  const [isModifyMode, setIsModifyMode] = useState(false);

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
        setIsModifyMode(false);
        alert('프로필 변환에 성공했습니다');
      })
      .catch(() => alert('프로필 변환에 실패했습니다'));
  };

  return (
    <Flex direction={'column'}>
      <SubHeader>
        <span>📋</span>
        <span>프로필</span>
      </SubHeader>
      <ProfileWrap>
        <Heading>내 프로필</Heading>
        {isModifyMode ? (
          <Fragment>
            <ProfileModifier {...data} onSubmit={handleSubmit} />
            <ModifyButton type={'submit'}>저장하기</ModifyButton>
          </Fragment>
        ) : (
          <Fragment>
            <ProfileViewer {...data} />
            <ModifyButton onClick={() => setIsModifyMode(true)} type={'button'}>
              수정하기
            </ModifyButton>
          </Fragment>
        )}
        {/*</form>*/}
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
  onSubmit?: (e: React.FormEvent) => void;
}> = ({ memberName, memberExplain, imageUrl, onSubmit }) => (
  <ProfileInfoGrid onSubmit={onSubmit}>
    <PInfoLabel>이미지</PInfoLabel>
    <ComonImageInput key={`${imageUrl}`} imageUrl={imageUrl} h={80} />

    <PInfoLabel>이름</PInfoLabel>
    <TextInput
      fontWeight={700}
      defaultValue={memberName ?? '홍길동'}
      name={'memberName'}
    />

    <PInfoLabel>자기소개</PInfoLabel>
    <TextInput
      fontWeight={500}
      defaultValue={
        memberExplain ?? '나의 관심분야, 목표 등으로 소개글을 채워보세요'
      }
      name={'memberExplain'}
    />
  </ProfileInfoGrid>
);
