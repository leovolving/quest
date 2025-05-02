// src/components/TagView.js
import React from 'react';
import ObjectiveList from './ObjectiveList';

const groupObjectivesByTag = (categories, tagType, hideCompleted) => {
  const grouped = {};
  categories.forEach((category) => {
    category.objectives.forEach((obj) => {
      obj.tags?.forEach((tag) => {
        if (tag.type === tagType) {
          if (!grouped[tag.value]) grouped[tag.value] = [];
          if (!(hideCompleted && obj.completed)) {
            grouped[tag.value].push(obj);
          }
        }
      });
    });
  });
  return grouped;
};

const TagView = ({ categories, tagType, hideCompleted = false }) => {
  const grouped = groupObjectivesByTag(categories, tagType, hideCompleted);

  return (
    <div className="tag-view">
      {Object.entries(grouped).map(([tagValue, objectives]) => (
        <div key={tagValue} className="tag-group">
          <h3>{tagValue}</h3>
          <ObjectiveList objectives={objectives} hideCompleted={hideCompleted} />
        </div>
      ))}
    </div>
  );
};

export default TagView;
