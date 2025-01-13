import { Dropdown } from '@/components/commons/Dropdown/Dropdown';
import { DropdownItem } from '@/components/commons/Dropdown/DropdownItem';
import { SText } from '@/components/commons/SText';
import { FONT_FAMILY_OPTIONS } from '@/components/features/Post/constants';

import { useCallback } from 'react';

import styled from '@emotion/styled';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, LexicalEditor, TextFormatType } from 'lexical';
import { breakpoints } from '@/constants/breakpoints';

const FONT_COLOR_OPTIONS: string[] = [
  '#000',
  '#3C42E0',
  '#6E74FA',
  '#EF2528',
  '#FF377F',
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['12px', '12px'],
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

const LabelBox = styled.div`
  font-size: 16px;
  height: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  box-sizing: border-box;

  // width: 100px;
  // white-space: nowrap;
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
}> = ({
  editor,
  currentFontFamily,
  currentFontSize,
  currentFontColor,
  dispatchTextFormat,
  isBold,
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

  return (
    <FontFlex>
      <Dropdown buttonLabel={<LabelBox>{currentFontFamily}</LabelBox>}>
        {FONT_FAMILY_OPTIONS.map(([option, text]) => (
          <DropdownItem
            key={option}
            onClick={() => onClick('font-family', option)}
          >
            <span>{text}</span>
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
      <Dropdown buttonLabel={<LabelBox>{currentFontSize}</LabelBox>}>
        {FONT_SIZE_OPTIONS.map(([option, text]) => (
          <DropdownItem
            key={option}
            onClick={() => onClick('font-size', option || '20px')}
          >
            <span>{text}</span>
          </DropdownItem>
        ))}
      </Dropdown>

      <button onClick={dispatchTextFormat('bold')}>
        <SText
          fontSize={'16px'}
          fontWeight={700}
          color={isBold ? '#000' : '#777'}
        >
          B
        </SText>
      </button>
    </FontFlex>
  );
};

const FontFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 47px;
  width: 360px;

  @media (max-width: ${breakpoints.mobile}px) {
    gap: 16px;
  }
`;
