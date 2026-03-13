import type { SortFrame } from "../../types";
import { BAR_COLORS } from "../../constants";

interface Props {
  array: number[];
  frame: SortFrame;
  isRunning: boolean;
  algoColor: string;
}

export function SortVisualizer({ array, frame, isRunning, algoColor }: Props) {
  const maxVal = Math.max(...array);
  const gap = Math.max(1, Math.floor(3 - array.length / 30));

  const getBarColor = (i: number) => {
    if (frame.sorted?.includes(i))   return algoColor;
    if (frame.swapping?.includes(i)) return BAR_COLORS.swapping;
    if (frame.pivot?.includes(i))    return BAR_COLORS.pivot;
    if (frame.comparing?.includes(i)) return BAR_COLORS.comparing;
    return BAR_COLORS.default;
  };

  const getBarGlow = (i: number) => {
    if (frame.swapping?.includes(i))  return `0 0 12px ${BAR_COLORS.swapping}`;
    if (frame.comparing?.includes(i)) return `0 0 12px #ffffff88`;
    if (frame.sorted?.includes(i))    return `0 0 8px ${algoColor}88`;
    return "none";
  };

  return (
    <div style={{
      flex: 1,
      display: "flex",
      alignItems: "flex-end",
      gap,
      padding: "16px",
      background: "#040810",
      border: "1px solid #0d2035",
      borderRadius: 6,
      minHeight: 320,
      position: "relative",
    }}>
      {/* Grid lines */}
      {[25, 50, 75, 100].map((p) => (
        <div key={p} style={{
          position: "absolute",
          left: 16, right: 16,
          bottom: `calc(16px + ${p}% * (100% - 32px) / 100)`,
          borderTop: "1px solid #0d2035",
          pointerEvents: "none",
        }}>
          <span style={{
            position: "absolute", right: 0, top: -9,
            fontSize: 8, color: "#1e3a5f",
          }}>{p}%</span>
        </div>
      ))}

      {/* Bars */}
      {array.map((val, i) => (
        <div
          key={i}
          title={`Index: ${i} | Value: ${val}`}
          style={{
            flex: 1,
            height: `${(val / maxVal) * 100}%`,
            background: getBarColor(i),
            boxShadow: getBarGlow(i),
            borderRadius: "2px 2px 0 0",
            minWidth: 2,
            transition: isRunning ? "height 0.05s ease, background-color 0.05s ease" : "none",
          }}
        />
      ))}
    </div>
  );
}