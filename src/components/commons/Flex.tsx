import styled from '@emotion/styled';

// TODO : justify, align 속성 따로 정의해서 쓰는지?
export const Flex = styled.div<{
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  gap?: string;
  width?: number;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'stretch'};
  justify-content: ${(props) => props.justify || 'flex-start'};
  gap: ${(props) => props.gap || '0'};
  width: ${(props) => props.width ?? 100}%;
  box-sizing: border-box;
`;
