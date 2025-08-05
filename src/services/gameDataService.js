import { useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';

import { ACTION_NAMES } from '../constants';

import { useGameContext } from '../context/GameContext';

import useRouterHelpers from '../hooks/useRouterHelpers';

import useAnalytics from './analyticsService';

const STORAGE_KEY = 'launch_quest_data';

const useGameDataService = () => {
  const { logAction } = useAnalytics();
  const { navigateToGame } = useRouterHelpers();
  const { gameId } = useParams();
  const { games, setGames } = useGameContext();
  const selectedGame = games.find((g) => String(g.id) === String(gameId));

  const getGames = (initialData = []) => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : initialData;
    } catch (e) {
      console.error('Failed to load games from localStorage', e);
      return [];
    }
  };

  const saveGames = (gamesToSave) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gamesToSave));
      setGames(gamesToSave);
    } catch (e) {
      console.error('Failed to save games to localStorage', e);
    }
  };

  const addNewGame = (newGame, options = {}) => {
    const { onSuccess } = options;
    newGame.id = games.length + 1;
    saveGames([...games, newGame]);
    if (typeof onSuccess === 'function') {
      onSuccess(newGame);
    }
  };

  const getObjectiveAndCategoryIndex = (objectiveId) => {
    for (let i = 0; i < selectedGame.categories.length; i++) {
      const category = selectedGame.categories[i];
      const objectiveIndex = category.objectives?.findIndex((o) => o.id === objectiveId);
      if (objectiveIndex >= 0) {
        return { objective: category.objectives[objectiveIndex], objectiveIndex, categoryIndex: i };
      }
    }
  };

  const getObjective = (objectiveId) => {
    if (selectedGame) {
      const objectiveData = getObjectiveAndCategoryIndex(objectiveId);
      return objectiveData?.objective;
    }
  };

  const updateGame = (updatedGame, options = {}) => {
    const { onSuccess } = options;
    const updated = games.map((g) => (g.id === updatedGame.id ? updatedGame : g));
    saveGames(updated);
    if (typeof onSuccess === 'function') {
      onSuccess();
    }
  };

  const deleteObjective = (objectiveId) => {
    const analyticsMetadata = { game_id: gameId, objective_id: objectiveId };
    const game = cloneDeep(selectedGame);
    const { objective, objectiveIndex, categoryIndex } = getObjectiveAndCategoryIndex(objectiveId);
    const confirmationMessage = `Are you sure you want to delete ${objective.title}? This action cannot be undone`;

    if (confirm(confirmationMessage)) {
      const newObjectives = cloneDeep(game.categories[categoryIndex].objectives);
      newObjectives.splice(objectiveIndex, 1);

      game.categories[categoryIndex].objectives = newObjectives;
      updateGame(game);
      logAction(ACTION_NAMES.objectiveDetailDeleteSuccess, analyticsMetadata);
      navigateToGame();
    } else {
      logAction(ACTION_NAMES.objectiveDetailDeleteCanceled, analyticsMetadata);
    }
  };

  const duplicateObjective = (objectiveId) => {
    const analyticsMetadata = { game_id: gameId, objective_id: objectiveId };
    const timestamp = Date.now();
    const game = cloneDeep(selectedGame);

    const {
      objective: objectiveToDuplicate,
      objectiveIndex,
      categoryIndex,
    } = getObjectiveAndCategoryIndex(objectiveId);
    const newId = objectiveId + '-duplicate-' + timestamp;
    const newObjective = {
      ...cloneDeep(objectiveToDuplicate),
      title: `Copy of ${objectiveToDuplicate.title}`,
      id: newId,
    };

    game.categories[categoryIndex].objectives.splice(objectiveIndex + 1, 0, newObjective);
    updateGame(game);
    logAction(ACTION_NAMES.objectiveDetailDuplicateSuccess, analyticsMetadata);
    navigateToGame();
  };

  const initialize = () => {
    const allCurrentGames = getGames();

    setGames(allCurrentGames);
  };

  return {
    initialize,
    addNewGame,
    deleteObjective,
    duplicateObjective,
    getObjective,
    selectedGame,
    updateGame,
  };
};

export default useGameDataService;
