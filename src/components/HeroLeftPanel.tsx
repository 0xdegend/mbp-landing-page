"use client";

import type { HeroLeftPanelRefs } from "./heroTypes";

type HeroLeftPanelProps = HeroLeftPanelRefs & {
  scrollToSection: (id: string) => void;
};

export default function HeroLeftPanel({
  badgeRef,
  headlineRef,
  beastWordRef,
  subheadRef,
  taglineRef,
  microcopyRef,
  ctaRef,
  primaryBtnRef,
  primaryCanvasRef,
  outlineBtnRef,
  scrollToSection,
}: HeroLeftPanelProps) {
  return (
    <div className="flex flex-col justify-center order-2 lg:order-1">
      <div
        ref={badgeRef}
        className="absolute top-8 left-4 lg:left-0 z-20 hero-float"
        style={{ opacity: 0 }}
      ></div>

      <h1
        ref={headlineRef}
        className="font-beast text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-none mb-4"
        style={{
          letterSpacing: "-0.02em",
          perspective: 500,
          transformStyle: "preserve-3d",
        }}
      >
        <span
          className="block text-bone word-the"
          style={{ opacity: 0, transformStyle: "preserve-3d" }}
        >
          THE
        </span>
        <span
          ref={beastWordRef}
          className="block word-beast"
          style={{
            WebkitTextStroke: "3px #c0392b",
            color: "transparent",
            textShadow:
              "6px 6px 0 rgba(192,57,43,0.3), 0 0 40px rgba(192,57,43,0.2)",
            filter: "drop-shadow(0 0 20px rgba(192,57,43,0.3))",
            transformStyle: "preserve-3d",
          }}
        >
          {"BEAST".split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block hero-char"
              style={{ opacity: 0 }}
            >
              {ch}
            </span>
          ))}
        </span>
        <span
          className="block text-bone word-ofsui"
          style={{ opacity: 0, transformStyle: "preserve-3d" }}
        >
          OF SUI
        </span>
      </h1>

      <p
        ref={subheadRef}
        className="font-display text-lg sm:text-xl text-sky-ice/90 mb-4 uppercase tracking-widest font-semibold"
        style={{ opacity: 0 }}
      >
        Half Man. Half Bear. Half Pig.
        <span className="text-scarlet font-bold"> 100% Chaos.</span>
      </p>

      <p
        ref={taglineRef}
        className="font-body text-base text-ash mb-2 italic max-w-sm"
        style={{ opacity: 0 }}
      >
        &ldquo;A savage meme forged in the wild.&rdquo;
      </p>

      <p
        ref={microcopyRef}
        className="font-display text-xs tracking-[0.25em] uppercase text-moss mb-8"
        style={{ opacity: 0 }}
      >
        Not a man. Not a bear. Not a pig.{" "}
        <span className="text-bone font-bold">A force.</span>
      </p>

      <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
        <button
          ref={primaryBtnRef}
          className="btn-beast btn-beast-primary"
          onClick={() => scrollToSection("#summon")}
        >
          <span className="btn-edge-bar" />
          <canvas ref={primaryCanvasRef} className="btn-ember-canvas" />
          <span className="btn-paw">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="7" cy="5" rx="2.5" ry="3" />
              <ellipse cx="17" cy="5" rx="2.5" ry="3" />
              <ellipse cx="3.5" cy="11" rx="2" ry="2.5" />
              <ellipse cx="20.5" cy="11" rx="2" ry="2.5" />
              <path d="M12 22c-4 0-7-3-7-6.5S8 10 12 10s7 2 7 5.5S16 22 12 22z" />
            </svg>
          </span>
          <span className="btn-text">Buy $MBP</span>
        </button>

        <button
          ref={outlineBtnRef}
          className="btn-beast btn-beast-outline"
          onClick={() => scrollToSection("#lore")}
        >
          <span className="btn-text">$MBP Origin</span>
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex gap-3">
          {["𝕏 Twitter", "Telegram", "Discord"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-xs font-display tracking-wider uppercase text-ash/70 hover:text-scarlet transition-all duration-300 border-b border-ash/20 hover:border-scarlet pb-0.5 hover:pb-1"
            >
              {s}
            </a>
          ))}
        </div>
        <span className="text-ash/30">·</span>
        <span className="text-xs text-ash/40 font-display tracking-wider">
          BUILT ON SUI
        </span>
      </div>
    </div>
  );
}
