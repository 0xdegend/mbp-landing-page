"use client";

import type { CSSProperties } from "react";
import type { HeroRightPanelRefs } from "./heroTypes";

export default function HeroRightPanel({
  rightPanelRef,
  mtnLayer1Ref,
  mtnLayer2Ref,
  mtnLayer3Ref,
  mistARef,
  mistBRef,
  beastCardRef,
  beastRef,
  beastBadgeRef,
  beastEmberCanvasRef,
}: HeroRightPanelRefs) {
  return (
    <div
      ref={rightPanelRef}
      className="flex justify-center items-end order-1 lg:order-2 relative"
      style={{ minHeight: 500 }}
    >
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "45%" }}
      >
        <div
          ref={mtnLayer1Ref}
          className="absolute inset-x-0 bottom-0"
          style={{ height: "100%", opacity: 0 }}
        >
          <svg
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,200 L0,140 Q100,60 200,110 Q300,40 400,90 Q500,30 600,100 Q700,50 800,80 L800,200Z"
              fill="rgba(13,26,14,0.9)"
            />
          </svg>
        </div>

        <div
          ref={mtnLayer2Ref}
          className="absolute inset-x-0 bottom-0"
          style={{ height: "80%", opacity: 0 }}
        >
          <svg
            viewBox="0 0 800 160"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,160 L0,120 Q80,70 180,100 Q280,50 380,85 Q480,40 560,75 Q660,45 740,90 L800,70 L800,160Z"
              fill="rgba(26,46,27,0.85)"
            />
          </svg>
        </div>

        <div
          ref={mtnLayer3Ref}
          className="absolute inset-x-0 bottom-0"
          style={{ height: "55%", opacity: 0 }}
        >
          <svg
            viewBox="0 0 800 110"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,110 L0,80 Q120,50 240,70 Q360,35 480,60 Q600,30 720,55 L800,45 L800,110Z"
              fill="rgba(45,90,46,0.6)"
            />
          </svg>
        </div>
      </div>

      <div
        ref={mistARef}
        className="absolute bottom-0 left-[-10%] pointer-events-none beast-mist-a"
        style={{
          width: "120%",
          height: 120,
          background:
            "radial-gradient(ellipse at center, rgba(13,26,14,0.7) 0%, transparent 70%)",
          opacity: 0,
          zIndex: 15,
        }}
      />
      <div
        ref={mistBRef}
        className="absolute bottom-0 right-[-10%] pointer-events-none beast-mist-b"
        style={{
          width: "120%",
          height: 120,
          background:
            "radial-gradient(ellipse at center, rgba(13,26,14,0.5) 0%, transparent 70%)",
          opacity: 0,
          zIndex: 15,
        }}
      />

      <div
        ref={beastCardRef}
        className="relative z-10"
        style={{
          maxWidth: 520,
          width: "80%",
          opacity: 0,
        }}
      >
        <div ref={beastRef} className="relative">
          <video
            className="w-full h-auto"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 55%, transparent 92%), linear-gradient(to left, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 55%, transparent 92%), linear-gradient(to left, black 70%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
              filter: "brightness(1)",
              transition: "filter 0.3s ease",
            } as CSSProperties}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="ManBearPig breathing animation"
          >
            <source src="/mbp-breathing.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          ref={beastBadgeRef}
          className="absolute top-[12%] right-[5%] z-20 beast-badge-swing"
          style={{ opacity: 0 }}
        >
          <div className="warning-sign rounded-sm" style={{ width: 80 }}>
            <div className="warning-header px-1.5 py-0.5 text-center" style={{ fontSize: 8 }}>
              ⚠ WARNING
            </div>
            <div className="p-1.5 text-center">
              <p
                className="font-bold text-gray-900 leading-tight font-display tracking-wide uppercase"
                style={{ fontSize: 7 }}
              >
                $MBP
                <br />
                BEWARE!!!
                <br />
                BEAST
              </p>
            </div>
          </div>
        </div>
      </div>

      <canvas
        ref={beastEmberCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 20 }}
      />
    </div>
  );
}
