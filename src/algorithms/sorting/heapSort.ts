import type { SortFrame } from "../../types";

export async function* heapSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const n = a.length;
  const steps: { type: string; indices: number[]; arr: number[]; sorted?: number[] }[] = [];
  const sortedIdx: number[] = [];

  function heapify(array: number[], size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size && array[l] > array[largest]) largest = l;
    if (r < size && array[r] > array[largest]) largest = r;

    if (largest !== i) {
      steps.push({ type: "compare", indices: [i, largest], arr: [...array], sorted: [...sortedIdx] });
      [array[i], array[largest]] = [array[largest], array[i]];
      steps.push({ type: "swap", indices: [i, largest], arr: [...array], sorted: [...sortedIdx] });
      heapify(array, size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sortedIdx.push(i);
    steps.push({ type: "swap", indices: [0, i], arr: [...a], sorted: [...sortedIdx] });
    heapify(a, i, 0);
  }

  for (const step of steps) {
    if (signal.aborted) return;
    yield { array: step.arr, comparing: step.type === "compare" ? step.indices : [], swapping: step.type === "swap" ? step.indices : [], sorted: step.sorted ?? [] };
  }

  yield { array: a, sorted: Array.from({ length: n }, (_, k) => k), done: true };
}