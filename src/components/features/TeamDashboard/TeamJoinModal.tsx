import { useWindowWidth } from '@/hooks/useWindowWidth.ts';

import { Button } from '@/components/commons/Button.tsx';
import { Flex } from '@/components/commons/Flex.tsx';
import { Label } from '@/components/commons/Label.tsx';
import Modal from '@/components/commons/Modal/Modal.tsx';
import { SText } from '@/components/commons/SText.tsx';
import { Spacer } from '@/components/commons/Spacer.tsx';

import { useState } from 'react';

import { ITeamInfo, joinTeam } from '@/api/team.ts';
import { breakpoints } from '@/constants/breakpoints.ts';
import { colors } from '@/constants/colors.ts';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';

export const TeamJoinModal: React.FC<{
  teamId: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamInfo?: ITeamInfo;
}> = ({ teamId, teamInfo, setIsModalOpen }) => {
  const [password, setPassword] = useState('');
  const width = useWindowWidth();
  const queryClient = useQueryClient();
  const isMobile = width <= breakpoints.mobile;

  const handleJoinTeam = () => {
    if (password.trim().length !== 4) {
      alert('비밀번호 4자리를 입력해 주세요.');
      return;
    }

    joinTeam(parseInt(teamId), password)
      .then(() => {
        queryClient
          .refetchQueries({ queryKey: ['membersInfo'] })
          .catch((err) =>
            alert(err?.response?.message ?? '팀 목록 최신화에 실패했습니다')
          );
        setIsModalOpen(false);
        setPassword('');
        window.location.reload();
      })
      .catch((err) => {
        alert(err?.response?.message ?? '팀 가입 요청에 실패했습니다.');
        console.error(err);
      });
  };

  return (
    <Modal
      // open={isModalOpen}
      open={true}
      onClose={() => setIsModalOpen(false)}
      height={isMobile ? 160 : 220}
      overlayBackground="#00000066"
    >
      <Flex direction="column" justify="center" align="center" width={100}>
        <SText
          color="#333"
          fontSize={isMobile ? '10px' : '12px'}
          fontWeight={600}
          cursor={'text'}
        >
          TEAM
        </SText>
        <Spacer h={4} />
        <SText
          fontSize={isMobile ? '16px' : '24px'}
          color="#333"
          fontWeight={700}
          cursor={'text'}
        >
          {teamInfo?.teamName}
        </SText>
        <Spacer h={4} />
        <SText
          fontSize={isMobile ? '10px' : '16px'}
          color="#777"
          fontWeight={400}
          cursor={'text'}
        >
          since {teamInfo?.createdAt}
        </SText>
        <Spacer h={isMobile ? 4 : 8} />
        <Label>
          <SText fontSize="10px" fontWeight={600}>
            {teamInfo?.topic}
          </SText>
        </Label>
        <Spacer h={isMobile ? 12 : 20} />
        <PasswordInput
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Spacer h={isMobile ? 6 : 10} />
        <Button
          backgroundColor={colors.buttonPurple}
          onClick={handleJoinTeam}
          padding={isMobile ? '' : '7px 14px'}
        >
          팀 참가하기 →
        </Button>
      </Flex>
    </Modal>
  );
};

const PasswordInput = styled.input`
  width: 160px;
  height: 28px;
  padding: 4px 40px;
  border-radius: 27px;
  border: 1px solid ${colors.borderPurple};
  box-sizing: border-box;
  text-align: center;
  color: #ccc;
  font-weight: 400;

  &:focus {
    outline: none;
    border: 1px solid ${colors.buttonPurple};
  }

  @media (max-width: ${breakpoints.mobile}px) {
    width: 140px;
    height: 20px;
    font-size: 10px;

    &::placeholder {
      font-size: 10px;
    }
  }
`;
