// src/components/GameDashboard.jsx
import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';

const Dashboard = styled.div`
  display: grid;
  gap: 1rem;
`;

const GameCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const GameDashboard = () => {
  const { games, setSelectedGame } = useGameContext();

  return (
    <Dashboard>
      <h1>Your Games</h1>
      {games.map(game => (
        <GameCard key={game.id} onClick={() => setSelectedGame(game)}>
          <h2>{game.name}</h2>
          <p>{game.categories.length} categories</p>
          <progress value={game.progress.completed} max={game.progress.total}></progress>
        </GameCard>
      ))}
    </Dashboard>
  );
};

export default GameDashboard;
