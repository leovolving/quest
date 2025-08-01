import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ACTION_NAMES } from '../constants';
import useToggleObjective from '../hooks/useToggleObjective';
import useRouterHelpers from '../hooks/useRouterHelpers';
import useAnalytics from '../services/analyticsService';

import { Button } from './_ds';

import { ObjectiveProgress } from './common/ObjectiveProgress';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  transition: background-color 0.2s ease-in-out;
  flex-direction: column;

  &:not(:last-of-type) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  justify-content: space-between;
`;

const Checkbox = styled.input`
  margin-top: ${({ theme }) => theme.spacing.xs};
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

const ObjectiveItem = ({ objective }) => {
  const toggleObjective = useToggleObjective();
  const { generateObjectiveDetailsLink } = useRouterHelpers();
  const { logAction } = useAnalytics();
  const { gameId } = useParams();

  const analyticsMetadata = { objective_id: objective.id, game_id: gameId };

  const handleChange = () => {
    logAction(ACTION_NAMES.objectiveItemCompleteToggle, {
      ...analyticsMetadata,
      new_value: !objective.completed,
    });
    toggleObjective(objective);
  };

  return (
    <Wrapper>
      <TitleContainer>
        <label>
          <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
          <Title>{objective.title}</Title>
        </label>
        <Button as={Link} to={generateObjectiveDetailsLink(objective.id)}>
          Manage
        </Button>
      </TitleContainer>
      {objective.notes && <Note>{objective.notes}</Note>}

      <ObjectiveProgress
        objective={objective}
        onChangeActionName={ACTION_NAMES.objectiveItemProgressChanged}
      />
    </Wrapper>
  );
};

export default ObjectiveItem;
