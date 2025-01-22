import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useMemo, useState } from 'react';
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
import { serializeForm } from '@/templates/User/utils.ts';
import { useAtom } from 'jotai';

export const TeamModificationButton = () => {
  const [teamName] = useAtom(formTextInputAtom);
  const [teamExplain] = useAtom(formTextareaAtom);
  const [topic] = useAtom(teamSubjectAtom);
  const [memberLimit] = useAtom(teamMaxNumAtom);
  const [password] = useAtom(teamPasswordAtom);
  const [image] = useAtom(imageAtom);
  const [saveCache, setSaveCache] = useState<number>(0);
  const location = useLocation();

  const cache = useMemo(
    () => serializeForm(teamName, teamExplain, image, topic, memberLimit),
    [saveCache]
  );

  const { teamId } = location.state;

  if (!teamId) {
    return <Navigate to={PATH.TEAMS} />;
  }
  const teamIdInt = parseInt(teamId);

  const onClick = () => {
    console.log('버튼 확인', cache);
    setSaveCache((prev) => prev + 1);
    if (
      serializeForm(teamName, teamExplain, image, topic, memberLimit) !== cache
    ) {
      modifyTeam({
        teamId: teamIdInt,
        teamName: teamName,
        teamExplain: teamExplain,
        topic: topic,
        image: image,
        memberLimit:
          typeof memberLimit === 'number' ? memberLimit : parseInt(memberLimit),
        // TODO: password 받아올 수 있으면 추가
        password: password.trim().length === 0 ? null : password,
      })
        .then(() => {
          //     성공했다고 토스트 띄워달라고 합니다
          alert('팀 수정 성공');
        })
        .catch(() => {
          alert('팀 수정 요청 실패');
        });
    }
  };

  return (
    <ComonFormSubmitButton disabled={false} onClick={onClick}>
      <img src={click} alt="click" width={24} />
      <span>팀 정보 수정하기</span>
    </ComonFormSubmitButton>
  );
};
