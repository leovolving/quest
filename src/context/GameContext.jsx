import React, { createContext, useContext, useMemo, useState } from 'react';

const GameContext = createContext();

export const useGameContext = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]); // Initialize with sample data
  const [selectedGameId, setSelectedGameId] = useState(null);

  const selectedGame = useMemo(
    () => (selectedGameId ? games.find((g) => g.id === selectedGameId) : null),
    [games, selectedGameId]
  );

  return (
    <GameContext.Provider value={{ games, selectedGame, setGames, setSelectedGameId }}>
      {children}
    </GameContext.Provider>
  );
};
