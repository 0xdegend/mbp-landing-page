"use client";

import type { CSSProperties } from "react";
import type { HeroRightPanelRefs } from "./heroTypes";

export default function HeroRightPanel({
  rightPanelRef,
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
        <div ref={beastRef} className="relative beast-video-wrap">
          <video
            className="w-full h-auto"
            style={
              {
                filter: "brightness(1)",
                transition: "filter 0.3s ease",
              } as CSSProperties
            }
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="ManBearPig breathing animation"
          >
            <source src="/breathing-beast.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          ref={beastBadgeRef}
          className="absolute top-[12%] right-[5%] z-20 beast-badge-swing"
          style={{ opacity: 0 }}
        >
          <div className="warning-sign rounded-sm" style={{ width: 80 }}>
            <div
              className="warning-header px-1.5 py-0.5 text-center"
              style={{ fontSize: 8 }}
            >
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
