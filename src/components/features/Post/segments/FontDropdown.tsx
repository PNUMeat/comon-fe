import { useWindowWidth } from '@/hooks/useWindowWidth.ts';

import { Dropdown } from '@/components/commons/Dropdown/Dropdown';
import { DropdownItem } from '@/components/commons/Dropdown/DropdownItem';
import { SText } from '@/components/commons/SText';
import {
  FONT_FAMILY_OPTIONS,
  convertToEnglishIfIsKoreanFont,
} from '@/components/features/Post/constants';

import { useCallback } from 'react';

import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, LexicalEditor, TextFormatType } from 'lexical';

const FONT_COLOR_OPTIONS: string[] = [
  '#000',
  '#3C42E0',
  '#6E74FA',
  '#EF2528',
  '#FF377F',
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['14px', '14px'],
  ['16px', '16px'],
  ['18px', '18px'],
  ['20px', '20px'],
  ['22px', '22px'],
  ['24px', '24px'],
  ['26px', '26px'],
  ['28px', '28px'],
  ['30px', '30px'],
];

const ColorBox = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${({ color }) => color};
  border: 1px solid #cbd5e0;
  border-radius: 3px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}px) {
    width: 16px;
    height: 16px;
  }
`;

const LabelBox = styled.div<{ fontFamily: string }>`
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  box-sizing: border-box;
  font-family: ${(props) => props.fontFamily};

  // width: 100px;
  white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;

  @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

export const FontDropdown: React.FC<{
  editor: LexicalEditor;
  currentFontFamily: string;
  currentFontSize: string;
  currentFontColor: string;
  dispatchTextFormat: (command: TextFormatType) => () => void;
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isSuperscript: boolean;
  isSubscript: boolean;
}> = ({
  editor,
  currentFontFamily,
  currentFontSize,
  currentFontColor,
  dispatchTextFormat,
  isBold,
  isItalic,
  isStrikethrough,
  isSubscript,
  isSuperscript,
}) => {
  const onClick = useCallback(
    (style: string, option: string) => {
      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              [style]: option,
            });
          }
        }
      });
    },
    [editor]
  );

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  return (
    <FontFlex>
      <Dropdown
        buttonLabel={
          <LabelBox
            fontFamily={convertToEnglishIfIsKoreanFont(currentFontFamily)}
          >
            {currentFontFamily}
          </LabelBox>
        }
      >
        {FONT_FAMILY_OPTIONS.map(([option, text]) => (
          <DropdownItem
            key={option}
            onClick={() => onClick('font-family', option)}
          >
            <SText fontFamily={option}>{text}</SText>
          </DropdownItem>
        ))}
      </Dropdown>
      <Dropdown buttonLabel={<ColorBox color={currentFontColor} />}>
        {FONT_COLOR_OPTIONS.map((option) => (
          <DropdownItem
            key={option}
            onClick={() => onClick('color', option || 'black')}
          >
            <ColorBox color={option} />
          </DropdownItem>
        ))}
      </Dropdown>
      <Dropdown
        buttonLabel={
          <LabelBox fontFamily={'Pretendard'}>{currentFontSize}</LabelBox>
        }
      >
        {FONT_SIZE_OPTIONS.map(([option, text]) => (
          <DropdownItem
            key={option}
            onClick={() => onClick('font-size', option || '20px')}
          >
            <SText fontSize={text} textAlign={'left'}>
              {text}
            </SText>
          </DropdownItem>
        ))}
      </Dropdown>

      <TextFlex>
        <TextFormatButton
          onClick={dispatchTextFormat('bold')}
          isHighlighted={isBold}
          textStyle={'bold'}
        >
          B
        </TextFormatButton>
        <TextFormatButton
          onClick={dispatchTextFormat('italic')}
          isHighlighted={isItalic}
          textStyle={'italic'}
        >
          I
        </TextFormatButton>
        <TextFormatButton
          onClick={dispatchTextFormat('strikethrough')}
          isHighlighted={isStrikethrough}
          textStyle={'strikethrough'}
        >
          S
        </TextFormatButton>
        <TextFormatButton
          onClick={dispatchTextFormat('superscript')}
          isHighlighted={isSuperscript}
          textStyle={''}
        >
          <div style={{ position: 'relative' }}>
            S
            <sup
              style={{
                position: 'absolute',
                top: -4,
                fontSize: isMobile ? '6px' : '12px',
              }}
            >
              T
            </sup>
          </div>
        </TextFormatButton>
        <TextFormatButton
          onClick={dispatchTextFormat('subscript')}
          isHighlighted={isSubscript}
          textStyle={''}
        >
          <div style={{ position: 'relative' }}>
            S
            <sup
              style={{
                position: 'absolute',
                top: 11,
                fontSize: isMobile ? '6px' : '12px',
              }}
            >
              T
            </sup>
          </div>
        </TextFormatButton>
      </TextFlex>
    </FontFlex>
  );
};

const FontFlex = styled.div`
  display: flex;
  align-items: center;
  // gap: 47px;
  gap: 30px;
  // width: 360px;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 16px;
  }
`;

const TextFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 10px;
  }
`;

const TextFormatButton = styled.button<{
  isHighlighted: boolean;
  textStyle: string;
}>`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: ${({ isHighlighted }) => (isHighlighted ? '#6E74FA' : '#777')};
  font-weight: ${({ isHighlighted }) => (isHighlighted ? 700 : 500)};

  ${({ textStyle }) => textStyle === 'italic' && 'font-style: italic;'}
  ${({ textStyle }) =>
    textStyle === 'strikethrough' && 'text-decoration: line-through;'}
    
    @media (max-width: ${breakpoints.mobile}px) {
    font-size: 12px;
  }

  sup {
    vertical-align: super;
    font-size: smaller;
  }

  sub {
    vertical-align: sub;
    font-size: smaller;
  }
`;
