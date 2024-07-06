import { useRef } from "react";

export const useKeyGetter = (initialKey?: number) => {
  const id = useRef(initialKey || 0);
  return () => {
    id.current++;
    return id.current;
  };
};
