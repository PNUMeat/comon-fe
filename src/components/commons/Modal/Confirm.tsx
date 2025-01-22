import { confirmAtom } from "@/store/modal";
import Modal from "./Modal";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "@emotion/styled";

export const Confirm: React.FC = () => {
  const { message, description, isVisible, onConfirm, onCancel } = useAtomValue(confirmAtom);
  const setModal = useSetAtom(confirmAtom);

  const confirm = () => {
    setModal({ message: '', description: '', isVisible: false, onConfirm: () => {}, onCancel: () => {} });
    onConfirm();
  }

  const cancel = () => {
    setModal({ message: '', description: '', isVisible: false, onConfirm: () => {}, onCancel: () => {} });
    onCancel();
  }

  return (
    <Modal open={isVisible} onClose={() => {}} height={168}>
      <ConfirmStyle>
        <MessageStyle>{message}</MessageStyle>
        <DescriptionStyle>{description}</DescriptionStyle>
        <ButtonContainer>
          <CancelButton onClick={cancel}>취소</CancelButton>
          <AcceptButton onClick={confirm}>나가기</AcceptButton>
        </ButtonContainer>
      </ConfirmStyle>
    </Modal>
  );
}

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
`;

const DescriptionStyle = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin-top: 8px;
  color: #EF2528;
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
  background-color: #D9D9D9;
  border-radius: 40px;
  font-size: 16px;
`;

const AcceptButton = styled.button`
  width: 110px;
  height: 38px;
  background-color: #EF2528;
  color: #fff;
  border-radius: 40px;
  font-size: 16px;
`;