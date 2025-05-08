import React, { useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import useStateToggleBoolean from '../hooks/useStateToggleBoolean';

useStateToggleBoolean;

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
    inputBorder: '#cbd5e1',
    inputText: '#1e293b',
    inputPlaceholder: '#94a3b8',
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
    inputBorder: '#475569',
    inputText: '#f8fafc',
    inputPlaceholder: '#94a3b8',
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
      background-color: ${({ theme }) => theme.colors.inputBackground};
      color: ${({ theme }) => theme.colors.inputText};
      border: 1px solid ${({ theme }) => theme.colors.inputBorder};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      padding: ${({ theme }) => theme.spacing.sm};
      font-size: 1rem;
      transition: all 0.2s ease-in-out;
  
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
      }
  
      &::placeholder {
        color: ${({ theme }) => theme.colors.inputPlaceholder};
      }
    }
  
    select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364758b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right ${({ theme }) => theme.spacing.sm} center;
      background-size: 16px;
      padding-right: ${({ theme }) => theme.spacing.xl};
    }
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

const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, toggleIsDarkMode, setIsDarkMode] = useStateToggleBoolean(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <ThemeToggle onClick={toggleIsDarkMode}>
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </ThemeToggle>
      {children}
    </ThemeProvider>
  );
};

export default ThemeContextProvider;
