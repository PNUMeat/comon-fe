import { useWindowWidth } from '@/hooks/useWindowWidth';

import { SText } from '@/components/commons/SText';
import { Tag } from '@/components/commons/Tag';
import { convertToKoreanIfIsKoreanFont } from '@/components/features/Post/constants';
import { parseHtmlStrToLexicalNodes } from '@/components/features/Post/plugins/InitContentPlugin.tsx';
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
import { breakpoints } from '@/constants/breakpoints';
import styled from '@emotion/styled';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from 'lexical';

const ToolbarWrap = styled.div`
  height: 44px;
  width: calc(100% - 40px);
  border-bottom: 3px solid #c2c5fb;
  padding: 0 20px 10px 20px;
  gap: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    border-bottom: none;
    padding: 0 8px;
    height: auto;
    width: 100%;
    box-sizing: border-box;
  }
`;

const HorizontalLine = styled.div`
  height: 1px;
  background-color: #c2c5fb;
  width: 100%;
`;

const TAG_LIST: {
  color: string;
  label: string;
}[] = [
  { color: '#FF5780', label: '코딩 테스트' },
  { color: '#6E74FA', label: '스터디 복습' },
  { color: '#C2C4FB', label: '스터디 예습' },
  { color: '#FFA379', label: '스터디' },
];

export const ToolbarPlugin: React.FC<{
  setIsLinkEditMode: Dispatch<boolean>;
  setTag?: (tag: string) => void;
  articleCategory?: string;
}> = ({ setIsLinkEditMode, setTag, articleCategory }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [fontFamily, setFontFamily] = useState<string>('프리텐다드');

  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [tag, selectTag] = useState<string>(() => articleCategory ?? '');

  const updateToolbarOnSelect = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

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

  const insertTemplate = useCallback(() => {
    editor.update(() => {
      $getRoot().select();
      const nodes = parseHtmlStrToLexicalNodes(template);

      const selection = $getSelection();
      if (selection) {
        selection.insertNodes(nodes);
      }
    });
  }, [editor]);

  const insertImage = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  const dispatchTextFormat = (command: TextFormatType) => () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  const width = useWindowWidth();
  const isMobile = width <= breakpoints.mobile;

  if (isMobile) {
    return (
      <ToolbarWrap>
        {setTag ? (
          <>
            <div
              style={{
                display: 'flex',
                width: '405px',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              <SText
                whiteSpace={'nowrap'}
                color={'#CCC'}
                fontSize={'10px'}
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
                  fontSize={'6px'}
                  padding={'2px 4px'}
                  height="12px"
                />
              ))}
            </div>
            <HorizontalLine />
          </>
        ) : (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <TemplateButton onClick={insertTemplate}>탬플릿</TemplateButton>
            </div>
            )}

        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            gap: '20px',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <FontDropdown
            editor={activeEditor}
            currentFontFamily={fontFamily}
            currentFontSize={fontSize}
            currentFontColor={fontColor}
            dispatchTextFormat={dispatchTextFormat}
            isBold={isBold}
            isItalic={isItalic}
            isStrikethrough={isStrikethrough}
          />
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              gap: '10px',
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
              buttonLabel={
                <InsertIcon src={imgIcon} alt={'insert image button'} />
              }
            />
          </div>
        </div>
        <HorizontalLine />
      </ToolbarWrap>
    );
  }

  return (
    <ToolbarWrap>
      <FontDropdown
        editor={activeEditor}
        currentFontFamily={fontFamily}
        currentFontSize={fontSize}
        currentFontColor={fontColor}
        dispatchTextFormat={dispatchTextFormat}
        isBold={isBold}
        isItalic={isItalic}
        isStrikethrough={isStrikethrough}
      />
      {setTag ? (
        <div
          style={{
            display: 'flex',
            width: '405px',
            gap: '13px',
            // marginRight: '78px',
            alignItems: 'center',
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
              fontSize={'10px'}
              padding={'6px 10px'}
              height="16px"
            />
          ))}
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          width: setTag ? '69px' : '169px',
          justifyContent: 'space-between',
        }}
      >
        {!setTag && (
          <TemplateButton onClick={insertTemplate}>탬플릿</TemplateButton>
        )}
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
            buttonLabel={
              <InsertIcon src={imgIcon} alt={'insert image button'} />
            }
          />
        </div>
      </div>
    </ToolbarWrap>
  );
};

const InsertIcon = styled.img<{ isSelected?: boolean }>`
  width: 20px;
  margin-left: 8px;
  border: ${(props) => (props.isSelected ? '1px solid #ccc' : undefined)};

  @media (max-width: ${breakpoints.mobile}px) {
    width: 16px;
    margin-left: 5px;
  }
`;

const TemplateButton = styled.button`
  border-radius: 4px;
  background: #cdcfff;
  color: #6e74fa;
  display: grid;
  place-items: center;
  width: 69px;
  height: 28px;
  flex-shrink: 0;

  font-family: 'Pretendard';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const template =
  '<p dir="ltr"><span class="editor-text-bold" style="">제목</span></p><p dir="ltr"><span style="">( 1/1 - class_ : 백준 )</span></p><p><br></p><p><br></p><p dir="ltr"><span class="editor-text-bold" style="">문제 유형</span></p><p><br></p><p><br></p><p dir="ltr"><span class="editor-text-bold" style="">풀이 방법 도출</span></p><ol><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ol><p dir="ltr"><br></p><p><br></p><p dir="ltr"><span class="editor-text-bold" style="">시간 복잡도</span></p><ul><li value="1" class="editor-listitem"></li><li value="2" class="editor-listitem"></li></ul><p><br></p><p dir="ltr"><span class="editor-text-bold" style="">핵심 코드 삽입 및 설명</span></p><p><br></p><p dir="ltr"><br></p>';
