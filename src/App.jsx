// src/App.jsx
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useGameContext } from './context/GameContext';
import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';

const lightTheme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    success: '#22c55e',
    successHover: '#16a34a',
    background: '#ffffff',
    cardBg: '#f8fafc',
    cardHover: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    inputBackground: '#ffffff',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};

const darkTheme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#94a3b8',
    success: '#22c55e',
    successHover: '#16a34a',
    background: '#0f172a',
    cardBg: '#1e293b',
    cardHover: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    border: '#334155',
    inputBackground: '#1e293b',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.2)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.2)',
  },
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
  }

  * {
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  input, select, textarea {
    font-family: inherit;
  }
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`;

function App() {
  const { selectedGame } = useGameContext();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppContainer>
        <ThemeToggle onClick={() => setIsDarkMode((prev) => !prev)}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </ThemeToggle>
        {selectedGame ? <GameDetail /> : <GameDashboard />}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
