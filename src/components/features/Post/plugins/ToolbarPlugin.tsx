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
  border-bottom: 3px solid #c2c5fb;
  padding: 0 20px;
  gap: 20px;
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

export const ToolbarPlugin: React.FC<{
  setIsLinkEditMode: Dispatch<boolean>;
}> = ({ setIsLinkEditMode }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  // const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [fontFamily, setFontFamily] = useState<string>('프리텐다드');

  const [isLink, setIsLink] = useState(false);
  // const [isBold, setIsBold] = useState(false);

  const updateToolbarOnSelect = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // setIsBold(selection.hasFormat('bold'));
      // setIsItalic(selection.hasFormat('italic'));
      // setIsUnderline(selection.hasFormat('underline'));
      // setIsStrikethrough(selection.hasFormat('strikethrough'));

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
      // activeEditor.registerEditableListener((editable) => {
      //   setIsEditable(editable);
      // }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbarOnSelect();
        });
      })
      // activeEditor.registerCommand<boolean>(
      //   CAN_UNDO_COMMAND,
      //   (payload) => {
      //     setCanUndo(payload);
      //     return false;
      //   },
      //   COMMAND_PRIORITY_CRITICAL
      // ),
      // activeEditor.registerCommand<boolean>(
      //   CAN_REDO_COMMAND,
      //   (payload) => {
      //     setCanRedo(payload);
      //     return false;
      //   },
      //   COMMAND_PRIORITY_CRITICAL
      // )
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
