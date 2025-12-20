import { Box } from '@/components/commons/Box';

import styled from '@emotion/styled';

interface ProgressBarProps {
  progress: number; // 0 ~ 100
  width?: string;
  height?: string;
}

export const ProgressBar = ({
  progress,
  width = '100px',
  height = '8px',
}: ProgressBarProps) => {
  return (
    <Box
      width={width}
      height={height}
      borderRadius="5px"
      padding="0"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#D9D9D9',
        borderRadius: '20px',
      }}
    >
      <StyledProgress progress={progress} />
    </Box>
  );
};

const StyledProgress = styled.div<{ progress: number }>`
  position: absolute;
  left: 0;
  top: 0;

  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: #6e74fa;
  transition: width 0.3s ease;
  border-radius: 20px;
`;
