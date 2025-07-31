import { useEffect, useCallback } from 'react';

function useAnalytics() {
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
  const logAction = useCallback((actionName) => {
    const actions = JSON.parse(localStorage.getItem('actions') || '[]');
    const newAction = { action: actionName, timestamp: Date.now() };
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

  return { logAction, exportAnalytics };
}

export default useAnalytics;
