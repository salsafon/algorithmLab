import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components";
import { ALGORITHMS } from "../../algorithms";

// Mini live sorting animation for the hero background
function LiveSortBackground() {
  const [bars, setBars] = useState(() =>
    Array.from({ length: 60 }, () => Math.floor(Math.random() * 80) + 20)
  );
  const [active, setActive] = useState<number[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    const arr = [...bars];
    const interval = setInterval(() => {
      const i = indexRef.current % (arr.length - 1);
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
      setActive([i, i + 1]);
      setBars([...arr]);
      indexRef.current++;
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "flex-end",
      gap: 2, padding: "0 40px 0",
      opacity: 0.12, pointerEvents: "none",
    }}>
      {bars.map((val, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${val}%`,
          background: active.includes(i) ? "#00f5ff" : "#1e3a5f",
          borderRadius: "2px 2px 0 0",
          transition: "height 0.04s ease",
        }} />
      ))}
    </div>
  );
}

const FEATURES = [
  {
    icon: "▶",
    title: "Sorting Visualizer",
    description: "Watch Bubble, Merge, Quick, Heap, Selection and Insertion sort come alive with step-by-step animation.",
    color: "#00f5ff",
    path: "/visualizer",
    tag: "6 ALGORITHMS",
  },
  {
    icon: "◈",
    title: "Graph & Pathfinding",
    description: "Visualize BFS, DFS, and Dijkstra on an interactive grid. Draw walls, set weights, find the shortest path.",
    color: "#ff3cac",
    path: "/graph",
    tag: "COMING SOON",
  },
  {
    icon: "◎",
    title: "Quiz Mode",
    description: "Watch an algorithm run and guess which one it is. Test your knowledge and sharpen your pattern recognition.",
    color: "#ffd700",
    path: "/quiz",
    tag: "COMING SOON",
  },
  {
    icon: "≡",
    title: "Cheat Sheet",
    description: "Every algorithm at a glance. Time complexities, space complexities, stability — all in one printable table.",
    color: "#a8ff3e",
    path: "/cheatsheet",
    tag: "COMING SOON",
  },
];

const STATS = [
  { value: "6",    label: "Sorting Algorithms" },
  { value: "O(1)", label: "Min Space Complexity" },
  { value: "4",    label: "Pages & Tools"       },
  { value: "∞",    label: "Things to Learn"     },
];

const ALGO_LIST = Object.values(ALGORITHMS);

export function Home() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredAlgo, setHoveredAlgo] = useState<number | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderBottom: "1px solid #0d2035",
      }}>
        <LiveSortBackground />

        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "20%", left: "15%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, #00f5ff08 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "15%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, #ff3cac06 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", textAlign: "center", maxWidth: 720, padding: "0 24px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", marginBottom: 32,
            border: "1px solid #0d2035", borderRadius: 20,
            fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }} />
            INTERACTIVE ALGORITHM VISUALIZER
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontFamily: "'Courier New', monospace",
            fontWeight: "bold",
            color: "#e0e8f0",
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}>
            Algorithms,{" "}
            <span style={{
              color: "#00f5ff",
              textShadow: "0 0 30px #00f5ff44",
            }}>
              visualized.
            </span>
          </h1>

          <p style={{
            fontSize: 15,
            color: "#4a7fa5",
            lineHeight: 1.8,
            marginBottom: 40,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}>
            Stop memorizing. Start understanding. Watch every comparison,
            swap, and recursion happen in real time.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/visualizer")}
              style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg, #00f5ff22, #00f5ff11)",
                border: "1px solid #00f5ff",
                color: "#00f5ff",
                borderRadius: 6, fontSize: 11,
                letterSpacing: "0.3em", cursor: "pointer",
                fontFamily: "inherit", textTransform: "uppercase",
                boxShadow: "0 0 20px #00f5ff22",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 30px #00f5ff44")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 20px #00f5ff22")}
            >
              ▶ Launch Visualizer
            </button>
            <button
              onClick={() => navigate("/cheatsheet")}
              style={{
                padding: "14px 32px",
                background: "transparent",
                border: "1px solid #0d2035",
                color: "#4a7fa5",
                borderRadius: 6, fontSize: 11,
                letterSpacing: "0.3em", cursor: "pointer",
                fontFamily: "inherit", textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a5a7a"; e.currentTarget.style.color = "#e0e8f0"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#0d2035"; e.currentTarget.style.color = "#4a7fa5"; }}
            >
              ≡ Cheat Sheet
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 32,
          fontSize: 9, color: "#1e3a5f",
          letterSpacing: "0.3em", textTransform: "uppercase",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <span>SCROLL</span>
          <div style={{ width: 1, height: 24, background: "linear-gradient(180deg, #1e3a5f, transparent)" }} />
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #0d2035",
        background: "#040810",
      }}>
        {STATS.map(({ value, label }, i) => (
          <div key={i} style={{
            flex: 1, padding: "24px",
            borderRight: i < STATS.length - 1 ? "1px solid #0d2035" : "none",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 28, color: "#00f5ff", fontWeight: "bold", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 9, color: "#2a5a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Features grid */}
      <div style={{ padding: "80px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.4em", marginBottom: 12 }}>WHAT'S INSIDE</div>
          <h2 style={{ fontSize: 32, color: "#e0e8f0", fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>
            Four tools, one mission.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              onClick={() => navigate(f.path)}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                padding: "28px",
                background: hoveredFeature === i ? "#040810" : "#030608",
                border: `1px solid ${hoveredFeature === i ? f.color + "44" : "#0d2035"}`,
                borderRadius: 10, cursor: "pointer",
                transition: "all 0.2s",
                transform: hoveredFeature === i ? "translateY(-2px)" : "none",
                boxShadow: hoveredFeature === i ? `0 8px 30px ${f.color}11` : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 24, color: f.color }}>{f.icon}</span>
                <span style={{
                  fontSize: 8, padding: "3px 8px",
                  border: `1px solid ${f.color}33`,
                  color: f.color, borderRadius: 3,
                  letterSpacing: "0.2em",
                  background: `${f.color}11`,
                }}>{f.tag}</span>
              </div>
              <div style={{ fontSize: 14, color: "#e0e8f0", marginBottom: 10, fontWeight: "bold" }}>{f.title}</div>
              <div style={{ fontSize: 11, color: "#2a5a7a", lineHeight: 1.7 }}>{f.description}</div>
              <div style={{ marginTop: 20, fontSize: 10, color: f.color, letterSpacing: "0.2em" }}>
                {f.path === "/visualizer" ? "OPEN →" : "SOON →"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm quick reference */}
      <div style={{ padding: "0 48px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.4em", marginBottom: 12 }}>ALGORITHMS</div>
          <h2 style={{ fontSize: 28, color: "#e0e8f0", fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>
            Know your complexities.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, maxWidth: 1100, margin: "0 auto" }}>
          {ALGO_LIST.map((algo, i) => (
            <div
              key={algo.key}
              onMouseEnter={() => setHoveredAlgo(i)}
              onMouseLeave={() => setHoveredAlgo(null)}
              onClick={() => navigate("/visualizer")}
              style={{
                padding: "16px 20px",
                background: hoveredAlgo === i ? "#040810" : "transparent",
                border: `1px solid ${hoveredAlgo === i ? algo.color + "44" : "#0d2035"}`,
                borderRadius: 8, cursor: "pointer",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: algo.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: hoveredAlgo === i ? algo.color : "#4a7fa5" }}>{algo.name}</span>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
                <span style={{ color: "#1e3a5f" }}>AVG</span>
                <span style={{ color: algo.color }}>{algo.average}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #0d2035",
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#040810",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 6px #00f5ff" }} />
          <span style={{ fontSize: 11, color: "#2a5a7a", letterSpacing: "0.2em" }}>ALGORITHM LAB</span>
        </div>
        <span style={{ fontSize: 10, color: "#1e3a5f", letterSpacing: "0.2em" }}>
          Built with React + TypeScript
        </span>
      </div>
    </Layout>
  );
}