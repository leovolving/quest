import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Button, InputField } from '../../components/_ds';

import { useGameContext } from '../../context/GameContext';
import useGameDataService from '../../services/gameDataService';
import useAnalytics from '../../services/analyticsService';

import { ACTION_NAMES } from '../../constants';

import TagEditor from './TagEditor';

const FormContainer = styled.form`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  label {
    font-weight: bold;
    display: block;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
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
    width: 100%;
    align-items: center;
  }

  fieldset {
    padding: 0;
    margin: 1.5rem 0 0;
    border: none;

    label {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  button {
    align-self: flex-start;
  }
`;

const TagsHeader = styled.h4`
  margin-bottom: 0;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const FlexInputField = styled(InputField)`
  flex: 1;
`;

const NewObjectiveForm = () => {
  const { selectedGame: game } = useGameContext();
  const { updateGame } = useGameDataService();
  const { logAction } = useAnalytics();
  const { gameId } = useParams();

  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [newObjectiveNote, setNewObjectiveNote] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
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

  const analyticsMetadata = { game_id: gameId };

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
    logAction(ACTION_NAMES.addNewObjectiveSuccess, {
      ...analyticsMetadata,
      objective_id: newObjective.id,
    });

    updateGame(updatedGame, { onSuccess: resetForm });
  };

  return (
    <FormContainer onSubmit={handleAddObjective}>
      <h3>Add new objective</h3>

      <InputField
        list="category-options"
        value={selectedCategoryName}
        onChange={(e) => setSelectedCategoryName(e.target.value)}
        placeholder="Category name"
        label="Category"
        blurActionName={ACTION_NAMES.addNewObjectiveCategoryBlur}
        focusActionName={ACTION_NAMES.addNewObjectiveCategoryFocus}
        analyticsMetadata={analyticsMetadata}
      />
      <datalist id="category-options">
        {uniqueCategoryNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <InputField
        type="text"
        value={newObjectiveTitle}
        onChange={(e) => setNewObjectiveTitle(e.target.value)}
        placeholder="Objective title"
        label="Title"
        blurActionName={ACTION_NAMES.addNewObjectiveTitleBlur}
        focusActionName={ACTION_NAMES.addNewObjectiveTitleFocus}
        analyticsMetadata={analyticsMetadata}
      />
      <InputField
        value={newObjectiveNote}
        onChange={(e) => setNewObjectiveNote(e.target.value)}
        placeholder="Optional note"
        label="Notes"
        as="textarea"
        blurActionName={ACTION_NAMES.addNewObjectiveNoteBlur}
        focusActionName={ACTION_NAMES.addNewObjectiveNoteFocus}
        analyticsMetadata={analyticsMetadata}
      />
      <fieldset>
        <legend>Progress</legend>
        <InputContainer>
          <FlexInputField
            type="number"
            min="0"
            value={progressCurrent}
            onChange={(e) => setProgressCurrent(e.target.value)}
            label="Current"
            blurActionName={ACTION_NAMES.addNewObjectiveProgressCurrentBlur}
            focusActionName={ACTION_NAMES.addNewObjectiveProgressCurrentFocus}
            analyticsMetadata={analyticsMetadata}
          />
          <span>/</span>
          <FlexInputField
            type="number"
            min="1"
            value={progressTotal}
            onChange={(e) => setProgressTotal(e.target.value)}
            label="Total"
            blurActionName={ACTION_NAMES.addNewObjectiveProgressTotalBlur}
            focusActionName={ACTION_NAMES.addNewObjectiveProgressTotalFocus}
            analyticsMetadata={analyticsMetadata}
          />
        </InputContainer>
      </fieldset>
      <TagsHeader>Tags</TagsHeader>
      <TagEditor
        objective={{ tags: newTags }}
        onUpdateTags={(t) => setNewTags(t)}
        typeInputProps={{
          analyticsMetadata,
          blurActionName: ACTION_NAMES.addNewObjectiveTagTypeBlur,
          focusActionName: ACTION_NAMES.addNewObjectiveTagTypeFocus,
        }}
        valueInputProps={{
          analyticsMetadata,
          blurActionName: ACTION_NAMES.addNewObjectiveTagValueBlur,
          focusActionName: ACTION_NAMES.addNewObjectiveTagValueFocus,
        }}
      />

      <Button type="submit" variant="primary">
        Add Objective
      </Button>
    </FormContainer>
  );
};

export default NewObjectiveForm;
