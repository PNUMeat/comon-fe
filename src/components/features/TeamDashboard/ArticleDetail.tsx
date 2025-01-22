import { viewStyle } from '@/utils/viewStyle';

import { Box } from '@/components/commons/Box';
import { Flex } from '@/components/commons/Flex';
import { LazyImage } from '@/components/commons/LazyImage';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';

import { Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { IArticle } from '@/api/dashboard';
import { deletePost } from '@/api/postings';
import DeleteIcon from '@/assets/TeamDashboard/deleteIcon.png';
import ModifyIcon from '@/assets/TeamDashboard/modifyIcon.png';
import { alertAtom, confirmAtom } from '@/store/modal';
import styled from '@emotion/styled';
import { useSetAtom } from 'jotai';

interface ArticleDetailProps {
  data: IArticle;
  teamId: number;
  refetchArticles: () => void;
  shouldBlur?: boolean;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  data,
  teamId,
  refetchArticles,
  shouldBlur = true,
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
  // TODO: 여기서?
  const setConfirm = useSetAtom(confirmAtom);
  const setAlert = useSetAtom(alertAtom);

  const deleteArticle = () => {
    if (data?.articleId) {
      deletePost(data.articleId)
        .then(() => {
          refetchArticles();
        })
        .catch(() =>
          setAlert({ message: '게시글 삭제를 실패했어요', isVisible: true })
        );
    }
  };

  const onClickDelete = () => {
    setConfirm({
      message: '게시글을 삭제하시겠습니까?',
      description: '삭제된 게시글은 복구되지 않아요',
      isVisible: true,
      onConfirm: deleteArticle,
    });
  };

  return (
    <Box width="100%" padding="30px 40px">
      <Flex direction="column" justify="center" align="flex-start">
        <Flex justify="space-between">
          <SText
            color="#333"
            fontSize="24px"
            fontWeight={700}
            whiteSpace={'normal'}
            wordBreak={'break-word'}
          >
            {data?.articleTitle}
          </SText>
          {data?.isAuthor && (
            <Suspense fallback={null}>
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
            </Suspense>
          )}
        </Flex>
        <Spacer h={8} />
        <SText color="#777" fontSize="14px" fontWeight={400}>
          {data?.createdDate.slice(0, -3)}
        </SText>
        <Spacer h={28} />
        <Flex align="center" gap="8px">
          {data?.memberImage && (
            <Suspense fallback={<div style={{ height: '16px' }} />}>
              <LazyImage
                src={data.memberImage}
                altText={data?.memberName || ''}
                w={16}
                h={16}
                maxW={16}
                style={{ borderRadius: '50%' }}
              />
            </Suspense>
          )}
          <SText color="#333" fontSize="12px" fontWeight={600}>
            {data?.memberName}
          </SText>
        </Flex>
        <Spacer h={36} />
        <ArticleViewer
          shouldBlur={shouldBlur}
          dangerouslySetInnerHTML={{
            __html: article,
          }}
        />
      </Flex>
    </Box>
  );
};

const ArticleViewer = styled.div<{
  shouldBlur: boolean;
}>`
  line-height: 1.5;
  ${viewStyle}

  ${(props) =>
    props.shouldBlur
      ? `
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
  `
      : ''}
`;
