import { ALGORITHMS } from "../../algorithms";
import { ALGORITHM_KEYS } from "../../constants";

interface Props {
  selected: string;
  isRunning: boolean;
  onSelect: (key: string) => void;
}

export function AlgorithmSelector({ selected, isRunning, onSelect }: Props) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em", marginBottom: 10 }}>
        SELECT ALGORITHM
      </div>
      {ALGORITHM_KEYS.map((key) => {
        const algo = ALGORITHMS[key];
        const isSelected = selected === key;
        return (
          <button
            key={key}
            onClick={() => { if (!isRunning) onSelect(key); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 10px",
              background: isSelected ? "#0a1825" : "transparent",
              border: isSelected ? `1px solid ${algo.color}33` : "1px solid transparent",
              borderRadius: 4,
              color: isSelected ? algo.color : "#4a6a85",
              fontSize: 12,
              cursor: isRunning ? "not-allowed" : "pointer",
              marginBottom: 2,
              textAlign: "left",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
              background: isSelected ? algo.color : "#1e3a5f",
            }} />
            {algo.name}
          </button>
        );
      })}
    </div>
  );
}