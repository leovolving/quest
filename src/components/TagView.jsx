import styled from 'styled-components';
import ObjectiveList from './ObjectiveList';

const TagGroup = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const groupObjectivesByTag = (categories, tagType, hideCompleted) => {
  const grouped = {};
  categories.forEach((category) => {
    category.objectives.forEach((obj) => {
      obj.tags?.forEach((tag) => {
        if (tag.type?.toLowerCase() === tagType) {
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
        <TagGroup key={tagValue} className="tag-group">
          <h3>{tagValue}</h3>
          <ObjectiveList objectives={objectives} hideCompleted={hideCompleted} />
        </TagGroup>
      ))}
    </div>
  );
};

export default TagView;
