import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import { ACTION_NAMES } from '../constants';
import useAnalytics from '../services/analyticsService';
import useGameDataService from '../services/gameDataService';
import useRouterHelpers from '../hooks/useRouterHelpers';
import useToggleObjective from '../hooks/useToggleObjective';
import useStateToggleBoolean from '../hooks/useStateToggleBoolean';

import { Button, BUTTON_VARIANT } from '../components/_ds';
import { ObjectiveProgress } from '../components/common/ObjectiveProgress';

import { BackLink } from '../components/common/BackLink';
import TagsList from '../components/common/TagsList';
import { EditObjectiveForm } from '../components/forms/EditObjectiveForm';

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
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

const ObjectiveDetail = () => {
  const { logAction } = useAnalytics();
  const { generateActiveGameLink } = useRouterHelpers();
  const { getObjective, deleteObjective, duplicateObjective } = useGameDataService();
  const { gameId, objectiveId } = useParams();
  const objective = getObjective(objectiveId);

  const analyticsMetadata = { game_id: gameId, objective_id: objectiveId };

  const toggleObjective = useToggleObjective();

  const [isEditing, toggleIsEditing] = useStateToggleBoolean(false);

  if (!objective) {
    return (
      <div>
        <BackLink to={generateActiveGameLink()} variant="tertiary" />
        <p>Objective not found.</p>
      </div>
    );
  }

  const handleChange = () => {
    logAction(ACTION_NAMES.objectiveDetailCompleteToggle, {
      ...analyticsMetadata,
      new_value: !objective.completed,
    });

    toggleObjective(objective);
  };

  const handleEdit = () => {
    logAction(ACTION_NAMES.objectiveDetailEditClicked);
    toggleIsEditing();
  };

  const handleDelete = () => {
    logAction(ACTION_NAMES.objectiveDetailDeleteClicked, analyticsMetadata);
    deleteObjective(objective.id);
  };

  const handleDuplicate = () => {
    logAction(ACTION_NAMES.objectiveDetailDuplicateClicked, analyticsMetadata);
    duplicateObjective(objective.id);
  };

  return (
    <Wrapper>
      <BackLink to={generateActiveGameLink()} />
      <Content>
        {isEditing ? (
          <EditObjectiveForm objective={objective} onClose={toggleIsEditing} />
        ) : (
          <>
            <label>
              <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
              <Title>{objective.title}</Title>
            </label>
            {objective.notes && <Note>{objective.notes}</Note>}
            <ObjectiveProgress
              objective={objective}
              onChangeActionName={ACTION_NAMES.objectiveDetailProgressChanged}
            />
            <TagsList tags={objective.tags} />
            <ActionsContainer>
              <Button onClick={handleEdit} variant={BUTTON_VARIANT.TERTIARY}>
                Edit objective
              </Button>
              <Button onClick={handleDuplicate} variant={BUTTON_VARIANT.SECONDARY}>
                + Duplicate
              </Button>
              <Button onClick={handleDelete} variant={BUTTON_VARIANT.DANGER}>
                Delete
              </Button>
            </ActionsContainer>
          </>
        )}
      </Content>
    </Wrapper>
  );
};

export default ObjectiveDetail;
