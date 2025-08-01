import { useState } from 'react';
import styled from 'styled-components';
import { FocusTrap } from 'focus-trap-react';

import { ACTION_NAMES, STATUS_OPTIONS } from '../../constants';
import useAnalytics from '../../services/analyticsService';

import { Button, Select, InputField } from '../_ds';

import useGameDataService from '../../services/gameDataService';

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

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const NewGameForm = ({ isOpen, onClose }) => {
  const { addNewGame } = useGameDataService();
  const { logAction } = useAnalytics();
  const [gameName, setGameName] = useState('');
  const [gameStatus, setGameStatus] = useState('currently-playing');

  const resetForm = () => {
    setGameName('');
    setGameStatus('currently-playing');
    onClose();
  };

  const handleSuccess = (newGame) => {
    logAction(ACTION_NAMES.addNewGameSuccess, { game_id: newGame.id });
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (gameName.trim() === '') {
      return;
    }

    const newGame = {
      name: gameName,
      status: gameStatus,
      progress: { completed: 0, total: 0 },
      categories: [],
    };

    addNewGame(newGame, { onSuccess: handleSuccess });
  };

  const handleCancel = () => {
    logAction(ACTION_NAMES.addNewGameCanceled);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FocusTrap>
      <Overlay onClick={handleCancel}>
        <DialogBox onClick={(e) => e.stopPropagation()}>
          <FormContainer onSubmit={handleSubmit}>
            <FormTitle>Add new game</FormTitle>
            <InputField
              label="Game title"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Horizon Zero Dawn"
              focusActionName={ACTION_NAMES.addNewGameTitleFocus}
              blurActionName={ACTION_NAMES.addNewGameTitleBlur}
              autoFocus
            />
            <Select
              label="Status"
              onChange={(e) => setGameStatus(e.target.value)}
              options={STATUS_OPTIONS}
              value={gameStatus}
              changeActionName={ACTION_NAMES.addNewGameStatusChanged}
            />
            <Button type="submit" variant="secondary">
              Add Game
            </Button>
          </FormContainer>
        </DialogBox>
      </Overlay>
    </FocusTrap>
  );
};

export default NewGameForm;
