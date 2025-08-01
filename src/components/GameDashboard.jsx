import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Button, ProgressBar } from '../components/_ds';

import { useGameContext } from '../context/GameContext';
import useStateToggleBoolean from '../hooks/useStateToggleBoolean';
import { ACTION_NAMES, STATUS_OPTIONS } from '../constants';
import useAnalytics from '../services/analyticsService';

import NewGameForm from './forms/NewGameForm';

const Dashboard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: 900px) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg} 0;
  }
  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md} 0;
  }
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

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
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

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const GameCardButton = styled(Link)`
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
  text-decoration: none;
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
  const { games } = useGameContext();
  const { logAction } = useAnalytics();
  const [isNewGameFormOpen, toggleIsNewGameFormOpen] = useStateToggleBoolean(false);

  const groupedGames = games.reduce((acc, game) => {
    const status = game.status || 'not-played';
    if (!acc[status]) acc[status] = [];
    acc[status].push(game);
    return acc;
  }, {});

  const orderedGroupedGames = STATUS_OPTIONS.reduce((acc, curr) => {
    const status = curr.value;
    if (groupedGames[status]) acc[status] = groupedGames[status];
    return acc;
  }, {});

  const handleAddNewGameClick = () => {
    logAction(ACTION_NAMES.addNewGameClicked);
    toggleIsNewGameFormOpen();
  };

  return (
    <Dashboard>
      <Header>
        <Title>Your Games</Title>
        <Button variant="secondary" onClick={handleAddNewGameClick}>
          + Add new game
        </Button>
      </Header>
      <NewGameForm isOpen={isNewGameFormOpen} onClose={toggleIsNewGameFormOpen} />
      {Object.entries(orderedGroupedGames).map(([status, games]) => (
        <GameCard key={status}>
          <StatusTitle>{status.replace(/-/g, ' ')}</StatusTitle>
          {games.map((game) => (
            <GameCardButton key={game.id} to={`/game/${game.id}`}>
              <h3>{game.name}</h3>
              <p>
                {game.categories.length} {game.categories.length === 1 ? 'category' : 'categories'}
              </p>
              <ProgressBar value={game.progress.completed} max={game.progress.total} />
            </GameCardButton>
          ))}
        </GameCard>
      ))}
    </Dashboard>
  );
};

export default GameDashboard;
