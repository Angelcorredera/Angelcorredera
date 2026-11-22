import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, SANS, SERIF } from "./brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Full-bleed photo with a slow Ken Burns move and brand-colored grading. */
export const PhotoBg: React.FC<{
  src: string;
  zoom?: [number, number];
  pan?: [string, string];
  darken?: number;
}> = ({ src, zoom = [1.08, 1.22], pan = ["0px 0px", "-40px -30px"], darken = 0.55 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, durationInFrames], zoom, clamp),
          translate: interpolate(frame, [0, durationInFrames], pan, clamp),
          filter: "saturate(0.9) contrast(1.05)",
        }}
      />
      {/* brand grade: dark top/bottom, wine glow low, readable middle */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(11,11,13,0.85) 0%, rgba(11,11,13,${darken}) 28%, rgba(11,11,13,${darken}) 62%, rgba(11,11,13,0.95) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 50% 100%, ${C.wineGlow} 0%, rgba(139,21,32,0) 70%)`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

/** Springs a child in (fade + rise + slight scale) after `delay` frames. */
export const Reveal: React.FC<{
  delay?: number;
  rise?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, rise = 60, children, style }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], clamp);
  return (
    <div
      style={{
        opacity: Math.min(p, 1) * out,
        translate: `0px ${(1 - p) * rise}px`,
        scale: 0.96 + 0.04 * p,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Words pop in one by one. */
export const WordPop: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  highlight?: string[];
}> = ({ text, delay = 0, stagger = 4, style, highlight = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.28em", ...style }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 14, stiffness: 160 } });
        const hl = highlight.includes(w.replace(/[.,:¿?]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(p, 1),
              translate: `0px ${(1 - p) * 40}px`,
              color: hl ? C.gold : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 32 }) => (
  <div
    style={{
      display: "inline-block",
      background: C.wine,
      color: C.white,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.28em",
      padding: "14px 22px 14px 30px",
      boxShadow: "0 10px 40px rgba(139,21,32,0.5)",
    }}
  >
    {children}
  </div>
);

/** A gold line that draws itself. */
export const GoldLine: React.FC<{ delay?: number; width?: number; color?: string }> = ({
  delay = 0,
  width = 160,
  color = C.wine,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: 8,
        width: interpolate(frame, [delay, delay + 18], [0, width], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        background: color,
        margin: "0 auto",
      }}
    />
  );
};

/** Frosted glass card. */
export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; border?: string }> = ({
  children,
  style,
  border = "rgba(255,255,255,0.18)",
}) => (
  <div
    style={{
      background: "rgba(16,16,20,0.55)",
      backdropFilter: "blur(18px)",
      border: `2px solid ${border}`,
      borderRadius: 28,
      boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Step progress bar: 4 segments, the active one fills up. */
export const Progress: React.FC<{ active: number; total?: number }> = ({ active, total = 4 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 14, width: 560, margin: "0 auto" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: C.gold,
              width:
                i < active
                  ? "100%"
                  : i === active
                    ? `${interpolate(frame, [5, durationInFrames - 10], [0, 100], clamp)}%`
                    : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};

/** Centered content column inside the IG/TikTok safe zone (285–1635 px). */
export const SafeColumn: React.FC<{ children: React.ReactNode; justify?: React.CSSProperties["justifyContent"] }> = ({
  children,
  justify = "center",
}) => (
  <AbsoluteFill
    style={{
      top: 285,
      bottom: 1920 - 1635,
      left: 80,
      right: 80,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      alignItems: "center",
      textAlign: "center",
      color: C.white,
      fontFamily: SANS,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Headline: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({
  children,
  size = 120,
  color = C.white,
}) => (
  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
    {children}
  </div>
);
