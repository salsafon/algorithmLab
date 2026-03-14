import type { Cell } from "./pathfinding";

export function generateMaze(grid: Cell[][]): Cell[][] {
  const rows = grid.length;
  const cols = grid[0].length;

  // Deep copy grid
  const newGrid = grid.map(row =>
    row.map(cell => ({ ...cell, type: cell.type === "start" || cell.type === "end" ? cell.type : "wall" as const }))
  );

  // Recursive backtracking — works on odd cells only
  const visited = new Set<string>();

  function carve(r: number, c: number) {
    visited.add(`${r},${c}`);
    if (newGrid[r][c].type !== "start" && newGrid[r][c].type !== "end") {
      newGrid[r][c].type = "empty";
    }

    // Shuffle directions
    const dirs = [[-2,0],[2,0],[0,-2],[0,2]].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`)) {
        // Carve through the wall between
        const wr = r + dr / 2;
        const wc = c + dc / 2;
        if (newGrid[wr][wc].type !== "start" && newGrid[wr][wc].type !== "end") {
          newGrid[wr][wc].type = "empty";
        }
        carve(nr, nc);
      }
    }
  }

  // Start from top-left odd cell
  carve(1, 1);

  // Make sure start and end are reachable — clear their neighbors
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].type === "start" || newGrid[r][c].type === "end") {
        const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (newGrid[nr][nc].type === "wall") newGrid[nr][nc].type = "empty";
          }
        }
      }
    }
  }

  return newGrid;
}