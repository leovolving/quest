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
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const GameCardButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  cursor: pointer;
  color: white;

  h3 {
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0 0 0.5rem;
  }

  progress {
    width: 100%;
  }

  &:hover {
    background-color: #2c2c2c;
  }
`;

const GameDashboard = () => {
  const { games, setSelectedGame } = useGameContext();

  const groupedGames = games.reduce((acc, game) => {
    const status = game.status || 'not-played';
    if (!acc[status]) acc[status] = [];
    acc[status].push(game);
    return acc;
  }, {});

  return (
    <Dashboard>
      <h1>Your Games</h1>
      {Object.entries(groupedGames).map(([status, games]) => (
        <GameCard key={status}>
          <h2>{status.replace(/-/g, ' ')}</h2>
          {games.map(game => (
            <GameCardButton
              key={game.id}
              onClick={() => setSelectedGame(game)}
            >
              <h3>{game.name}</h3>
              <p>{game.categories.length} categories</p>
              <progress value={game.progress.completed} max={game.progress.total} />
            </GameCardButton>
          ))}
          </GameCard>
      ))}
    </Dashboard>
  );
};

export default GameDashboard;
