import styled from '@emotion/styled';
import ButtonIcon from '@/assets/EventFloating/ButtonIcon.svg';

const FloatingButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #FFD482 0%, #FF377F 100%);
  width: 65px;
  height: 65px;
  border-radius: 50%;
`;

const FloatingButtonStyle = styled.button`
width: 60px;
height: 60px;
border-radius: 50%;
background: #6E74FA;
background-image: url(${ButtonIcon});
background-repeat: no-repeat;
background-position: center;
`;



export const EventFloatingButton: React.FC = () => {
  return (
    <FloatingButtonContainer>
      <FloatingButtonStyle />
    </FloatingButtonContainer>
  );
}