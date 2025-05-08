// src/components/GameDashboard.jsx
import React from 'react';
import styled from 'styled-components';

import { useGameContext } from '../context/GameContext';
import useStateToggleBoolean from '../hooks/useStateToggleBoolean';

import NewGameForm from './forms/NewGameForm';

const Dashboard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
`;

const NewGameButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.successHover};
    transform: translateY(-1px);
  }
`;

const GameCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const GameCardButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease-in-out;

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.25rem;
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.875rem;
  }

  progress {
    width: 100%;
    height: 6px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background-color: ${({ theme }) => theme.colors.border};

    &::-webkit-progress-bar {
      background-color: ${({ theme }) => theme.colors.border};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    &::-webkit-progress-value {
      background-color: ${({ theme }) => theme.colors.primary};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardHover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  text-transform: capitalize;
`;

const GameDashboard = () => {
  const { games, setSelectedGameId } = useGameContext();
  const [isNewGameFormOpen, toggleIsNewGameFormOpen] = useStateToggleBoolean(false);

  const groupedGames = games.reduce((acc, game) => {
    const status = game.status || 'not-played';
    if (!acc[status]) acc[status] = [];
    acc[status].push(game);
    return acc;
  }, {});

  return (
    <Dashboard>
      <Header>
        <Title>Your Games</Title>
        <NewGameButton onClick={toggleIsNewGameFormOpen}>+ Add new game</NewGameButton>
      </Header>
      <NewGameForm isOpen={isNewGameFormOpen} onClose={toggleIsNewGameFormOpen} />
      {Object.entries(groupedGames).map(([status, games]) => (
        <GameCard key={status}>
          <StatusTitle>{status.replace(/-/g, ' ')}</StatusTitle>
          {games.map((game) => (
            <GameCardButton key={game.id} onClick={() => setSelectedGameId(game.id)}>
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
