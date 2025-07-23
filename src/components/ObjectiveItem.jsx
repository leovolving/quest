import { useState } from 'react';
import styled from 'styled-components';

import useStateToggleBoolean from '../hooks/useStateToggleBoolean';
import useToggleObjective from '../hooks/useToggleObjective';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';

import TagEditor from './forms/TagEditor';
import TagsList from './common/TagsList';

import { Button } from './_ds';

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

const EditButton = styled(Button)`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.md} 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
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

const ProgressText = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;

  button {
    background: #666;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
`;

const ObjectiveItem = ({ objective }) => {
  const toggleObjective = useToggleObjective();
  const { selectedGame } = useGameContext();
  const { updateGame } = useGameDataService();

  const [isEditing, toggleIsEditing] = useStateToggleBoolean(false);
  const [title, setTitle] = useState(objective.title);
  const [notes, setNotes] = useState(objective.notes || '');

  const handleChange = () => {
    toggleObjective(objective);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateObjective({ ...objective, title, notes });
    toggleIsEditing();
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
                  <button onClick={() => handleProgressChange(-1)}>-</button>
                  <button onClick={() => handleProgressChange(1)}>+</button>
                </ProgressControls>
              </>
            )}
            <TagsList tags={objective.tags} />
            {objective.notes && <Note>{objective.notes}</Note>}
            <EditButton onClick={toggleIsEditing} variant="tertiary">
              Edit objective
            </EditButton>
          </>
        )}
      </Content>
    </Wrapper>
  );
};

export default ObjectiveItem;
