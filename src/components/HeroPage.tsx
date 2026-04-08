"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import FloatingParticleLayer from "./FloatingParticleLayer";

export default function HeroPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const beastWordRef = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const beastCardRef = useRef<HTMLDivElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const microcopyRef = useRef<HTMLParagraphElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const clawRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      /* ── Phase 1: Atmosphere fades in ────────────────────────── */
      tl.fromTo(
        auroraRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: "power2.inOut" },
        0,
      );

      /* ── Phase 2: 3-D mountains rise from the depths ─────── */
      tl.fromTo(
        layer1Ref.current,
        { opacity: 0, y: 200 },
        { opacity: 1, y: 0, duration: 2, ease: "power3.out" },
        0.3,
      );
      tl.fromTo(
        layer2Ref.current,
        { opacity: 0, y: 150 },
        { opacity: 1, y: 0, duration: 1.8, ease: "power3.out" },
        0.5,
      );
      tl.fromTo(
        layer3Ref.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
        0.7,
      );

      /* ── Phase 3: Claw marks slash across the screen ──────── */
      const clawMarks = clawRef.current?.querySelectorAll(".claw-slash");
      if (clawMarks?.length) {
        tl.fromTo(
          clawMarks,
          { scaleX: 0, opacity: 1 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: "power4.in",
            transformOrigin: "left center",
          },
          1.2,
        ).to(clawMarks, {
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          delay: 0.2,
        });
      }

      /* ── Phase 4: "THE" drops in with weight ─────────────── */
      const theWord = headlineRef.current?.querySelector(".word-the");
      if (theWord) {
        tl.fromTo(
          theWord,
          { opacity: 0, y: -100, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          1.5,
        );
      }

      /* ── Phase 5: "BEAST" explodes in letter-by-letter ───── */
      const beastChars = beastWordRef.current?.querySelectorAll(".hero-char");
      if (beastChars?.length) {
        tl.fromTo(
          beastChars,
          {
            opacity: 0,
            scale: 0,
            rotation: () => gsap.utils.random(-45, 45),
            y: () => gsap.utils.random(-80, 80),
            x: () => gsap.utils.random(-50, 50),
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            x: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          1.8,
        );

        // Glitch shake after letters assemble
        tl.to(beastWordRef.current, {
          keyframes: [
            { x: -8, skewX: -5, duration: 0.05 },
            { x: 6, skewX: 8, duration: 0.05 },
            { x: -4, skewX: -3, duration: 0.05 },
            { x: 3, skewX: 2, duration: 0.05 },
            { x: 0, skewX: 0, duration: 0.05 },
          ],
        });
      }

      /* ── Phase 6: "OF SUI" slides up ─────────────────────── */
      const ofSui = headlineRef.current?.querySelector(".word-ofsui");
      if (ofSui) {
        tl.fromTo(
          ofSui,
          { opacity: 0, y: 60, rotateX: 45 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: "power3.out" },
          2.4,
        );
      }

      /* ── Phase 7: Beast image — dramatic 3-D entrance ────── */
      tl.fromTo(
        beastCardRef.current,
        { opacity: 0, scale: 0.3, rotateY: -30, rotateX: 15 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        1.8,
      );

      /* ── Phase 8: Glow ring ──────────────────────────────── */
      tl.fromTo(
        glowRingRef.current,
        { opacity: 0, scale: 0, rotation: -180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "power2.out" },
        2.5,
      );

      /* ── Phase 9: Warning sign swings in ─────────────────── */
      tl.fromTo(
        warningRef.current,
        { opacity: 0, rotation: -45, x: -200, scale: 0.5 },
        {
          opacity: 1,
          rotation: -6,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        2.8,
      );

      /* ── Phase 10: Badge + copy + CTAs ───────────────────── */
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" },
        2.0,
      );
      tl.fromTo(
        subheadRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        2.8,
      );
      tl.fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        3.0,
      );
      tl.fromTo(
        microcopyRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        3.1,
      );
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" },
        3.0,
      );

      /* ── Continuous loops ─────────────────────────────────── */
      gsap.to(beastRef.current, {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 4,
      });
      gsap.to(glowRingRef.current, {
        rotation: "+=360",
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);

    /* ── 3-D mouse parallax ──────────────────────────────── */
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;

      // Rotate the whole 3-D scene slightly
      gsap.to(sceneRef.current, {
        rotateY: xRatio * 2.5,
        rotateX: -yRatio * 1.5,
        duration: 1.5,
        ease: "power2.out",
      });

      // Layer-based depth parallax
      gsap.to(layer1Ref.current, {
        x: xRatio * 30,
        y: yRatio * 15,
        duration: 1.5,
        ease: "power1.out",
      });
      gsap.to(layer2Ref.current, {
        x: xRatio * 20,
        y: yRatio * 10,
        duration: 1.5,
        ease: "power1.out",
      });
      gsap.to(layer3Ref.current, {
        x: xRatio * 10,
        y: yRatio * 5,
        duration: 1.5,
        ease: "power1.out",
      });

      // Spotlight follows cursor
      gsap.to(spotlightRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050a04]"
    >
      {/* ═══ Cursor spotlight ═══ */}
      <div
        ref={spotlightRef}
        className="fixed pointer-events-none z-50"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,57,43,0.06) 0%, rgba(232,77,14,0.03) 30%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ═══ Claw-slash overlay ═══ */}
      <div ref={clawRef} className="absolute inset-0 z-40 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="claw-slash absolute"
            style={{
              top: `${25 + i * 18}%`,
              left: "10%",
              width: "80%",
              height: 4,
              background:
                "linear-gradient(90deg, transparent, rgba(192,57,43,0.8) 20%, rgba(232,77,14,0.6) 80%, transparent)",
              transform: `rotate(${-3 + i * 2}deg) scaleX(0)`,
              borderRadius: 2,
              boxShadow:
                "0 0 20px rgba(192,57,43,0.5), 0 0 40px rgba(232,77,14,0.3)",
            }}
          />
        ))}
      </div>

      {/* ═══ Aurora / Northern-lights ═══ */}
      <div
        ref={auroraRef}
        className="absolute top-0 left-0 right-0 h-[60%] pointer-events-none aurora-shimmer"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(46,139,87,0.08) 20%, rgba(192,57,43,0.05) 40%, rgba(0,100,148,0.06) 60%, rgba(46,139,87,0.04) 80%, transparent 100%)",
          backgroundSize: "200% 100%",
          filter: "blur(60px)",
          zIndex: 1,
          opacity: 0,
        }}
      />

      {/* ═══ 3-D Scene Container ═══ */}
      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Stars */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 1, transformStyle: "preserve-3d" }}
        >
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full star-twinkle"
              style={{
                width: Math.random() * 2.5 + 0.5,
                height: Math.random() * 2.5 + 0.5,
                top: `${Math.random() * 45}%`,
                left: `${Math.random() * 100}%`,
                background: i % 5 === 0 ? "#7ec8e3" : "white",
                opacity: Math.random() * 0.7 + 0.1,
                animationDuration: `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `translateZ(${-100 - Math.random() * 200}px)`,
              }}
            />
          ))}
        </div>

        {/* Far mountains */}
        <div
          ref={layer1Ref}
          className="absolute bottom-0 left-0 right-0"
          style={{
            zIndex: 2,
            transform: "translateZ(-80px) scale(1.08)",
            opacity: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 450"
            preserveAspectRatio="none"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="mtG1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f3d15" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#071a09" />
              </linearGradient>
              <linearGradient id="mtG2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a2a0e" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#050e06" stopOpacity="0.9" />
              </linearGradient>
              <filter id="mtGlow">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <path
              d="M0,350 L60,200 L140,260 L260,110 L380,180 L500,70 L600,150 L720,40 L840,120 L960,80 L1080,160 L1180,50 L1300,130 L1380,90 L1440,170 L1440,450 L0,450Z"
              fill="url(#mtG2)"
            />
            <path
              d="M0,320 L100,190 L180,240 L300,120 L420,170 L540,90 L640,155 L740,70 L840,140 L960,100 L1080,160 L1180,80 L1300,150 L1380,110 L1440,180 L1440,450 L0,450Z"
              fill="url(#mtG1)"
            />
            <path
              d="M260,110 L295,150 L225,150Z"
              fill="white"
              opacity="0.6"
              filter="url(#mtGlow)"
            />
            <path
              d="M720,40 L755,80 L685,80Z"
              fill="white"
              opacity="0.55"
              filter="url(#mtGlow)"
            />
            <path
              d="M1180,50 L1210,85 L1150,85Z"
              fill="white"
              opacity="0.45"
              filter="url(#mtGlow)"
            />
            <path
              d="M500,70 L530,105 L470,105Z"
              fill="white"
              opacity="0.4"
              filter="url(#mtGlow)"
            />
          </svg>
        </div>

        {/* Mid pine forest */}
        <div
          ref={layer2Ref}
          className="absolute bottom-0 left-0 right-0"
          style={{
            zIndex: 3,
            transform: "translateZ(-40px) scale(1.04)",
            opacity: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-auto"
          >
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map((x, i) => (
              <g
                key={`l${i}`}
                transform={`translate(${x}, ${255 - (i % 4) * 12})`}
              >
                <polygon
                  points="0,-70 -22,0 22,0"
                  fill="#0f2210"
                  opacity="0.95"
                />
                <polygon
                  points="0,-100 -16,-35 16,-35"
                  fill="#162e18"
                  opacity="0.85"
                />
                <polygon
                  points="0,-120 -11,-60 11,-60"
                  fill="#1a3a1c"
                  opacity="0.75"
                />
              </g>
            ))}
            {[1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1440].map(
              (x, i) => (
                <g
                  key={`r${i}`}
                  transform={`translate(${x}, ${255 - (i % 4) * 10})`}
                >
                  <polygon
                    points="0,-65 -20,0 20,0"
                    fill="#0f2210"
                    opacity="0.95"
                  />
                  <polygon
                    points="0,-90 -14,-32 14,-32"
                    fill="#162e18"
                    opacity="0.85"
                  />
                  <polygon
                    points="0,-108 -9,-52 9,-52"
                    fill="#1a3a1c"
                    opacity="0.75"
                  />
                </g>
              ),
            )}
            <rect
              x="0"
              y="255"
              width="1440"
              height="65"
              fill="#0a1a0b"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Foreground mist */}
        <div
          ref={layer3Ref}
          className="absolute bottom-0 left-0 right-0"
          style={{ zIndex: 4, opacity: 0 }}
        >
          <div className="relative w-full h-48">
            <div
              className="absolute inset-0 mist-layer"
              style={
                {
                  background:
                    "linear-gradient(to top, rgba(10,13,8,0.95), rgba(13,26,14,0.4), transparent)",
                  filter: "blur(15px)",
                  "--drift-time": "12s",
                } as React.CSSProperties
              }
            />
            <div
              className="absolute inset-0 mist-layer"
              style={
                {
                  background:
                    "linear-gradient(to top, rgba(10,13,8,0.6), rgba(45,90,46,0.1), transparent)",
                  filter: "blur(30px)",
                  animationDelay: "-5s",
                  "--drift-time": "18s",
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </div>

      {/* ═══ Particles ═══ */}
      <FloatingParticleLayer count={15} type="ember" className="z-[5]" />
      <FloatingParticleLayer count={10} type="dust" className="z-[5]" />

      {/* ═══ Fireflies ═══ */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full firefly-glow"
            style={{
              width: 4,
              height: 4,
              background: i % 3 === 0 ? "#ffaa00" : "#7ec8e3",
              boxShadow: `0 0 ${8 + i * 2}px ${
                i % 3 === 0 ? "rgba(255,170,0,0.6)" : "rgba(126,200,227,0.4)"
              }`,
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 6}s`,
              // Use one of the three firefly keyframes based on index
              animationName: `firefly${i % 3}`,
            }}
          />
        ))}
      </div>

      {/* ═══ Warning sign ═══ */}
      <div
        ref={warningRef}
        className="absolute top-28 left-4 sm:left-8 lg:left-16 z-20"
        style={{ transformOrigin: "top center", opacity: 0 }}
      >
        <div className="warning-sign rounded-sm" style={{ width: 120 }}>
          <div className="warning-header px-2 py-1 text-center text-xs">
            ⚠ WARNING
          </div>
          <div className="p-2 text-center">
            <p className="text-[9px] font-bold text-gray-900 leading-tight font-display tracking-wide uppercase">
              MAN-BEAR-PIG
              <br />
              SEEN
              <br />
              IN
              <br />
              THIS
              <br />
              AREA
            </p>
          </div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-2 bg-[#5a3a20] h-16" />
        </div>
      </div>

      {/* ═══ Hero content ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[80vh]">
          {/* ── Left — Text ── */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
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
                {/* Individual chars for explosion animation */}
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

            {/* Subheadline */}
            <p
              ref={subheadRef}
              className="font-display text-lg sm:text-xl text-sky-ice/90 mb-4 uppercase tracking-widest font-semibold"
              style={{ opacity: 0 }}
            >
              Half Man. Half Bear. Half Pig.
              <span className="text-scarlet font-bold"> 100% Chaos.</span>
            </p>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="font-body text-base text-ash mb-2 italic max-w-sm"
              style={{ opacity: 0 }}
            >
              &ldquo;A savage meme forged in the wild.&rdquo;
            </p>

            {/* Microcopy */}
            <p
              ref={microcopyRef}
              className="font-display text-xs tracking-[0.25em] uppercase text-moss mb-8"
              style={{ opacity: 0 }}
            >
              Not a man. Not a bear. Not a pig.{" "}
              <span className="text-bone font-bold">A force.</span>
            </p>

            {/* CTA buttons */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-4"
              style={{ opacity: 0 }}
            >
              <button
                className="btn-beast btn-beast-primary"
                onClick={() => scrollToSection("#summon")}
              >
                🐾 Buy $MBP
              </button>
              <button
                className="btn-beast btn-beast-outline"
                onClick={() => scrollToSection("#lore")}
              >
                $MBP Origin
              </button>
            </div>

            {/* Social */}
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

          {/* ── Right — Beast with 3-D card ── */}
          <div
            className="flex justify-center items-end order-1 lg:order-2 relative"
            style={{ perspective: 800 }}
          >
            {/* Rotating energy ring */}
            <div
              ref={glowRingRef}
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2"
              style={{
                width: 400,
                height: 400,
                border: "2px solid rgba(192,57,43,0.15)",
                borderRadius: "50%",
                boxShadow:
                  "0 0 30px rgba(192,57,43,0.1), inset 0 0 30px rgba(192,57,43,0.05)",
                opacity: 0,
              }}
            >
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-3 h-3 bg-scarlet/40 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateX(200px) translate(-50%,-50%)`,
                    boxShadow: "0 0 10px rgba(192,57,43,0.6)",
                  }}
                />
              ))}
            </div>

            {/* Glow aura */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: 350,
                height: 350,
                background:
                  "radial-gradient(ellipse, rgba(192,57,43,0.3) 0%, rgba(232,77,14,0.1) 40%, transparent 70%)",
                filter: "blur(40px)",
                animation: "pulseGlow 3s ease-in-out infinite",
              }}
            />

            {/* Beast image — 3-D tilt card */}
            <div
              ref={beastCardRef}
              className="relative z-10"
              style={{
                maxWidth: 500,
                width: "100%",
                transformStyle: "preserve-3d",
                opacity: 0,
              }}
            >
              <div ref={beastRef}>
                <video
                  className="w-full h-auto"
                  style={{
                    filter:
                      "drop-shadow(0 20px 40px rgba(192,57,43,0.5)) drop-shadow(0 0 80px rgba(232,77,14,0.3))",
                    transform: "translateZ(30px)",
                  }}
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

              {/* Light reflection overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
                  transform: "translateZ(40px)",
                }}
              />
            </div>

            {/* Floating $MBP badge */}
            <div className="absolute top-8 right-4 lg:right-0 z-20 hero-float">
              <div
                className="bg-scarlet/10 border border-scarlet/40 backdrop-blur-md px-4 py-3 text-center"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  boxShadow: "0 0 20px rgba(192,57,43,0.2)",
                }}
              >
                <div
                  className="font-beast text-2xl text-scarlet"
                  style={{ textShadow: "0 0 20px rgba(192,57,43,0.5)" }}
                >
                  $MBP
                </div>
                <div className="font-display text-xs tracking-wider text-ash uppercase">
                  Token
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="font-display text-xs tracking-widest uppercase text-ash/60">
            Scroll Down
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-ash/40 to-transparent scroll-line-pulse" />
        </div>
      </div>

      {/* ═══ Bottom jagged edge ═══ */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-20">
        <svg
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,50 L0,30 L30,45 L60,25 L90,40 L120,20 L150,38 L180,18 L210,35 L240,15 L270,32 L300,12 L330,28 L360,10 L390,25 L420,8 L450,22 L480,5 L510,20 L540,3 L570,18 L600,2 L630,17 L660,0 L690,15 L720,0 L750,14 L780,2 L810,16 L840,0 L870,15 L900,3 L930,18 L960,5 L990,20 L1020,8 L1050,25 L1080,10 L1110,28 L1140,12 L1170,30 L1200,15 L1230,32 L1260,18 L1290,35 L1320,20 L1350,38 L1380,25 L1410,40 L1440,28 L1440,50Z"
            fill="#0a0d08"
          />
        </svg>
      </div>

      {/* ═══ Scoped keyframes ═══ */}
      <style jsx>{`
        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1) translateX(-50%);
          }
          50% {
            opacity: 1;
            transform: scale(1.15) translateX(-43%);
          }
        }

        /* Firefly movement paths */
        @keyframes firefly0 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -20px) scale(1.3);
            opacity: 0.8;
          }
          50% {
            transform: translate(-10px, -40px) scale(0.8);
            opacity: 0.2;
          }
          75% {
            transform: translate(20px, -10px) scale(1.1);
            opacity: 0.7;
          }
        }
        @keyframes firefly1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          30% {
            transform: translate(-25px, 15px) scale(1.2);
            opacity: 0.9;
          }
          60% {
            transform: translate(15px, -25px) scale(0.7);
            opacity: 0.3;
          }
        }
        @keyframes firefly2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          40% {
            transform: translate(20px, 30px) scale(1.4);
            opacity: 0.8;
          }
          70% {
            transform: translate(-30px, -15px) scale(0.9);
            opacity: 0.5;
          }
        }

        .firefly-glow {
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        /* Star twinkle */
        .star-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
        }

        /* Floating badge */
        .hero-float {
          animation: heroFloat 4s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(2deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        /* Aurora shimmer */
        .aurora-shimmer {
          animation: auroraShift 8s linear infinite;
        }
        @keyframes auroraShift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }

        /* Scroll line */
        .scroll-line-pulse {
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%,
          100% {
            opacity: 0.4;
            height: 40px;
          }
          50% {
            opacity: 0.8;
            height: 50px;
          }
        }
      `}</style>
    </section>
  );
}
