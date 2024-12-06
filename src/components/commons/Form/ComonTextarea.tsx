import { EditableDiv } from '@/components/commons/Form/segments/EditableDiv';
import { InputHelperText } from '@/components/commons/Form/segments/InputHelperText';
import { Wrap } from '@/components/commons/Wrap';

import { useEffect, useRef } from 'react';

import { currentPathAtom, formTextareaAtom } from '@/store/form';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 19px;
  border: 1px solid #cdcfff;
  border-radius: 20px;
  background: #ffffff;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: -0.32px;
  color: #333;
`;

/**
 * 상태가 매핑됨 (formTextareaAtom)
 */
export const ComonTextarea: React.FC<{
  maxLength: number;
  placeholder: string;
  value?: string;
}> = ({ maxLength, placeholder, value }) => {
  // TODO: 현재 해당 컴포넌트가 여러번 필요한 디자인이 없으므로 상태를 매핑 했다. 혹시 생긴다면 수정 필요.
  //  상태를 매핑했기 때문에 하나의 페이지에서 여러번 재사용 불가함.
  //   클린업 함수는 submit 후동작으로 넣을 것임. useEffect의 return 부분에 넣어야하는지?
  const [content, setContent] = useAtom(formTextareaAtom);
  // useAtomValue로 가져오면 리렌더링 감지 안됨
  const [path] = useAtom(currentPathAtom);
  const editableRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editableRef.current) {
      const text = editableRef.current.innerText;
      setContent(text);
    }
  };

  useEffect(() => {
    const editable = editableRef.current;
    if (editable) {
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();

        const text = e.clipboardData?.getData('text/plain');
        if (!text) {
          return;
        }

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          return;
        }

        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        if (editableRef.current) {
          const updatedText = editableRef.current.innerText;
          setContent(updatedText);
        }
      };

      editable.addEventListener('paste', handlePaste);

      return () => {
        editable?.removeEventListener('paste', handlePaste);
      };
    }
  }, []);

  useEffect(() => {
    if (editableRef.current) {
      if (value && content.trim().length == 0) {
        editableRef.current.innerText = value;
      } else {
        editableRef.current.innerText = content;
      }
    }
  }, [path, value]);

  return (
    <Wrap>
      <ContentContainer>
        <EditableDiv
          ref={editableRef}
          contentEditable="plaintext-only"
          onInput={handleInput}
          suppressContentEditableWarning={true}
          placeholder={placeholder}
        />
      </ContentContainer>
      <InputHelperText>
        {content.length}/{maxLength}자
      </InputHelperText>
    </Wrap>
  );
};
