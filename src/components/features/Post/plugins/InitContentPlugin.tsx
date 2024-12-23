import { useEffect, useRef } from 'react';

import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection } from 'lexical';

export const InitContentPlugin: React.FC<{ content: string }> = ({
  content,
}) => {
  const isInitializedRef = useRef(true);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(content, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      const selection = $getSelection();
      if (selection && isInitializedRef.current) {
        selection.insertNodes(nodes);
        isInitializedRef.current = false;
      }
    });
  }, [editor]);

  return null;
};
