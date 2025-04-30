// src/components/CategoryList.jsx
import React, {useMemo} from 'react';
import styled from 'styled-components';
import ObjectiveList from './ObjectiveList';

const Category = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
`;

const CategoryList = ({ category, hideCompleted }) => {
    const objectives = useMemo(() => hideCompleted ? category.objectives.filter(o => !o.completed) : category.objectives, [category, hideCompleted])
    return (
    <Category>
        <h3>{category.name}</h3>
        <ObjectiveList objectives={objectives} hideCompleted={hideCompleted} />
    </Category>
    )
};

export default CategoryList;
