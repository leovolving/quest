import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { GameProvider } from './context/GameContext';
import ThemeContextProvider from './context/ThemeContext.jsx';
import App from './App.jsx';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>
);
