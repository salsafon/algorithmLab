export type CellType = "empty" | "wall" | "start" | "end" | "visited" | "path" | "weighted";

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  weight: number;
  distance: number;
  parent: { row: number; col: number } | null;
}

export interface PathFrame {
  visited: [number, number][];
  path: [number, number][];
  done: boolean;
  found: boolean;
}

function getNeighbors(grid: Cell[][], row: number, col: number) {
  const neighbors: Cell[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  for (const [dr, dc] of dirs) {
    const r = row + dr, c = col + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c].type !== "wall") {
      neighbors.push(grid[r][c]);
    }
  }
  return neighbors;
}

export async function* bfs(
  grid: Cell[][],
  start: [number, number],
  end: [number, number],
  signal: AbortSignal
): AsyncGenerator<PathFrame> {
  const visited: [number, number][] = [];
  const queue: [number, number][] = [start];
  const seen = new Set<string>();
  const parent = new Map<string, [number, number] | null>();
  seen.add(`${start[0]},${start[1]}`);
  parent.set(`${start[0]},${start[1]}`, null);

  while (queue.length > 0) {
    if (signal.aborted) return;
    const [r, c] = queue.shift()!;
    visited.push([r, c]);
    yield { visited: [...visited], path: [], done: false, found: false };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      yield { visited, path, done: true, found: true };
      return;
    }

    for (const neighbor of getNeighbors(grid, r, c)) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (!seen.has(key)) {
        seen.add(key);
        parent.set(key, [r, c]);
        queue.push([neighbor.row, neighbor.col]);
      }
    }
  }
  yield { visited, path: [], done: true, found: false };
}

export async function* dfs(
  grid: Cell[][],
  start: [number, number],
  end: [number, number],
  signal: AbortSignal
): AsyncGenerator<PathFrame> {
  const visited: [number, number][] = [];
  const stack: [number, number][] = [start];
  const seen = new Set<string>();
  const parent = new Map<string, [number, number] | null>();
  parent.set(`${start[0]},${start[1]}`, null);

  while (stack.length > 0) {
    if (signal.aborted) return;
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (seen.has(key)) continue;
    seen.add(key);
    visited.push([r, c]);
    yield { visited: [...visited], path: [], done: false, found: false };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      yield { visited, path, done: true, found: true };
      return;
    }

    for (const neighbor of getNeighbors(grid, r, c)) {
      const nkey = `${neighbor.row},${neighbor.col}`;
      if (!seen.has(nkey)) {
        parent.set(nkey, [r, c]);
        stack.push([neighbor.row, neighbor.col]);
      }
    }
  }
  yield { visited, path: [], done: true, found: false };
}

export async function* dijkstra(
  grid: Cell[][],
  start: [number, number],
  end: [number, number],
  signal: AbortSignal
): AsyncGenerator<PathFrame> {
  const visited: [number, number][] = [];
  const dist = new Map<string, number>();
  const parent = new Map<string, [number, number] | null>();
  const pq: { dist: number; pos: [number, number] }[] = [];

  const startKey = `${start[0]},${start[1]}`;
  dist.set(startKey, 0);
  parent.set(startKey, null);
  pq.push({ dist: 0, pos: start });

  while (pq.length > 0) {
    if (signal.aborted) return;
    pq.sort((a, b) => a.dist - b.dist);
    const { dist: d, pos: [r, c] } = pq.shift()!;
    const key = `${r},${c}`;
    if ((dist.get(key) ?? Infinity) < d) continue;
    visited.push([r, c]);
    yield { visited: [...visited], path: [], done: false, found: false };

    if (r === end[0] && c === end[1]) {
      const path = reconstructPath(parent, end);
      yield { visited, path, done: true, found: true };
      return;
    }

    for (const neighbor of getNeighbors(grid, r, c)) {
      const nkey = `${neighbor.row},${neighbor.col}`;
      const newDist = d + neighbor.weight;
      if (newDist < (dist.get(nkey) ?? Infinity)) {
        dist.set(nkey, newDist);
        parent.set(nkey, [r, c]);
        pq.push({ dist: newDist, pos: [neighbor.row, neighbor.col] });
      }
    }
  }
  yield { visited, path: [], done: true, found: false };
}

function reconstructPath(
  parent: Map<string, [number, number] | null>,
  end: [number, number]
): [number, number][] {
  const path: [number, number][] = [];
  let current: [number, number] | null = end;
  while (current !== null) {
    path.unshift(current);
    current = parent.get(`${current[0]},${current[1]}`) ?? null;
  }
  return path;
}