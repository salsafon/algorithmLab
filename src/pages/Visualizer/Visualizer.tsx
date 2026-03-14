import { useEffect, useState } from "react";
import { Layout } from "../../components";
import { useArray, useVisualizer, useKeyboard } from "../../hooks";
import { ALGORITHMS } from "../../algorithms";
import {
  AlgorithmSelector,
  SpeedSlider,
  ArraySizeSlider,
  SortVisualizer,
  ComplexityPanel,
  CustomInputModal,
  PseudocodePanel,
} from "../../components";

export function Visualizer() {
  const [activeTab, setActiveTab] = useState("visualizer");
  const [showModal, setShowModal] = useState(false);
  const { array, setArray, arraySize, updateSize, shuffle } = useArray();
  const {
    selectedAlgo, setSelectedAlgo,
    frame, isRunning, isDone,
    speed, setSpeed,
    stats, reset, run,
  } = useVisualizer(array, setArray);

  const algo = ALGORITHMS[selectedAlgo];

  useEffect(() => { reset(); }, [selectedAlgo]);
  useEffect(() => { reset(); shuffle(arraySize); }, [arraySize]);

  const handleRun = () => {
    if (isDone) { reset(); shuffle(arraySize); return; }
    run();
  };

  useKeyboard({
  onRun: handleRun,
  onReset: () => { reset(); shuffle(arraySize); },
  onShuffle: () => { if (!isRunning) { reset(); shuffle(arraySize); } },
});

  return (
    <Layout>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 240, borderRight: "1px solid #0d2035",
          display: "flex", flexDirection: "column",
          background: "#040810",
        }}>
          <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #0d2035" }}>
            <AlgorithmSelector
              selected={selectedAlgo}
              isRunning={isRunning}
              onSelect={setSelectedAlgo}
            />
          </div>

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
                transition: "all 0.2s", marginBottom: 6,
              }}
            >
              {isRunning ? "■  STOP" : isDone ? "↺  RESET" : "▶  RUN"}
            </button>

            <button
              onClick={() => { reset(); shuffle(arraySize); }}
              disabled={isRunning}
              style={{
                width: "100%", padding: "7px",
                background: "transparent", border: "1px solid #0d2035",
                color: "#2a5a7a", borderRadius: 4, fontSize: 10,
                letterSpacing: "0.2em", fontFamily: "inherit",
                cursor: isRunning ? "not-allowed" : "pointer",
                textTransform: "uppercase",
              }}
            >
              ⟳  SHUFFLE
            </button>

            <button
              onClick={() => setShowModal(true)}
              disabled={isRunning}
              style={{
                width: "100%", padding: "7px", marginTop: 6,
                background: "transparent",
                border: `1px solid ${algo.color}44`,
                color: algo.color, borderRadius: 4, fontSize: 10,
                letterSpacing: "0.2em", fontFamily: "inherit",
                cursor: isRunning ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                opacity: isRunning ? 0.5 : 1,
              }}
            >
              ✎  CUSTOM INPUT
            </button>
          </div>

          {/* Stats */}
          <div style={{ padding: "16px" }}>
            <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em", marginBottom: 12 }}>
              LIVE STATS
            </div>
            {([
              ["COMPARISONS", stats.comparisons],
              ["SWAPS", stats.swaps],
              ["ELAPSED", `${stats.time}s`],
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
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #0d2035", padding: "0 24px" }}>
            {["visualizer", "complexity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 20px", background: "transparent", border: "none",
                  borderBottom: activeTab === tab ? `2px solid ${algo.color}` : "2px solid transparent",
                  color: activeTab === tab ? algo.color : "#2a5a7a",
                  fontSize: 10, letterSpacing: "0.3em", cursor: "pointer",
                  fontFamily: "inherit", textTransform: "uppercase", marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "visualizer" && (
            <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Info bar */}
              <div style={{
                display: "flex", gap: 16, alignItems: "center",
                padding: "10px 16px", background: "#040810",
                border: "1px solid #0d2035", borderRadius: 6, fontSize: 11,
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
                  { color: "#ffffff", label: "COMPARING" },
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

              {/* Keyboard hints */}
<div style={{
  display: "flex", gap: 16, fontSize: 9,
  letterSpacing: "0.15em", color: "#1e3a5f",
}}>
  {[
    ["SPACE", "RUN / STOP"],
    ["R", "RESET"],
    ["S", "SHUFFLE"],
  ].map(([key, action]) => (
    <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        padding: "2px 6px",
        border: "1px solid #0d2035",
        borderRadius: 3, fontSize: 9,
        color: "#2a5a7a",
      }}>{key}</span>
      <span>{action}</span>
    </div>
  ))}
</div>

              <SortVisualizer
                array={array}
                frame={frame}
                isRunning={isRunning}
                algoColor={algo.color}
              />

              <PseudocodePanel
                algoKey={selectedAlgo}
                currentLine={frame.codeLine}
                algoColor={algo.color}
              />

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

      <CustomInputModal
        isOpen={showModal}
        algoColor={algo.color}
        onClose={() => setShowModal(false)}
        onApply={(arr) => { reset(); setArray(arr); }}
      />
    </Layout>
  );
}