import { branchProgress, type BranchId } from "../data/skills";

type Props = {
  active: BranchId;
  onSelect: (b: BranchId) => void;
};

function fillFor(pct: number, isActive: boolean) {
  const alpha = 0.15 + (pct / 100) * 0.7;
  if (isActive) {
    return `hsl(var(--primary) / ${alpha.toFixed(3)})`;
  }
  return `hsl(var(--foreground) / ${(alpha * 0.5).toFixed(3)})`;
}

function strokeFor(isActive: boolean) {
  return isActive ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.25)";
}

export function BodyMap({ active, onSelect }: Props) {
  const push = branchProgress("PUSH");
  const pull = branchProgress("PULL");
  const core = branchProgress("CORE");
  const legs = branchProgress("LEGS");

  const region = (id: BranchId, pct: number) => ({
    fill: fillFor(pct, active === id),
    stroke: strokeFor(active === id),
    strokeWidth: active === id ? 1.5 : 1,
    onClick: () => onSelect(id),
    style: {
      cursor: "pointer",
      transition: "all 0.25s ease",
    } as React.CSSProperties,
  });

  return (
    <svg
      viewBox="0 0 200 360"
      className="w-full h-auto max-h-[420px] mx-auto block"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth="0.5"
        fill="none"
      >
        <circle cx="100" cy="180" r="120" strokeDasharray="2 4" />
        <line x1="0" y1="180" x2="200" y2="180" strokeDasharray="2 6" />
        <line x1="100" y1="0" x2="100" y2="360" strokeDasharray="2 6" />
      </g>

      <ellipse
        cx="100"
        cy="32"
        rx="18"
        ry="22"
        fill="hsl(var(--foreground) / 0.12)"
        stroke="hsl(var(--foreground) / 0.3)"
      />
      <rect
        x="92"
        y="52"
        width="16"
        height="10"
        fill="hsl(var(--foreground) / 0.15)"
      />

      <path
        d="M 60 65 Q 100 60 140 65 L 138 105 Q 100 115 62 105 Z"
        {...region("PUSH", push)}
      />
      <path
        d="M 70 108 Q 100 116 130 108 L 130 175 Q 100 182 70 175 Z"
        {...region("CORE", core)}
      />

      <path
        d="M 40 70 Q 50 64 60 68 L 62 130 Q 48 132 40 122 Z"
        {...region("PULL", pull)}
      />
      <path
        d="M 160 70 Q 150 64 140 68 L 138 130 Q 152 132 160 122 Z"
        {...region("PULL", pull)}
      />
      <path
        d="M 38 130 L 50 132 L 56 180 L 44 182 Z"
        {...region("PULL", pull)}
      />
      <path
        d="M 162 130 L 150 132 L 144 180 L 156 182 Z"
        {...region("PULL", pull)}
      />

      <circle
        cx="50"
        cy="190"
        r="6"
        fill="hsl(var(--foreground) / 0.15)"
      />
      <circle
        cx="150"
        cy="190"
        r="6"
        fill="hsl(var(--foreground) / 0.15)"
      />

      <path
        d="M 70 178 Q 100 184 130 178 L 134 200 Q 100 208 66 200 Z"
        fill="hsl(var(--foreground) / 0.12)"
        stroke="hsl(var(--foreground) / 0.25)"
      />

      <path
        d="M 70 205 L 96 205 L 94 280 L 76 282 Z"
        {...region("LEGS", legs)}
      />
      <path
        d="M 130 205 L 104 205 L 106 280 L 124 282 Z"
        {...region("LEGS", legs)}
      />
      <path
        d="M 78 285 L 94 285 L 92 340 L 80 340 Z"
        {...region("LEGS", legs)}
      />
      <path
        d="M 122 285 L 106 285 L 108 340 L 120 340 Z"
        {...region("LEGS", legs)}
      />

      <PinLabel
        x={148}
        y={85}
        label="PUSH"
        pct={push}
        active={active === "PUSH"}
      />
      <PinLabel
        x={28}
        y={100}
        label="PULL"
        pct={pull}
        active={active === "PULL"}
        flipped
      />
      <PinLabel
        x={148}
        y={150}
        label="CORE"
        pct={core}
        active={active === "CORE"}
      />
      <PinLabel
        x={28}
        y={250}
        label="LEGS"
        pct={legs}
        active={active === "LEGS"}
        flipped
      />
    </svg>
  );
}

function PinLabel({
  x,
  y,
  label,
  pct,
  active,
  flipped,
}: {
  x: number;
  y: number;
  label: string;
  pct: number;
  active: boolean;
  flipped?: boolean;
}) {
  const stroke = active
    ? "hsl(var(--primary))"
    : "hsl(var(--foreground) / 0.35)";
  const text = active
    ? "hsl(var(--primary))"
    : "hsl(var(--foreground) / 0.7)";
  const lineX2 = flipped ? x + 22 : x - 22;
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={lineX2}
        y2={y}
        stroke={stroke}
        strokeWidth="0.6"
      />
      <circle cx={x} cy={y} r="1.5" fill={stroke} />
      <text
        x={flipped ? x - 2 : x + 2}
        y={y - 4}
        fontSize="6"
        fontFamily="JetBrains Mono, monospace"
        fill={text}
        textAnchor={flipped ? "end" : "start"}
        letterSpacing="1"
      >
        {label}
      </text>
      <text
        x={flipped ? x - 2 : x + 2}
        y={y + 6}
        fontSize="8"
        fontFamily="Space Grotesk, sans-serif"
        fontWeight="700"
        fill={text}
        textAnchor={flipped ? "end" : "start"}
      >
        {pct}%
      </text>
    </g>
  );
}
