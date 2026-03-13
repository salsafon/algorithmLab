import { ALGORITHMS } from "../../algorithms";
import { ALGORITHM_KEYS } from "../../constants";
import { ComplexityChart } from "./ComplexityChart";

interface Props {
  selectedAlgo: string;
  arraySize: number;
  isRunning: boolean;
  onSelect: (key: string) => void;
}

export function ComplexityPanel({ selectedAlgo, arraySize, isRunning, onSelect }: Props) {
  return (
    <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
      {/* Algorithm cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {ALGORITHM_KEYS.map((key) => {
          const a = ALGORITHMS[key];
          const isSelected = selectedAlgo === key;
          return (
            <div
              key={key}
              onClick={() => { if (!isRunning) onSelect(key); }}
              style={{
                padding: "16px",
                background: isSelected ? "#040810" : "#030608",
                border: `1px solid ${isSelected ? a.color + "66" : "#0d2035"}`,
                borderRadius: 8,
                cursor: isRunning ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
                <span style={{ color: a.color, fontSize: 12, fontWeight: "bold" }}>{a.name}</span>
                <span style={{
                  marginLeft: "auto", fontSize: 8, padding: "2px 6px",
                  background: a.stable ? "#0a1f0a" : "#1f0a0a",
                  border: `1px solid ${a.stable ? "#1a5a1a" : "#5a1a1a"}`,
                  color: a.stable ? "#3a9a3a" : "#9a3a3a",
                  borderRadius: 3, letterSpacing: "0.15em",
                }}>
                  {a.stable ? "STABLE" : "UNSTABLE"}
                </span>
              </div>

              {/* Complexity grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {([["BEST", a.best], ["AVG", a.average], ["WORST", a.worst], ["SPACE", a.space]] as const).map(([l, v]) => (
                  <div key={l} style={{ background: "#050a12", padding: "6px 8px", borderRadius: 4 }}>
                    <div style={{ fontSize: 8, color: "#2a5a7a", marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 11, color: isSelected ? a.color : "#6a8fa5" }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8, fontSize: 9, color: "#2a5a7a", lineHeight: 1.5 }}>
                {a.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth chart */}
      <div style={{
        background: "#040810",
        border: "1px solid #0d2035",
        borderRadius: 8,
        padding: 20,
      }}>
        <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em", marginBottom: 16 }}>
          COMPLEXITY GROWTH
        </div>
        <ComplexityChart n={arraySize} />
      </div>
    </div>
  );
}