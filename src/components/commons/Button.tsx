import { breakpoints } from '@/constants/breakpoints';
import { colors } from '@/constants/colors';
import styled from '@emotion/styled';

interface ButtonProps {
  backgroundColor?: string;
  padding?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  cursor?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  backgroundColor,
  padding,
  cursor,
  onClick,
  children,
}) => {
  return (
    <StyledButton
      backgroundColor={backgroundColor}
      padding={padding}
      cursor={cursor}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.padding || '5px 11px'};
  border: none;
  border-radius: 5px;
  background-color: ${(props) => props.backgroundColor || colors.buttonPurple};
  color: #fff;
  font-weight: 400;
  cursor: ${(props) => props.cursor ?? 'pointer'};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;
