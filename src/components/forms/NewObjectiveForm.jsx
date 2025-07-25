// src/components/forms/NewObjectiveForm.js
import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../components/_ds';

import { useGameContext } from '../../context/GameContext';
import useGameDataService from '../../services/gameDataService';

import TagEditor from './TagEditor';

const FormContainer = styled.form`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  label {
    font-weight: bold;
    margin-top: 1rem;
  }

  input,
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 4px;
    display: block;
    margin-top: 8px;
    min-width: 0;
    align-items: center;
  }

  button {
    align-self: flex-start;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const NewObjectiveForm = () => {
  const { selectedGame: game } = useGameContext();
  const { updateGame } = useGameDataService();

  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [newObjectiveNote, setNewObjectiveNote] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState(game.categories[0]?.name || '');
  const [newTags, setNewTags] = useState([]);
  const [progressCurrent, setProgressCurrent] = useState('');
  const [progressTotal, setProgressTotal] = useState('');

  const uniqueCategoryNames = Array.from(new Set(game.categories.map((cat) => cat.name)));

  const resetForm = () => {
    setNewObjectiveTitle('');
    setNewObjectiveNote('');
    setNewTags([]);
    setProgressCurrent('');
    setProgressTotal('');
  };

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

    const newObjective = {
      id: `${category.id}-${category.objectives.length + 1}`,
      title: newObjectiveTitle,
      completed: false,
      notes: newObjectiveNote,
      tags: newTags,
      categoryId: category.id,
    };

    if (progressTotal) {
      newObjective.progress = {
        current: parseInt(progressCurrent || '0', 10),
        total: parseInt(progressTotal, 10),
      };
    }

    updatedCategories = updatedCategories.map((cat) => {
      if (cat.name !== selectedCategoryName) return cat;
      return {
        ...cat,
        objectives: [...cat.objectives, newObjective],
      };
    });

    const updatedGame = { ...game, categories: updatedCategories };

    updateGame(updatedGame, { onSuccess: resetForm });
  };

  return (
    <FormContainer onSubmit={handleAddObjective}>
      <h3>Add new objective</h3>
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
      <h4>Tags</h4>
      <TagEditor objective={{ tags: newTags }} onUpdateTags={(t) => setNewTags(t)} />

      <Button type="submit" variant="primary">
        Add Objective
      </Button>
    </FormContainer>
  );
};

export default NewObjectiveForm;
