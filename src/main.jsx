import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AnalyticsContextProvider from './context/AnalyticsContext.jsx';
import { GameProvider } from './context/GameContext';
import ThemeContextProvider from './context/ThemeContext.jsx';
import App from './App.jsx';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsContextProvider>
        <ThemeContextProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </ThemeContextProvider>
      </AnalyticsContextProvider>
    </BrowserRouter>
  </StrictMode>
);
