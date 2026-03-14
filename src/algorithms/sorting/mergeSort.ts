import type { SortFrame } from "../../types";

export async function* mergeSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const steps: { type: string; indices?: number[]; index?: number; arr?: number[]; codeLine: number }[] = [];

  function merge(array: number[], left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left, j = mid + 1;
    while (i <= mid && j <= right) {
      steps.push({ type: "compare", indices: [i, j], codeLine: 6 });
      if (array[i] <= array[j]) {
        steps.push({ type: "compare", indices: [i, j], codeLine: 7 });
        temp.push(array[i++]);
      } else {
        steps.push({ type: "compare", indices: [i, j], codeLine: 8 });
        temp.push(array[j++]);
      }
    }
    while (i <= mid) temp.push(array[i++]);
    while (j <= right) temp.push(array[j++]);
    for (let k = left; k <= right; k++) {
      array[k] = temp[k - left];
      steps.push({ type: "place", index: k, arr: [...array], codeLine: 9 });
    }
  }

  function mergeSortHelper(array: number[], left: number, right: number) {
    if (left >= right) { steps.push({ type: "base", codeLine: 1 }); return; }
    const mid = Math.floor((left + right) / 2);
    steps.push({ type: "base", codeLine: 2 });
    mergeSortHelper(array, left, mid);
    steps.push({ type: "base", codeLine: 3 });
    mergeSortHelper(array, mid + 1, right);
    steps.push({ type: "base", codeLine: 5 });
    merge(array, left, mid, right);
  }

  mergeSortHelper(a, 0, a.length - 1);

  let current = [...arr];
  for (const step of steps) {
    if (signal.aborted) return;
    if (step.type === "compare") {
      yield { array: current, comparing: step.indices, codeLine: step.codeLine };
    } else if (step.type === "place") {
      current = step.arr!;
      yield { array: current, swapping: [step.index!], codeLine: step.codeLine };
    } else {
      yield { array: current, codeLine: step.codeLine };
    }
  }

  yield { array: a, sorted: Array.from({ length: a.length }, (_, k) => k), codeLine: 0, done: true };
}