// src/hooks/useToggleObjective.js
import { useCallback } from 'react';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';

const useToggleObjective = () => {
  const { games, selectedGame } = useGameContext();
  const { updateGame } = useGameDataService();

  return useCallback(
    (objective) => {
      const { id: objectiveId, categoryId } = objective;
      const updatedGames = games.map((game) => {
        if (game.id !== selectedGame.id) return game;

        const updatedCategories = game.categories.map((category) => {
          if (category.id !== categoryId) return category;
          const updatedObjectives = category.objectives.map((obj) =>
            obj.id === objectiveId ? { ...obj, completed: !obj.completed } : obj
          );
          return { ...category, objectives: updatedObjectives };
        });

        const flatObjectives = updatedCategories.flatMap((c) => c.objectives);
        const completed = flatObjectives.filter((o) => o.completed).length;
        const total = flatObjectives.length;

        return {
          ...game,
          categories: updatedCategories,
          progress: { completed, total },
        };
      });

      const updatedGame = updatedGames.find((g) => g.id === selectedGame.id);
      updateGame(updatedGame);
    },
    [games, selectedGame, updateGame]
  );
};

export default useToggleObjective;
