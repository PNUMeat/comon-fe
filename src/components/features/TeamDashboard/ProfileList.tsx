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
        <Profile
          key={index}
          src={profile}
          alt={`Profile ${index + 1}`}
          size={size}
          overlap={overlap}
        />
      ))}
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Profile = styled.img<{ size: number; overlap: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: ${(props) => `-${props.overlap}px`};

  &:first-of-type {
    margin-left: 0;
  }
`;
