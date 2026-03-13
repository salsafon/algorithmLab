import type { SortFrame } from "../../types";

export async function* mergeSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const steps: { type: string; indices?: number[]; index?: number; arr?: number[] }[] = [];

  function merge(array: number[], left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left, j = mid + 1;

    while (i <= mid && j <= right) {
      steps.push({ type: "compare", indices: [i, j] });
      if (array[i] <= array[j]) temp.push(array[i++]);
      else temp.push(array[j++]);
    }

    while (i <= mid) temp.push(array[i++]);
    while (j <= right) temp.push(array[j++]);

    for (let k = left; k <= right; k++) {
      array[k] = temp[k - left];
      steps.push({ type: "place", index: k, arr: [...array] });
    }
  }

  function mergeSort(array: number[], left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(array, left, mid);
    mergeSort(array, mid + 1, right);
    merge(array, left, mid, right);
  }

  mergeSort(a, 0, a.length - 1);

  let current = [...arr];
  for (const step of steps) {
    if (signal.aborted) return;
    if (step.type === "compare") {
      yield { array: current, comparing: step.indices };
    } else {
      current = step.arr!;
      yield { array: current, swapping: [step.index!] };
    }
  }

  yield { array: a, sorted: Array.from({ length: a.length }, (_, k) => k), done: true };
}