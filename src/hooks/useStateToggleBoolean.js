import { useState } from 'react';

const useStateToggleBoolean = (initialState) => {
  const [state, setState] = useState(initialState);

  const toggleState = () => {
    setState((prev) => !prev);
  };

  return [state, toggleState, setState];
};

export default useStateToggleBoolean;
