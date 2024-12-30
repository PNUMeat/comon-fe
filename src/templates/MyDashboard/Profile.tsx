import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';

import { Fragment, Suspense } from 'react';

import { getMyProfile } from '@/api/user';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const SubHeader = styled.div`
  margin-top: 12px;
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
export const Profile = () => {
  const { data } = useQuery({
    queryKey: ['my-profile-query'],
    queryFn: getMyProfile,
  });
  const name = data?.memberName ?? '이름을 알려주세요';
  const desc = data?.memberExplain ?? '간단한 소개를 해주세요';
  const imgUrl = data?.imageUrl;

  return (
    <Fragment>
      <Flex direction={'column'}>
        <SubHeader>
          <span>📋</span>
          <span>프로필</span>
        </SubHeader>
        <ProfileWrap>
          <Heading>내 프로필</Heading>
          <ProfileInfoGrid>
            <PInfoLabel>이미지</PInfoLabel>
            {imgUrl ? (
              <Suspense fallback={<FallbackImg />}>
                <LazyImage
                  altText={'profile image'}
                  w={80}
                  maxW={80}
                  h={80}
                  src={imgUrl}
                />
              </Suspense>
            ) : (
              <FallbackImg />
            )}
            <PInfoLabel>이름</PInfoLabel>
            <ProfileTextValue fontWeight={700}>{name}</ProfileTextValue>

            <PInfoLabel>자기소개</PInfoLabel>
            <ProfileTextValue fontWeight={500}>{desc}</ProfileTextValue>
          </ProfileInfoGrid>
          <ModifyButton>수정하기</ModifyButton>
          {/*<SText color={'#333'} fontSize={'8px'}>*/}
          {/*  계정 탈퇴*/}
          {/*</SText>*/}
        </ProfileWrap>
      </Flex>
    </Fragment>
  );
};
