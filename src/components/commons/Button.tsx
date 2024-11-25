import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface ButtonProps {
  backgroundColor?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  backgroundColor,
  onClick,
  children,
}) => {
  return (
    <StyledButton backgroundColor={backgroundColor} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 11px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.backgroundColor || colors.buttonPurple};
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
