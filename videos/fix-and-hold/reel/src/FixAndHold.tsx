import React from "react";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { pushCut } from "@remotion/transitions/push-cut";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill } from "remotion";
import { C } from "./brand";
import { BenefitsScene, CompareScene, EndScene, HookScene, StepScene, TipScene } from "./scenes";

const T = 15; // transition length (frames)
const push = () => pushCut({ flashColor: C.gold, flashOpacity: 0.35 });
const sp = springTiming({ config: { damping: 200 }, durationInFrames: T });

export const SCENE_FRAMES = [150, 210, 165, 165, 165, 165, 210, 210, 210];
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0) - T * (SCENE_FRAMES.length - 1);

export const FixAndHold: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={150}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={push()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence name="Diferencia" durationInFrames={210}>
        <CompareScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={sp} />

      <TransitionSeries.Sequence name="Paso 1" durationInFrames={165}>
        <StepScene
          index={0}
          title="COMPRA"
          body="Una casa que necesita trabajo, por debajo del precio del mercado."
          img="img/step1.jpg"
          highlight={["trabajo", "debajo"]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={sp} />

      <TransitionSeries.Sequence name="Paso 2" durationInFrames={165}>
        <StepScene
          index={1}
          title="RENUEVA"
          body="Le sumas valor: cocina, baños, pintura y pisos."
          img="img/step2.jpg"
          highlight={["valor"]}
          zoom={[1.2, 1.05]}
          pan={["-30px 0px", "20px 0px"]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={push()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence name="Paso 3" durationInFrames={165}>
        <StepScene
          index={2}
          title="REFINANCIA"
          body="Con el nuevo valor de la casa, pasas a una hipoteca a largo plazo."
          img="img/step3.jpg"
          highlight={["nuevo", "valor", "largo", "plazo"]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={sp} />

      <TransitionSeries.Sequence name="Paso 4" durationInFrames={165}>
        <StepScene
          index={3}
          title="TE LA QUEDAS"
          body="Vives en ella o la rentas, y la vas pagando poco a poco."
          img="img/step4.jpg"
          highlight={["Vives", "rentas", "poco"]}
          zoom={[1.2, 1.05]}
          pan={["0px 20px", "0px -20px"]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={push()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence name="Beneficios" durationInFrames={210}>
        <BenefitsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={sp} />

      <TransitionSeries.Sequence name="Tip" durationInFrames={210}>
        <TipScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

      <TransitionSeries.Sequence name="Cierre" durationInFrames={210}>
        <EndScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
