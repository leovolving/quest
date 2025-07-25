import { useEffect } from 'react';
import styled from 'styled-components';
import { Route, Routes, Link } from 'react-router-dom';

import useGameDataService from './services/gameDataService';

import _404 from './pages/_404';

import GameDashboard from './components/GameDashboard';
import GameDetail from './components/GameDetail';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing.lg};
    max-width: 100vw;
  }
  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;

const GlobalNav = styled.nav``;

const Logo = styled.img`
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

function App() {
  const { initialize } = useGameDataService();

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
      <Routes>
        <Route path="/game/:gameId" element={<GameDetail />} />
        <Route path="/" element={<GameDashboard />} />
        <Route path="*" element={<_404 />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
