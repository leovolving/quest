import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { ACTION_NAMES } from '../constants';

function useAnalytics() {
  const { pathname } = useLocation();

  // Ensure anonymous user ID is created once
  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', crypto.randomUUID());
    }
  }, []);

  // Start session on mount
  useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    sessions.push({ start: Date.now() });
    localStorage.setItem('sessions', JSON.stringify(sessions));

    return () => {
      const updated = JSON.parse(localStorage.getItem('sessions') || '[]');
      if (updated.length > 0 && !updated[updated.length - 1].end) {
        updated[updated.length - 1].end = Date.now();
        localStorage.setItem('sessions', JSON.stringify(updated));
      }
    };
  }, []);

  // Log a key action
  const logAction = useCallback((actionName, additionalData = {}) => {
    const actions = JSON.parse(localStorage.getItem('actions') || '[]');
    const newAction = { action: actionName, timestamp: Date.now(), ...additionalData };
    // TODO: only log on in dev env
    console.info(`${actionName} - ${newAction.timestamp}`);
    actions.push(newAction);
    localStorage.setItem('actions', JSON.stringify(actions));
  }, []);

  // Export analytics data for testers
  const exportAnalytics = useCallback(() => {
    const data = {
      user_id: localStorage.getItem('user_id'),
      sessions: JSON.parse(localStorage.getItem('sessions') || '[]'),
      actions: JSON.parse(localStorage.getItem('actions') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback-data.json';
    a.click();
  }, []);

  // Automatically log when path changes
  useEffect(() => {
    logAction(ACTION_NAMES.pathNavigation, { pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return { logAction, exportAnalytics };
}

export default useAnalytics;
