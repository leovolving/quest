import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ACTION_NAMES } from '../constants';

import useToggleObjective from '../hooks/useToggleObjective';
import useStateToggleBoolean from '../hooks/useStateToggleBoolean';

import { useGameContext } from '../context/GameContext';
import useAnalytics from '../services/analyticsService';
import useGameDataService from '../services/gameDataService';

import { MarkCompleteButton } from './common/MarkCompleteButton';
import { ObjectiveProgress } from './common/ObjectiveProgress';
import TagsList from './common/TagsList';
import { EditObjectiveForm } from './forms/EditObjectiveForm';

import ThreeDotMenu from './_ds/ThreeDotMenu';

import { Clone, Keyboard, TrashCan } from '../icons';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  transition: background-color 0.2s ease-in-out;
  flex-direction: column;

  border-top: 1px solid ${({ theme }) => theme.colors.border};

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

const Title = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const Note = styled.em`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs};
  display: block;
`;

const ObjectiveItem = ({ objective }) => {
  const toggleObjective = useToggleObjective();
  const { deleteObjective, duplicateObjective } = useGameDataService();
  const { showTags } = useGameContext();
  const { logAction } = useAnalytics();
  const { gameId } = useParams();

  const [isEditing, toggleIsEditing] = useStateToggleBoolean(false);

  const analyticsMetadata = { objective_id: objective.id, game_id: gameId };

  const handleChange = () => {
    logAction(ACTION_NAMES.objectiveItemCompleteToggle, {
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
      {isEditing ? (
        <EditObjectiveForm objective={objective} onClose={toggleIsEditing} />
      ) : (
        <>
          <TitleContainer>
            <Title>{objective.title}</Title>
            <ThreeDotMenu
              options={[
                { label: 'Edit', onClick: handleEdit, icon: Keyboard },
                { label: 'Duplicate', onClick: handleDuplicate, icon: Clone },
                { label: 'Delete', onClick: handleDelete, icon: TrashCan },
              ]}
            />
          </TitleContainer>
          {objective.notes && <Note>{objective.notes}</Note>}
          <MarkCompleteButton isComplete={objective.completed} onClick={handleChange} />
          <ObjectiveProgress
            objective={objective}
            onChangeActionName={ACTION_NAMES.objectiveItemProgressChanged}
          />
          {showTags && <TagsList tags={objective.tags} />}
        </>
      )}
    </Wrapper>
  );
};

export default ObjectiveItem;
