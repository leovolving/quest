// src/components/CategoryList.jsx
import React from 'react';
import styled from 'styled-components';
import ObjectiveItem from './ObjectiveItem';

const Category = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
`;

const CategoryList = ({ category }) => (
  <Category>
    <h3>{category.name}</h3>
    {category.objectives.map(obj => (
      <ObjectiveItem
        key={obj.id}
        objective={obj}
      />
    ))}
  </Category>
);

export default CategoryList;
