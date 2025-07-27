import { useState } from 'react';
import { styled } from 'styled-components';

import useGameDataService from '../../services/gameDataService';
import useToggleObjective from '../../hooks/useToggleObjective';

import { Button } from '../_ds';

import TagEditor from './TagEditor';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  input:not([type='checkbox']),
  select,
  textarea {
    width: 100%;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Checkbox = styled.input`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  max-width: 100%;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

  const handleChange = () => {
    toggleObjective(objective);
  };

  const handleTagUpdate = (newTags) => {
    updateObjective({ ...objective, tags: newTags });
  };
  return (
    <Form onSubmit={handleEditSubmit}>
      <CheckboxLabel>
        <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
        Complete?
      </CheckboxLabel>
      <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <label>
        Progress:
        <InputContainer>
          <input
            type="number"
            min="0"
            value={progressCurrent}
            onChange={(e) => setProgressCurrent(e.target.value)}
            placeholder="Current"
          />
          <span>/</span>
          <input
            type="number"
            min="1"
            value={progressTotal}
            onChange={(e) => setProgressTotal(e.target.value)}
            placeholder="Total"
          />
        </InputContainer>
      </label>
      <TagEditor objective={objective} onUpdateTags={handleTagUpdate} />
      <ButtonGroup>
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </ButtonGroup>
    </Form>
  );
};
