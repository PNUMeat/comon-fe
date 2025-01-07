import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { $isCodeNode, CodeNode, getLanguageFriendlyName } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $setSelection,
  LexicalEditor,
  isHTMLElement,
} from 'lexical';

const CODE_PADDING = 8;

interface Position {
  top: string;
  right: string;
}

type AnyFunction = (...args: unknown[]) => unknown;

const debounce = <T extends AnyFunction>(
  func: T,
  wait: number,
  options: { maxWait?: number } = {}
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime: number | null = null;
  console.log(lastCallTime);

  const { maxWait } = options;

  const invokeFunc = (args: Parameters<T>) => {
    func(...args);
    lastInvokeTime = Date.now();
  };

  const debounced = (...args: Parameters<T>) => {
    const now = Date.now();

    if (!lastInvokeTime) {
      lastInvokeTime = now;
    }

    if (maxWait && now - lastInvokeTime >= maxWait) {
      if (timeout) clearTimeout(timeout);
      invokeFunc(args);
      lastCallTime = null;
      timeout = null;
      return;
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      invokeFunc(args);
      lastCallTime = null;
      timeout = null;
    }, wait);

    lastCallTime = now;
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = null;
    lastCallTime = null;
  };
  return debounced;
};

const useDebounce = <T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number
) => {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(
    () =>
      debounce(
        (...args) => {
          if (funcRef.current) {
            funcRef.current(...(args as Parameters<T>));
          }
        },
        ms,
        { maxWait }
      ),
    [ms, maxWait]
  );
};

interface Props {
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

const CopyButton = ({ editor, getCodeDOMNode }: Props) => {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

  const removeSuccess = useDebounce(() => {
    setCopyCompleted(false);
  }, 3000);

  const handleClick = async (): Promise<void> => {
    const codeDOMNode = getCodeDOMNode();

    if (!codeDOMNode) {
      return;
    }

    let content = '';

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = $getSelection();
      $setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopyCompleted(true);
      removeSuccess();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button className="menu-item" onClick={handleClick} aria-label="copy">
      {isCopyCompleted ? '복사완료!' : '복사하기'}
    </button>
  );
};

const CodeActionMenuContainer = ({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}) => {
  const [editor] = useLexicalComposerContext();

  const [lang, setLang] = useState('');
  const [isShown, setShown] = useState<boolean>(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] =
    useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    right: '0',
    top: '0',
  });
  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);

  const getCodeDOMNode = (): HTMLElement | null => {
    return codeDOMNodeRef.current;
  };

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = '';

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || '';
        }
      });
      if (codeNode) {
        const { y: editorElemY, right: editorElemRight } =
          anchorElem.getBoundingClientRect();
        const { y, right } = codeDOMNode.getBoundingClientRect();
        setLang(_lang);
        setShown(true);
        const wtf = {
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        };
        setPosition(wtf);
      }
    },
    50,
    1000
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener('mousemove', debouncedOnMouseMove);

    return () => {
      setShown(false);
      debouncedOnMouseMove.cancel();
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case 'created':
                codeSetRef.current.add(key);
                break;

              case 'destroyed':
                codeSetRef.current.delete(key);
                break;

              default:
                break;
            }
          }
        });
        setShouldListenMouseMove(codeSetRef.current.size > 0);
      },
      { skipInitialization: false }
    );
  }, [editor]);

  const codeFriendlyName = getLanguageFriendlyName(lang);

  return (
    <>
      {isShown ? (
        <div className="code-action-menu-container" style={{ ...position }}>
          <div className="code-highlight-language">{codeFriendlyName}</div>
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
        </div>
      ) : null}
    </>
  );
};

const getMouseInfo = (
  event: MouseEvent
): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} => {
  const target = event.target;

  if (target && isHTMLElement(target)) {
    const codeDOMNode = target.closest<HTMLElement>('code.codeblock');
    const isOutside = !(
      codeDOMNode ||
      target.closest<HTMLElement>('div.code-action-menu-container')
    );

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
};

export const CodeActionPlugin = ({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null => {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />,
    anchorElem
  );
};
