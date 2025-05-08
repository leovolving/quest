import { useState } from 'react';
import styled from 'styled-components';
import { FocusTrap } from 'focus-trap-react';

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
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const InputField = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.inputText};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.inputText};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364758b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.sm} center;
  background-size: 16px;
  padding-right: ${({ theme }) => theme.spacing.xl};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.successHover};
    transform: translateY(-1px);
  }
`;

const NewGameForm = ({ isOpen, onClose }) => {
  const { addNewGame } = useGameDataService();
  const [gameName, setGameName] = useState('');
  const [gameStatus, setGameStatus] = useState('currently-playing');

  const resetForm = () => {
    setGameName('');
    setGameStatus('currently-playing');
    onClose();
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

    addNewGame(newGame, { onSuccess: resetForm });
  };

  if (!isOpen) return null;

  return (
    <FocusTrap>
      <Overlay onClick={onClose}>
        <DialogBox onClick={(e) => e.stopPropagation()}>
          <FormContainer onSubmit={handleSubmit}>
            <FormTitle>Add New Game</FormTitle>
            <InputField
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
              autoFocus
            />
            <SelectField value={gameStatus} onChange={(e) => setGameStatus(e.target.value)}>
              <option value="currently-playing">Currently Playing</option>
              <option value="not-played">Not Played</option>
              <option value="beaten-game">Beaten</option>
            </SelectField>
            <SubmitButton type="submit">Add Game</SubmitButton>
          </FormContainer>
        </DialogBox>
      </Overlay>
    </FocusTrap>
  );
};

export default NewGameForm;
