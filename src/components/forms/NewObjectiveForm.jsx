// src/components/GameDetail.js
import React, { useState } from 'react';
import styled from 'styled-components';

import { useGameContext } from '../../context/GameContext';

const FormContainer = styled.form`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }

  input,
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 4px;
  }

  button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const NewObjectiveForm = () => {
  const { selectedGame: game, setGames, setSelectedGame } = useGameContext();

  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [newObjectiveNote, setNewObjectiveNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(game.categories[0]?.id || '');

  const handleAddObjective = (e) => {
    e.preventDefault();
    if (!newObjectiveTitle || !selectedCategoryId) return;

    const updatedCategories = game.categories.map((cat) => {
      if (cat.id !== selectedCategoryId) return cat;
      return {
        ...cat,
        objectives: [
          ...cat.objectives,
          {
            id: `${selectedCategoryId}-${game.categories.length + 1}`,
            title: newObjectiveTitle,
            completed: false,
            notes: newObjectiveNote,
            tags: [],
            categoryId: cat.id,
          },
        ],
      };
    });

    const updatedGame = { ...game, categories: updatedCategories };
    setGames((prev) => prev.map((g) => (g.id === game.id ? updatedGame : g)));
    setSelectedGame(updatedGame);
    setNewObjectiveTitle('');
    setNewObjectiveNote('');
  };

  return (
    <FormContainer onSubmit={handleAddObjective}>
      <h3>Add New Objective</h3>
      <label>
        Category:
        <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
          {game.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Title:
        <input
          type="text"
          value={newObjectiveTitle}
          onChange={(e) => setNewObjectiveTitle(e.target.value)}
          placeholder="Objective title"
        />
      </label>
      <label>
        Note:
        <textarea
          value={newObjectiveNote}
          onChange={(e) => setNewObjectiveNote(e.target.value)}
          placeholder="Optional note"
        />
      </label>
      <button type="submit">Add Objective</button>
    </FormContainer>
  );
};

export default NewObjectiveForm;
