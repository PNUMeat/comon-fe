import { Wrap } from '@/components/commons/Wrap';

import { useEffect, useRef } from 'react';

import { enrollIntroductionAtom } from '@/store/enroll';
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

const EditableDiv = styled.div`
  flex: 1;
  outline: none;
  border: none;
  background: transparent;
  color: #333333;
  cursor: text;

  &:empty::before {
    content: '자신을 소개해주세요!';
    color: #cccccc;
    display: block;
  }
`;

const CharacterCount = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #cccccc;
  display: block;
  text-align: right;
  margin-top: 4px;
`;

export const ContentEditable = ({ maxLength }: { maxLength: number }) => {
  const [content, setContent] = useAtom(enrollIntroductionAtom);
  const editableRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editableRef.current) {
      const text = editableRef.current.innerText;
      setContent(text);
    }
  };

  useEffect(() => {
    if (editableRef.current) {
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

      editableRef.current.addEventListener('paste', handlePaste);

      return () => {
        editableRef.current?.removeEventListener('paste', handlePaste);
      };
    }
  }, []);

  return (
    <Wrap>
      <ContentContainer>
        <EditableDiv
          ref={editableRef}
          contentEditable="plaintext-only"
          onInput={handleInput}
          suppressContentEditableWarning={true}
        />
      </ContentContainer>
      <CharacterCount>
        {content.length}/{maxLength}자
      </CharacterCount>
    </Wrap>
  );
};
