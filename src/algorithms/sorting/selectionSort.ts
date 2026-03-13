import type { SortFrame } from "../../types";

export async function* selectionSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (signal.aborted) return;
      yield { array: [...a], comparing: [minIdx, j], sorted: [...sorted] };
      if (a[j] < a[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], swapping: [i, minIdx], sorted: [...sorted] };
    }

    sorted.push(i);
  }

  sorted.push(n - 1);
  yield { array: [...a], sorted, done: true };
}