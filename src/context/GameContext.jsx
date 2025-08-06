import { createContext, useContext, useState, useMemo, useRef } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

import useStorageState from '../hooks/useStorageState';

const GameContext = createContext();

export const useGameContext = () => {
  return useContext(GameContext);
};

function useSelectedGameId() {
  const location = useLocation();
  const match = matchPath('/game/:gameId', location.pathname);

  return match?.params?.gameId;
}

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const selectedGameId = useSelectedGameId();
  const prevAllTagTypesRef = useRef([]);
  const [showTags, setShowTags] = useStorageState(false, 'tag-visibility');

  // TODO: remove if sticking with location-only tag type
  const allTagTypes = useMemo(() => {
    const tagSet = new Set(prevAllTagTypesRef.current);
    games.forEach((game) => {
      game.categories.forEach((cat) => {
        cat.objectives.forEach((obj) => {
          obj.tags?.forEach((tag) => tagSet.add(tag.type));
        });
      });
    });
    const tagArray = Array.from(tagSet);
    prevAllTagTypesRef.current = tagArray;
    return tagArray;
  }, [games]);
  const selectedGame = useMemo(
    () => (selectedGameId ? games.find((g) => String(g.id) === String(selectedGameId)) : null),
    [games, selectedGameId]
  );

  const locationTagValues = useMemo(() => {
    const tagSet = new Set();
    selectedGame?.categories.forEach((cat) => {
      cat.objectives.forEach((obj) => {
        obj.tags?.forEach((tag) => {
          if (tag.type?.toLowerCase() === 'location') tagSet.add(tag.value);
        });
      });
    });
    return Array.from(tagSet);
  }, [selectedGame]);

  return (
    <GameContext.Provider
      value={{
        allTagTypes,
        locationTagValues,
        games,
        setGames,
        selectedGame,
        selectedGameId,
        showTags,
        setShowTags,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
