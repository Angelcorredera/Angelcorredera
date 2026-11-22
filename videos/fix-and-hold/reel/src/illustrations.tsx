import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

/** Draws an SVG path progressively (stroke-dash animation). */
const Draw: React.FC<{
  d: string;
  start: number;
  dur: number;
  color?: string;
  width?: number;
  len?: number;
  glow?: boolean;
}> = ({ d, start, dur, color = C.gold, width = 4, len = 3000, glow }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: ease });
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
      style={glow ? { filter: `drop-shadow(0 0 10px ${color})` } : undefined}
    />
  );
};

/** Dark base with drifting gold particles and a wine glow. */
const Base: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const dots = Array.from({ length: 26 }, (_, i) => {
    const x = (i * 397) % 1080;
    const y0 = (i * 733) % 1920;
    const y = (y0 - frame * (0.6 + (i % 5) * 0.25) + 1920 * 4) % 1920;
    const r = 3 + (i % 4) * 3;
    return <circle key={i} cx={x} cy={y} r={r} fill={C.gold} opacity={0.08 + (i % 3) * 0.06} />;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${C.wineGlow} 0%, rgba(139,21,32,0) 70%), radial-gradient(ellipse 70% 35% at 50% 0%, rgba(214,178,106,0.10) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {dots}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

/** Blueprint grid with a house elevation drawing itself. */
export const BlueprintBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const grid = [];
  for (let x = 0; x <= 1080; x += 60) grid.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={1920} />);
  for (let y = 0; y <= 1920; y += 60) grid.push(<line key={`h${y}`} x1={0} y1={y} x2={1080} y2={y} />);
  const s = interpolate(frame, [0, durationInFrames], [1, 1.08], clamp);
  return (
    <Base>
      <svg width={1080} height={1920} style={{ position: "absolute", scale: s }}>
        <g stroke="rgba(214,178,106,0.07)" strokeWidth={2}>{grid}</g>
        <g opacity={0.5}>
          {/* house elevation, upper area */}
          <Draw d="M140 520 L540 200 L940 520" start={0} dur={30} width={6} glow />
          <Draw d="M200 470 L200 900 L880 900 L880 470" start={14} dur={30} width={6} />
          <Draw d="M470 900 L470 700 L610 700 L610 900" start={34} dur={18} />
          <Draw d="M270 560 L400 560 L400 680 L270 680 Z M335 560 L335 680 M270 620 L400 620" start={42} dur={20} />
          <Draw d="M680 560 L810 560 L810 680 L680 680 Z M745 560 L745 680 M680 620 L810 620" start={48} dur={20} />
          <Draw d="M700 300 L700 220 L770 220 L770 360" start={26} dur={16} />
          {/* dimension lines */}
          <Draw d="M200 960 L880 960 M200 945 L200 975 M880 945 L880 975" start={56} dur={20} color={C.wine} width={3} />
          <Draw d="M950 470 L950 900 M935 470 L965 470 M935 900 L965 900" start={60} dur={20} color={C.wine} width={3} />
        </g>
        <g opacity={0.3}>
          {/* floor plan, lower area */}
          <Draw d="M160 1660 L920 1660 L920 1880 L160 1880 Z" start={20} dur={40} />
          <Draw d="M420 1660 L420 1880 M660 1660 L660 1780 M660 1820 L660 1880 M160 1770 L320 1770" start={40} dur={30} />
        </g>
      </svg>
    </Base>
  );
};

/** Rising property-value chart. */
export const ChartBg: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = [
    [80, 1500], [220, 1440], [340, 1470], [470, 1330], [600, 1360], [720, 1180], [850, 1080], [1000, 880],
  ];
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const area = d + " L1000 1700 L80 1700 Z";
  const reveal = interpolate(frame, [6, 70], [0, 1080], { ...clamp, easing: ease });
  const bars = [0, 1, 2, 3, 4, 5].map((i) => {
    const h = interpolate(frame, [10 + i * 6, 40 + i * 6], [0, 90 + i * 70], { ...clamp, easing: ease });
    return <rect key={i} x={120 + i * 150} y={1700 - h} width={70} height={h} rx={8} fill={C.wine} opacity={0.35} />;
  });
  return (
    <Base>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.gold} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.gold} stopOpacity={0} />
          </linearGradient>
          <clipPath id="r">
            <rect x={0} y={0} width={reveal} height={1920} />
          </clipPath>
        </defs>
        {bars}
        <g clipPath="url(#r)">
          <path d={area} fill="url(#g)" />
        </g>
        <Draw d={d} start={6} dur={64} width={8} glow len={1400} />
        <circle
          cx={1000}
          cy={880}
          r={interpolate(frame, [68, 80], [0, 18], clamp)}
          fill={C.gold}
          style={{ filter: `drop-shadow(0 0 20px ${C.gold})` }}
        />
      </svg>
    </Base>
  );
};

/** Finished home with windows lighting up, plus a key. */
export const HomeBg: React.FC = () => {
  const frame = useCurrentFrame();
  const light = (start: number) => interpolate(frame, [start, start + 12], [0, 1], clamp);
  const win = (x: number, y: number, st: number) => (
    <rect
      x={x}
      y={y}
      width={130}
      height={120}
      rx={6}
      fill={C.gold}
      opacity={0.55 * light(st)}
      style={{ filter: `drop-shadow(0 0 30px ${C.gold})` }}
    />
  );
  return (
    <Base>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g opacity={0.55}>
          <Draw d="M140 1360 L540 1040 L940 1360" start={0} dur={28} width={7} glow />
          <Draw d="M200 1310 L200 1760 L880 1760 L880 1310" start={12} dur={28} width={7} />
          <Draw d="M470 1760 L470 1550 L610 1550 L610 1760" start={30} dur={16} width={5} />
          {win(270, 1400, 46)}
          {win(680, 1400, 54)}
          <rect x={470} y={1550} width={140} height={210} fill={C.wine} opacity={0.5 * light(62)} />
        </g>
        {/* key, upper right */}
        <g
          opacity={0.45}
          style={{
            translate: `0px ${interpolate(frame, [0, 120], [20, -20], clamp)}px`,
            rotate: `${interpolate(frame, [0, 120], [-8, 6], clamp)}deg`,
            transformOrigin: "860px 260px",
          }}
        >
          <Draw d="M860 260 m-70 0 a70 70 0 1 0 140 0 a70 70 0 1 0 -140 0" start={10} dur={24} width={7} len={500} />
          <Draw d="M790 260 L560 260 M600 260 L600 310 M650 260 L650 300" start={28} dur={20} width={7} len={400} />
        </g>
      </svg>
    </Base>
  );
};
