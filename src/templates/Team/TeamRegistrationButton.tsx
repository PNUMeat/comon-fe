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
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { modalAtom } from '@/store/modal';

export const TeamRegistrationButton = () => {
  const isRegistrationFormValid = useAtomValue(isTeamRegistrationValidAtom);
  const teamName = useAtomValue(formTextInputAtom);
  const teamExplain = useAtomValue(formTextareaAtom);
  const topic = useAtomValue(teamSubjectAtom);
  const memberLimit = useAtomValue(teamMaxNumAtom);
  const password = useAtomValue(teamPasswordAtom);
  const image = useAtomValue(imageAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAlert = useSetAtom(modalAtom);

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
          alert('팀 생성에 성공했습니다!');
          queryClient.invalidateQueries({ queryKey: ['team-list', 0] });
        })
        .catch(() => setAlert({ message: '팀 생성에 실패했습니다.', isVisible: true }));
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
