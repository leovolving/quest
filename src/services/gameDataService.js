import cloneDeep from 'lodash/cloneDeep';

import sampleData from '../data/sampleData';

import { useGameContext } from '../context/GameContext';

const STORAGE_KEY = 'launch_quest_data';

const useGameDataService = () => {
  const { selectedGame, games, setGames } = useGameContext();

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
      onSuccess();
    }
  };

  const getObjectiveAndCategoryIndex = (objectiveId) => {
    for (let i = 0; i < selectedGame.categories.length; i++) {
      const category = selectedGame.categories[i];
      const objective = category.objectives?.find((o) => o.id === objectiveId);
      if (objective) return { objective, categoryIndex: i };
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

  const duplicateObjective = (objectiveId) => {
    const timestamp = Date.now();
    const { objective: objectiveToDuplicate, categoryIndex } =
      getObjectiveAndCategoryIndex(objectiveId);
    const newId = objectiveId + '-duplicate-' + timestamp;
    const newObjective = cloneDeep(objectiveToDuplicate);

    selectedGame.categories[categoryIndex].objectives.push({ ...newObjective, id: newId });
    updateGame(selectedGame);
  };

  const initialize = () => {
    const allCurrentGames = getGames(sampleData);

    setGames(allCurrentGames);
  };

  return { addNewGame, initialize, duplicateObjective, updateGame };
};

export default useGameDataService;
