import type{ SpeedKey, AlgorithmKey } from "../types";

export const SPEEDS: Record<SpeedKey, number> = {
  slow: 200,
  medium: 80,
  fast: 20,
  turbo: 5,
};

export const ALGORITHM_KEYS: AlgorithmKey[] = [
  "bubble",
  "selection",
  "insertion",
  "merge",
  "quick",
  "heap",
];

export const COMPLEXITY_CURVES = [
  { label: "O(n)",       fn: (x: number) => x,                  color: "#a8ff3e" },
  { label: "O(n log n)", fn: (x: number) => x * Math.log2(x),   color: "#00f5ff" },
  { label: "O(n²)",      fn: (x: number) => x * x,              color: "#ff6b35" },
];

export const BAR_COLORS = {
  default:   "#1e3a5f",
  comparing: "#ffffff",
  swapping:  "#ff4444",
  pivot:     "#ffd700",
};

export const DEFAULT_ARRAY_SIZE = 40;
export const MIN_ARRAY_SIZE = 8;
export const MAX_ARRAY_SIZE = 80;