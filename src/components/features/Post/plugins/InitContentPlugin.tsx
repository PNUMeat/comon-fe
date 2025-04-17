import { parseHtmlStrToLexicalNodes } from '@/components/features/Post/plugins/utils.ts';

import { useEffect, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection } from 'lexical';

export const InitContentPlugin: React.FC<{ content: string }> = ({
  content,
}) => {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      return editor.update(() => {
        const nodes = parseHtmlStrToLexicalNodes(content);
        $getRoot().clear().select();
        const selection = $getSelection();
        if (selection) {
          selection.insertNodes(nodes);
          setInitialized(true);
        }
      });
    }
  }, [editor]);

  return null;
};
