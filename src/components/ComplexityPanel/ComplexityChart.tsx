import { COMPLEXITY_CURVES } from "../../constants";

interface Props {
  n: number;
}

export function ComplexityChart({ n }: Props) {
  const width = 500;
  const height = 200;
  const pad = { top: 10, right: 20, bottom: 30, left: 50 };
  const maxN = 100;
  const pts = Array.from({ length: maxN }, (_, i) => i + 1);
  const maxY = Math.max(...COMPLEXITY_CURVES.map((c) => c.fn(maxN)));

  const scaleX = (x: number) => pad.left + (x / maxN) * (width - pad.left - pad.right);
  const scaleY = (y: number) => height - pad.bottom - (y / maxY) * (height - pad.top - pad.bottom);

  const pathFor = (fn: (x: number) => number) =>
    pts.map((x, i) => `${i === 0 ? "M" : "L"} ${scaleX(x)} ${scaleY(fn(x))}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {[25, 50, 75, 100].map((v) => (
        <line
          key={v}
          x1={pad.left} x2={width - pad.right}
          y1={scaleY(maxY * v / 100)} y2={scaleY(maxY * v / 100)}
          stroke="#0d2035" strokeWidth={1}
        />
      ))}

      {/* Axes */}
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} stroke="#1e3a5f" strokeWidth={1} />
      <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} stroke="#1e3a5f" strokeWidth={1} />

      {/* Axis labels */}
      <text x={width / 2} y={height - 4} textAnchor="middle" fill="#2a5a7a" fontSize={9} fontFamily="Courier New">
        n (array size)
      </text>
      <text
        x={14} y={height / 2} textAnchor="middle"
        fill="#2a5a7a" fontSize={9} fontFamily="Courier New"
        transform={`rotate(-90 14 ${height / 2})`}
      >
        operations
      </text>

      {/* Curves */}
      {COMPLEXITY_CURVES.map((c) => (
        <path key={c.label} d={pathFor(c.fn)} fill="none" stroke={c.color} strokeWidth={1.5} opacity={0.8} />
      ))}

      {/* Current n marker */}
      <line
        x1={scaleX(n)} x2={scaleX(n)}
        y1={pad.top} y2={height - pad.bottom}
        stroke="#ffffff44" strokeWidth={1} strokeDasharray="4,3"
      />
      <text x={scaleX(n)} y={height - pad.bottom + 14} textAnchor="middle" fill="#ffffff88" fontSize={8} fontFamily="Courier New">
        n={n}
      </text>

      {/* Legend */}
      {COMPLEXITY_CURVES.map((c, i) => (
        <g key={c.label} transform={`translate(${width - pad.right - 90}, ${pad.top + i * 18})`}>
          <line x1={0} x2={16} y1={6} y2={6} stroke={c.color} strokeWidth={2} />
          <text x={20} y={10} fill={c.color} fontSize={9} fontFamily="Courier New">{c.label}</text>
        </g>
      ))}
    </svg>
  );
}