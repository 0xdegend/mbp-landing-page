"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // iOS Low Power Mode can still block autoplay until the user taps.
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(max-width: 767px)").matches) return;

    if (video.readyState >= 2) {
      startVideo();
      return;
    }

    video.addEventListener("canplay", startVideo, { once: true });
    return () => {
      video.removeEventListener("canplay", startVideo);
    };
  }, [startVideo]);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const tween = gsap.fromTo(
      image,
      {
        scale: 1,
        y: 0,
        rotate: 0,
        filter: "brightness(0.94) saturate(0.96) contrast(1.01)",
      },
      {
        scale: 1.04,
        y: -8,
        rotate: 0.35,
        filter: "brightness(1.04) saturate(1.08) contrast(1.03)",
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 56%",
      },
    );

    return () => {
      tween.kill();
    };
  }, []);

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
        }}
      >
        <div
          ref={beastRef}
          className="relative beast-video-wrap-v2"
          style={
            {
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskComposite: "destination-in",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              maskComposite: "intersect",
            } as CSSProperties
          }
        >
          <video
            ref={videoRef}
            className="!hidden w-full h-auto md:!block"
            style={
              {
                transition: "filter 0.3s ease",
              } as CSSProperties
            }
            autoPlay
            loop
            muted
            controls={false}
            playsInline
            webkit-playsinline="true"
            preload="auto"
            aria-label="ManBearPig breathing animation"
            src="/breathing-beast.mp4"
            onTouchStart={startVideo}
            onClick={startVideo}
          />
          <img
            ref={imageRef}
            src="/images/hero-page-img.jpg"
            alt="ManBearPig hero artwork"
            className="block w-full h-auto md:hidden"
            style={{ willChange: "transform, filter" }}
            draggable={false}
          />
        </div>

        <div
          ref={beastBadgeRef}
          className="absolute top-[12%] right-[5%] z-20 beast-badge-swing"
          style={{ scale: "0" }}
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
                BEWARE!!!
                <br />
                $MBP is here!!!
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
