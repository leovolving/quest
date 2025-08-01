import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { ACTION_NAMES } from '../constants';
import { endpoint } from '../utils/api';

function useAnalytics() {
  const { pathname } = useLocation();

  const isLocal = location.host.startsWith('localhost');

  const logAction = useCallback((actionName, properties = {}) => {
    if (isLocal) {
      console.info({ actionName, properties });
    } else {
      properties.pathname = pathname;
      fetch(endpoint('/log-analytics'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: actionName,
          local_user_id: localStorage.getItem('user_id'),
          local_session_id: sessionStorage.getItem('session_id'),
          properties,
        }),
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLocal, logAction };
}

export function useInitializeAnalytics() {
  const { pathname } = useLocation();
  const { logAction } = useAnalytics();

  // Ensure user_id is persistent across sessions
  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', crypto.randomUUID());
    }
  }, []);

  // Start/end sessions and send to backend
  useEffect(() => {
    const sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
    logAction('session_started');

    return () => {
      logAction('session_ended');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Automatically log when path changes
  useEffect(() => {
    logAction(ACTION_NAMES.pathNavigation, { pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}

export default useAnalytics;
