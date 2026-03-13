import type { SortFrame } from "../../types";

export async function* insertionSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const n = a.length;

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0 && a[j - 1] > a[j]) {
      if (signal.aborted) return;
      yield { array: [...a], comparing: [j - 1, j] };
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      yield { array: [...a], swapping: [j, j - 1] };
      j--;
    }
  }

  yield { array: [...a], sorted: Array.from({ length: n }, (_, k) => k), done: true };
}