import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import useGameDataService from '../../services/gameDataService';

import { Button, BUTTON_VARIANT, ProgressBar } from '../_ds';
import useAnalytics from '../../services/analyticsService';

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
  width: 100%;
`;

export const ObjectiveProgress = ({ objective, onChangeActionName }) => {
  const { selectedGame, updateGame } = useGameDataService();
  const { logAction } = useAnalytics();
  const { gameId } = useParams();

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
    if (onChangeActionName) {
      logAction(onChangeActionName, { game_id: gameId, objective_id: objective.id, delta });
    }
  };

  return objective?.progress ? (
    <>
      <ProgressText>
        Progress: {objective.progress.current} / {objective.progress.total}
      </ProgressText>
      <ProgressControls>
        <Button variant={BUTTON_VARIANT.SECONDARY} onClick={() => handleProgressChange(-1)}>
          -
        </Button>
        <ProgressBar value={objective.progress.current} max={objective.progress.total} />
        <Button variant={BUTTON_VARIANT.SECONDARY} onClick={() => handleProgressChange(1)}>
          +
        </Button>
      </ProgressControls>
    </>
  ) : null;
};
