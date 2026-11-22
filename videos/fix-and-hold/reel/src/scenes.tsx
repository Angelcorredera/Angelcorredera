import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF, SERIF_I } from "./brand";
import { Glass, GoldLine, Headline, PhotoBg, Progress, Reveal, SafeColumn, Tag, WordPop } from "./components";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* 1 ─ Hook */
export const HookScene: React.FC = () => (
  <AbsoluteFill>
    <PhotoBg src="img/hook.jpg" zoom={[1.25, 1.05]} pan={["0px -40px", "0px 0px"]} darken={0.5} />
    <SafeColumn>
      <Reveal delay={4}>
        <Tag>REAL ESTATE</Tag>
      </Reveal>
      <Reveal delay={12} style={{ marginTop: 50 }}>
        <Headline size={124}>¿Conoces el</Headline>
      </Reveal>
      <Reveal delay={22} rise={90}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 150,
            letterSpacing: "0.02em",
            color: C.gold,
            textShadow: "0 10px 50px rgba(214,178,106,0.35)",
          }}
        >
          FIX &amp; HOLD?
        </div>
      </Reveal>
      <div style={{ marginTop: 30 }}>
        <GoldLine delay={34} />
      </div>
      <WordPop
        text="Arreglar una casa y quedarte con ella"
        delay={40}
        style={{ marginTop: 40, fontSize: 54, fontWeight: 600, color: C.gray, maxWidth: 860 }}
        highlight={["quedarte"]}
      />
    </SafeColumn>
  </AbsoluteFill>
);

/* 2 ─ Flip vs Hold */
const Row: React.FC<{ label: string; delay: number; strong?: boolean; color?: string; strike?: boolean }> = ({
  label,
  delay,
  strong,
  color = C.gray,
  strike,
}) => {
  const frame = useCurrentFrame();
  return (
    <Reveal delay={delay} rise={30}>
      <div
        style={{
          position: "relative",
          fontSize: strong ? 46 : 44,
          fontWeight: strong ? 900 : 600,
          color,
          padding: "14px 0",
        }}
      >
        {label}
        {strike ? (
          <div
            style={{
              position: "absolute",
              left: "8%",
              top: "50%",
              height: 5,
              background: C.wine,
              width: `${interpolate(frame, [delay + 10, delay + 22], [0, 84], clamp)}%`,
            }}
          />
        ) : null}
      </div>
    </Reveal>
  );
};

export const CompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 60, fps, config: { damping: 10, stiffness: 140 } });
  return (
    <AbsoluteFill>
      <PhotoBg src="img/compare.jpg" darken={0.72} />
      <SafeColumn>
        <Reveal delay={2}>
          <Headline size={104}>La diferencia</Headline>
        </Reveal>
        <div style={{ display: "flex", gap: 28, marginTop: 60, width: "100%" }}>
          <Reveal delay={10} style={{ flex: 1 }}>
            <Glass style={{ padding: "40px 10px" }}>
              <div style={{ fontWeight: 900, fontSize: 50, letterSpacing: "0.06em", color: C.white, marginBottom: 20 }}>
                FIX &amp; FLIP
              </div>
              <Row label="Compras" delay={16} />
              <Row label="Arreglas" delay={20} />
              <Row label="Vendes" delay={24} color={C.dim} strike />
            </Glass>
          </Reveal>
          <Reveal delay={30} style={{ flex: 1, scale: 1 + 0.06 * Math.min(pop, 1.2) }}>
            <Glass style={{ padding: "40px 10px" }} border={C.gold}>
              <div style={{ fontWeight: 900, fontSize: 50, letterSpacing: "0.06em", color: C.gold, marginBottom: 20 }}>
                FIX &amp; HOLD
              </div>
              <Row label="Compras" delay={36} />
              <Row label="Arreglas" delay={40} />
              <Row label="TE LA QUEDAS" delay={56} strong color={C.gold} />
            </Glass>
          </Reveal>
        </div>
        <WordPop
          text="En vez de venderla, la casa se vuelve tuya."
          delay={80}
          style={{ marginTop: 60, fontSize: 52, fontWeight: 600, color: C.gray, maxWidth: 880 }}
          highlight={["tuya"]}
        />
      </SafeColumn>
    </AbsoluteFill>
  );
};

/* 3-6 ─ Steps */
export const StepScene: React.FC<{
  index: number;
  title: string;
  body: string;
  img: string;
  highlight?: string[];
  zoom?: [number, number];
  pan?: [string, string];
}> = ({ index, title, body, img, highlight = [], zoom, pan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const num = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 110 } });
  return (
    <AbsoluteFill>
      <PhotoBg src={img} zoom={zoom} pan={pan} darken={0.6} />
      <SafeColumn>
        <Reveal delay={0} rise={20}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.3em", color: C.gold, marginBottom: 26 }}>
            PASO {index + 1} DE 4
          </div>
          <Progress active={index} />
        </Reveal>
        <div
          style={{
            marginTop: 50,
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 300,
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: `4px ${C.gold}`,
            opacity: Math.min(num, 1),
            scale: 0.6 + 0.4 * num,
            rotate: `${(1 - num) * -12}deg`,
            textShadow: "0 0 60px rgba(214,178,106,0.25)",
          }}
        >
          {index + 1}
        </div>
        <Reveal delay={14} rise={80}>
          <div
            style={{
              fontWeight: 900,
              fontSize: title.length > 10 ? 104 : 124,
              letterSpacing: "0.04em",
              color: C.white,
              textShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            {title}
          </div>
        </Reveal>
        <div style={{ margin: "26px 0 34px" }}>
          <GoldLine delay={24} />
        </div>
        <Reveal delay={28} rise={40}>
          <Glass style={{ padding: "34px 44px", maxWidth: 900 }}>
            <WordPop
              text={body}
              delay={32}
              stagger={3}
              style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.3, color: C.white }}
              highlight={highlight}
            />
          </Glass>
        </Reveal>
      </SafeColumn>
    </AbsoluteFill>
  );
};

/* 7 ─ Benefits */
const Check: React.FC<{ delay: number; text: string }> = ({ delay, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 150 } });
  return (
    <Reveal delay={delay} rise={40}>
      <Glass style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 36px", width: 900, textAlign: "left" }}>
        <div
          style={{
            flex: "0 0 auto",
            width: 84,
            height: 84,
            borderRadius: 42,
            background: C.gold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: Math.min(p, 1.15),
            color: C.bg,
            fontSize: 52,
            fontWeight: 900,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.25, color: C.white }}>{text}</div>
      </Glass>
    </Reveal>
  );
};

export const BenefitsScene: React.FC = () => (
  <AbsoluteFill>
    <PhotoBg src="img/benefits.jpg" zoom={[1.05, 1.2]} pan={["30px 0px", "-30px -20px"]} darken={0.65} />
    <SafeColumn>
      <Reveal delay={2}>
        <Headline size={108}>¿Por qué hacerlo?</Headline>
      </Reveal>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 70 }}>
        <Check delay={18} text="Construyes patrimonio" />
        <Check delay={42} text="Tu casa puede ganar valor con los años" />
        <Check delay={66} text="Si la rentas, te genera un ingreso cada mes" />
      </div>
    </SafeColumn>
  </AbsoluteFill>
);

/* 8 ─ Tip: FHA 203(k) */
export const TipScene: React.FC = () => (
  <AbsoluteFill>
    <PhotoBg src="img/tip.jpg" zoom={[1.2, 1.05]} pan={["0px 0px", "30px 20px"]} darken={0.68} />
    <SafeColumn>
      <Reveal delay={2}>
        <Tag size={36}>TIP</Tag>
      </Reveal>
      <Reveal delay={10} style={{ marginTop: 44 }}>
        <Headline size={104}>¿Quieres vivir en ella?</Headline>
      </Reveal>
      <Reveal delay={26} style={{ marginTop: 50 }}>
        <Glass style={{ padding: "40px 46px", maxWidth: 920 }} border={C.gold}>
          <WordPop
            text="Hay préstamos como el FHA 203(k) que juntan la compra y la renovación en una sola hipoteca."
            delay={30}
            stagger={3}
            style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.3 }}
            highlight={["FHA", "203(k)", "sola", "hipoteca"]}
          />
        </Glass>
      </Reveal>
      <Reveal delay={90} style={{ marginTop: 40 }}>
        <div style={{ fontSize: 36, fontWeight: 500, color: C.dim, maxWidth: 820, lineHeight: 1.35 }}>
          Requiere vivir en la casa. Cada caso es distinto: consulta con un prestamista.
        </div>
      </Reveal>
    </SafeColumn>
  </AbsoluteFill>
);

/* 9 ─ End card */
export const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const agent = spring({ frame: frame - 4, fps, config: { damping: 20, stiffness: 80 } });
  const L = 64;
  const left: React.CSSProperties = { position: "absolute", left: L, fontFamily: SANS, color: C.white };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <PhotoBg src="img/end.jpg" zoom={[1.1, 1.2]} darken={0.82} />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(11,11,13,0) 35%, rgba(11,11,13,0.97) 58%, #0b0b0d 100%)" }}
      />
      <Img
        src={staticFile("brand/agent.png")}
        style={{
          position: "absolute",
          left: 480,
          top: 815,
          width: 600,
          opacity: Math.min(agent, 1),
          translate: `${(1 - agent) * 120}px 0px`,
          scale: interpolate(frame, [0, durationInFrames], [1, 1.04], clamp),
        }}
      />
      <div style={{ ...left, top: 300 }}>
        <Reveal delay={6}>
          <Tag size={30}>FIX &amp; HOLD</Tag>
        </Reveal>
      </div>
      <div style={{ ...left, top: 380 }}>
        <Reveal delay={12}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 108, lineHeight: 1.08 }}>
            ¿Listo para
            <br />
            tu casa?
          </div>
        </Reveal>
      </div>
      <div style={{ ...left, top: 640 }}>
        <Reveal delay={22}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.14em", color: C.gold }}>
            TE AYUDO A ENCONTRAR LA PROPIEDAD
          </div>
        </Reveal>
      </div>
      <div style={{ ...left, top: 1180 }}>
        <Reveal delay={30}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.0 }}>
            ANGEL
            <br />
            CORREDERA
          </div>
          <div style={{ fontFamily: SERIF_I, fontStyle: "italic", fontWeight: 700, fontSize: 42, color: C.gold, marginTop: 12 }}>
            Agente de Bienes Raíces
          </div>
          <div style={{ height: 3, width: 460, background: C.wine, margin: "16px 0" }} />
          <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "0.16em", color: C.gray }}>
            ANGEL CORREDERA REAL ESTATE
          </div>
        </Reveal>
      </div>
      <div style={{ ...left, top: 1440 }}>
        <Reveal delay={42}>
          <div style={{ fontSize: 62, fontWeight: 800, display: "flex", alignItems: "center", gap: 16 }}>
            <Img src={staticFile("brand/phone.png")} style={{ width: 52, height: 52 }} /> 786-309-0210
          </div>
        </Reveal>
      </div>
      <div style={{ ...left, top: 1536 }}>
        <Reveal delay={52}>
          <Tag size={27}>EL REALTOR DE TU FAMILIA</Tag>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
