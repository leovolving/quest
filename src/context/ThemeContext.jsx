import { useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import useStateToggleBoolean from '../hooks/useStateToggleBoolean';

import { Button } from '../components/_ds';

useStateToggleBoolean;

const lightTheme = {
  colors: {
    primary: '#C75C00',
    primaryHover: '#E67300',
    secondary: '#1E2A38',
    success: '#207544',
    successHover: '#2F8F56',
    background: '#FFFFFF',
    cardBg: '#F3F3F3',
    cardHover: '#E6E6E6',
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    border: '#D0D7DE',
    inputBackground: '#FFFFFF',
    inputBorder: '#C9D1D9',
    inputText: '#1A1A1A',
    inputPlaceholder: '#6A737D',
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
  buttons: {
    secondary: {
      text: '#1E556C',
      border: '2px solid #1E556C',
      bg: ({ theme }) => theme.colors.background,
      hover: '#ECF6F8',
      active: '#8C6600',
      disabledBg: '#E5C98C',
      disabledText: '#888888',
    },
    primary: {
      bg: '#1E556C',
      text: '#FFFFFF',
      hover: '#3D8FBA',
      active: '#246380',
      disabledBg: '#A9CFE5',
      disabledText: '#888888',
    },
    tertiary: {
      text: '#1A1A1A',
      hoverText: '#4A4A4A',
      activeText: '#000000',
      hoverBg: '#F3F3F3',
      activeBg: '#E6E6E6',
    },
  },
};

const darkTheme = {
  colors: {
    primary: '#FFA500',
    primaryHover: '#FFB733',
    secondary: '#2D2F36',
    success: '#48C774',
    successHover: '#5ED48A',
    background: '#0D1117',
    cardBg: '#161B22',
    cardHover: '#1E242D',
    text: '#FFFFFF',
    textSecondary: '#C9D1D9',
    border: '#30363D',
    inputBackground: '#21262D',
    inputBorder: '#444C56',
    inputText: '#FFFFFF',
    inputPlaceholder: '#8B949E',
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
  buttons: {
    primary: {
      bg: ({ theme }) => theme.colors.primary,
      text: ({ theme }) => theme.colors.background,
      hover: '#DDAF26',
      active: '#A87C00',
    },
    secondary: {
      text: ({ theme }) => theme.colors.primary,
      bg: ({ theme }) => theme.colors.background,
      border: ({ theme }) => `2px solid ${theme.colors.primary}`,
      hover: '#272B3F',
      active: '#246380',
      fontWeight: 'bold',
    },
    tertiary: {
      text: '#F9F9F9',
      hoverBg: '#1E2A38',
      activeBg: '#273445',
    },
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

const ThemeToggle = styled(Button)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
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
      <ThemeToggle variant="tertiary" onClick={toggleIsDarkMode}>
        {isDarkMode ? '☀️ Light mode' : '🌙 Dark mode'}
      </ThemeToggle>
      {children}
    </ThemeProvider>
  );
};

export default ThemeContextProvider;
