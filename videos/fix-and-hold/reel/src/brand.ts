import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  bg: "#0b0b0d",
  wine: "#8b1520",
  wineGlow: "rgba(139,21,32,0.55)",
  gold: "#d6b26a",
  white: "#ffffff",
  gray: "#d4d4da",
  dim: "#8a8a94",
};

export const SERIF = "Playfair";
export const SERIF_I = "PlayfairItalic";
export const SANS = "Montserrat";

export const fontsReady = Promise.all([
  loadFont({ family: SANS, url: staticFile("fonts/Montserrat.ttf"), weight: "100 900" }),
  loadFont({ family: SERIF, url: staticFile("fonts/Playfair.ttf"), weight: "400 900" }),
  loadFont({ family: SERIF_I, url: staticFile("fonts/PlayfairItalic.ttf"), weight: "400 900", style: "italic" }),
]);

export const FPS = 30;
export const W = 1080;
export const H = 1920;
