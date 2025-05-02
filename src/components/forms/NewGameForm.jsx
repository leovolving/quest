import { useState } from 'react';
import styled from 'styled-components';
import { FocusTrap } from 'focus-trap-react';

import { useGameContext } from '../../context/GameContext';

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
  background: ${({ theme }) => theme.background || 'white'};
  color: ${({ theme }) => theme.text || 'black'};
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 400px;
  width: 100%;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  padding: 8px;
  margin: 10px 0;
`;

const SelectField = styled.select`
  padding: 8px;
  margin: 10px 0;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const NewGameForm = ({ isOpen, onClose }) => {
  const { games, setGames } = useGameContext(); // Get games and setGames from context
  const [gameName, setGameName] = useState('');
  const [gameStatus, setGameStatus] = useState('currently-playing'); // Default status

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (gameName.trim() === '') {
      return; // Don't add a game if the name is empty
    }

    const newGame = {
      id: games.length + 1, // Simple ID generation, in real-world, this should be dynamic
      name: gameName,
      status: gameStatus,
      progress: { completed: 0, total: 0 },
      categories: [],
    };

    setGames([...games, newGame]); // Add new game to the context's games list
    setGameName(''); // Reset input
    setGameStatus('currently-playing'); // Reset status to default
    onClose();
  };

  if (!isOpen) return null;

  return (
    <FocusTrap>
      <Overlay onClick={onClose}>
        <DialogBox onClick={(e) => e.stopPropagation()}>
          <FormContainer onSubmit={handleSubmit}>
            <InputField
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
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
