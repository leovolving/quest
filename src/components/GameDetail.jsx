// src/components/GameDetail.js
import React, { useState } from 'react';
import CategoryList from './CategoryList';
import TagView from './TagView';

const GameDetail = ({ game, goBack }) => {
  const [groupByTagType, setGroupByTagType] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);

  const tagTypes = Array.from(
    new Set(
      game.categories.flatMap(cat =>
        cat.objectives.flatMap(obj => obj.tags?.map(tag => tag.type) || [])
      )
    )
  );

  return (
    <div className="game-detail">
      <button onClick={goBack}>← Back</button>
      <h1>{game.name}</h1>

      <div className="view-controls">
        <label>
          Group by tag:
          <select
            value={groupByTagType}
            onChange={e => setGroupByTagType(e.target.value)}
          >
            <option value="">Category</option>
            {tagTypes.map(type => (
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
            onChange={() => setHideCompleted(prev => !prev)}
          />{' '}
          Hide completed
        </label>
      </div>

      {groupByTagType ? (
        <TagView
          categories={game.categories}
          tagType={groupByTagType}
          hideCompleted={hideCompleted}
        />
      ) : (
        game.categories.map(cat => (
          <CategoryList key={cat.id} category={cat} hideCompleted={hideCompleted} />
        ))
      )}
    </div>
  );
};

export default GameDetail;
