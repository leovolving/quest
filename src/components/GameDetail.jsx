import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';

import { STATUS_OPTIONS } from '../constants';

import CategoryList from './CategoryList';
import TagView from './TagView';
import NewObjectiveForm from './forms/NewObjectiveForm';

import { Select } from './_ds';

const BackLink = styled(Link)`
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
  text-decoration: none;
  transition:
    background 0.2s,
    border-color 0.2s;

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
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const GameTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
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

const Flex1ControlGroup = styled(ControlGroup)`
  flex: 1;
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
  const { selectedGame: game } = useGameContext();
  const { updateGame } = useGameDataService();

  if (!game) {
    return (
      <div>
        <BackLink to="/">← Back</BackLink>
        <p>Game not found.</p>
      </div>
    );
  }

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

  const isUsingTags = tagTypes.length > 0;
  const hasObjectives = game.categories.some((c) => c.objectives?.length > 0);
  const shouldShowGameControls = isUsingTags || hasObjectives;

  return (
    <div>
      <BackLink to="/">← Back</BackLink>
      <GameHeader>
        <GameTitle>{game.name}</GameTitle>
        <Select
          label="Game status"
          onChange={onUpdateStatus}
          options={STATUS_OPTIONS}
          value={game.status || 'not-played'}
        />
      </GameHeader>

      {shouldShowGameControls && (
        <ViewControls>
          {isUsingTags && (
            <ControlGroup>
              <Select
                value={groupByTagType}
                onChange={(e) => setGroupByTagType(e.target.value)}
                label="Grouped by:"
                options={[{ value: '', label: 'Category' }].concat(
                  tagTypes.map((type) => ({ label: type, value: type }))
                )}
              />
            </ControlGroup>
          )}

          {hasObjectives && (
            <Flex1ControlGroup>
              <Checkbox
                type="checkbox"
                checked={hideCompleted}
                onChange={() => setHideCompleted((prev) => !prev)}
                id="hide-completed"
              />
              <Label htmlFor="hide-completed">Hide completed</Label>
            </Flex1ControlGroup>
          )}
        </ViewControls>
      )}

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
