import { useEffect } from 'react';
import styled from 'styled-components';
import { Route, Routes, Link } from 'react-router-dom';

import useGameDataService from './services/gameDataService';

import useScrollToTopOnNewRoute from './hooks/useScrollToTopOnNewRoute';

import _404 from './pages/_404';

import { MvpBanner } from './components/global';
import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';
import ObjectiveDetail from './pages/ObjectiveDetail';

const bufferPadding = '3rem'; // provides enough space for theme toggle

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  padding-bottom: ${bufferPadding};

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg} ${bufferPadding};
    max-width: 100vw;
  }
  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm} ${bufferPadding};
  }
`;

const GlobalNav = styled.nav``;

const Logo = styled.img`
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

function App() {
  const { initialize } = useGameDataService();
  useScrollToTopOnNewRoute();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContainer>
      <GlobalNav>
        <Link to="/">
          <Logo src="/trackquest_banner_v2.png" width="300" />
        </Link>
      </GlobalNav>
      <MvpBanner />
      <Routes>
        <Route path="/game/:gameId/objective/:objectiveId" element={<ObjectiveDetail />} />
        <Route path="/game/:gameId" element={<GameDetail />} />
        <Route path="/" element={<GameDashboard />} />
        <Route path="*" element={<_404 />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
