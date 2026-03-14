import type { SortFrame } from "../../types";

export async function* quickSort(
  arr: number[],
  signal: AbortSignal
): AsyncGenerator<SortFrame> {
  const a = [...arr];
  const steps: { type: string; indices: number[]; pivot: number; arr?: number[]; codeLine: number }[] = [];

  function partition(array: number[], low: number, high: number): number {
    steps.push({ type: "compare", indices: [low, high], pivot: high, codeLine: 2 });
    const pivot = array[high];
    let i = low - 1;
    steps.push({ type: "compare", indices: [low, high], pivot: high, codeLine: 3 });

    for (let j = low; j < high; j++) {
      steps.push({ type: "compare", indices: [j, high], pivot: high, codeLine: 5 });
      if (array[j] <= pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        steps.push({ type: "swap", indices: [i, j], pivot: high, arr: [...array], codeLine: 6 });
      }
      steps.push({ type: "compare", indices: [j, high], pivot: high, codeLine: 4 });
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({ type: "swap", indices: [i + 1, high], pivot: i + 1, arr: [...array], codeLine: 7 });
    return i + 1;
  }

  function sort(array: number[], low: number, high: number) {
    if (low >= high) { steps.push({ type: "base", indices: [], pivot: -1, codeLine: 1 }); return; }
    const pi = partition(array, low, high);
    steps.push({ type: "base", indices: [], pivot: -1, codeLine: 8 });
    sort(array, low, pi - 1);
    steps.push({ type: "base", indices: [], pivot: -1, codeLine: 9 });
    sort(array, pi + 1, high);
  }

  sort(a, 0, a.length - 1);

  let current = [...arr];
  for (const step of steps) {
    if (signal.aborted) return;
    if (step.type === "compare") {
      yield { array: current, comparing: step.indices, pivot: [step.pivot], codeLine: step.codeLine };
    } else if (step.type === "swap") {
      current = step.arr!;
      yield { array: current, swapping: step.indices, pivot: [step.pivot], codeLine: step.codeLine };
    } else {
      yield { array: current, codeLine: step.codeLine };
    }
  }

  yield { array: a, sorted: Array.from({ length: a.length }, (_, k) => k), codeLine: 0, done: true };
}