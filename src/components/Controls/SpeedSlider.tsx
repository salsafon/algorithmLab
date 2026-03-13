import type { SpeedKey } from "../../types";

const SPEED_KEYS: SpeedKey[] = ["slow", "medium", "fast", "turbo"];

interface Props {
  speed: SpeedKey;
  color: string;
  onSpeedChange: (s: SpeedKey) => void;
}

export function SpeedSlider({ speed, color, onSpeedChange }: Props) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#2a5a7a", marginBottom: 6 }}>SPEED</div>
      <div style={{ display: "flex", gap: 4 }}>
        {SPEED_KEYS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            style={{
              flex: 1, padding: "4px 0", fontSize: 9,
              letterSpacing: "0.05em", textTransform: "uppercase",
              background: speed === s ? color : "#0a1825",
              border: `1px solid ${speed === s ? color : "#0d2035"}`,
              color: speed === s ? "#000" : "#4a7fa5",
              borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}