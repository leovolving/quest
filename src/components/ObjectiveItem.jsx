// src/components/ObjectiveItem.jsx
import React from 'react';
import styled from 'styled-components';
import useToggleObjective from '../hooks/useToggleObjective';

const Wrapper = styled.div`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ObjectiveItem = ({ objective }) => {
  const toggleObjective = useToggleObjective();

  const handleChange = () => {
    toggleObjective(objective);
  };

  return (
    <Wrapper>
      <input
        type="checkbox"
        checked={objective.completed}
        onChange={handleChange}
      />
      <span>{objective.title}</span>
      {objective.notes && <em> - {objective.notes}</em>}
    </Wrapper>
  );
};

export default ObjectiveItem;
