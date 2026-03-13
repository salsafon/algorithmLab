export type AlgorithmKey =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap";

export type SpeedKey = "slow" | "medium" | "fast" | "turbo";

export interface SortFrame {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number[];
  done?: boolean;
}

export interface AlgorithmMeta {
  name: string;
  key: AlgorithmKey;
  color: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  description: string;
  run: (arr: number[], signal: AbortSignal) => AsyncGenerator<SortFrame>;
}

export interface SortStats {
  comparisons: number;
  swaps: number;
  time: number;
}