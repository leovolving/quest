// src/components/CategoryList.jsx
import React, { useMemo } from 'react';
import styled from 'styled-components';
import ObjectiveList from './ObjectiveList';

const Category = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CategoryTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
`;

const EmptyMessage = styled.em`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CategoryList = ({ category, hideCompleted }) => {
  const objectives = useMemo(
    () => (hideCompleted ? category.objectives.filter((o) => !o.completed) : category.objectives),
    [category, hideCompleted]
  );

  return (
    <Category>
      <CategoryTitle>{category.name}</CategoryTitle>
      {objectives.length === 0 ? (
        <EmptyMessage>
          {hideCompleted ? 'All objectives completed!' : 'No objectives yet'}
        </EmptyMessage>
      ) : (
        <ObjectiveList objectives={objectives} hideCompleted={hideCompleted} />
      )}
    </Category>
  );
};

export default CategoryList;
