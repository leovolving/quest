// src/components/ObjectiveItem.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

import useStateToggleBoolean from '../hooks/useStateToggleBoolean';
import useToggleObjective from '../hooks/useToggleObjective';

import { useGameContext } from '../context/GameContext';

import TagEditor from './forms/TagEditor';

const Wrapper = styled.div`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
      <input type="checkbox" checked={objective.completed} onChange={handleChange} />
      {isEditing ? (
        <Form onSubmit={handleEditSubmit}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={toggleIsEditing}>
            Cancel
          </button>
        </Form>
      ) : (
        <>
          <span>{objective.title}</span>
          {objective.notes && <em> - {objective.notes}</em>}
          <button onClick={toggleIsEditing}>Edit</button>
          <TagEditor objective={objective} onUpdateTags={handleTagUpdate} />
        </>
      )}
    </Wrapper>
  );
};

export default ObjectiveItem;
