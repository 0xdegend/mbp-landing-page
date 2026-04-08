"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import FloatingParticleLayer from "./FloatingParticleLayer";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      },
    });

    // Fog rolls in
    tl.fromTo(
      fogRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
      0
    );

    // Beast erupts
    tl.fromTo(
      beastRef.current,
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.3)" },
      0.3
    );

    // Glow intensifies
    tl.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
      0.3
    );

    // Title slams
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: -50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power4.out" },
      0.8
    ).to(titleRef.current, {
      keyframes: [
        { x: -8, duration: 0.05 },
        { x: 8, duration: 0.05 },
        { x: -5, duration: 0.05 },
        { x: 5, duration: 0.05 },
        { x: -2, duration: 0.05 },
        { x: 0, duration: 0.05 },
      ],
    });

    // CTA buttons
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
      1.2
    );

    // Beast breathe loop
    gsap.to(beastRef.current, {
      scale: 1.03,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
    });

    // Glow pulse
    gsap.to(glowRef.current, {
      scale: 1.2,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handleCTAHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      keyframes: [
        { x: -3, duration: 0.05 },
        { x: 3, duration: 0.05 },
        { x: -2, duration: 0.05 },
        { x: 2, duration: 0.05 },
        { x: 0, duration: 0.05 },
      ],
    });
  };

  return (
    <section
      id="summon"
      ref={sectionRef}
      className="relative py-24 lg:py-36 min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#0d1a0e] via-[#0a0d08] to-[#050705]"
    >
      {/* Particles */}
      <FloatingParticleLayer count={50} type="ember" />
      <FloatingParticleLayer count={20} type="fog" />

      {/* Moving fog base */}
      <div
        ref={fogRef}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "400px", zIndex: 2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg, rgba(13,26,14,0.8) 0%, rgba(10,13,8,0.4) 50%, transparent 100%)",
            animation: "mistDrift 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg, rgba(139,26,26,0.2) 0%, transparent 60%)",
            animation: "mistDrift 18s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Central glow */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(192,57,43,0.3) 0%, rgba(232,77,14,0.1) 40%, transparent 70%)",
          filter: "blur(30px)",
          zIndex: 1,
        }}
      />

      {/* Mountain backdrop */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 1 }}>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-auto opacity-40">
          <path
            d="M0,400 L0,250 L120,150 L240,200 L360,100 L480,160 L600,80 L720,130 L840,70 L960,120 L1080,60 L1200,110 L1320,80 L1440,130 L1440,400 Z"
            fill="#0d1a0e"
          />
          <path d="M360,100 L390,135 L330,135 Z" fill="rgba(255,255,255,0.3)" />
          <path d="M600,80 L630,115 L570,115 Z" fill="rgba(255,255,255,0.3)" />
          <path d="M840,70 L870,105 L810,105 Z" fill="rgba(255,255,255,0.25)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pre-title */}
        <div className="inline-flex items-center gap-2 bg-scarlet/20 border border-scarlet/50 px-4 py-2 mb-8">
          <span className="text-ember animate-pulse">◆</span>
          <span className="font-display text-xs tracking-widest uppercase text-scarlet">
            Final Warning
          </span>
          <span className="text-ember animate-pulse">◆</span>
        </div>

        {/* SUMMON THE BEAST headline */}
        <h2
          ref={titleRef}
          className="font-beast text-6xl sm:text-7xl lg:text-9xl leading-none mb-6 relative"
        >
          <span className="block text-bone">SUMMON</span>
          <span
            className="block"
            style={{
              WebkitTextStroke: "4px #c0392b",
              color: "transparent",
              textShadow: "8px 8px 0 rgba(192,57,43,0.15)",
            }}
          >
            THE BEAST
          </span>
        </h2>

        {/* Beast image */}
        <div ref={beastRef} className="relative inline-block mb-10">
          <Image
            src="/mascot.jpg"
            alt="ManBearPig Beast"
            width={400}
            height={400}
            className="w-48 sm:w-64 lg:w-80 h-auto mx-auto"
            style={{
              filter: "drop-shadow(0 0 40px rgba(192,57,43,0.6)) drop-shadow(0 0 80px rgba(232,77,14,0.3))",
            }}
          />
        </div>

        {/* Tagline */}
        <p className="font-display text-lg sm:text-xl tracking-wider text-tan uppercase mb-4">
          The forest has spoken.{" "}
          <span className="text-scarlet">The beast is here.</span>
        </p>
        <p className="font-body text-base text-ash/80 mb-12 max-w-lg mx-auto">
          Join the most savage meme community on Sui. Every burn, every raid, every holder makes the beast stronger.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className="btn-beast btn-beast-primary text-lg px-10 py-5"
            onMouseEnter={handleCTAHover}
          >
            🔥 Buy $MBP
          </button>
          <button
            className="btn-beast btn-beast-outline text-lg px-10 py-5"
            onMouseEnter={handleCTAHover}
          >
            🐾 Join the Pack
          </button>
          <button
            className="btn-beast text-lg px-10 py-5"
            onMouseEnter={handleCTAHover}
            style={{
              background: "transparent",
              border: "2px solid rgba(74,124,89,0.6)",
              color: "#4a7c59",
              clipPath: "polygon(8px 0, calc(100% - 0px) 0, 100% 8px, 100% 100%, calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
          >
            🌲 Enter the Forest
          </button>
        </div>

        {/* Contract address */}
        <div
          className="inline-flex items-center gap-3 bg-pine-dark/80 border border-forest-green/30 px-6 py-3"
          style={{
            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
          }}
        >
          <span className="font-display text-xs tracking-wider uppercase text-ash">CA:</span>
          <span className="font-display text-xs text-silver tracking-wider font-mono">
            0x...MBP...SUI (TBA)
          </span>
          <button className="text-xs text-scarlet font-display tracking-wider hover:text-ember transition-colors">
            COPY
          </button>
        </div>
      </div>

      {/* Bottom brand lockup */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent to-scarlet/30" />
          <span className="font-beast text-2xl text-scarlet/60">🐾 MBP</span>
          <div className="flex-1 max-w-xs h-px bg-gradient-to-l from-transparent to-scarlet/30" />
        </div>
      </div>
    </section>
  );
}
