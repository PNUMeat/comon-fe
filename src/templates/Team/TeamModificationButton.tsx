import { ComonFormSubmitButton } from '@/components/commons/Form/ComonFormSubmitButton';
import click from '@/assets/TeamJoin/click.png';

export const TeamModificationButton = () => {
  return (
    <ComonFormSubmitButton disabled={true}>
      <img src={click} alt="click" width={24} />
      <span>팀 정보 수정하기</span>
    </ComonFormSubmitButton>
  );
};
