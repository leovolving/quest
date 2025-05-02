import React, { createContext, useContext, useState } from 'react';
import sampleData from '../data/sampleData'; // Import sample data

const GameContext = createContext();

export const useGameContext = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState(sampleData); // Initialize with sample data
const [selectedGame, setSelectedGame] = useState(null);

  return (
    <GameContext.Provider value={{ games, selectedGame, setGames, setSelectedGame }}>
      {children}
    </GameContext.Provider>
  );
};
