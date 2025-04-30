// src/components/GameDetail.jsx
import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';
import CategoryList from './CategoryList';

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GameDetail = ({ game }) => {
  const { setSelectedGame } = useGameContext();

  return (
    <Detail>
      <button onClick={() => setSelectedGame(null)}>← Back</button>
      <h1>{game.name}</h1>
      {game.categories.map(cat => (
        <CategoryList key={cat.id} category={cat} />
      ))}
    </Detail>
  );
};

export default GameDetail;
