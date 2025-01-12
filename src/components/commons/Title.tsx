import styled from '@emotion/styled';

export const Title: React.FC<{ src: string; title: string }> = ({
  src,
  title,
}) => (
  <TitleStyle>
    <Icon src={src} />
    <span>{title}</span>
  </TitleStyle>
);

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
