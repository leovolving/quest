import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useGameContext } from '../context/GameContext';
import useGameDataService from '../services/gameDataService';
import useAnalytics from '../services/analyticsService';
import useStorageState from '../hooks/useStorageState';
import useStateToggleBoolean from '../hooks/useStateToggleBoolean';

import { ACTION_NAMES, STATUS_OPTIONS } from '../constants';

import CategoryList from './CategoryList';
import TagView from './TagView';
import NewCategoryForm from './forms/NewCategoryForm';
import NewObjectiveForm from './forms/NewObjectiveForm';

import { Button, BUTTON_VARIANT, RouterLink, SegmentControl, Select } from './_ds';

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
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  align-items: flex-end;
`;

const ControlGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Flex1ControlGroup = styled(ControlGroup)`
  flex-direction: column;
  @media (max-width: 350px) {
    flex: 1;
  }
`;

const ToggleWrapper = styled.div`
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

const groupings = {
  CATEGORIES: {
    label: 'Quests',
    value: '',
  },
  LOCATION_TAG: {
    label: 'Locations',
    value: 'location',
  },
};

const groupingOptions = Object.values(groupings);

const GameDetail = () => {
  const [isCategoryFormOpen, toggleIsCategoryFormOpen] = useStateToggleBoolean(false);
  const [groupByTagType, setGroupByTagType] = useStorageState('', 'grouping');
  const [hideCompleted, setHideCompleted] = useStorageState(false, 'hide-completed');
  const { selectedGame: game, showTags, setShowTags } = useGameContext();
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

  const handleTagVisibilityChange = () => {
    const newValue = !showTags;
    logAction(ACTION_NAMES.gameDetailHideCompletedClicked, {
      ...analyticsMetadata,
      to_be_visible: newValue,
    });
    setShowTags(newValue);
  };

  const handleNewCategoryClick = () => {
    logAction(ACTION_NAMES.addNewCategoryClicked, analyticsMetadata);
    toggleIsCategoryFormOpen(true);
  };

  const hasObjectives = game.categories.some((c) => c.objectives?.length > 0);

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

      <ViewControls>
        {hasObjectives && (
          <Flex1ControlGroup>
            <div>
              <Checkbox
                type="checkbox"
                checked={!hideCompleted}
                onChange={handleCompletedVisibilityChange}
                id="hide-completed"
              />
              <Label htmlFor="hide-completed">Show completed tasks</Label>
            </div>
            <div>
              <Checkbox
                type="checkbox"
                checked={showTags}
                onChange={handleTagVisibilityChange}
                id="show-tags"
              />
              <Label htmlFor="show-tags">Show location tags</Label>
            </div>
          </Flex1ControlGroup>
        )}

        <Button variant={BUTTON_VARIANT.SECONDARY} onClick={handleNewCategoryClick}>
          + Add new quest
        </Button>
      </ViewControls>

      {isCategoryFormOpen && <NewCategoryForm isOpen onClose={toggleIsCategoryFormOpen} />}

      <ToggleWrapper>
        <span id="task-grouping-toggle">Grouped by:</span>
        <SegmentControl
          options={groupingOptions}
          selected={groupByTagType}
          onChange={setGroupByTagType}
          ariaLabeledBy="task-grouping-toggle"
        />
      </ToggleWrapper>

      {groupByTagType ? (
        <TagView
          categories={filteredForTagView}
          tagType={groupByTagType}
          hideCompleted={hideCompleted}
          showTags={showTags}
        />
      ) : (
        filteredCategories.map((cat) => (
          <CategoryList
            key={cat.id}
            category={{ ...cat, objectives: cat.visibleObjectives }}
            hideCompleted={hideCompleted}
            showTags={showTags}
          />
        ))
      )}

      <NewObjectiveForm />
    </div>
  );
};

export default GameDetail;
