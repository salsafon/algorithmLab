import type { SortFrame } from "../../types";

export async function* bubbleSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (signal.aborted) return;

      yield { array: [...a], comparing: [j, j + 1] };

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], swapping: [j, j + 1] };
      }
    }
  }

  yield { array: [...a], sorted: Array.from({ length: n }, (_, k) => k), done: true };
}