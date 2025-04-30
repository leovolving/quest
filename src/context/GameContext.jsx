import { createContext, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = GameContext.Provider;

export const useGameContext = () => useContext(GameContext);