import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

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

  const selectedGame = useMemo(
    () => (selectedGameId ? games.find((g) => String(g.id) === String(selectedGameId)) : null),
    [games, selectedGameId]
  );

  return (
    <GameContext.Provider value={{ games, setGames, selectedGame, selectedGameId }}>
      {children}
    </GameContext.Provider>
  );
};
