import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';

import { useLocation, useNavigate } from 'react-router-dom';

import { createTeam } from '@/api/team';
import click from '@/assets/TeamJoin/click.png';
import { PATH } from '@/routes/path.tsx';
import {
  formTextInputAtom,
  formTextareaAtom,
  imageAtom,
  isTeamRegistrationValidAtom,
  teamMaxNumAtom,
  teamPasswordAtom,
  teamSubjectAtom,
} from '@/store/form';
import { alertAtom } from '@/store/modal';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

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
  const setAlert = useSetAtom(alertAtom);
  const location = useLocation();
  const teamMemberUuids = location.state?.teamMemberUuids || [];
  console.log(teamMemberUuids);

  const onClick = () => {
    // 개발자 도구에서 버튼 disabled 바꿀 수 있음
    if (isRegistrationFormValid) {
      createTeam({
        memberLimit:
          typeof memberLimit === 'number' ? memberLimit : parseInt(memberLimit),
        teamName,
        teamExplain,
        topic,
        password,
        image,
        teamMemberUuids,
      })
        .then((data) => {
          navigate(`${PATH.TEAM_DASHBOARD}/${data.teamId}`);
          setAlert({
            message: '팀 생성을 완료했어요',
            isVisible: true,
            onConfirm: () => {},
          });
          queryClient.invalidateQueries({ queryKey: ['team-list', 0] });
        })
        .catch(() =>
          setAlert({
            message: '팀 생성에 실패했습니다.',
            isVisible: true,
            onConfirm: () => {},
          })
        );
    }
  };

  return (
    <ComonFormSubmitButton
      disabled={!isRegistrationFormValid}
      onClick={onClick}
    >
      <img src={click} alt="click" width={24} />
      <span>팀 생성하기</span>
    </ComonFormSubmitButton>
  );
};
