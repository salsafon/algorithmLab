import { useEffect, useRef } from "react";
import { PSEUDOCODE } from "../../constants";

interface Props {
  algoKey: string;
  currentLine?: number;
  algoColor: string;
}

export function PseudocodePanel({ algoKey, currentLine, algoColor }: Props) {
  const lines = PSEUDOCODE[algoKey] ?? [];
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentLine]);

  return (
    <div style={{
      background: "#040810",
      border: "1px solid #0d2035",
      borderRadius: 6,
      overflow: "hidden",
      fontFamily: "'Courier New', monospace",
    }}>
      {/* Header */}
      <div style={{
        padding: "8px 14px",
        borderBottom: "1px solid #0d2035",
        background: "#030608",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: algoColor }} />
        <span style={{ fontSize: 9, color: "#4a7fa5", letterSpacing: "0.3em" }}>PSEUDOCODE</span>
      </div>

      {/* Lines */}
      <div style={{ padding: "8px 0", maxHeight: 220, overflowY: "auto" }}>
        {lines.map((line, i) => {
          const isActive = i === currentLine;
          return (
            <div
              key={i}
              ref={isActive ? activeRef : null}
              style={{
                display: "flex", alignItems: "center", gap: 0,
                background: isActive ? `${algoColor}18` : "transparent",
                borderLeft: isActive ? `2px solid ${algoColor}` : "2px solid transparent",
                transition: "all 0.1s",
                padding: "3px 0",
              }}
            >
              {/* Line number */}
              <span style={{
                fontSize: 9, color: isActive ? algoColor : "#1e3a5f",
                minWidth: 36, textAlign: "right", paddingRight: 12,
                userSelect: "none",
              }}>
                {i + 1}
              </span>

              {/* Code */}
              <span style={{
                fontSize: 11,
                color: isActive ? algoColor : "#2a5a7a",
                fontWeight: isActive ? "bold" : "normal",
                letterSpacing: "0.03em",
                transition: "color 0.1s",
                whiteSpace: "pre",
              }}>
                {line}
              </span>

              {/* Active indicator */}
              {isActive && (
                <span style={{
                  marginLeft: 10, fontSize: 9,
                  color: algoColor, opacity: 0.7,
                }}>
                  ◀
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}