import { Dropdown } from '@/components/commons/Dropdown/Dropdown';
import { DropdownItem } from '@/components/commons/Dropdown/DropdownItem';
import { Flex } from '@/components/commons/Flex';
import { FONT_FAMILY_OPTIONS } from '@/components/features/Post/constants';

import { useCallback } from 'react';

import styled from '@emotion/styled';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, LexicalEditor } from 'lexical';

const FONT_COLOR_OPTIONS: string[] = ['#FFF', '#000'];

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
`;

export const FontDropdown: React.FC<{
  editor: LexicalEditor;
  currentFontFamily: string;
  currentFontSize: string;
  currentFontColor: string;
}> = ({ editor, currentFontFamily, currentFontSize, currentFontColor }) => {
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
    <Flex align={'center'} gap={'47px'}>
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
    </Flex>
  );
};