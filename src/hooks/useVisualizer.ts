import { useState, useRef, useCallback } from "react";
import type { SortFrame, SortStats, SpeedKey } from "../types";
import { SPEEDS } from "../constants";
import { ALGORITHMS } from "../algorithms";

const DEFAULT_STATS: SortStats = { comparisons: 0, swaps: 0, time: 0 };

export function useVisualizer(
  array: number[],
  setArray: (arr: number[]) => void
) {
  const [selectedAlgo, setSelectedAlgo] = useState("bubble");
  const [frame, setFrame] = useState<SortFrame>({ array: [] });
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [speed, setSpeed] = useState<SpeedKey>("medium");
  const [stats, setStats] = useState<SortStats>(DEFAULT_STATS);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    if (timerRef.current) clearInterval(timerRef.current);
    setFrame({ array: [] });
    setIsRunning(false);
    setIsDone(false);
    setStats(DEFAULT_STATS);
  }, []);

  const run = useCallback(async () => {
    // If running, stop
    if (isRunning) {
      abortRef.current?.abort();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
      return;
    }

    // If done, signal parent to reset
    if (isDone) return;

    const algo = ALGORITHMS[selectedAlgo];
    abortRef.current = new AbortController();
    setIsRunning(true);
    setIsDone(false);

    let comparisons = 0;
    let swaps = 0;
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setStats(s => ({
        ...s,
        time: parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(2)),
      }));
    }, 100);

    const gen = algo.run(array, abortRef.current.signal);

    for await (const f of gen) {
      if (abortRef.current?.signal.aborted) break;

      if (f.comparing?.length) comparisons++;
      if (f.swapping?.length) swaps++;

      setStats({
        comparisons,
        swaps,
        time: parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(2)),
      });

      setFrame(f);
      if (f.array) setArray(f.array);

      if (f.done) {
        setIsDone(true);
        break;
      }

      await new Promise(r => setTimeout(r, SPEEDS[speed]));
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  }, [isRunning, isDone, selectedAlgo, array, speed, setArray]);

  return {
    selectedAlgo,
    setSelectedAlgo,
    frame,
    isRunning,
    isDone,
    speed,
    setSpeed,
    stats,
    reset,
    run,
  };
}