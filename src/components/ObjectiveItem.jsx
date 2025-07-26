import { useState } from 'react';
import styled from 'styled-components';

import useStateToggleBoolean from '../hooks/useStateToggleBoolean';
import useToggleObjective from '../hooks/useToggleObjective';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';

import TagEditor from './forms/TagEditor';
import TagsList from './common/TagsList';

import { Button, ProgressBar } from './_ds';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  transition: background-color 0.2s ease-in-out;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
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
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
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

const ProgressText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
`;

const ObjectiveItem = ({ objective }) => {
  const toggleObjective = useToggleObjective();
  const { selectedGame } = useGameContext();
  const { duplicateObjective, updateGame } = useGameDataService();

  const [isEditing, toggleIsEditing] = useStateToggleBoolean(false);
  const [title, setTitle] = useState(objective.title);
  const [notes, setNotes] = useState(objective.notes || '');
  const [progressCurrent, setProgressCurrent] = useState(objective.progress?.current || '');
  const [progressTotal, setProgressTotal] = useState(objective.progress?.total || '');

  const handleChange = () => {
    toggleObjective(objective);
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
    toggleIsEditing();
  };

  // TODO: use game data service for these game-updating functions

  const handleDuplicate = () => {
    duplicateObjective(objective.id);
  };

  const handleProgressChange = (delta) => {
    const updatedCategories = selectedGame.categories.map((cat) => {
      const updatedObjectives = cat.objectives.map((obj) => {
        if (obj.id !== objective.id) return obj;

        const updatedCurrent = Math.max(
          0,
          Math.min((obj.progress?.current || 0) + delta, obj.progress?.total || 0)
        );

        return {
          ...obj,
          progress: {
            ...obj.progress,
            current: updatedCurrent,
          },
          completed: updatedCurrent >= obj.progress.total,
        };
      });

      return { ...cat, objectives: updatedObjectives };
    });

    const updatedGame = { ...selectedGame, categories: updatedCategories };
    updateGame(updatedGame);
  };

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

  const handleTagUpdate = (newTags) => {
    updateObjective({ ...objective, tags: newTags });
  };

  return (
    <Wrapper>
      <Content>
        {isEditing ? (
          <Form onSubmit={handleEditSubmit}>
            <label>
              <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
              Complete?
            </label>
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
              <Button type="button" onClick={toggleIsEditing} variant="secondary">
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        ) : (
          <>
            <label>
              <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
              <Title>{objective.title}</Title>
            </label>

            {objective.progress && (
              <>
                <ProgressText>
                  Progress: {objective.progress.current} / {objective.progress.total}
                </ProgressText>
                <ProgressControls>
                  <Button variant="secondary" onClick={() => handleProgressChange(-1)}>
                    -
                  </Button>
                  <ProgressBar value={objective.progress.current} max={objective.progress.total} />
                  <Button variant="secondary" onClick={() => handleProgressChange(1)}>
                    +
                  </Button>
                </ProgressControls>
              </>
            )}
            <TagsList tags={objective.tags} />
            {objective.notes && <Note>{objective.notes}</Note>}
            <ActionsContainer>
              <Button onClick={handleDuplicate} variant="secondary">
                + Duplicate
              </Button>
              <Button onClick={toggleIsEditing} variant="tertiary">
                Edit objective
              </Button>
            </ActionsContainer>
          </>
        )}
      </Content>
    </Wrapper>
  );
};

export default ObjectiveItem;
