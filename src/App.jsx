// src/App.jsx
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { GameProvider } from './context/GameContext';
import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';
import sampleData from './data/sampleData';

const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  cardBg: '#f9f9f9',
  cardHover: '#efefef',
};

const darkTheme = {
  background: '#1e1e1e',
  text: '#ffffff',
  cardBg: '#2a2a2a',
  cardHover: '#3a3a3a',
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: Arial, sans-serif;
  }
`;

const AppContainer = styled.div`
  padding: 2rem;
`;

function App() {
  const [games, setGames] = useState(sampleData);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <GameProvider value={{ games, setGames, selectedGame, setSelectedGame }}>
        <AppContainer>
          <button onClick={() => setIsDarkMode(prev => !prev)}>
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
          {selectedGame ? (
            <GameDetail game={selectedGame} />
          ) : (
            <GameDashboard />
          )}
        </AppContainer>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
