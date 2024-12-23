import { SText } from '@/components/commons/SText';
import { Tag } from '@/components/commons/Tag';
import { convertToKoreanIfIsKoreanFont } from '@/components/features/Post/constants';
import { FontDropdown } from '@/components/features/Post/segments/FontDropdown';
import { InsertImageButton } from '@/components/features/Post/segments/InsertImageButton';
import {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
  getSelectedNode,
} from '@/components/features/Post/utils';

import { Dispatch, useCallback, useEffect, useState } from 'react';

import imgIcon from '@/assets/Posting/imageIcon.svg';
import linkIcon from '@/assets/Posting/linkIcon.svg';
import styled from '@emotion/styled';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection, // CAN_REDO_COMMAND,
  // CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

const ToolbarWrap = styled.div`
  height: 44px;
  width: calc(100% - 40px);
  border-bottom: 3px solid #c2c5fb;
  padding: 0 20px;
  gap: 20px;
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

const TAG_LIST: {
  color: string;
  label: string;
}[] = [
  { color: '#6E74FA', label: '스터디 복습' },
  { color: '#C2C4FB', label: '스터디 예습' },
  { color: '#FFA379', label: '스터디' },
  { color: '#FF5780', label: '코딩 테스트' },
];

export const ToolbarPlugin: React.FC<{
  setIsLinkEditMode: Dispatch<boolean>;
  setTag?: (tag: string) => void;
}> = ({ setIsLinkEditMode, setTag }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [fontFamily, setFontFamily] = useState<string>('프리텐다드');

  const [isLink, setIsLink] = useState(false);
  // const [isBold, setIsBold] = useState(false);

  const [tag, selectTag] = useState<string>('');

  const updateToolbarOnSelect = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // setIsBold(selection.hasFormat('bold'));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      );
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
      );
      setFontFamily(
        convertToKoreanIfIsKoreanFont(
          $getSelectionStyleValueForProperty(
            selection,
            'font-family',
            '프리텐다드'
          )
        )
      );
    }
  }, [editor, activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        updateToolbarOnSelect();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbarOnSelect]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      updateToolbarOnSelect();
    });

    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbarOnSelect();
        });
      })
    );
  }, [editor, activeEditor, updateToolbarOnSelect]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
      return;
    }
    setIsLinkEditMode(false);
    activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const insertImage = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  return (
    <ToolbarWrap>
      <FontDropdown
        editor={activeEditor}
        currentFontFamily={fontFamily}
        currentFontSize={fontSize}
        currentFontColor={fontColor}
      />
      {setTag ? (
        <div
          style={{
            display: 'flex',
            width: '405px',
            gap: '13px',
            marginRight: '78px',
          }}
        >
          <SText
            whiteSpace={'nowrap'}
            color={'#CCC'}
            fontSize={'16px'}
            fontWeight={'600'}
          >
            태그 선택:
          </SText>
          {TAG_LIST.map((item) => (
            <Tag
              key={item.label}
              bgColor={item.color}
              label={item.label}
              onClick={() => {
                setTag(item.label);
                selectTag(item.label);
              }}
              isSelected={item.label === tag}
            />
          ))}
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          width: '69px',
          justifyContent: 'space-between',
        }}
      >
        <button onClick={insertLink}>
          <InsertIcon
            src={linkIcon}
            alt={'insert link button'}
            isSelected={isLink}
          />
        </button>
        <InsertImageButton
          insertImage={insertImage}
          buttonLabel={<InsertIcon src={imgIcon} alt={'insert image button'} />}
        />
      </div>
    </ToolbarWrap>
  );
};

const InsertIcon = styled.img<{ isSelected?: boolean }>`
  width: 20px;
  margin-left: 8px;
  border: ${(props) => (props.isSelected ? '1px solid #ccc' : undefined)};
`;
