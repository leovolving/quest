import styled from 'styled-components';
import { FocusTrap } from 'focus-trap-react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogBox = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 400px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.md};
    max-width: 95vw;
  }
`;

export const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <FocusTrap>
      <Overlay onClick={onClose}>
        <DialogBox onClick={(e) => e.stopPropagation()}>{children}</DialogBox>
      </Overlay>
    </FocusTrap>
  );
};
