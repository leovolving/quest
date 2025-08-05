import { useState } from 'react';
import styled from 'styled-components';

import { ACTION_NAMES, STATUS_OPTIONS } from '../../constants';
import useAnalytics from '../../services/analyticsService';

import { Button, BUTTON_VARIANT, Select, InputField } from '../_ds';

import useGameDataService from '../../services/gameDataService';

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

const NewGameForm = ({ onSuccess }) => {
  const { addNewGame } = useGameDataService();
  const { logAction } = useAnalytics();
  const [gameName, setGameName] = useState('');
  const [gameStatus, setGameStatus] = useState('currently-playing');

  const handleSuccess = (newGame) => {
    logAction(ACTION_NAMES.addNewGameSuccess, { game_id: newGame.id });
    onSuccess(newGame);
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

  return (
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
      <Button type="submit" variant={BUTTON_VARIANT.SECONDARY}>
        Add Game
      </Button>
    </FormContainer>
  );
};

export default NewGameForm;
