import type { AlgorithmMeta } from "../types";
import { bubbleSort }    from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort }     from "./sorting/mergeSort";
import { quickSort }     from "./sorting/quickSort";
import { heapSort }      from "./sorting/heapSort";

export const ALGORITHMS: Record<string, AlgorithmMeta> = {
  bubble: {
    key: "bubble", name: "Bubble Sort", color: "#00f5ff",
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    stable: true,
    description: "Repeatedly swaps adjacent elements if they are in the wrong order.",
    run: bubbleSort,
  },
  selection: {
    key: "selection", name: "Selection Sort", color: "#ff6b35",
    best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    stable: false,
    description: "Finds the minimum element and places it at the beginning each pass.",
    run: selectionSort,
  },
  insertion: {
    key: "insertion", name: "Insertion Sort", color: "#a8ff3e",
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    stable: true,
    description: "Builds sorted array one element at a time by inserting into correct position.",
    run: insertionSort,
  },
  merge: {
    key: "merge", name: "Merge Sort", color: "#ff3cac",
    best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)",
    stable: true,
    description: "Divides array in half, recursively sorts, then merges the sorted halves.",
    run: mergeSort,
  },
  quick: {
    key: "quick", name: "Quick Sort", color: "#ffd700",
    best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)",
    stable: false,
    description: "Picks a pivot, partitions array around it, recursively sorts partitions.",
    run: quickSort,
  },
  heap: {
    key: "heap", name: "Heap Sort", color: "#bf5af2",
    best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)",
    stable: false,
    description: "Builds a max-heap, then repeatedly extracts the maximum element.",
    run: heapSort,
  },
};