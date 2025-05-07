// src/components/ObjectiveItem.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

import useStateToggleBoolean from '../hooks/useStateToggleBoolean';
import useToggleObjective from '../hooks/useToggleObjective';

import { useGameContext } from '../context/GameContext';

import TagEditor from './forms/TagEditor';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardHover};
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

const EditButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 500;
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.text};
  }
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
  const { selectedGame, setGames, setSelectedGame } = useGameContext();
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
    setGames((prev) => prev.map((g) => (g.id === selectedGame.id ? updatedGame : g)));
    setSelectedGame(updatedGame);
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
    setSelectedGame(updatedGame);
    setGames((prevGames) =>
      prevGames.map((game) => (game.id !== selectedGame.id ? game : updatedGame))
    );
  };

  const handleTagUpdate = (newTags) => {
    updateObjective({ ...objective, tags: newTags });
  };

  return (
    <Wrapper>
      <Checkbox type="checkbox" checked={objective.completed} onChange={handleChange} />
      <Content>
        {isEditing ? (
          <Form onSubmit={handleEditSubmit}>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input
              type="text"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <ButtonGroup>
              <SaveButton type="submit">Save</SaveButton>
              <CancelButton type="button" onClick={toggleIsEditing}>
                Cancel
              </CancelButton>
            </ButtonGroup>
          </Form>
        ) : (
          <>
            <Title>{objective.title}</Title>
            {objective.notes && <Note> - {objective.notes}</Note>}
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
            <EditButton onClick={toggleIsEditing}>Edit</EditButton>
            <TagEditor objective={objective} onUpdateTags={handleTagUpdate} />
          </>
        )}
      </Content>
    </Wrapper>
  );
};

export default ObjectiveItem;
