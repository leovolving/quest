// src/components/GameDetail.js
import React, { useState } from 'react';

import CategoryList from './CategoryList';
import TagView from './TagView';
import NewObjectiveForm from './forms/NewObjectiveForm';

import { useGameContext } from '../context/GameContext';

const GameDetail = () => {
  const [groupByTagType, setGroupByTagType] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const { selectedGame: game, setSelectedGame, setGames } = useGameContext();

  const tagTypes = Array.from(
    new Set(
      game.categories.flatMap((cat) =>
        cat.objectives.flatMap((obj) => obj.tags?.map((tag) => tag.type) || [])
      )
    )
  );

  const filteredCategories = game.categories.map((cat) => {
    const visibleObjectives = hideCompleted
      ? cat.objectives.filter((obj) => !obj.completed)
      : cat.objectives;
    return { ...cat, visibleObjectives };
  });

  const filteredForTagView = game.categories.map((cat) => ({
    ...cat,
    objectives: hideCompleted ? cat.objectives.filter((obj) => !obj.completed) : cat.objectives,
  }));

  const onUpdateStatus = (e) => {
    const updatedGame = { ...game, status: e.target.value };
    setSelectedGame(updatedGame);
    setGames((prev) => prev.map((g) => (g.id === game.id ? updatedGame : g)));
  };

  return (
    <div className="game-detail">
      <button onClick={() => setSelectedGame(null)}>← Back</button>
      <h1>{game.name}</h1>
      <label>
        Status:{' '}
        <select value={game.status || 'not-played'} onChange={onUpdateStatus}>
          <option value="not-played">Not Played</option>
          <option value="currently-playing">Currently Playing</option>
          <option value="beaten-game">Game Beaten</option>
        </select>
      </label>

      <div className="view-controls">
        <label>
          Group by tag:
          <select value={groupByTagType} onChange={(e) => setGroupByTagType(e.target.value)}>
            <option value="">Category</option>
            {tagTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={() => setHideCompleted((prev) => !prev)}
          />{' '}
          Hide completed
        </label>
      </div>

      {groupByTagType ? (
        <TagView
          categories={filteredForTagView}
          tagType={groupByTagType}
          hideCompleted={hideCompleted}
        />
      ) : (
        filteredCategories.map((cat) => (
          <CategoryList
            key={cat.id}
            category={{ ...cat, objectives: cat.visibleObjectives }}
            hideCompleted={hideCompleted}
          />
        ))
      )}

      <NewObjectiveForm />
    </div>
  );
};

export default GameDetail;
