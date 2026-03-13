import { MIN_ARRAY_SIZE, MAX_ARRAY_SIZE } from "../../constants";

interface Props {
  size: number;
  color: string;
  isRunning: boolean;
  onChange: (size: number) => void;
}

export function ArraySizeSlider({ size, color, isRunning, onChange }: Props) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 10, color: "#2a5a7a", marginBottom: 6,
        display: "flex", justifyContent: "space-between",
      }}>
        <span>ARRAY SIZE</span>
        <span style={{ color }}>{size}</span>
      </div>
      <input
        type="range"
        min={MIN_ARRAY_SIZE}
        max={MAX_ARRAY_SIZE}
        value={size}
        disabled={isRunning}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color }}
      />
    </div>
  );
}