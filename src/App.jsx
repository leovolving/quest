// src/App.jsx
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useGameContext } from './context/GameContext';
import useGameDataService from './services/gameDataService';

import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

function App() {
  const { selectedGame } = useGameContext();
  const { initialize } = useGameDataService();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppContainer>{selectedGame ? <GameDetail /> : <GameDashboard />}</AppContainer>;
}

export default App;
