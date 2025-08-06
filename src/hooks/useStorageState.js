import { useState, useEffect, useCallback } from 'react';

function useStorageState(initialValue, storageKey, storage = localStorage) {
  const getStoredValue = () => {
    try {
      const stored = storage.getItem(storageKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (e) {
      console.error(`Error reading storage key "${storageKey}":`, e);
      return initialValue;
    }
  };

  const [value, setValueState] = useState(getStoredValue);

  const setValue = useCallback(
    (newValue) => {
      setValueState((prev) => {
        const valueToStore = typeof newValue === 'function' ? newValue(prev) : newValue;
        try {
          storage.setItem(storageKey, JSON.stringify(valueToStore));
        } catch (e) {
          console.error(`Error setting ${storage} key "${storageKey}":`, e);
        }
        return valueToStore;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === storageKey && event.newValue) {
        try {
          setValueState(JSON.parse(event.newValue));
        } catch (e) {
          console.error(`Error parsing ${storage} event for key "${storageKey}":`, e);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue];
}

export default useStorageState;
