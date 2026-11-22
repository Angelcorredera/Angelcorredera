import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { FPS, fontsReady, H, W } from "./brand";
import { FixAndHold, TOTAL_FRAMES } from "./FixAndHold";

const handle = delayRender("Loading brand fonts");
fontsReady.then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FixAndHold"
    component={FixAndHold}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
