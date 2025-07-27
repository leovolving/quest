import { useParams } from 'react-router-dom';

const useRouterHelpers = () => {
  const { gameId } = useParams();

  const generateActiveGameLink = () => `/game/${gameId}`;

  const generateObjectiveDetailsLink = (objectiveId) => {
    return `${generateActiveGameLink()}/objective/${objectiveId}`;
  };

  return { generateActiveGameLink, generateObjectiveDetailsLink };
};

export default useRouterHelpers;
