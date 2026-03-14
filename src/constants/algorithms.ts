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

export const PSEUDOCODE: Record<string, string[]> = {
  bubble: [
    "procedure bubbleSort(arr)",
    "  for i ← 0 to n−1",
    "    for j ← 0 to n−i−2",
    "      if arr[j] > arr[j+1]",
    "        swap(arr[j], arr[j+1])",
    "  return arr",
  ],
  selection: [
    "procedure selectionSort(arr)",
    "  for i ← 0 to n−1",
    "    minIdx ← i",
    "    for j ← i+1 to n",
    "      if arr[j] < arr[minIdx]",
    "        minIdx ← j",
    "    swap(arr[i], arr[minIdx])",
    "  return arr",
  ],
  insertion: [
    "procedure insertionSort(arr)",
    "  for i ← 1 to n",
    "    j ← i",
    "    while j > 0 and arr[j−1] > arr[j]",
    "      swap(arr[j], arr[j−1])",
    "      j ← j − 1",
    "  return arr",
  ],
  merge: [
    "procedure mergeSort(arr, left, right)",
    "  if left ≥ right → return",
    "  mid ← (left + right) / 2",
    "  mergeSort(arr, left, mid)",
    "  mergeSort(arr, mid+1, right)",
    "  merge(left, mid, right)",
    "    while i ≤ mid and j ≤ right",
    "      if arr[i] ≤ arr[j] → pick arr[i]",
    "      else → pick arr[j]",
    "    copy temp back to arr",
  ],
  quick: [
    "procedure quickSort(arr, low, high)",
    "  if low ≥ high → return",
    "  pivot ← arr[high]",
    "  i ← low − 1",
    "  for j ← low to high−1",
    "    if arr[j] ≤ pivot",
    "      i++ → swap(arr[i], arr[j])",
    "  swap(arr[i+1], arr[high])",
    "  quickSort(left partition)",
    "  quickSort(right partition)",
  ],
  heap: [
    "procedure heapSort(arr)",
    "  build max-heap from arr",
    "  for i ← n−1 to 1",
    "    swap(arr[0], arr[i])",
    "    heapify(arr, i, 0)",
    "  procedure heapify(arr, n, i)",
    "    largest ← max(i, left, right)",
    "    if largest ≠ i",
    "      swap(arr[i], arr[largest])",
    "      heapify(arr, n, largest)",
  ],
};