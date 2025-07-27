import { useNavigate, useParams } from 'react-router-dom';

const useRouterHelpers = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const generateActiveGameLink = () => `/game/${gameId}`;

  const generateObjectiveDetailsLink = (objectiveId) => {
    return `${generateActiveGameLink()}/objective/${objectiveId}`;
  };

  const navigateToGame = () => {
    navigate(generateActiveGameLink());
  };

  return { navigateToGame, generateActiveGameLink, generateObjectiveDetailsLink };
};

export default useRouterHelpers;
