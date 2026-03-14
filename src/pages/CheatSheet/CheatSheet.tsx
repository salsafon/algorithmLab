import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components";
import { ALGORITHMS } from "../../algorithms";
import { ALGORITHM_KEYS } from "../../constants";

const ALGO_LIST = ALGORITHM_KEYS.map((k) => ALGORITHMS[k]);

type SortKey = "name" | "best" | "average" | "worst" | "space";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name",    label: "ALGORITHM" },
  { key: "best",    label: "BEST"      },
  { key: "average", label: "AVERAGE"   },
  { key: "worst",   label: "WORST"     },
  { key: "space",   label: "SPACE"     },
];

const COMPLEXITY_ORDER: Record<string, number> = {
  "O(1)":        1,
  "O(log n)":    2,
  "O(n)":        3,
  "O(n log n)":  4,
  "O(n²)":       5,
};

function complexityColor(val: string) {
  const order = COMPLEXITY_ORDER[val] ?? 3;
  if (order <= 2) return "#3a9a3a";
  if (order === 3) return "#a8ff3e";
  if (order === 4) return "#00f5ff";
  return "#ff4444";
}

export function CheatSheet() {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<"all" | "stable" | "unstable">("all");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...ALGO_LIST]
    .filter(a => filter === "all" ? true : filter === "stable" ? a.stable : !a.stable)
    .sort((a, b) => {
      let valA: string | number = a[sortKey];
      let valB: string | number = b[sortKey];
      if (sortKey !== "name") {
        valA = COMPLEXITY_ORDER[valA] ?? 99;
        valB = COMPLEXITY_ORDER[valB] ?? 99;
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Layout>
      <div style={{ padding: "48px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.4em", marginBottom: 12 }}>
            REFERENCE
          </div>
          <h1 style={{
            fontSize: 36, color: "#e0e8f0",
            fontFamily: "'Courier New', monospace",
            fontWeight: "bold", marginBottom: 12,
          }}>
            Algorithm Cheat Sheet
          </h1>
          <p style={{ fontSize: 12, color: "#2a5a7a", lineHeight: 1.7 }}>
            Time and space complexities for all sorting algorithms. Click a column header to sort.
          </p>
        </div>

        {/* Complexity legend */}
        <div style={{
          display: "flex", gap: 20, marginBottom: 28,
          padding: "14px 20px",
          background: "#040810",
          border: "1px solid #0d2035",
          borderRadius: 8, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 9, color: "#4a7fa5", letterSpacing: "0.3em", alignSelf: "center" }}>COMPLEXITY SCALE</span>
          {[
            { label: "O(1) — Constant",      color: "#3a9a3a" },
            { label: "O(n) — Linear",         color: "#a8ff3e" },
            { label: "O(n log n) — Linearithmic", color: "#00f5ff" },
            { label: "O(n²) — Quadratic",     color: "#ff4444" },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 10, color: "#4a6a85" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {(["all", "stable", "unstable"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", fontSize: 9,
                letterSpacing: "0.2em", textTransform: "uppercase",
                background: filter === f ? "#00f5ff22" : "transparent",
                border: `1px solid ${filter === f ? "#00f5ff" : "#0d2035"}`,
                color: filter === f ? "#00f5ff" : "#2a5a7a",
                borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: "#040810",
          border: "1px solid #0d2035",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
            padding: "12px 24px",
            borderBottom: "1px solid #0d2035",
            background: "#030608",
          }}>
            {COLUMNS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                style={{
                  background: "transparent", border: "none",
                  color: sortKey === key ? "#00f5ff" : "#2a5a7a",
                  fontSize: 9, letterSpacing: "0.25em",
                  cursor: "pointer", fontFamily: "inherit",
                  textAlign: "left", display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {label}
                {sortKey === key && (
                  <span style={{ fontSize: 8 }}>{sortDir === "asc" ? "↑" : "↓"}</span>
                )}
              </button>
            ))}
            <div style={{ fontSize: 9, color: "#2a5a7a", letterSpacing: "0.25em" }}>STABLE</div>
            <div style={{ fontSize: 9, color: "#2a5a7a", letterSpacing: "0.25em" }}>VISUALIZE</div>
          </div>

          {/* Rows */}
          {sorted.map((algo, i) => (
            <div
              key={algo.key}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr",
                padding: "16px 24px",
                borderBottom: i < sorted.length - 1 ? "1px solid #0d2035" : "none",
                background: hoveredRow === i ? `${algo.color}08` : "transparent",
                transition: "background 0.15s",
                alignItems: "center",
              }}
            >
              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 2,
                  background: algo.color,
                  boxShadow: hoveredRow === i ? `0 0 8px ${algo.color}` : "none",
                  transition: "box-shadow 0.15s", flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 13, fontWeight: "bold",
                  color: hoveredRow === i ? algo.color : "#e0e8f0",
                  transition: "color 0.15s",
                }}>
                  {algo.name}
                </span>
              </div>

              {/* Complexities */}
              {[algo.best, algo.average, algo.worst, algo.space].map((val, j) => (
                <div key={j} style={{
                  fontSize: 12,
                  color: hoveredRow === i ? complexityColor(val) : "#4a6a85",
                  transition: "color 0.15s",
                  fontWeight: hoveredRow === i ? "bold" : "normal",
                }}>
                  {val}
                </div>
              ))}

              {/* Stable */}
              <div>
                <span style={{
                  fontSize: 8, padding: "3px 8px",
                  background: algo.stable ? "#0a1f0a" : "#1f0a0a",
                  border: `1px solid ${algo.stable ? "#1a5a1a" : "#5a1a1a"}`,
                  color: algo.stable ? "#3a9a3a" : "#9a3a3a",
                  borderRadius: 3, letterSpacing: "0.15em",
                }}>
                  {algo.stable ? "YES" : "NO"}
                </span>
              </div>

              {/* Visualize button */}
              <div>
                <button
                  onClick={() => navigate("/visualizer")}
                  style={{
                    padding: "4px 12px", fontSize: 9,
                    letterSpacing: "0.15em",
                    background: hoveredRow === i ? `${algo.color}22` : "transparent",
                    border: `1px solid ${hoveredRow === i ? algo.color : "#0d2035"}`,
                    color: hoveredRow === i ? algo.color : "#2a5a7a",
                    borderRadius: 3, cursor: "pointer",
                    fontFamily: "inherit", textTransform: "uppercase",
                    transition: "all 0.15s",
                  }}
                >
                  VIEW →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Description cards */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.3em", marginBottom: 20 }}>
            QUICK NOTES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {sorted.map((algo, i) => (
              <div
                key={algo.key}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  padding: "16px 20px",
                  background: hoveredRow === i ? "#040810" : "#030608",
                  border: `1px solid ${hoveredRow === i ? algo.color + "44" : "#0d2035"}`,
                  borderRadius: 8, transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: algo.color }} />
                  <span style={{ fontSize: 11, color: algo.color, fontWeight: "bold" }}>{algo.name}</span>
                </div>
                <div style={{ fontSize: 10, color: "#2a5a7a", lineHeight: 1.7 }}>
                  {algo.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}