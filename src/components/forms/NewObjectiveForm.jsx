// src/components/forms/NewObjectiveForm.js
import React, { useState } from 'react';
import styled from 'styled-components';

import TagEditor from './TagEditor';

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

const TagList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  li {
    background: ${({ theme }) => (theme.mode === 'dark' ? '#444' : '#eee')};
    color: ${({ theme }) => (theme.mode === 'dark' ? '#fff' : '#000')};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
`;

const NewObjectiveForm = () => {
  const { selectedGame: game, setGames, setSelectedGame } = useGameContext();

  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [newObjectiveNote, setNewObjectiveNote] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState(game.categories[0]?.name || '');
  const [newTags, setNewTags] = useState([]);

  const uniqueCategoryNames = Array.from(new Set(game.categories.map((cat) => cat.name)));

  const handleAddObjective = (e) => {
    e.preventDefault();
    if (!newObjectiveTitle || !selectedCategoryName) return;

    let category = game.categories.find((cat) => cat.name === selectedCategoryName);
    let updatedCategories;

    if (!category) {
      const newCategory = {
        id: `${Date.now()}`,
        name: selectedCategoryName,
        objectives: [],
      };
      category = newCategory;
      updatedCategories = [...game.categories, newCategory];
    } else {
      updatedCategories = [...game.categories];
    }

    updatedCategories = updatedCategories.map((cat) => {
      if (cat.name !== selectedCategoryName) return cat;
      return {
        ...cat,
        objectives: [
          ...cat.objectives,
          {
            id: `${cat.id}-${cat.objectives.length + 1}`,
            title: newObjectiveTitle,
            completed: false,
            notes: newObjectiveNote,
            tags: newTags,
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
    setNewTags([]);
  };

  return (
    <FormContainer onSubmit={handleAddObjective}>
      <h3>Add New Objective</h3>
      <label>
        Category:
        <input
          list="category-options"
          value={selectedCategoryName}
          onChange={(e) => setSelectedCategoryName(e.target.value)}
          placeholder="Category name"
        />
        <datalist id="category-options">
          {uniqueCategoryNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
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

      <TagEditor objective={{ tags: newTags }} onUpdateTags={(t) => setNewTags(t)} />

      <button type="submit">Add Objective</button>
    </FormContainer>
  );
};

export default NewObjectiveForm;
