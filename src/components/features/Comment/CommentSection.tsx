import { viewStyle } from '@/utils/viewStyle';

import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import Modal from '@/components/commons/Modal/Modal';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from '@/components/features/Post/nodes/ImageNode';
import { HighlightCodePlugin } from '@/components/features/Post/plugins/HighlightCodePlugin';
import { ImagePlugin } from '@/components/features/Post/plugins/ImagePlugin';
import { SHORTCUTS } from '@/components/features/Post/plugins/markdownShortcuts';
import { INSERT_IMAGE_COMMAND } from '@/components/features/Post/utils';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { uploadImages } from '@/api/image';
import {
  createArticleComment,
  deleteArticleComment,
  getArticleComments,
  mutateArticleComment,
} from '@/api/postings';
import DeleteIcon from '@/assets/TeamDashboard/deleteIcon.png';
import ModifyIcon from '@/assets/TeamDashboard/modifyIcon.png';
import { colors } from '@/constants/colors';
import { isLoggedInAtom, profileAtom } from '@/store/auth';
import styled from '@emotion/styled';
import {
  $createCodeNode,
  $isCodeNode,
  CodeHighlightNode,
  CodeNode,
} from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  ElementTransformer,
} from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  EditorThemeClasses,
  KEY_ENTER_COMMAND,
} from 'lexical';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';

interface CommentSectionProps {
  articleId: number;
}

interface CommentInlineEditorProps {
  editorKey: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onUploadingChange?: (status: boolean) => void;
}

const MAX_COMMENT_LENGTH = 300;
const COMMENT_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;
const getResponsiveImageMaxWidth = () => {
  if (typeof window === 'undefined') return 600;
  return Math.max(280, window.innerWidth - 48);
};

const blobToFile = async (src: string, index: number) => {
  const response = await fetch(src);
  const blob = await response.blob();
  const ext = blob.type.split('/')[1] || 'png';
  return new File([blob], `comment-image-${Date.now()}-${index}.${ext}`, {
    type: blob.type || 'image/png',
  });
};

const replaceTemporaryImageUrls = async (markdown: string) => {
  const matches = Array.from(markdown.matchAll(COMMENT_IMAGE_REGEX));
  if (matches.length === 0) return markdown;

  const tempMatches = matches.filter((match) => {
    const url = match[2]?.trim() ?? '';
    return url.startsWith('blob:') || url.startsWith('data:image/');
  });

  if (tempMatches.length === 0) return markdown;

  const files = await Promise.all(
    tempMatches.map((match, index) => blobToFile(match[2].trim(), index))
  );
  const uploadedUrls = await uploadImages({
    files,
    category: 'ARTICLE',
  });

  const replacementByIndex = new Map<number, string>();
  tempMatches.forEach((match, index) => {
    const matchIndex = match.index;
    if (matchIndex === undefined) return;
    const altText = match[1] ?? `comment-image-${index + 1}`;
    replacementByIndex.set(matchIndex, `![${altText}](${uploadedUrls[index]})`);
  });

  tempMatches.forEach((match) => {
    const url = match[2]?.trim() ?? '';
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });

  let cursor = 0;
  let result = '';
  matches.forEach((match) => {
    const start = match.index ?? 0;
    const original = match[0];
    const end = start + original.length;
    result += markdown.slice(cursor, start);
    result += replacementByIndex.get(start) ?? original;
    cursor = end;
  });
  result += markdown.slice(cursor);

  return result;
};

const IMAGE_MARKDOWN_TRANSFORMER: ElementTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) return null;
    return `![${node.getAltText()}](${node.getSrc()})`;
  },
  regExp: /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/,
  replace: (parentNode, _children, match) => {
    const [, altText, src] = match;
    const imageNode = $createImageNode({
      altText: altText || 'image',
      maxWidth: getResponsiveImageMaxWidth(),
      src,
    });
    parentNode.replace(imageNode);
  },
  type: 'element',
};

const COMMENT_SHORTCUTS = [IMAGE_MARKDOWN_TRANSFORMER, ...SHORTCUTS];

const commentEditorTheme: EditorThemeClasses = {
  image: 'editor-image',
  link: 'editor-link',
  list: {
    nested: {
      listitem: 'nested',
    },
    listitem: 'editor-listitem',
  },
  quote: 'editor-quote',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
  },
  code: 'codeblock',
  codeHighlight: {
    atrule: 'o',
    attr: 'o',
    boolean: 'p',
    builtin: 'q',
    cdata: 'r',
    char: 'q',
    class: 's',
    'class-name': 's',
    comment: 'r',
    constant: 'p',
    deleted: 'p',
    doctype: 'r',
    entity: 't',
    function: 's',
    important: 'u',
    inserted: 'q',
    keyword: 'o',
    namespace: 'u',
    number: 'p',
    operator: 't',
    prolog: 'r',
    property: 'p',
    punctuation: 'v',
    regex: 'u',
    selector: 'q',
    string: 'q',
    symbol: 'p',
    tag: 'p',
    url: 't',
    variable: 'u',
  },
};

const commentEditorConfig = {
  namespace: 'comment-section',
  onError: (error: Error) => console.error(error),
  theme: commentEditorTheme,
  nodes: [
    ImageNode,
    AutoLinkNode,
    LinkNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
  ],
};

const MarkdownStatePlugin = ({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (value: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const isApplyingExternalValue = useRef(false);

  useEffect(() => {
    const nextValue = initialValue ?? '';

    editor.getEditorState().read(() => {
      const currentValue = $convertToMarkdownString(COMMENT_SHORTCUTS);
      if (currentValue === nextValue) return;

      isApplyingExternalValue.current = true;
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (nextValue.trim()) {
          $convertFromMarkdownString(nextValue, COMMENT_SHORTCUTS);
        }
        if (!root.getFirstChild()) {
          root.append($createParagraphNode());
        }
        root.selectEnd();
      });
    });
  }, [editor, initialValue]);

  return (
    <OnChangePlugin
      ignoreSelectionChange
      onChange={(editorState) => {
        if (isApplyingExternalValue.current) {
          isApplyingExternalValue.current = false;
          return;
        }
        editorState.read(() => {
          onChange($convertToMarkdownString(COMMENT_SHORTCUTS));
        });
      }}
    />
  );
};

const ImagePasteDropPlugin = ({
  onUploadingChange,
}: {
  onUploadingChange?: (status: boolean) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const insertTemporaryImages = (files: File[]) => {
      if (files.length === 0) return;
      onUploadingChange?.(false);
      editor.update(() => {
        files.forEach((file, index) => {
          const blobUrl = URL.createObjectURL(file);
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: `comment-image-${index + 1}`,
            maxWidth: getResponsiveImageMaxWidth(),
            src: blobUrl,
          });
        });
      });
    };

    const removeRootListener = editor.registerRootListener((root, prevRoot) => {
      if (prevRoot) {
        prevRoot.onpaste = null;
        prevRoot.ondrop = null;
        prevRoot.ondragover = null;
      }

      if (!root) return;

      root.onpaste = (event: ClipboardEvent) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter(
          (file) => file.type.startsWith('image/')
        );

        if (files.length === 0) return;
        event.preventDefault();
        insertTemporaryImages(files);
      };

      root.ondrop = (event: DragEvent) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter(
          (file) => file.type.startsWith('image/')
        );

        if (files.length === 0) return;
        event.preventDefault();
        insertTemporaryImages(files);
      };

      root.ondragover = (event: DragEvent) => {
        event.preventDefault();
      };
    });

    return () => {
      removeRootListener();
    };
  }, [editor, onUploadingChange]);

  return null;
};

const CodeFencePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        let handled = false;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

          const anchorNode = selection.anchor.getNode();
          const topLevelNode = anchorNode.getTopLevelElementOrThrow();

          if ($isParagraphNode(topLevelNode)) {
            const text = topLevelNode.getTextContent();
            const openMatch = text.match(/^[ \t]*```(\w+)?[ \t]*$/);
            if (!openMatch) return;

            const language = openMatch[1] || 'javascript';
            const codeNode = $createCodeNode(language);
            topLevelNode.replace(codeNode);
            codeNode.selectEnd();
            handled = true;
            return;
          }

          if ($isCodeNode(topLevelNode)) {
            const codeText = topLevelNode.getTextContent().replace(/\r/g, '');
            const closeMatch = codeText.match(/(?:^|\n)```[ \t]*$/);
            if (!closeMatch) return;
            const closeIndex = closeMatch.index ?? codeText.length;

            const nextCodeText = codeText
              .slice(0, closeIndex)
              .replace(/\n$/, '');

            topLevelNode.clear();
            if (nextCodeText.length > 0) {
              topLevelNode.append($createTextNode(nextCodeText));
            }

            const paragraphNode = $createParagraphNode();
            topLevelNode.insertAfter(paragraphNode);
            paragraphNode.selectStart();
            handled = true;
          }
        });

        if (handled) {
          event?.preventDefault();
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
};

const CommentInlineEditor = ({
  editorKey,
  value,
  onChange,
  placeholder,
  readOnly = false,
  onFocus,
  onBlur,
  onUploadingChange,
}: CommentInlineEditorProps) => {
  const emptyPlaceholder: (isEditable: boolean) => null = () => null;

  const initialConfig = useMemo(
    () => ({
      ...commentEditorConfig,
      editable: !readOnly,
    }),
    [readOnly]
  );

  return (
    <LexicalComposer initialConfig={initialConfig} key={editorKey}>
      <RichTextPlugin
        contentEditable={
          <StyledContentEditable
            aria-placeholder={placeholder}
            placeholder={emptyPlaceholder}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        }
        placeholder={<EditorPlaceholder>{placeholder}</EditorPlaceholder>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LinkPlugin />
      <ListPlugin />
      <TabIndentationPlugin />
      <MarkdownShortcutPlugin transformers={COMMENT_SHORTCUTS} />
      <CodeFencePlugin />
      <HighlightCodePlugin />
      <ImagePlugin />
      <MarkdownStatePlugin initialValue={value} onChange={onChange} />
      {!readOnly && (
        <ImagePasteDropPlugin onUploadingChange={onUploadingChange} />
      )}
    </LexicalComposer>
  );
};

export const CommentSection = ({ articleId }: CommentSectionProps) => {
  const queryClient = useQueryClient();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const profile = useAtomValue(profileAtom);

  const [newComment, setNewComment] = useState('');
  const [newEditorVersion, setNewEditorVersion] = useState(0);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingEditorVersion, setEditingEditorVersion] = useState(0);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isUploadingNewImages, setIsUploadingNewImages] = useState(false);
  const [isUploadingEditImages, setIsUploadingEditImages] = useState(false);

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['article-comments', articleId],
    queryFn: ({ pageParam = 0 }) => getArticleComments(articleId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage.data.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
  });

  const commentItems =
    commentsData?.pages.flatMap((page) => page.data.content) ?? [];
  const totalElements = commentsData?.pages[0]?.data.page.totalElements ?? 0;

  const sortedComments =
    sortOrder === 'latest' ? [...commentItems].reverse() : commentItems;

  const createCommentMutation = useMutation({
    mutationFn: (description: string) =>
      createArticleComment(articleId, { description }),
    onSuccess: () => {
      setNewComment('');
      setNewEditorVersion((prev) => prev + 1);
      queryClient.invalidateQueries({
        queryKey: ['article-comments', articleId],
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      deleteArticleComment(articleId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article-comments', articleId],
      });
    },
  });

  const modifyCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      description,
    }: {
      commentId: number;
      description: string;
    }) => mutateArticleComment(articleId, commentId, { description }),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingText('');
      setEditingEditorVersion((prev) => prev + 1);
      queryClient.invalidateQueries({
        queryKey: ['article-comments', articleId],
      });
    },
  });

  const handleCreateComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !isLoggedIn) return;

    try {
      setIsUploadingNewImages(true);
      const normalized = await replaceTemporaryImageUrls(trimmed);
      await createCommentMutation.mutateAsync(normalized);
    } catch {
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploadingNewImages(false);
    }
  };

  const handleStartEdit = (commentId: number, description: string) => {
    setEditingCommentId(commentId);
    setEditingText(description);
    setEditingEditorVersion((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleConfirmEdit = async (commentId: number) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    try {
      setIsUploadingEditImages(true);
      const normalized = await replaceTemporaryImageUrls(trimmed);
      await modifyCommentMutation.mutateAsync({
        commentId,
        description: normalized,
      });
    } catch {
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploadingEditImages(false);
    }
  };

  const createLengthExceeded = newComment.length > MAX_COMMENT_LENGTH;
  const editLengthExceeded = editingText.length > MAX_COMMENT_LENGTH;

  const isCreateDisabled =
    !isLoggedIn ||
    !newComment.trim() ||
    isUploadingNewImages ||
    createLengthExceeded;

  const isEditDisabled =
    !editingText.trim() || isUploadingEditImages || editLengthExceeded;

  return (
    <CommentSectionWrapper>
      <SectionHeader>
        <SText fontSize="14px" fontWeight={600} color="#6E74FA">
          댓글 {totalElements}
        </SText>
        <SortGroup>
          <SortButton
            type="button"
            active={sortOrder === 'latest'}
            onClick={() => setSortOrder('latest')}
          >
            최신순
          </SortButton>
          <SortButton
            type="button"
            active={sortOrder === 'oldest'}
            onClick={() => setSortOrder('oldest')}
          >
            오래된순
          </SortButton>
        </SortGroup>
      </SectionHeader>
      <CommentList>
        {sortedComments.map((comment) => {
          const isOwner =
            !!profile && comment.memberName === profile.memberName;
          const isEditing = editingCommentId === comment.commentId;

          return (
            <CommentCard key={comment.commentId}>
              <Flex justify="space-between" align="center">
                <Flex align="center" gap="10px" flex={1}>
                  <AvatarCircle>
                    {comment.memberImageUrl ? (
                      <AvatarImage src={comment.memberImageUrl} alt="" />
                    ) : (
                      comment.memberName?.[0]
                    )}
                  </AvatarCircle>
                  <Flex flex={1} align="center">
                    <SText fontSize="13px" fontWeight={600} color="#111">
                      {comment.memberName}
                    </SText>
                  </Flex>
                  <SText fontSize="11px" color="#999">
                    {!comment.isDeleted && formatDateTime(comment.createdAt)}
                  </SText>
                </Flex>

                {isOwner && !isEditing && !comment.isDeleted && (
                  <CommentActions>
                    <img
                      src={ModifyIcon}
                      alt="수정"
                      width={12}
                      height={12}
                      onClick={() =>
                        handleStartEdit(comment.commentId, comment.description)
                      }
                    />
                    <img
                      src={DeleteIcon}
                      alt="삭제"
                      width={12}
                      height={12}
                      onClick={() => setDeleteTargetId(comment.commentId)}
                    />
                  </CommentActions>
                )}
              </Flex>

              <Spacer h={12} />

              {comment.isDeleted ? (
                <SText fontSize="13px" color="#bbb" lineHeight="20px">
                  삭제된 댓글입니다.
                </SText>
              ) : isEditing ? (
                <>
                  <EditEditorWrapper>
                    <CommentInlineEditor
                      editorKey={`edit-${comment.commentId}-${editingEditorVersion}`}
                      value={editingText}
                      onChange={setEditingText}
                      onUploadingChange={setIsUploadingEditImages}
                      placeholder="댓글을 수정해 주세요"
                    />
                  </EditEditorWrapper>
                  <Spacer h={6} />
                  <CommentHelperText>
                    {isUploadingEditImages
                      ? '이미지 업로드 중...'
                      : `${editingText.length}/${MAX_COMMENT_LENGTH}`}
                  </CommentHelperText>
                  {editLengthExceeded && (
                    <CommentWarningText>
                      댓글은 최대 {MAX_COMMENT_LENGTH}자까지 저장할 수 있어요.
                    </CommentWarningText>
                  )}
                  <Spacer h={8} />
                  <EditButtons>
                    <TextButton type="button" onClick={handleCancelEdit}>
                      취소
                    </TextButton>
                    <Button
                      backgroundColor={
                        isEditDisabled ? '#E4E5F7' : colors.buttonPurple
                      }
                      cursor={isEditDisabled ? 'not-allowed' : 'pointer'}
                      onClick={
                        isEditDisabled
                          ? undefined
                          : () => handleConfirmEdit(comment.commentId)
                      }
                    >
                      <SText fontSize="12px" fontWeight={700} color="#fff">
                        완료
                      </SText>
                    </Button>
                  </EditButtons>
                </>
              ) : (
                <CommentMarkdown>
                  <ReactMarkdown
                    skipHtml
                    urlTransform={transformMarkdownUrl}
                    components={{
                      pre: ({ children }) => <>{children}</>,
                      code: ({ className, children, ...props }) => {
                        const codeText = String(children ?? '')
                          .replace(/\r\n/g, '\n')
                          .replace(/\r/g, '\n')
                          .replace(/\n$/, '');

                        const isInline = !className;

                        if (isInline) {
                          return (
                            <code {...props} className={className}>
                              {children}
                            </code>
                          );
                        }

                        const language = className?.replace('language-', '');

                        const normalizedLanguage =
                          language && Prism.languages[language]
                            ? language
                            : 'javascript';

                        const highlighted = Prism.highlight(
                          codeText,
                          Prism.languages[normalizedLanguage],
                          normalizedLanguage
                        );

                        const gutter =
                          codeText
                            .split('\n')
                            .map((_, index) => index + 1)
                            .join('\n') || '1';

                        return (
                          <pre className="codeblock" data-gutter={gutter}>
                            <code
                              dangerouslySetInnerHTML={{ __html: highlighted }}
                            />
                          </pre>
                        );
                      },
                    }}
                  >
                    {comment.description}
                  </ReactMarkdown>
                </CommentMarkdown>
              )}
            </CommentCard>
          );
        })}

        {commentItems.length === 0 && (
          <EmptyState>
            <SText fontSize="13px" color="#999">
              아직 댓글이 없어요. 첫 댓글을 남겨보세요!
            </SText>
          </EmptyState>
        )}

        {hasNextPage && (
          <MoreButton
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '불러오는 중...' : '댓글 더보기'}
          </MoreButton>
        )}
      </CommentList>

      <Spacer h={32} />

      <SText fontSize="16px" fontWeight={600} color="#6E74FA">
        작성하기
      </SText>

      <EditorWrapper
        isFocused={isEditorFocused}
        disabled={!isLoggedIn}
        onClick={() => {
          if (!isLoggedIn) return;
        }}
      >
        <CommentInlineEditor
          editorKey={`create-${newEditorVersion}`}
          value={newComment}
          onChange={setNewComment}
          onUploadingChange={setIsUploadingNewImages}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          readOnly={!isLoggedIn}
          placeholder={
            isLoggedIn
              ? '더 좋은 풀이 방법이나 응원의 메시지를 남겨주세요!'
              : '댓글을 작성하려면 로그인해 주세요.'
          }
        />
        <Spacer h={8} />
        <CommentHelperText>
          {isUploadingNewImages
            ? '이미지 업로드 중...'
            : `${newComment.length}/${MAX_COMMENT_LENGTH}`}
        </CommentHelperText>
        {createLengthExceeded && (
          <CommentWarningText>
            댓글은 최대 {MAX_COMMENT_LENGTH}자까지 저장할 수 있어요.
          </CommentWarningText>
        )}
        <Spacer h={12} />
        <Flex align="center" justify="flex-end">
          <Button
            padding="5px 11px"
            backgroundColor={isCreateDisabled ? '#E4E5F7' : colors.buttonPurple}
            cursor={isCreateDisabled ? 'not-allowed' : 'pointer'}
            onClick={isCreateDisabled ? undefined : handleCreateComment}
          >
            <SText fontSize="12px" fontWeight={700} color="#fff">
              댓글 달기
            </SText>
          </Button>
        </Flex>
      </EditorWrapper>

      <Spacer h={24} />

      <Modal
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        height={168}
      >
        <DeleteModalContent>
          <DeleteModalMessage>댓글을 삭제할까요?</DeleteModalMessage>
          <DeleteModalDescription>
            삭제 후에는 다시 되돌릴 수 없어요.
          </DeleteModalDescription>
          <DeleteModalButtons>
            <DeleteCancelButton
              type="button"
              onClick={() => setDeleteTargetId(null)}
            >
              취소
            </DeleteCancelButton>
            <DeleteConfirmButton
              type="button"
              onClick={() => {
                if (deleteTargetId === null) return;
                deleteCommentMutation.mutate(deleteTargetId);
                setDeleteTargetId(null);
              }}
            >
              삭제하기
            </DeleteConfirmButton>
          </DeleteModalButtons>
        </DeleteModalContent>
      </Modal>
    </CommentSectionWrapper>
  );
};

const CommentSectionWrapper = styled.div`
  margin-top: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SortGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortButton = styled.button<{ active: boolean }>`
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => (props.active ? colors.buttonPurple : '#C2C5FB')};
  cursor: pointer;
`;

const EditorWrapper = styled.div<{ isFocused: boolean; disabled: boolean }>`
  margin-top: 10px;
  padding: 20px 35px;
  position: relative;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #ffffff;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  box-sizing: border-box;
`;

const StyledContentEditable = styled(ContentEditable)`
  position: relative;
  padding: 8px;
  width: 100%;
  min-height: 80px;
  border: none;
  border-radius: 8px;
  resize: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  ${viewStyle}

  h1 {
    font-size: 22px;
  }

  h2 {
    font-size: 19px;
  }

  h3 {
    font-size: 17px;
  }

  h4,
  h5,
  h6 {
    font-size: 15px;
  }

  .codeblock {
    max-width: 100%;
  }

  img {
    display: block;
    max-width: 100% !important;
    height: auto;
    border-radius: 8px;
    margin: 8px 0;
    box-shadow: 0px 6px 16px 0px #30314314;
  }
`;

const EditorPlaceholder = styled.div`
  position: absolute;
  pointer-events: none;
  user-select: none;
  color: ${colors.borderPurple};
  font-size: 14px;
  left: 42px;
  top: 30px;
`;

const EditEditorWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  border: 1px solid ${colors.borderPurple};
  padding: 10px 12px;
  box-sizing: border-box;
`;

const CommentHelperText = styled.p`
  font-size: 12px;
  color: #8c90e8;
`;

const CommentWarningText = styled.p`
  font-size: 12px;
  color: #ef2528;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentCard = styled.div`
  padding: 16px 18px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 6px 20px 0px #3031430f;
`;

const AvatarCircle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${colors.headerPurple};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  color: #666;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-left: 20px;
`;

const TextButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 12px;
  color: #777;
  cursor: pointer;

  &:hover {
    color: ${colors.buttonPurple};
  }
`;

const CommentMarkdown = styled.div`
  color: #333;
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: break-word;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 8px 0;
    color: #222;
    line-height: 1.45;
  }

  h1 {
    font-size: 18px;
  }

  h2 {
    font-size: 16px;
  }

  h3 {
    font-size: 15px;
  }

  h4,
  h5,
  h6 {
    font-size: 14px;
  }

  p {
    margin: 6px 0;
  }

  ul,
  ol {
    margin: 6px 0;
    padding-left: 20px;
  }

  blockquote {
    margin: 8px 0;
    padding: 4px 0 4px 10px;
    border-left: 3px solid #d5d7ff;
    color: #5a5f8d;
  }

  code {
    background: #f5f6ff;
    border-radius: 4px;
    padding: 0 4px;
    font-size: 12px;
    font-family: 'Consolas', 'Monaco', monospace;
  }

  pre {
    margin: 10px 0;
    padding: 10px 12px;
    border-radius: 8px;
    background: #f5f6ff;
    overflow-x: auto;
  }

  .codeblock {
    background-color: #f8f6f2;
    font-family: Menlo, Consolas, Monaco, monospace;
    display: block;
    border-radius: 0;
    padding: 8px 8px 8px 52px;
    line-height: 1.53;
    max-width: 100%;
    font-size: 13px;
    margin: 8px 0;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    tab-size: 2;
    white-space: pre;
  }

  .codeblock:before {
    content: attr(data-gutter);
    position: absolute;
    background-color: #eee;
    left: 0;
    top: 0;
    border-right: 1px solid #ccc;
    padding: 8px;
    color: #777;
    white-space: pre-wrap;
    text-align: right;
    min-width: 25px;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata,
  .r {
    color: slategray;
  }

  .token.punctuation,
  .v {
    color: #999;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted,
  .p {
    color: #905;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted,
  .q {
    color: #690;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .token.variable,
  .t {
    color: #9a6e3a;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword,
  .o {
    color: #07a;
  }

  .token.function,
  .token.class-name,
  .s {
    color: #dd4a68;
  }

  .token.regex,
  .token.important,
  .u {
    color: #e90;
  }

  pre code {
    padding: 0;
    background: transparent;
    border-radius: 0;
    font-size: 12px;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 8px 0;
    box-shadow: 0px 6px 16px 0px #30314314;
  }

  a {
    color: #4e56dd;
    text-decoration: underline;
  }
`;

const EditButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const MoreButton = styled.button`
  border: none;
  border-radius: 8px;
  background-color: #f8f8ff;
  font-size: 14px;
  text-decoration: underline;
  font-weight: 500;
  color: #b2b5fb;
  cursor: pointer;
`;

const EmptyState = styled.div`
  padding: 24px 18px;
  border-radius: 16px;
  background-color: #f8f8ff;
  text-align: center;
`;

const DeleteModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DeleteModalMessage = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin-top: 32px;
  color: #333;
`;

const DeleteModalDescription = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin-top: 8px;
  color: #ef2528;
`;

const DeleteModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 22px auto;
  gap: 16px;
`;

const DeleteCancelButton = styled.button`
  width: 110px;
  height: 38px;
  background-color: #d9d9d9;
  border-radius: 40px;
  font-size: 14px;
`;

const DeleteConfirmButton = styled.button`
  width: 110px;
  height: 38px;
  background-color: #ef2528;
  color: #fff;
  border-radius: 40px;
  font-size: 14px;
`;

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) return isoString;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${y}.${m}.${d} ${h}:${min}`;
};

const transformMarkdownUrl = (url: string) => {
  if (!url) return '';

  if (url.startsWith('/')) return url;

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    return '';
  } catch {
    return '';
  }
};
