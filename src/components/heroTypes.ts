import type { RefObject } from "react";

export type HeroBackdropRefs = {
  spotlightRef: RefObject<HTMLDivElement>;
  clawRef: RefObject<HTMLDivElement>;
  auroraRef: RefObject<HTMLDivElement>;
  sceneRef: RefObject<HTMLDivElement>;
  layer1Ref: RefObject<HTMLDivElement>;
  layer2Ref: RefObject<HTMLDivElement>;
  layer3Ref: RefObject<HTMLDivElement>;
  warningRef: RefObject<HTMLDivElement>;
};

export type HeroLeftPanelRefs = {
  badgeRef: RefObject<HTMLDivElement>;
  headlineRef: RefObject<HTMLHeadingElement>;
  beastWordRef: RefObject<HTMLSpanElement>;
  subheadRef: RefObject<HTMLParagraphElement>;
  taglineRef: RefObject<HTMLParagraphElement>;
  microcopyRef: RefObject<HTMLParagraphElement>;
  ctaRef: RefObject<HTMLDivElement>;
  primaryBtnRef: RefObject<HTMLAnchorElement>;
  primaryCanvasRef: RefObject<HTMLCanvasElement>;
  outlineBtnRef: RefObject<HTMLButtonElement>;
};

export type HeroRightPanelRefs = {
  rightPanelRef: RefObject<HTMLDivElement>;
  mistARef: RefObject<HTMLDivElement>;
  mistBRef: RefObject<HTMLDivElement>;
  beastCardRef: RefObject<HTMLDivElement>;
  beastRef: RefObject<HTMLDivElement>;
  beastBadgeRef: RefObject<HTMLDivElement>;
  beastEmberCanvasRef: RefObject<HTMLCanvasElement>;
};
