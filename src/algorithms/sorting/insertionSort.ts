import type { SortFrame } from "../../types";

export async function* insertionSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const n = a.length;

  yield { array: [...a], codeLine: 0 };

  for (let i = 1; i < n; i++) {
    let j = i;
    yield { array: [...a], codeLine: 2 };

    while (j > 0 && a[j - 1] > a[j]) {
      if (signal.aborted) return;
      yield { array: [...a], comparing: [j - 1, j], codeLine: 3 };
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      yield { array: [...a], swapping: [j, j - 1], codeLine: 4 };
      j--;
      yield { array: [...a], codeLine: 5 };
    }
    yield { array: [...a], codeLine: 1 };
  }

  yield { array: [...a], sorted: Array.from({ length: n }, (_, k) => k), codeLine: 6, done: true };
}