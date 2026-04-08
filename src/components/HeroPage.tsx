"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import FloatingParticleLayer from "./FloatingParticleLayer";

export default function HeroPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const mtn1Ref = useRef<HTMLDivElement>(null);
  const mtn2Ref = useRef<HTMLDivElement>(null);
  const mtn3Ref = useRef<HTMLDivElement>(null);
  const microcopyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Mountains drift in
    tl.fromTo([mtn3Ref.current, mtn2Ref.current, mtn1Ref.current],
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.8, stagger: 0.15, ease: "power2.out" },
      0
    );

    // Warning sign entrance
    tl.fromTo(warningRef.current,
      { opacity: 0, x: -120, rotation: -15 },
      { opacity: 1, x: 0, rotation: -6, duration: 0.9, ease: "back.out(1.5)" },
      0.4
    );

    // Beast entrance — emerges from below
    tl.fromTo(beastRef.current,
      { opacity: 0, y: 120, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
      0.6
    );

    // Headline slams in with shake
    tl.fromTo(headlineRef.current,
      { opacity: 0, y: -50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power4.out" },
      1.0
    ).to(headlineRef.current, {
      keyframes: [
        { x: -5, duration: 0.05 },
        { x: 5, duration: 0.05 },
        { x: -3, duration: 0.05 },
        { x: 3, duration: 0.05 },
        { x: 0, duration: 0.05 },
      ]
    });

    // Subheadline
    tl.fromTo(subheadRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      1.5
    );

    // Tagline
    tl.fromTo(taglineRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      1.7
    );

    // Microcopy
    tl.fromTo(microcopyRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      1.9
    );

    // CTA buttons
    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
      1.8
    );

    // Badge
    tl.fromTo(badgeRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
      2.1
    );

    // Beast breathing loop
    gsap.to(beastRef.current, {
      scale: 1.015,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
    });

    // Subtle mountain parallax on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(mtn1Ref.current, { x: xRatio * 15, y: yRatio * 8, duration: 1.5, ease: "power1.out" });
      gsap.to(mtn2Ref.current, { x: xRatio * 10, y: yRatio * 5, duration: 1.5, ease: "power1.out" });
      gsap.to(mtn3Ref.current, { x: xRatio * 5, y: yRatio * 3, duration: 1.5, ease: "power1.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1a2e] via-[#0d1a0e] to-[#0a0d08]"
    >
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a2e] via-[#1a2e1b] to-[#0a0d08]" />

      {/* Stars */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 50 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.6 + 0.2,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 4 + "s",
            }}
          />
        ))}
      </div>

      {/* Mountain layers — back to front */}
      {/* Far mountains */}
      <div ref={mtn3Ref} className="absolute bottom-0 left-0 right-0" style={{ zIndex: 2 }}>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-auto">
          <path
            d="M0,300 L80,180 L160,220 L280,100 L400,160 L520,80 L620,140 L720,60 L820,130 L940,90 L1060,150 L1160,70 L1280,140 L1360,100 L1440,160 L1440,400 L0,400 Z"
            fill="#0d2a0e"
            opacity="0.6"
          />
          <path
            d="M0,300 L80,180 L160,220 L280,100 L400,160 L520,80 L620,140 L720,60 L820,130 L940,90 L1060,150 L1160,70 L1280,140 L1360,100 L1440,160 L1440,350 L1440,400 L0,400 Z"
            fill="#0a2010"
            opacity="0.4"
          />
          {/* Snow caps */}
          <path d="M280,100 L310,130 L250,130 Z" fill="white" opacity="0.5" />
          <path d="M720,60 L750,95 L690,95 Z" fill="white" opacity="0.5" />
          <path d="M1160,70 L1185,100 L1135,100 Z" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Mid pine forest */}
      <div ref={mtn2Ref} className="absolute bottom-0 left-0 right-0" style={{ zIndex: 3 }}>
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="w-full h-auto">
          {/* Pine trees left */}
          {[0, 60, 120, 180, 240, 300, 360, 420].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${240 - (i % 3) * 15})`}>
              <polygon points={`0,-60 -20,0 20,0`} fill="#0f2210" opacity="0.9" />
              <polygon points={`0,-90 -14,-30 14,-30`} fill="#162e18" opacity="0.8" />
              <polygon points={`0,-110 -10,-55 10,-55`} fill="#1a3a1c" opacity="0.7" />
            </g>
          ))}
          {/* Pine trees right */}
          {[1100, 1160, 1220, 1280, 1340, 1400].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${240 - (i % 3) * 12})`}>
              <polygon points={`0,-55 -18,0 18,0`} fill="#0f2210" opacity="0.9" />
              <polygon points={`0,-80 -12,-28 12,-28`} fill="#162e18" opacity="0.8" />
              <polygon points={`0,-100 -8,-50 8,-50`} fill="#1a3a1c" opacity="0.7" />
            </g>
          ))}
          <rect x="0" y="240" width="1440" height="60" fill="#0a1a0b" opacity="0.8" />
        </svg>
      </div>

      {/* Foreground mist */}
      <div ref={mtn1Ref} className="absolute bottom-0 left-0 right-0" style={{ zIndex: 4 }}>
        <div
          className="w-full h-40 bg-gradient-to-t from-[#0a0d08] via-[rgba(13,26,14,0.6)] to-transparent"
          style={{ filter: "blur(20px)" }}
        />
      </div>

      {/* Particles */}
      <FloatingParticleLayer count={20} type="dust" className="z-5" />

      {/* WARNING SIGN */}
      <div
        ref={warningRef}
        className="absolute top-28 left-4 sm:left-8 lg:left-16 z-20"
        style={{ transformOrigin: "top center" }}
      >
        <div className="warning-sign rounded-sm" style={{ width: "120px" }}>
          <div className="warning-header px-2 py-1 text-center text-xs">⚠ WARNING</div>
          <div className="p-2 text-center">
            <p className="text-[9px] font-bold text-gray-900 leading-tight font-display tracking-wide uppercase">
              MAN-BEAR-PIG<br />SEEN<br />IN<br />THIS<br />AREA
            </p>
            <div className="mt-1 opacity-60">
              <svg viewBox="0 0 40 50" width="30" className="mx-auto">
                <ellipse cx="20" cy="8" rx="8" ry="9" fill="#4a3020" />
                <rect x="12" y="16" width="16" height="20" rx="3" fill="#3a2018" />
                <ellipse cx="14" cy="25" rx="4" ry="6" fill="#3a2018" />
                <ellipse cx="26" cy="25" rx="4" ry="6" fill="#3a2018" />
              </svg>
            </div>
          </div>
          {/* Post */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-2 bg-[#5a3a20] h-16" />
        </div>
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[80vh]">

          {/* LEFT — TEXT */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Token badge */}
            <div ref={badgeRef} className="mb-6 inline-flex w-fit">
              <div className="flex items-center gap-2 bg-forest-green/30 border border-forest-green/50 px-4 py-2 rounded-none clip-path-badge">
                <span className="text-ember text-xs">●</span>
                <span className="font-display text-xs tracking-widest uppercase text-moss">Live on Sui Ecosystem</span>
                <span className="bg-scarlet/20 border border-scarlet/40 text-scarlet font-display text-xs px-2 py-0.5 font-bold">$MBP</span>
              </div>
            </div>

            {/* Main headline */}
            <h1
              ref={headlineRef}
              className="font-beast text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-none mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="block text-bone">THE</span>
              <span className="block" style={{
                WebkitTextStroke: "3px #c0392b",
                color: "transparent",
                textShadow: "6px 6px 0 rgba(192,57,43,0.2)",
              }}>BEAST</span>
              <span className="block text-bone">OF SUI</span>
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadRef}
              className="font-display text-lg sm:text-xl text-sky-ice/90 mb-4 uppercase tracking-widest font-600"
            >
              Half Man. Half Bear. Half Pig.
              <span className="text-scarlet font-bold"> 100% Chaos.</span>
            </p>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="font-body text-base text-ash mb-2 italic max-w-sm"
            >
              "A savage meme forged in the wild."
            </p>

            {/* Microcopy */}
            <p
              ref={microcopyRef}
              className="font-display text-xs tracking-[0.25em] uppercase text-moss mb-8"
            >
              Not a man. Not a bear. Not a pig.{" "}
              <span className="text-bone">A force.</span>
            </p>

            {/* CTA BUTTONS */}
            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <button
                className="btn-beast btn-beast-primary"
                onClick={() => scrollToSection("#summon")}
              >
                🐾 Join the Hunt
              </button>
              <button
                className="btn-beast btn-beast-outline"
                onClick={() => scrollToSection("#lore")}
              >
                See the Beast Lore
              </button>
            </div>

            {/* Social mini-row */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex gap-3">
                {["𝕏 Twitter", "Telegram", "Discord"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-xs font-display tracking-wider uppercase text-ash/70 hover:text-scarlet transition-colors duration-200 border-b border-ash/20 hover:border-scarlet pb-0.5"
                  >
                    {s}
                  </a>
                ))}
              </div>
              <span className="text-ash/30">·</span>
              <span className="text-xs text-ash/40 font-display tracking-wider">BUILT ON SUI</span>
            </div>
          </div>

          {/* RIGHT — BEAST */}
          <div className="flex justify-center items-end order-1 lg:order-2 relative">
            {/* Glow aura behind beast */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: "320px",
                height: "320px",
                background: "radial-gradient(ellipse, rgba(192,57,43,0.25) 0%, transparent 70%)",
                filter: "blur(40px)",
                animation: "pulseGlow 3s ease-in-out infinite",
              }}
            />

            {/* Beast image */}
            <div
              ref={beastRef}
              className="relative z-10"
              style={{ maxWidth: "480px", width: "100%" }}
            >
              <Image
                src="/banner.png"
                alt="ManBearPig — The Beast of Sui"
                width={1266}
                height={476}
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(192,57,43,0.4)) drop-shadow(0 0 60px rgba(232,77,14,0.2))",
                }}
                priority
              />
            </div>

            {/* Floating token badge */}
            <div
              className="absolute top-8 right-4 lg:right-0 z-20"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <div
                className="bg-scarlet/10 border border-scarlet/40 backdrop-blur-sm px-4 py-3 text-center"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
              >
                <div className="font-beast text-2xl text-scarlet">$MBP</div>
                <div className="font-display text-xs tracking-wider text-ash uppercase">Token</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="font-display text-xs tracking-widest uppercase text-ash/60">Scroll Down</span>
          <div className="w-px h-10 bg-gradient-to-b from-ash/40 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Bottom jagged edge */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-20">
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,50 L0,30 L30,45 L60,25 L90,40 L120,20 L150,38 L180,18 L210,35 L240,15 L270,32 L300,12 L330,28 L360,10 L390,25 L420,8 L450,22 L480,5 L510,20 L540,3 L570,18 L600,2 L630,17 L660,0 L690,15 L720,0 L750,14 L780,2 L810,16 L840,0 L870,15 L900,3 L930,18 L960,5 L990,20 L1020,8 L1050,25 L1080,10 L1110,28 L1140,12 L1170,30 L1200,15 L1230,32 L1260,18 L1290,35 L1320,20 L1350,38 L1380,25 L1410,40 L1440,28 L1440,50 Z"
            fill="#0a0d08"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: scale(1) translateX(-50%); }
          50% { opacity: 1; transform: scale(1.1) translateX(-45%); }
        }
      `}</style>
    </section>
  );
}
