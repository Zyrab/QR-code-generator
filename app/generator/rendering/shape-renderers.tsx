type QRCodeMatrix = (number | boolean)[][];

interface ShapeProps {
  x: number;
  y: number;
  size: number;
  color: string;
  matrix?: QRCodeMatrix;
  neighbors?: { top: number | boolean; bottom: number | boolean; left: number | boolean; right: number | boolean };
}
const R = 0.55; // visually > 50%
const O = 0.03; // overlap (removes seams)

export const ShapeRenderers: Record<string, React.FC<ShapeProps>> = {
  square: ({ x, y, color }) => <rect x={x} y={y} width={1} height={1} fill={color} shapeRendering="crispEdges" />,
  softSquare: ({ x, y, color }) => <rect x={x} y={y} width={1} height={1} rx={0.18} ry={0.18} fill={color} />,
  circle: ({ x, y, color }) => <circle cx={x + 0.5} cy={y + 0.5} r={0.45} fill={color} />,
  pill: ({ x, y, color, neighbors }) => {
    const { left, right } = neighbors || {};
    const rx = left || right ? 0.5 : 0.25;

    return <rect x={x} y={y} width={1} height={1} rx={rx} ry={0.5} fill={color} />;
  },
  blob: ({ x, y, color }) => <circle cx={x + 0.5} cy={y + 0.5} r={0.5} fill={color} />,
  fluid: ({ x, y, color, neighbors }) => {
    const { top, bottom, left, right } = neighbors || {};
    const r = 0.5;
    const o = 0.02; // overlap amount (critical)

    const tl = !top && !left ? r : 0;
    const tr = !top && !right ? r : 0;
    const bl = !bottom && !left ? r : 0;
    const br = !bottom && !right ? r : 0;

    const x0 = x - (left ? o : 0);
    const y0 = y - (top ? o : 0);
    const x1 = x + 1 + (right ? o : 0);
    const y1 = y + 1 + (bottom ? o : 0);

    let d = `M ${x0 + tl},${y0}`;

    d += ` L ${x1 - tr},${y0}`;
    if (tr) d += ` A ${tr},${tr} 0 0 1 ${x1},${y0 + tr}`;

    d += ` L ${x1},${y1 - br}`;
    if (br) d += ` A ${br},${br} 0 0 1 ${x1 - br},${y1}`;

    d += ` L ${x0 + bl},${y1}`;
    if (bl) d += ` A ${bl},${bl} 0 0 1 ${x0},${y1 - bl}`;

    d += ` L ${x0},${y0 + tl}`;
    if (tl) d += ` A ${tl},${tl} 0 0 1 ${x0 + tl},${y0}`;

    d += " Z";

    return <path d={d} fill={color} shapeRendering="geometricPrecision" />;
  },

  cutCorner: ({ x, y, color }) => (
    <path transform={`translate(${x},${y})`} d="M0.2 0 H1 V0.8 L0.8 1 H0 V0.2 Z" fill={color} />
  ),

  blobH: ({ x, y, color, neighbors }) => {
    const { left, right } = neighbors || {};

    const l = left ? 0 : R;
    const r = right ? 0 : R;

    const x0 = x - (left ? O : 0);
    const x1 = x + 1 + (right ? O : 0);
    const y0 = y - O;
    const y1 = y + 1 + O;

    const d = `
    M ${x0 + l},${y0}
    L ${x1 - r},${y0}
    A ${r} ${r} 0 0 1 ${x1},${y0 + r}
    L ${x1},${y1 - r}
    A ${r} ${r} 0 0 1 ${x1 - r},${y1}
    L ${x0 + l},${y1}
    A ${l} ${l} 0 0 1 ${x0},${y1 - l}
    L ${x0},${y0 + l}
    A ${l} ${l} 0 0 1 ${x0 + l},${y0}
    Z
  `;

    return <path d={d} fill={color} shapeRendering="geometricPrecision" />;
  },
  blobV: ({ x, y, color, neighbors }) => {
    const { top, bottom } = neighbors || {};

    const t = top ? 0 : R;
    const b = bottom ? 0 : R;

    const y0 = y - (top ? O : 0);
    const y1 = y + 1 + (bottom ? O : 0);
    const x0 = x - O;
    const x1 = x + 1 + O;

    const d = `
    M ${x0},${y0 + t}
    A ${t} ${t} 0 0 1 ${x0 + t},${y0}
    L ${x1 - t},${y0}
    A ${t} ${t} 0 0 1 ${x1},${y0 + t}
    L ${x1},${y1 - b}
    A ${b} ${b} 0 0 1 ${x1 - b},${y1}
    L ${x0 + b},${y1}
    A ${b} ${b} 0 0 1 ${x0},${y1 - b}
    Z
  `;

    return <path d={d} fill={color} shapeRendering="geometricPrecision" />;
  },
};

export const FrameRenderers: Record<string, React.FC<{ color: string }>> = {
  square: ({ color }) => <rect x={0.5} y={0.5} width={6} height={6} fill="none" stroke={color} strokeWidth={1} />,

  circle: ({ color }) => <circle cx={3.5} cy={3.5} r={3} fill="none" stroke={color} strokeWidth={1} />,

  soft: ({ color }) => (
    <rect x={0.5} y={0.5} width={6} height={6} rx={2.2} ry={2.2} fill="none" stroke={color} strokeWidth={1} />
  ),

  leaf: ({ color }) => (
    <path
      d="M3.5 0.5 
         L6.5 0.5 
         L6.5 3.5 
         A3 3 0 0 1 3.5 6.5
         L0.5 6.5
         L0.5 3.5
         A3 3 0 0 1 3.5 0.5 Z"
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  ),

  eye: ({ color }) => (
    <path
      d="M0.5 3.5 
         C1.5 1.5 5.5 1.5 6.5 3.5
         C5.5 5.5 1.5 5.5 0.5 3.5 Z"
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  ),

  drop: ({ color }) => (
    <path
      d="M3.5 0.5
         C5.5 2.5 6.5 4 6.5 5
         A3 3 0 0 1 0.5 5
         C0.5 4 1.5 2.5 3.5 0.5 Z"
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  ),

  hex: ({ color }) => (
    <path d="M3.5 0.5 L6.5 2.2 L6.5 4.8 L3.5 6.5 L0.5 4.8 L0.5 2.2 Z" fill="none" stroke={color} strokeWidth={1} />
  ),
};

export const BallRenderers: Record<string, React.FC<{ color: string }>> = {
  square: ({ color }) => <rect x={2} y={2} width={3} height={3} fill={color} />,

  circle: ({ color }) => <circle cx={3.5} cy={3.5} r={1.5} fill={color} />,

  soft: ({ color }) => <rect x={2} y={2} width={3} height={3} rx={1.2} ry={1.2} fill={color} />,

  leaf: ({ color }) => (
    <path
      d="M3.5 2
         L5 2
         L5 3.5
         A1.5 1.5 0 0 1 3.5 5
         L2 5
         L2 3.5
         A1.5 1.5 0 0 1 3.5 2 Z"
      fill={color}
    />
  ),

  eye: ({ color }) => (
    <>
      <ellipse cx={3.5} cy={3.5} rx={1.6} ry={1.1} fill={color} />
      <circle cx={3.5} cy={3.5} r={0.6} fill="white" />
    </>
  ),

  drop: ({ color }) => (
    <path
      d="M3.5 2
         C4.5 3.2 5 4 5 4.6
         A1.5 1.5 0 0 1 2 4.6
         C2 4 2.5 3.2 3.5 2 Z"
      fill={color}
    />
  ),

  hex: ({ color }) => <polygon points="3.5,2 5,2.8 5,4.2 3.5,5 2,4.2 2,2.8" fill={color} />,
};
const FINDER_ROTATION: Record<"tl" | "tr" | "bl", number> = {
  tl: 0,
  tr: 90,
  bl: -90,
};

export const FinderPattern = ({
  x,
  y,
  frameType,
  ballType,
  color,
  position,
}: {
  x: number;
  y: number;
  frameType: string;
  ballType: string;
  color: string;
  position: "tl" | "tr" | "bl";
}) => {
  const Frame = FrameRenderers[frameType] || FrameRenderers.square;
  const Ball = BallRenderers[ballType] || BallRenderers.square;
  const rot = FINDER_ROTATION[position];

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot}, 3.5, 3.5)`}>
      <Frame color={color} />
      <Ball color={color} />
    </g>
  );
};
