import type { SortFrame } from "../../types";

export async function* selectionSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield { array: [...a], codeLine: 0 };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { array: [...a], codeLine: 2 };

    for (let j = i + 1; j < n; j++) {
      if (signal.aborted) return;
      yield { array: [...a], comparing: [minIdx, j], sorted: [...sorted], codeLine: 4 };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { array: [...a], codeLine: 5 };
      }
      yield { array: [...a], codeLine: 3 };
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], swapping: [i, minIdx], sorted: [...sorted], codeLine: 6 };
    }
    sorted.push(i);
  }

  sorted.push(n - 1);
  yield { array: [...a], sorted, codeLine: 7, done: true };
}