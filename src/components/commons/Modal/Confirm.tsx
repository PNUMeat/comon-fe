import { confirmAtom } from '@/store/modal';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import Modal from './Modal';

export const Confirm: React.FC = () => {
  // const { message, description, isVisible, onConfirm, onCancel } = useAtomValue(confirmAtom);
  // const setModal = useSetAtom(confirmAtom);
  const [modal, setModal] = useAtom(confirmAtom);
  const { message, description, isVisible, cancleText = '취소', confirmText = '나가기', onConfirm, onCancel } = modal;

  const queryClient = useQueryClient();

  const confirm = () => {
    setModal({
      message: '',
      description: '',
      isVisible: false,
      onConfirm: () => {
        queryClient.refetchQueries({ queryKey: ['membersInfo'] });
      },
      onCancel: () => {},
    });
    onConfirm();
  };

  const cancel = () => {
    setModal({
      message: '',
      description: '',
      isVisible: false,
      onConfirm: () => {},
      onCancel: () => {},
    });
    onCancel();
  };

  return (
    <Modal open={isVisible} onClose={() => {}} height={168}>
      <ConfirmStyle>
        <MessageStyle>{message}</MessageStyle>
        <DescriptionStyle>{description}</DescriptionStyle>
        <ButtonContainer>
          <CancelButton onClick={cancel}>{cancleText}</CancelButton>
          <AcceptButton onClick={confirm}>{confirmText}</AcceptButton>
        </ButtonContainer>
      </ConfirmStyle>
    </Modal>
  );
};

const ConfirmStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MessageStyle = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-top: 35px;
  color: #333;
  white-space: pre-line;
`;

const DescriptionStyle = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin-top: 8px;
  color: #ef2528;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 22px auto;
  gap: 16px;
`;

const CancelButton = styled.button`
  width: 110px;
  height: 38px;
  background-color: #d9d9d9;
  border-radius: 40px;
  font-size: 16px;
`;

const AcceptButton = styled.button`
  width: 110px;
  height: 38px;
  background-color: #ef2528;
  color: #fff;
  border-radius: 40px;
  font-size: 16px;
`;
