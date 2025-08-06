import ObjectiveItem from './ObjectiveItem';

const ObjectiveList = ({ objectives, hideCompleted }) => {
  const emptyMessage = hideCompleted ? 'All tasks completed!' : 'No tasks yet';
  if (objectives.length === 0) {
    return <em>{emptyMessage}</em>;
  }

  return objectives.map((objective) => <ObjectiveItem key={objective.id} objective={objective} />);
};

export default ObjectiveList;
