import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useMemo, useState } from 'react';

// import { useLocation } from 'react-router-dom';
// import { modifyTeam } from '@/api/team.ts';
import click from '@/assets/TeamJoin/click.png';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  teamMaxNumAtom, // teamPasswordAtom,
  teamSubjectAtom,
} from '@/store/form.ts';
import { serializeForm } from '@/templates/User/utils.ts';
import { useAtomValue } from 'jotai/index';

export const TeamModificationButton = () => {
  const teamName = useAtomValue(formTextInputAtom);
  const teamExplain = useAtomValue(formTextareaAtom);
  const topic = useAtomValue(teamSubjectAtom);
  const memberLimit = useAtomValue(teamMaxNumAtom);
  // const password = useAtomValue(teamPasswordAtom);
  const image = useAtomValue(imageAtom);
  // const location = useLocation();
  // const { teamId } = location.state;
  // const teamIdInt = parseInt(teamId);
  const [saveCache, setSaveCache] = useState<number>(0);

  const cache = useMemo(
    () => serializeForm(teamName, teamExplain, image, topic, memberLimit),
    [saveCache]
  );

  const onClick = () => {
    console.log('버튼 확인', cache);
    setSaveCache((prev) => prev + 1);
    // if (
    //   serializeForm(teamName, teamExplain, image, topic, memberLimit) !== cache
    // ) {
    //   modifyTeam({
    //     teamId: teamIdInt,
    //     teamName: teamName,
    //     teamExplain: teamExplain,
    //     topic: topic,
    //     image: image,
    //     memberLimit:
    //       typeof memberLimit === 'number' ? memberLimit : parseInt(memberLimit),
    //     // TODO: password 받아올 수 있으면 추가
    //     password: null,
    //   })
    //     .then(() => {
    //       //     성공했다고 토스트 띄워달라고 합니다
    //     })
    //     .catch(() => {
    //       alert('팀 수정 요청 실패');
    //     });
    // }
  };

  return (
    <ComonFormSubmitButton disabled={false} onClick={onClick}>
      <img src={click} alt="click" width={24} />
      <span>팀 정보 수정하기</span>
    </ComonFormSubmitButton>
  );
};
