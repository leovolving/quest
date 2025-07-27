import styled from 'styled-components';

import useToggleObjective from '../hooks/useToggleObjective';
import useRouterHelpers from '../hooks/useRouterHelpers';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';

import { Button, ProgressBar } from './_ds';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  transition: background-color 0.2s ease-in-out;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const Checkbox = styled.input`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const Note = styled.em`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-left: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: block;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
`;

const ObjectiveItem = ({ objective }) => {
  const toggleObjective = useToggleObjective();
  const { selectedGame } = useGameContext();
  const { updateGame } = useGameDataService();
  const { generateObjectiveDetailsLink } = useRouterHelpers();

  const handleChange = () => {
    toggleObjective(objective);
  };

  // TODO: use game data service for these game-updating functions

  const handleProgressChange = (delta) => {
    const updatedCategories = selectedGame.categories.map((cat) => {
      const updatedObjectives = cat.objectives.map((obj) => {
        if (obj.id !== objective.id) return obj;

        const updatedCurrent = Math.max(
          0,
          Math.min((obj.progress?.current || 0) + delta, obj.progress?.total || 0)
        );

        return {
          ...obj,
          progress: {
            ...obj.progress,
            current: updatedCurrent,
          },
          completed: updatedCurrent >= obj.progress.total,
        };
      });

      return { ...cat, objectives: updatedObjectives };
    });

    const updatedGame = { ...selectedGame, categories: updatedCategories };
    updateGame(updatedGame);
  };

  return (
    <Wrapper>
      <Content>
        <label>
          <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
          <Title>{objective.title}</Title>
        </label>
        {objective.notes && <Note>{objective.notes}</Note>}

        {objective.progress && (
          <>
            <ProgressText>
              Progress: {objective.progress.current} / {objective.progress.total}
            </ProgressText>
            <ProgressControls>
              <Button variant="secondary" onClick={() => handleProgressChange(-1)}>
                -
              </Button>
              <ProgressBar value={objective.progress.current} max={objective.progress.total} />
              <Button variant="secondary" onClick={() => handleProgressChange(1)}>
                +
              </Button>
            </ProgressControls>
          </>
        )}
        <ActionsContainer>
          <Button as={Link} to={generateObjectiveDetailsLink(objective.id)}>
            Expand
          </Button>
        </ActionsContainer>
      </Content>
    </Wrapper>
  );
};

export default ObjectiveItem;
