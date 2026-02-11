import { Button } from '@/components/commons/Button';
import { Flex } from '@/components/commons/Flex';
import Modal from '@/components/commons/Modal/Modal';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useState } from 'react';

import {
  createArticleComment,
  deleteArticleComment,
  getArticleComments,
  mutateArticleComment,
} from '@/api/postings';
import { colors } from '@/constants/colors';
import { isLoggedInAtom, profileAtom } from '@/store/auth';
import styled from '@emotion/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

interface CommentSectionProps {
  articleId: number;
}

export const CommentSection = ({ articleId }: CommentSectionProps) => {
  const queryClient = useQueryClient();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const profile = useAtomValue(profileAtom);

  const [newComment, setNewComment] = useState('');
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { data: commentsResp } = useQuery({
    queryKey: ['article-comments', articleId],
    queryFn: () => getArticleComments(articleId),
  });

  const commentItems = commentsResp?.data.comments ?? [];

  const sortedComments =
    sortOrder === 'latest' ? [...commentItems].slice().reverse() : commentItems;

  console.log('articleId', articleId);

  const createCommentMutation = useMutation({
    mutationFn: (description: string) =>
      createArticleComment(articleId, { description }),
    onSuccess: () => {
      setNewComment('');
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
      queryClient.invalidateQueries({
        queryKey: ['article-comments', articleId],
      });
    },
  });

  const handleCreateComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed || !isLoggedIn) return;

    createCommentMutation.mutate(trimmed);
  };

  const handleStartEdit = (commentId: number, description: string) => {
    setEditingCommentId(commentId);
    setEditingText(description);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleConfirmEdit = (commentId: number) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    modifyCommentMutation.mutate({ commentId, description: trimmed });
  };

  const isCreateDisabled = !isLoggedIn || !newComment.trim();

  const isEditDisabled = !editingText.trim();

  return (
    <CommentSectionWrapper>
      <SectionHeader>
        <SText fontSize="14px" fontWeight={600} color="#6E74FA">
          댓글 {commentItems.length}
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

      <EditorWrapper
        isFocused={isEditorFocused}
        disabled={!isLoggedIn}
        onClick={() => {
          if (!isLoggedIn) return;
        }}
      >
        <CommentTextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          readOnly={!isLoggedIn}
          placeholder={
            isLoggedIn
              ? '더 좋은 풀이가 떠오르면 댓글을 남겨주세요!'
              : '댓글을 작성하려면 로그인해 주세요.'
          }
        />
        <Spacer h={12} />
        <Flex align="center" justify="flex-end">
          <Button
            backgroundColor={isCreateDisabled ? '#E4E5F7' : colors.buttonPurple}
            cursor={isCreateDisabled ? 'not-allowed' : 'pointer'}
            onClick={isCreateDisabled ? undefined : handleCreateComment}
          >
            댓글 달기
          </Button>
        </Flex>
      </EditorWrapper>

      <Spacer h={24} />

      <CommentList>
        {sortedComments.map((comment) => {
          const isOwner =
            !!profile && comment.memberName === profile.memberName;
          const isEditing = editingCommentId === comment.commentId;

          return (
            <CommentCard key={comment.commentId}>
              <Flex justify="space-between" align="flex-start">
                <Flex align="center" gap="10px">
                  <AvatarCircle>{comment.memberName[0] ?? '?'}</AvatarCircle>
                  <div>
                    <SText fontSize="13px" fontWeight={600} color="#111">
                      {comment.memberName}
                    </SText>
                    <SText fontSize="11px" color="#999">
                      {formatDateTime(comment.createdAt)}
                    </SText>
                  </div>
                </Flex>

                {isOwner && !isEditing && (
                  <CommentActions>
                    <TextButton
                      type="button"
                      onClick={() =>
                        handleStartEdit(comment.commentId, comment.description)
                      }
                    >
                      수정
                    </TextButton>
                    <TextButton
                      type="button"
                      onClick={() => setDeleteTargetId(comment.commentId)}
                    >
                      삭제
                    </TextButton>
                  </CommentActions>
                )}
              </Flex>

              <Spacer h={12} />

              {isEditing ? (
                <>
                  <EditTextArea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                  />
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
                      완료
                    </Button>
                  </EditButtons>
                </>
              ) : (
                <SText
                  fontSize="13px"
                  color="#333"
                  lineHeight="20px"
                  whiteSpace="pre-wrap"
                >
                  {comment.description}
                </SText>
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
      </CommentList>

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
  margin-top: 4px;
  padding: 16px 18px;
  border-radius: 8px;
  border: none;
  outline: ${(props) =>
    props.isFocused ? `1px solid ${colors.buttonPurple}` : 'none'};
  background-color: #ffffff;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  box-sizing: border-box;
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: none;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  background: transparent;
  font-size: 13px;
  line-height: 20px;
  color: #333;
  font-size: 14px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;

  &::placeholder {
    color: ${colors.borderPurple};
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentCard = styled.div`
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid ${colors.borderPurple};
  background-color: #fff;
  box-shadow: 5px 7px 11.6px 0px #3f3f4d12;
`;

const AvatarCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${colors.headerPurple};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #666;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const EditTextArea = styled.textarea`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.borderPurple};
  padding: 10px 12px;
  font-size: 13px;
  resize: vertical;
  outline: none;
  line-height: 20px;
  box-sizing: border-box;
`;

const EditButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
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

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
