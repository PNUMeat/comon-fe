import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { modifyTeam } from '@/api/team.ts';
import click from '@/assets/TeamJoin/click.png';
import { PATH } from '@/routes/path.tsx';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  teamMaxNumAtom,
  teamPasswordAtom,
  teamSubjectAtom,
} from '@/store/form.ts';
import { useTeamOldData } from '@/templates/Team/TeamFormContext.tsx';
import { useAtom } from 'jotai';

export const TeamModificationButton = () => {
  const [teamName] = useAtom(formTextInputAtom);
  const [teamExplain] = useAtom(formTextareaAtom);
  const [topic] = useAtom(teamSubjectAtom);
  const [memberLimit] = useAtom(teamMaxNumAtom);
  const [password] = useAtom(teamPasswordAtom);
  const [image] = useAtom(imageAtom);
  const location = useLocation();
  const [isDirty, setIsDirty] = useState(false);
  const { teamId } = location.state;
  const {
    teamName: currTeamName,
    teamExplain: currTeamExplain,
    topic: currTopic,
    memberLimit: currMemberLimit,
    // image: currImage,
  } = useTeamOldData();

  useEffect(() => {
    const name = teamName.length === 0 ? currTeamName : teamName;
    const exp = teamExplain.length === 0 ? currTeamExplain : teamExplain;
    const top = topic ?? currTopic;
    const mem = memberLimit ?? currMemberLimit;

    const curr = `${currTeamName}-${currTeamExplain}-null-${currTopic}-${currMemberLimit}`;
    const changed = `${name}-${exp}-${image?.name ?? null}-${top}-${mem}`;

    setIsDirty(curr !== changed);
  }, [teamName, teamExplain, topic, memberLimit]);

  if (!teamId) {
    return <Navigate to={PATH.TEAMS} />;
  }

  const onClick = () => {
    if (isDirty) {
      const vMemberLimit = memberLimit ?? currMemberLimit;
      modifyTeam({
        teamId: parseInt(teamId),
        teamName: teamName.length === 0 ? currTeamName : teamName,
        teamExplain: teamExplain.length === 0 ? currTeamExplain : teamExplain,
        topic: topic ?? currTopic,
        image: image,
        memberLimit:
          typeof vMemberLimit === 'number'
            ? vMemberLimit
            : parseInt(vMemberLimit),
        // TODO: password 받아올 수 있으면 추가
        password: password.trim().length === 0 ? null : password,
      })
        .then(() => {
          //     성공했다고 토스트 띄워달라고 합니다
          alert('팀 수정 성공');
          setIsDirty(false);
        })
        .catch(() => {
          alert('팀 수정 요청 실패: 필드를 다시 입력해주세요');
        });
    }
  };

  return (
    <ComonFormSubmitButton disabled={!isDirty} onClick={onClick}>
      <img src={click} alt="click" width={24} />
      <span>팀 정보 수정하기</span>
    </ComonFormSubmitButton>
  );
};
