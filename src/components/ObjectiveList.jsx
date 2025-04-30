import React from 'react';
import ObjectiveItem from './ObjectiveItem';

const ObjectiveList = ({ objectives, hideCompleted }) => {
    const emptyMessage = hideCompleted ? 'All objectives completed!' : 'No objectives yet'
  if (objectives.length === 0) {
    return <em>{emptyMessage}</em>;
  }

  return (
      objectives.map(objective => (
        <ObjectiveItem key={objective.id} objective={objective} />
      ))
  );
};

export default ObjectiveList;
