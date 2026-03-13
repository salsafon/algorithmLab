import { useEffect, useState } from "react";
import { useArray, useVisualizer } from "./hooks";
import { ALGORITHMS } from "./algorithms";
import {
  Navbar,
  AlgorithmSelector,
  SpeedSlider,
  ArraySizeSlider,
  SortVisualizer,
  ComplexityPanel,
} from "./components";
import "./index.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("visualizer");
  const { array, setArray, arraySize, updateSize, shuffle } = useArray();
  const {
    selectedAlgo, setSelectedAlgo,
    frame, isRunning, isDone,
    speed, setSpeed,
    stats, reset, run,
  } = useVisualizer(array, setArray);

  const algo = ALGORITHMS[selectedAlgo];

  // Reset when algorithm or size changes
  useEffect(() => { reset(); }, [selectedAlgo]);
  useEffect(() => { reset(); shuffle(arraySize); }, [arraySize]);

  const handleRun = () => {
    if (isDone) { reset(); shuffle(arraySize); return; }
    run();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050a12", display: "flex", flexDirection: "column", fontFamily: "'Courier New', monospace", color: "#e0e8f0" }}>
      <Navbar
        algoColor={algo.color}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 240, borderRight: "1px solid #0d2035", display: "flex", flexDirection: "column", background: "#040810" }}>

          {/* Algorithm selector */}
          <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #0d2035" }}>
            <AlgorithmSelector
              selected={selectedAlgo}
              isRunning={isRunning}
              onSelect={setSelectedAlgo}
            />
          </div>

          {/* Controls */}
          <div style={{ padding: "16px", borderBottom: "1px solid #0d2035" }}>
            <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em", marginBottom: 12 }}>
              CONTROLS
            </div>

            <ArraySizeSlider
              size={arraySize}
              color={algo.color}
              isRunning={isRunning}
              onChange={updateSize}
            />

            <SpeedSlider
              speed={speed}
              color={algo.color}
              onSpeedChange={setSpeed}
            />

            <button
              onClick={handleRun}
              style={{
                width: "100%", padding: "10px", marginTop: 14,
                background: isRunning ? "#1a0a0a" : `linear-gradient(135deg, ${algo.color}22, ${algo.color}11)`,
                border: `1px solid ${isRunning ? "#ff4444" : algo.color}`,
                color: isRunning ? "#ff4444" : algo.color,
                borderRadius: 4, fontSize: 11, letterSpacing: "0.3em",
                cursor: "pointer", fontFamily: "inherit",
                textTransform: "uppercase",
                boxShadow: isRunning ? "0 0 12px #ff444422" : `0 0 12px ${algo.color}22`,
                transition: "all 0.2s",
                marginBottom: 6,
              }}
            >
              {isRunning ? "■  STOP" : isDone ? "↺  RESET" : "▶  RUN"}
            </button>

            <button
              onClick={() => { reset(); shuffle(arraySize); }}
              disabled={isRunning}
              style={{
                width: "100%", padding: "7px",
                background: "transparent",
                border: "1px solid #0d2035",
                color: "#2a5a7a", borderRadius: 4, fontSize: 10,
                letterSpacing: "0.2em", fontFamily: "inherit",
                cursor: isRunning ? "not-allowed" : "pointer",
                textTransform: "uppercase",
              }}
            >
              ⟳  SHUFFLE
            </button>
          </div>

          {/* Stats */}
          <div style={{ padding: "16px" }}>
            <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em", marginBottom: 12 }}>
              LIVE STATS
            </div>
            {([
              ["COMPARISONS", stats.comparisons],
              ["SWAPS",       stats.swaps],
              ["ELAPSED",     `${stats.time}s`],
            ] as const).map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                <span style={{ fontSize: 9, color: "#2a5a7a", letterSpacing: "0.15em" }}>{label}</span>
                <span style={{ fontSize: 13, color: algo.color, fontWeight: "bold" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {activeTab === "visualizer" && (
            <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Info bar */}
              <div style={{
                display: "flex", gap: 16, alignItems: "center",
                padding: "10px 16px",
                background: "#040810",
                border: "1px solid #0d2035",
                borderRadius: 6, fontSize: 11,
              }}>
                <span style={{ color: algo.color, fontWeight: "bold", fontSize: 13 }}>{algo.name}</span>
                <span style={{ color: "#1e3a5f" }}>|</span>
                <span style={{ color: "#2a5a7a" }}>{algo.description}</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
                  <span><span style={{ color: "#2a5a7a" }}>AVG </span><span style={{ color: algo.color }}>{algo.average}</span></span>
                  <span><span style={{ color: "#2a5a7a" }}>SPACE </span><span style={{ color: algo.color }}>{algo.space}</span></span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: 20, fontSize: 10, letterSpacing: "0.15em" }}>
                {[
                  { color: "#ffffff",  label: "COMPARING" },
                  { color: "#ff4444", label: "SWAPPING"  },
                  { color: "#ffd700", label: "PIVOT"     },
                  { color: algo.color, label: "SORTED"   },
                  { color: "#1e3a5f", label: "UNSORTED"  },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, color: "#4a6a85" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Visualizer */}
              <SortVisualizer
                array={array}
                frame={frame}
                isRunning={isRunning}
                algoColor={algo.color}
              />

              {/* Done banner */}
              {isDone && (
                <div style={{
                  padding: "10px 16px",
                  background: `${algo.color}11`,
                  border: `1px solid ${algo.color}44`,
                  borderRadius: 6, fontSize: 11,
                  color: algo.color, letterSpacing: "0.2em",
                  textAlign: "center",
                }}>
                  ✓ SORTED — {stats.comparisons} comparisons · {stats.swaps} swaps · {stats.time}s
                </div>
              )}
            </div>
          )}

          {activeTab === "complexity" && (
            <ComplexityPanel
              selectedAlgo={selectedAlgo}
              arraySize={arraySize}
              isRunning={isRunning}
              onSelect={setSelectedAlgo}
            />
          )}
        </div>
      </div>
    </div>
  );
}