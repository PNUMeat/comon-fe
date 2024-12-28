import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useNavigate } from 'react-router-dom';

import { createTeam } from '@/api/team';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  isTeamRegistrationValidAtom,
  teamMaxNumAtom,
  teamPasswordAtom,
  teamSubjectAtom,
} from '@/store/form';
import { useAtomValue } from 'jotai';

export const TeamRegistrationButton = () => {
  const isRegistrationFormValid = useAtomValue(isTeamRegistrationValidAtom);
  const teamName = useAtomValue(formTextInputAtom);
  const teamExplain = useAtomValue(formTextareaAtom);
  const topic = useAtomValue(teamSubjectAtom);
  const memberLimit = useAtomValue(teamMaxNumAtom);
  const password = useAtomValue(teamPasswordAtom);
  const image = useAtomValue(imageAtom);
  const navigate = useNavigate();

  const onClick = () => {
    // 개발자 도구에서 버튼 disabled 바꿀 수 있음
    if (isRegistrationFormValid) {
      createTeam({
        memberLimit: memberLimit.toString(),
        teamName,
        teamExplain,
        topic,
        password,
        image,
      })
        .then((data) => {
          navigate(`/team-dashboard/${data.teamId}`);
          console.error('CT', data);
          alert('팀 생성에 성공했습니다!');
        })
        .catch(() => alert('팀 생성에 실패했습니다.'));
    }
  };

  return (
    <ComonFormSubmitButton
      disabled={!isRegistrationFormValid}
      onClick={onClick}
    >
      <span>🚀 팀 생성하기</span>
    </ComonFormSubmitButton>
  );
};
