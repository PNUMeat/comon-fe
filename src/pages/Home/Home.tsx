import { Container } from '@/components/commons/Container';
import { Flex } from '@/components/commons/Flex';
import { SText } from '@/components/commons/SText';
import { Spacer } from '@/components/commons/Spacer';
import { CommonLayout } from '@/components/layout/CommonLayout';

import { Fragment, ReactNode, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH } from '@/routes/path';
import styled from '@emotion/styled';

export const Home = () => {
  const navigate = useNavigate();
  const onClickStart = () => navigate(`${PATH.TEAM_RECRUIT}/list`);

  return (
    <Fragment>
      <CommonLayout>
        <section></section>
        <section></section>
        <section></section>

        <section></section>
        <section></section>
        <section></section>
      </CommonLayout>
    </Fragment>
  );
};
