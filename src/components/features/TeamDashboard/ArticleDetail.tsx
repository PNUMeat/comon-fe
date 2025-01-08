import { viewStyle } from '@/utils/viewStyle';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { IArticle } from '@/api/dashboard';
import { deletePost } from '@/api/postings';
import DeleteIcon from '@/assets/TeamDashboard/deleteIcon.png';
import ModifyIcon from '@/assets/TeamDashboard/modifyIcon.png';
import {
  pageAtom,
  selectedDateAtom,
  selectedPostIdAtom,
} from '@/store/dashboard';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { alertAtom, confirmAtom } from '@/store/modal';

interface ArticleDetailProps {
  data: IArticle;
  teamId: number;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  data,
  teamId,
}) => {
  const article = useMemo(
    () =>
      data?.imageUrl
        ? data?.articleBody.replace(
            /(<img[^>]*src=")\?("[^>]*>)/g,
            `$1${data?.imageUrl}$2`
          )
        : (data?.articleBody ?? ''),
    [data]
  );
  const queryClient = useQueryClient();
  const selectedDate = useAtomValue(selectedDateAtom);
  const page = useAtomValue(pageAtom);
  const setSelectedArticleId = useSetAtom(selectedPostIdAtom);
  const setConfirm = useSetAtom(confirmAtom);
  const setAlert = useSetAtom(alertAtom);

  const deleteArticle = () => {
    if (data?.articleId) {
      deletePost(data.articleId)
        .then(() => {
          queryClient
            .invalidateQueries({
              queryKey: ['articles-by-date', teamId, selectedDate, page],
            })
            .then(() => {
              setAlert({message: '게시글을 삭제했어요', isVisible: true });
              setSelectedArticleId(null);
            })
            .catch(() => setAlert({ message : '최신 게시글 조회가 실패했습니다.', isVisible: true }));
        })
        .catch(() => setAlert({message: '게시글 삭제를 실패했어요', isVisible: true }));
    }
  };

  const onClickDelete = () => {
    setConfirm({
      message: '게시글을 삭제하시겠습니까?',
      description: '삭제된 게시글은 복구되지 않아요',
      isVisible: true,
      onConfirm : deleteArticle,
    });
  }


  return (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <Flex justify="space-between">
          <SText color="#333" fontSize="24px" fontWeight={700}>
            {data?.articleTitle}
          </SText>
          {data?.isAuthor && (
            <Flex width={7} gap="16px">
              <Link
                to={`/posting/${teamId}`}
                state={{
                  article: article,
                  articleId: data?.articleId,
                  articleTitle: data?.articleTitle,
                }}
              >
                <LazyImage
                  src={ModifyIcon}
                  altText="수정"
                  w={20}
                  h={20}
                  maxW={20}
                />
              </Link>
              <div style={{ cursor: 'pointer' }} onClick={onClickDelete}>
                <LazyImage
                  src={DeleteIcon}
                  altText="삭제"
                  w={20}
                  h={20}
                  maxW={16}
                />
              </div>
            </Flex>
          )}
        </Flex>
        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          {data?.createdDate.slice(0, -3)}
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          {data?.memberImage && (
            <LazyImage
              src={data.memberImage}
              altText={data?.memberName || ''}
              w={16}
              h={16}
              maxW={16}
              style={{ borderRadius: '50%' }}
            />
          )}
          <SText color="#333" fontSize="12px" fontWeight={600}>
            {data?.memberName}
          </SText>
        </Flex>
        <Spacer h={36} />
        <ArticleViewer
          dangerouslySetInnerHTML={{
            __html: article,
          }}
        />
      </Flex>
    </Box>
  );
};

const ArticleViewer = styled.div`
  line-height: 1.5;

  & img {
    max-width: 600px;
    object-fit: contain;
  }
  ${viewStyle}
`;
