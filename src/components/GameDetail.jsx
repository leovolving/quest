// src/components/GameDetail.js
import React, { useState } from 'react';
import styled from 'styled-components';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';

import CategoryList from './CategoryList';
import TagView from './TagView';
import NewObjectiveForm from './forms/NewObjectiveForm';

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cardHover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GameTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
`;

const StatusSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
`;

const GameDetail = () => {
  const [groupByTagType, setGroupByTagType] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const { selectedGame: game, setSelectedGameId } = useGameContext();
  const { updateGame } = useGameDataService();

  const tagTypes = Array.from(
    new Set(
      game.categories.flatMap((cat) =>
        cat.objectives.flatMap((obj) => obj.tags?.map((tag) => tag.type) || [])
      )
    )
  );

  const filteredCategories = game.categories.map((cat) => {
    const visibleObjectives = hideCompleted
      ? cat.objectives.filter((obj) => !obj.completed)
      : cat.objectives;
    return { ...cat, visibleObjectives };
  });

  const filteredForTagView = game.categories.map((cat) => ({
    ...cat,
    objectives: hideCompleted ? cat.objectives.filter((obj) => !obj.completed) : cat.objectives,
  }));

  const onUpdateStatus = (e) => {
    const updatedGame = { ...game, status: e.target.value };
    updateGame(updatedGame);
  };

  return (
    <div>
      <BackButton onClick={() => setSelectedGameId(null)}>← Back to Games</BackButton>

      <GameHeader>
        <GameTitle>{game.name}</GameTitle>
        <StatusSelect value={game.status || 'not-played'} onChange={onUpdateStatus}>
          <option value="not-played">Not Played</option>
          <option value="currently-playing">Currently Playing</option>
          <option value="beaten-game">Game Beaten</option>
        </StatusSelect>
      </GameHeader>

      <ViewControls>
        <ControlGroup>
          <Label>
            Group by tag:
            <StatusSelect
              value={groupByTagType}
              onChange={(e) => setGroupByTagType(e.target.value)}
            >
              <option value="">Category</option>
              {tagTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </StatusSelect>
          </Label>
        </ControlGroup>

        <ControlGroup>
          <Checkbox
            type="checkbox"
            checked={hideCompleted}
            onChange={() => setHideCompleted((prev) => !prev)}
            id="hide-completed"
          />
          <Label htmlFor="hide-completed">Hide completed</Label>
        </ControlGroup>
      </ViewControls>

      {groupByTagType ? (
        <TagView
          categories={filteredForTagView}
          tagType={groupByTagType}
          hideCompleted={hideCompleted}
        />
      ) : (
        filteredCategories.map((cat) => (
          <CategoryList
            key={cat.id}
            category={{ ...cat, objectives: cat.visibleObjectives }}
            hideCompleted={hideCompleted}
          />
        ))
      )}

      <NewObjectiveForm />
    </div>
  );
};

export default GameDetail;
