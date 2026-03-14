import { useState, useRef, useCallback, useEffect } from "react";
import { Layout } from "../../components";
import { bfs, dfs, dijkstra } from "../../algorithms/graph/pathfinding";
import { generateMaze } from "../../algorithms/graph/mazeGenerator";
import type { Cell, CellType } from "../../algorithms/graph/pathfinding";

const ROWS = 22;
const COLS = 50;
const ALGORITHMS = {
  bfs:      { name: "BFS",      color: "#00f5ff", description: "Explores all neighbors level by level. Guarantees shortest path." },
  dfs:      { name: "DFS",      color: "#ff3cac", description: "Explores as far as possible before backtracking. Does not guarantee shortest path." },
  dijkstra: { name: "Dijkstra", color: "#ffd700", description: "Weighted shortest path. Respects cell weights." },
};

function createGrid(): Cell[][] {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row, col, type: "empty" as CellType,
      weight: 1, distance: Infinity, parent: null,
    }))
  );
}

function initGrid(): Cell[][] {
  const g = createGrid();
  g[Math.floor(ROWS / 2)][4].type = "start";
  g[Math.floor(ROWS / 2)][COLS - 5].type = "end";
  return g;
}

type DrawMode = "wall" | "weight" | "erase";

export function Graph() {
  const [grid, setGrid] = useState<Cell[][]>(initGrid);
  const [selectedAlgo, setSelectedAlgo] = useState<"bfs" | "dfs" | "dijkstra">("bfs");
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [drawMode, setDrawMode] = useState<DrawMode>("wall");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [pathCells, setPathCells] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, found: false });
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const algo = ALGORITHMS[selectedAlgo];

  const getStartEnd = useCallback(() => {
    let start: [number, number] = [0, 0];
    let end: [number, number] = [0, 0];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c].type === "start") start = [r, c];
        if (grid[r][c].type === "end") end = [r, c];
      }
    return { start, end };
  }, [grid]);

  const reset = () => {
    abortRef.current?.abort();
    setGrid(g => g.map(row => row.map(cell => ({
      ...cell,
      type: cell.type === "visited" || cell.type === "path" ? "empty" : cell.type,
    }))));
    setVisitedCells(new Set());
    setPathCells(new Set());
    setIsRunning(false);
    setIsDone(false);
    setStats({ visited: 0, pathLength: 0, found: false });
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setGrid(initGrid());
    setVisitedCells(new Set());
    setPathCells(new Set());
    setIsRunning(false);
    setIsDone(false);
    setStats({ visited: 0, pathLength: 0, found: false });
  };

  const generateMazeHandler = () => {
    if (isRunning) return;
    abortRef.current?.abort();
    setVisitedCells(new Set());
    setPathCells(new Set());
    setIsDone(false);
    setStats({ visited: 0, pathLength: 0, found: false });
    setGrid(g => generateMaze(g));
};

  const run = async () => {
    if (isRunning) { abortRef.current?.abort(); setIsRunning(false); return; }
    reset();
    await new Promise(r => setTimeout(r, 50));

    abortRef.current = new AbortController();
    setIsRunning(true);
    setIsDone(false);

    const { start, end } = getStartEnd();
    const algoFn = selectedAlgo === "bfs" ? bfs : selectedAlgo === "dfs" ? dfs : dijkstra;
    const visited = new Set<string>();
    const path = new Set<string>();

    for await (const frame of algoFn(grid, start, end, abortRef.current.signal)) {
      if (abortRef.current.signal.aborted) break;

      frame.visited.forEach(([r, c]) => visited.add(`${r},${c}`));
      setVisitedCells(new Set(visited));

      if (frame.done) {
        frame.path.forEach(([r, c]) => path.add(`${r},${c}`));
        setPathCells(new Set(path));
        setStats({ visited: visited.size, pathLength: frame.path.length, found: frame.found });
        setIsDone(true);
        break;
      }

      await new Promise(r => setTimeout(r, 12));
    }
    setIsRunning(false);
  };

  const handleCellInteract = (row: number, col: number) => {
    if (isRunning) return;
    setGrid(g => {
      const newGrid = g.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      if (cell.type === "start" || cell.type === "end") {
        setDragging(cell.type);
        return newGrid;
      }
      if (drawMode === "wall" && cell.type === "empty") cell.type = "wall";
      else if (drawMode === "erase" && cell.type !== "start" && cell.type !== "end") {
        cell.type = "empty"; cell.weight = 1;
      }
      else if (drawMode === "weight" && cell.type === "empty") {
        cell.type = "weighted"; cell.weight = 5;
      }
      return newGrid;
    });
  };

  const handleCellEnter = (row: number, col: number) => {
    if (!isMouseDown || isRunning) return;
    if (dragging) {
      setGrid(g => {
        const newGrid = g.map(r => r.map(c => ({ ...c })));
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            if (newGrid[r][c].type === dragging) newGrid[r][c].type = "empty";
        if (newGrid[row][col].type === "empty") newGrid[row][col].type = dragging;
        return newGrid;
      });
      return;
    }
    setGrid(g => {
      const newGrid = g.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      if (drawMode === "wall" && cell.type === "empty") cell.type = "wall";
      else if (drawMode === "erase" && cell.type !== "start" && cell.type !== "end") {
        cell.type = "empty"; cell.weight = 1;
      }
      else if (drawMode === "weight" && cell.type === "empty") {
        cell.type = "weighted"; cell.weight = 5;
      }
      return newGrid;
    });
  };

  const getCellStyle = (cell: Cell): React.CSSProperties => {
    const key = `${cell.row},${cell.col}`;
    const isPath = pathCells.has(key);
    const isVisited = visitedCells.has(key);
    const base: React.CSSProperties = {
      width: "100%", height: "100%",
      transition: "background-color 0.1s ease",
    };
    if (cell.type === "start") return { ...base, background: "#3a9a3a", boxShadow: "0 0 6px #3a9a3a" };
    if (cell.type === "end")   return { ...base, background: "#ff4444", boxShadow: "0 0 6px #ff4444" };
    if (cell.type === "wall")  return { ...base, background: "#0a1520" };
    if (isPath)                return { ...base, background: algo.color, boxShadow: `0 0 4px ${algo.color}` };
    if (isVisited)             return { ...base, background: `${algo.color}44` };
    if (cell.type === "weighted") return { ...base, background: "#1a2a1a", border: "1px solid #2a5a2a" };
    return { ...base, background: "transparent" };
  };

  return (
    <Layout>
      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.4em", marginBottom: 6 }}>GRAPH</div>
            <h1 style={{ fontSize: 24, color: "#e0e8f0", fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>
              Pathfinding Visualizer
            </h1>
          </div>

          {/* Stats */}
          {isDone && (
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "VISITED",  value: stats.visited,    color: `${algo.color}` },
                { label: "PATH LEN", value: stats.pathLength, color: algo.color },
                { label: "FOUND",    value: stats.found ? "YES" : "NO", color: stats.found ? "#3a9a3a" : "#ff4444" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  padding: "8px 16px", background: "#040810",
                  border: `1px solid ${color}33`, borderRadius: 6, textAlign: "center",
                }}>
                  <div style={{ fontSize: 18, color, fontWeight: "bold" }}>{value}</div>
                  <div style={{ fontSize: 8, color: "#2a5a7a", letterSpacing: "0.2em" }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Algorithm picker */}
          <div style={{ display: "flex", gap: 6 }}>
            {(Object.keys(ALGORITHMS) as (keyof typeof ALGORITHMS)[]).map(key => (
              <button
                key={key}
                onClick={() => { if (!isRunning) setSelectedAlgo(key); }}
                style={{
                  padding: "7px 16px", fontSize: 10, letterSpacing: "0.2em",
                  background: selectedAlgo === key ? `${ALGORITHMS[key].color}22` : "transparent",
                  border: `1px solid ${selectedAlgo === key ? ALGORITHMS[key].color : "#0d2035"}`,
                  color: selectedAlgo === key ? ALGORITHMS[key].color : "#2a5a7a",
                  borderRadius: 4, cursor: isRunning ? "not-allowed" : "pointer",
                  fontFamily: "inherit", textTransform: "uppercase",
                }}
              >
                {ALGORITHMS[key].name}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: "#0d2035" }} />

          {/* Draw mode */}
          <div style={{ display: "flex", gap: 6 }}>
            {([["wall", "✦ WALL"], ["weight", "◈ WEIGHT"], ["erase", "✕ ERASE"]] as const).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setDrawMode(mode)}
                style={{
                  padding: "7px 14px", fontSize: 9, letterSpacing: "0.15em",
                  background: drawMode === mode ? "#0a1825" : "transparent",
                  border: `1px solid ${drawMode === mode ? "#4a7fa5" : "#0d2035"}`,
                  color: drawMode === mode ? "#e0e8f0" : "#2a5a7a",
                  borderRadius: 4, cursor: "pointer",
                  fontFamily: "inherit", textTransform: "uppercase",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: "#0d2035" }} />

          {/* Actions */}
          <button
            onClick={run}
            style={{
              padding: "7px 20px", fontSize: 10, letterSpacing: "0.25em",
              background: isRunning ? "#1a0a0a" : `linear-gradient(135deg, ${algo.color}22, ${algo.color}11)`,
              border: `1px solid ${isRunning ? "#ff4444" : algo.color}`,
              color: isRunning ? "#ff4444" : algo.color,
              borderRadius: 4, cursor: "pointer",
              fontFamily: "inherit", textTransform: "uppercase",
              boxShadow: `0 0 12px ${isRunning ? "#ff444422" : algo.color + "22"}`,
            }}
          >
            {isRunning ? "■ STOP" : "▶ RUN"}
          </button>

          <button onClick={reset} disabled={isRunning} style={{
            padding: "7px 14px", fontSize: 9, letterSpacing: "0.2em",
            background: "transparent", border: "1px solid #0d2035",
            color: "#2a5a7a", borderRadius: 4, cursor: isRunning ? "not-allowed" : "pointer",
            fontFamily: "inherit", textTransform: "uppercase",
          }}>
            ⟳ RESET PATH
          </button>

          <button onClick={clearAll} disabled={isRunning} style={{
            padding: "7px 14px", fontSize: 9, letterSpacing: "0.2em",
            background: "transparent", border: "1px solid #0d2035",
            color: "#2a5a7a", borderRadius: 4, cursor: isRunning ? "not-allowed" : "pointer",
            fontFamily: "inherit", textTransform: "uppercase",
          }}>
            ✕ CLEAR ALL
          </button>
        </div>

        <div style={{ width: 1, height: 24, background: "#0d2035" }} />

        <button
        onClick={generateMazeHandler}
        disabled={isRunning}
        style={{
            padding: "7px 14px", fontSize: 9, letterSpacing: "0.2em",
            background: isRunning ? "transparent" : "#0a1825",
            border: `1px solid ${isRunning ? "#0d2035" : "#bf5af2"}`,
            color: isRunning ? "#1e3a5f" : "#bf5af2",
            borderRadius: 4, cursor: isRunning ? "not-allowed" : "pointer",
            fontFamily: "inherit", textTransform: "uppercase",
            boxShadow: isRunning ? "none" : "0 0 10px #bf5af222",
            transition: "all 0.2s",
        }}
>
        ◈ GENERATE MAZE
</button>

        {/* Algorithm description */}
        <div style={{
          padding: "8px 16px", background: "#040810",
          border: "1px solid #0d2035", borderRadius: 6,
          fontSize: 11, color: "#2a5a7a",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: algo.color, flexShrink: 0 }} />
          <span style={{ color: algo.color, fontWeight: "bold" }}>{algo.name}</span>
          <span style={{ color: "#1e3a5f" }}>|</span>
          {algo.description}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            flex: 1,
            background: "#040810",
            border: "1px solid #0d2035",
            borderRadius: 8,
            overflow: "hidden",
            cursor: drawMode === "erase" ? "cell" : "crosshair",
            minHeight: 340,
            gap: "1px",
            padding: "1px",
          }}
          onMouseLeave={() => { setIsMouseDown(false); setDragging(null); }}
          onMouseUp={() => { setIsMouseDown(false); setDragging(null); }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => { setIsMouseDown(true); handleCellInteract(r, c); }}
                onMouseEnter={() => handleCellEnter(r, c)}
                onMouseUp={() => { setIsMouseDown(false); setDragging(null); }}
                style={getCellStyle(cell)}
              />
            ))
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, fontSize: 9, letterSpacing: "0.15em", flexWrap: "wrap" }}>
          {[
            { color: "#3a9a3a",          label: "START"   },
            { color: "#ff4444",          label: "END"     },
            { color: "#0a1520",          label: "WALL"    },
            { color: "#1a2a1a",          label: "WEIGHT"  },
            { color: `${algo.color}44`,  label: "VISITED" },
            { color: algo.color,         label: "PATH"    },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, color: "#4a6a85" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: "1px solid #0d2035" }} />
              {label}
            </div>
          ))}
          <span style={{ color: "#1e3a5f", marginLeft: "auto" }}>
            Drag START/END to move · Click/drag to draw
          </span>
        </div>
      </div>
    </Layout>
  );
}