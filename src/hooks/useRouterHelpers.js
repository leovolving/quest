import { useGameContext } from '../context/GameContext';

const useRouterHelpers = () => {
  const { selectedGameId } = useGameContext();
  const generateObjectiveDetailsLink = (objectiveId) => {
    return `/game/${selectedGameId}/objective/${objectiveId}`;
  };

  return { generateObjectiveDetailsLink };
};

export default useRouterHelpers;
