import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTopOnNewRoute = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTopOnNewRoute;
