import { LazyImage } from '@/components/commons/LazyImage';

import { Suspense } from 'react';

import styled from '@emotion/styled';

interface ProfileListProps {
  profiles: string[];
  size?: number;
  overlap?: number;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  size = 24,
  overlap = 7,
}) => {
  return (
    <ProfileContainer>
      {profiles.map((profile, index) => (
        <LazyImageWrapper
          key={index}
          size={size}
          overlap={overlap}
          index={index}
        >
          <Suspense>
            <LazyImage
              src={profile}
              altText={`profile ${index + 1}`}
              w={size}
              h={size}
              maxW={size}
            />
          </Suspense>
        </LazyImageWrapper>
      ))}
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const LazyImageWrapper = styled.div<{
  size: number;
  overlap: number;
  index: number;
}>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: ${(props) => (props.index === 0 ? '0' : `-${props.overlap}px`)};
`;
