import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';
import useAnalytics from '../services/analyticsService';

import { ACTION_NAMES, STATUS_OPTIONS } from '../constants';

import CategoryList from './CategoryList';
import TagView from './TagView';
import NewObjectiveForm from './forms/NewObjectiveForm';

import { RouterLink, Select } from './_ds';

const BackLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: fit-content;
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
  justify-content: space-between;
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
  @media (max-width: 350px) {
    flex: 1;
  }
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
  const { logAction } = useAnalytics();
  const { gameId } = useParams();

  if (!game) {
    return (
      <div>
        <BackLink to="/" variant="tertiary">
          ← Back
        </BackLink>
        <p>Game not found.</p>
      </div>
    );
  }

  const analyticsMetadata = { game_id: gameId };
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

  const handleCompletedVisibilityChange = () => {
    const newValue = !hideCompleted;
    logAction(ACTION_NAMES.gameDetailHideCompletedClicked, {
      ...analyticsMetadata,
      to_be_visible: newValue,
    });
    setHideCompleted(newValue);
  };

  const isUsingTags = tagTypes.length > 0;
  const hasObjectives = game.categories.some((c) => c.objectives?.length > 0);
  const shouldShowGameControls = isUsingTags || hasObjectives;

  return (
    <div>
      <BackLink to="/" variant="tertiary">
        ← Back
      </BackLink>
      <GameHeader>
        <GameTitle>{game.name}</GameTitle>
        <Select
          label="Game status"
          onChange={onUpdateStatus}
          options={STATUS_OPTIONS}
          value={game.status || 'not-played'}
          changeActionName={ACTION_NAMES.gameDetailGameStatusChanged}
          analyticsMetadata={analyticsMetadata}
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
                  tagTypes.map((type) => ({ label: `Tag: ${type}`, value: type }))
                )}
                changeActionName={ACTION_NAMES.gameDetailGroupingChanged}
                analyticsMetadata={analyticsMetadata}
              />
            </ControlGroup>
          )}

          {hasObjectives && (
            <Flex1ControlGroup>
              <Checkbox
                type="checkbox"
                checked={hideCompleted}
                onChange={handleCompletedVisibilityChange}
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
