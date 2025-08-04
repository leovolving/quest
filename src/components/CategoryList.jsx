import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button } from './_ds';

import ObjectiveList from './ObjectiveList';
import NewObjectiveForm from './forms/NewObjectiveForm';

const Category = styled.div`
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CategoryTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const EmptyMessage = styled.em`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CategoryList = ({ category, hideCompleted }) => {
  const [showForm, setShowForm] = useState(false);
  const objectives = useMemo(
    () => (hideCompleted ? category.objectives.filter((o) => !o.completed) : category.objectives),
    [category, hideCompleted]
  );

  return (
    <Category>
      <TitleContainer>
        <CategoryTitle>{category.name}</CategoryTitle>
        <Button onClick={() => setShowForm(true)}>+ Add new task</Button>
      </TitleContainer>
      {showForm && (
        <NewObjectiveForm
          initialValues={{ category: category.name }}
          onClose={() => setShowForm(false)}
        />
      )}
      {objectives.length === 0 ? (
        <EmptyMessage>{hideCompleted ? 'All tasks completed!' : 'No tasks yet'}</EmptyMessage>
      ) : (
        <ObjectiveList objectives={objectives} hideCompleted={hideCompleted} />
      )}
    </Category>
  );
};

export default CategoryList;
