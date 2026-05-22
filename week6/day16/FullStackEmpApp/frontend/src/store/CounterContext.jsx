import { createContext, useState } from "react";

// Create context
export const CounterContext = createContext();

// Create provider component
export const CounterProvider = ({ children }) => {
  const [counter, setCounter] = useState(0);

  const increment = () => setCounter(prev => prev + 1);
  const decrement = () => setCounter(prev => prev - 1);
  const setCounterValue = (value) => setCounter(value);

  return (
    <CounterContext.Provider value={{ counter, increment, decrement, setCounterValue }}>
      {children}
    </CounterContext.Provider>
  );
};