import { useState, useCallback } from "react";
import { DEFAULT_ARRAY_SIZE } from "../constants";

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export function useArray() {
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [array, setArray] = useState<number[]>(() => generateArray(DEFAULT_ARRAY_SIZE));

  const shuffle = useCallback((size?: number) => {
    const s = size ?? arraySize;
    setArray(generateArray(s));
  }, [arraySize]);

  const updateSize = useCallback((size: number) => {
    setArraySize(size);
    setArray(generateArray(size));
  }, []);

  return { array, setArray, arraySize, updateSize, shuffle };
}