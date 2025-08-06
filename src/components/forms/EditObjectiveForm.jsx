import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import useGameDataService from '../../services/gameDataService';
import useToggleObjective from '../../hooks/useToggleObjective';
import useAnalytics from '../../services/analyticsService';

import { Button, InputField } from '../_ds';

import { MarkCompleteButton } from '../common/MarkCompleteButton';

import TagEditor from './TagEditor';
import { ACTION_NAMES } from '../../constants';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  select,
  textarea {
    width: 100%;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  max-width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EditObjectiveForm = ({ objective, onClose }) => {
  const [title, setTitle] = useState(objective?.title || '');
  const [notes, setNotes] = useState(objective?.notes || '');
  const [progressCurrent, setProgressCurrent] = useState(objective?.progress?.current || '');
  const [progressTotal, setProgressTotal] = useState(objective?.progress?.total || '');

  const toggleObjective = useToggleObjective();
  const { selectedGame, updateGame } = useGameDataService();
  const { logAction } = useAnalytics();
  const { gameId } = useParams();

  const analyticsMetadata = { game_id: gameId, objective_id: objective.id };

  const updateObjective = (updatedObj) => {
    const updatedGame = {
      ...selectedGame,
      categories: selectedGame.categories.map((cat) =>
        cat.id !== updatedObj.categoryId
          ? cat
          : {
              ...cat,
              objectives: cat.objectives.map((obj) =>
                obj.id === updatedObj.id ? updatedObj : obj
              ),
            }
      ),
    };
    logAction(ACTION_NAMES.editObjectiveSuccess, analyticsMetadata);
    updateGame(updatedGame);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const newObjective = { ...objective, title, notes };
    if (progressTotal) {
      newObjective.progress = {
        current: parseInt(progressCurrent || '0', 10),
        total: parseInt(progressTotal, 10),
      };
    }

    updateObjective(newObjective);
    onClose();
  };

  const handleCancel = () => {
    logAction(ACTION_NAMES.editObjectiveCanceled, analyticsMetadata);
    onClose();
  };

  const handleChange = () => {
    logAction(ACTION_NAMES.editObjectiveCompleteToggle, {
      ...analyticsMetadata,
      new_value: !objective.completed,
    });
    toggleObjective(objective);
  };

  const handleTagUpdate = (newTags) => {
    updateObjective({ ...objective, tags: newTags });
  };
  return (
    <Form onSubmit={handleEditSubmit}>
      <MarkCompleteButton isComplete={objective.completed} onClick={handleChange} />
      <InputField
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Title"
        required
        blurActionName={ACTION_NAMES.editObjectiveTitleBlur}
        focusActionName={ACTION_NAMES.editObjectiveTitleFocus}
        analyticsMetadata={analyticsMetadata}
      />
      <InputField
        as="textarea"
        label="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        blurActionName={ACTION_NAMES.editObjectiveNoteBlur}
        focusActionName={ACTION_NAMES.editObjectiveNoteFocus}
        analyticsMetadata={analyticsMetadata}
      />
      <label>
        Progress:
        <InputContainer>
          <InputField
            type="number"
            min="0"
            value={progressCurrent}
            onChange={(e) => setProgressCurrent(e.target.value)}
            label="Current"
            blurActionName={ACTION_NAMES.editObjectiveProgressCurrentBlur}
            focusActionName={ACTION_NAMES.editObjectiveProgressCurrentFocus}
            analyticsMetadata={analyticsMetadata}
          />
          <span>/</span>
          <InputField
            type="number"
            min="1"
            value={progressTotal}
            onChange={(e) => setProgressTotal(e.target.value)}
            label="Total"
            blurActionName={ACTION_NAMES.editObjectiveProgressTotalBlur}
            focusActionName={ACTION_NAMES.editObjectiveProgressTotalFocus}
            analyticsMetadata={analyticsMetadata}
          />
        </InputContainer>
      </label>
      <TagEditor
        objective={objective}
        onUpdateTags={handleTagUpdate}
        typeInputProps={{
          analyticsMetadata,
          blurActionName: ACTION_NAMES.editObjectiveTagTypeBlur,
          focusActionName: ACTION_NAMES.editObjectiveTagTypeFocus,
        }}
        valueInputProps={{
          analyticsMetadata,
          blurActionName: ACTION_NAMES.editObjectiveTagValueBlur,
          focusActionName: ACTION_NAMES.editObjectiveTagValueFocus,
        }}
      />
      <ButtonGroup>
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button type="button" onClick={handleCancel} variant="secondary">
          Cancel
        </Button>
      </ButtonGroup>
    </Form>
  );
};
