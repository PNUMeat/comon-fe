import { forwardRef } from 'react';

import styled from '@emotion/styled';

const Outer = styled.button<{ size: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  box-shadow: 5px 7px 5.8px rgba(63, 64, 77, 0.07);
  transition: opacity 0.3s;
`;

const Inner = styled.div`
  top: 5px;
  left: 7px;

  width: 51px;
  height: 51px;
  border-radius: 8px;

  background-color: #f0f1ff;
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ScrollUpButton = forwardRef<
  HTMLButtonElement,
  { onClick: () => void }
>(({ onClick }, ref) => {
  return (
    <Outer size={52} onClick={onClick} ref={ref}>
      <Inner>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="14"
          viewBox="0 0 24 14"
          fill="none"
        >
          <path d="M1 13L12 2L23 13" stroke="#8488EC" strokeWidth="2" />
        </svg>
      </Inner>
    </Outer>
  );
});
