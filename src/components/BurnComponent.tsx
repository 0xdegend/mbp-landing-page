"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   Ash burst on click
   ═══════════════════════════════════════════════════════ */
function spawnAshBurst(origin: DOMRect) {
  if (typeof document === "undefined") return;
  const colors = ["#c0392b", "#e84d0e", "#e8dcc8", "#ff6b35"];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("div");
    const size = 2 + Math.random() * 4;
    el.style.cssText = `
      position:fixed;left:${origin.left + origin.width / 2}px;
      top:${origin.top + origin.height / 2}px;
      width:${size}px;height:${size}px;border-radius:50%;
      background:${colors[i % colors.length]};
      pointer-events:none;z-index:9999;mix-blend-mode:screen;
    `;
    document.body.appendChild(el);
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 100;
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 50,
      opacity: 0,
      scale: 0,
      duration: 0.7 + Math.random() * 0.5,
      ease: "power3.out",
      onComplete: () => el.remove(),
    });
  }
}

/* ═══════════════════════════════════════════════════════
   Rising embers (DOM particles)
   ═══════════════════════════════════════════════════════ */
function EmberField({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    const embers: HTMLDivElement[] = [];
    let running = true;

    function spawn() {
      if (!running || !container) return;
      const ember = document.createElement("div");
      const size = 1.5 + Math.random() * 2.5;
      const colors = ["#e84d0e", "#c0392b", "#ff6b35", "#e8dcc8"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      ember.style.cssText = `
        position:absolute;bottom:-2px;left:${Math.random() * 100}%;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};box-shadow:0 0 ${size * 3}px ${color}88;
        pointer-events:none;will-change:transform,opacity;
      `;
      container.appendChild(ember);
      embers.push(ember);
      gsap.to(ember, {
        y: -(120 + Math.random() * 200),
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        scale: 0.2,
        duration: 2 + Math.random() * 2.5,
        ease: "power1.out",
        onComplete: () => {
          ember.remove();
          const idx = embers.indexOf(ember);
          if (idx > -1) embers.splice(idx, 1);
        },
      });
      if (running) setTimeout(spawn, (80 + Math.random() * 180) / intensity);
    }

    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 120);
    return () => {
      running = false;
      embers.forEach((e) => e.remove());
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   SVG progress ring
   ═══════════════════════════════════════════════════════ */
function BurnRing({
  progress,
  size = 280,
  stroke = 2.5,
}: {
  progress: number;
  size?: number;
  stroke?: number;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { strokeDashoffset: circ },
      {
        strokeDashoffset: circ * (1 - progress / 100),
        duration: 2.5,
        ease: "power2.out",
        delay: 0.6,
      },
    );
  }, [progress, circ]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 m-auto"
      style={{ zIndex: 3 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth={stroke}
      />
      <circle
        ref={ref}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#burnGrad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: "drop-shadow(0 0 6px rgba(232,77,14,0.35))" }}
      />
      {/* Tick marks */}
      {Array.from({ length: 48 }).map((_, i) => {
        const angle = (i / 48) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const major = i % 4 === 0;
        const r1 = r - (major ? 8 : 4);
        const r2 = r - 1;
        return (
          <line
            key={i}
            x1={size / 2 + Math.cos(rad) * r1}
            y1={size / 2 + Math.sin(rad) * r1}
            x2={size / 2 + Math.cos(rad) * r2}
            y2={size / 2 + Math.sin(rad) * r2}
            stroke={major ? "rgba(232,77,14,0.18)" : "rgba(255,255,255,0.03)"}
            strokeWidth={major ? 1.5 : 0.5}
          />
        );
      })}
      <defs>
        <linearGradient id="burnGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b1a1a" />
          <stop offset="50%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#e84d0e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Main BurnComponent — horizontal layout
   ═══════════════════════════════════════════════════════ */
export default function BurnComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const furnaceRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  const outerGlowRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const stokeRef = useRef<HTMLButtonElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [emberIntensity, setEmberIntensity] = useState(1);
  const [isHot, setIsHot] = useState(false);

  /* ── Furnace tilt ── */
  const handleFurnaceMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!furnaceRef.current) return;
      const rect = furnaceRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(furnaceRef.current, {
        rotateY: x * 10,
        rotateX: y * -10,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [],
  );

  const handleFurnaceLeave = useCallback(() => {
    if (!furnaceRef.current) return;
    gsap.to(furnaceRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  /* ── Stoke ── */
  const handleStoke = useCallback(() => {
    setIsHot(true);
    setEmberIntensity(3.5);

    if (coreRef.current) {
      gsap
        .timeline()
        .to(coreRef.current, {
          scale: 1.18,
          duration: 0.12,
          ease: "power2.out",
        })
        .to(coreRef.current, {
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.35)",
        });
    }
    if (innerGlowRef.current) {
      gsap
        .timeline()
        .to(innerGlowRef.current, { opacity: 1, scale: 1.4, duration: 0.18 })
        .to(innerGlowRef.current, {
          opacity: 0.5,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        });
    }
    if (outerGlowRef.current) {
      gsap
        .timeline()
        .to(outerGlowRef.current, { opacity: 0.9, scale: 1.25, duration: 0.18 })
        .to(outerGlowRef.current, {
          opacity: 0.25,
          scale: 1,
          duration: 2,
          ease: "power2.out",
        });
    }
    if (pulseRingRef.current) {
      gsap.fromTo(
        pulseRingRef.current,
        { scale: 0.5, opacity: 0.9 },
        { scale: 3, opacity: 0, duration: 0.9, ease: "power2.out" },
      );
    }
    if (furnaceRef.current) {
      gsap
        .timeline()
        .to(furnaceRef.current, { x: -4, duration: 0.035 })
        .to(furnaceRef.current, { x: 4, duration: 0.035 })
        .to(furnaceRef.current, { x: -2, duration: 0.035 })
        .to(furnaceRef.current, { x: 0, duration: 0.25, ease: "power2.out" });
    }
    if (stokeRef.current) {
      spawnAshBurst(stokeRef.current.getBoundingClientRect());
      gsap.fromTo(
        stokeRef.current,
        { scale: 1 },
        {
          scale: 0.92,
          duration: 0.07,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
      );
    }

    setTimeout(() => {
      setEmberIntensity(1);
      setIsHot(false);
    }, 2500);
  }, []);

  /* ── Master timeline ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Left column entrance */
      if (leftRef.current) {
        const items = leftRef.current.querySelectorAll(".burn-reveal");
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      /* Furnace entrance */
      if (furnaceRef.current) {
        gsap.fromTo(
          furnaceRef.current,
          { opacity: 0, scale: 0.65 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: furnaceRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      /* Right column entrance */
      if (rightRef.current) {
        const items = rightRef.current.querySelectorAll(".burn-stat-row");
        gsap.fromTo(
          items,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      /* Breathing loops */
      if (coreRef.current) {
        gsap.to(coreRef.current, {
          scale: 1.05,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (innerGlowRef.current) {
        gsap.to(innerGlowRef.current, {
          opacity: 0.7,
          scale: 1.08,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.3,
        });
      }
      if (outerGlowRef.current) {
        gsap.to(outerGlowRef.current, {
          opacity: 0.4,
          scale: 1.06,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6,
        });
      }

      /* Percent counter */
      if (percentRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: 18.31,
          duration: 2.5,
          ease: "power2.out",
          delay: 0.8,
          scrollTrigger: {
            trigger: percentRef.current,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            if (percentRef.current)
              percentRef.current.textContent = counter.val.toFixed(2);
          },
        });
      }

      /* Progress fill */
      if (progressFillRef.current) {
        gsap.to(progressFillRef.current, {
          width: "18.31%",
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: progressFillRef.current,
            start: "top 95%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats: {
    label: string;
    value: string;
    suffix: string;
    accent: string;
  }[] = [
    { label: "Total Burned", value: "183.12M", suffix: "", accent: "#e84d0e" },
    {
      label: "Circulating Supply",
      value: "625.2M",
      suffix: "",
      accent: "#c0392b",
    },
    { label: "Beast Hunger", value: "100%", suffix: "", accent: "#e8dcc8" },
  ];

  return (
    <section
      id="burn"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#040603] py-20 lg:py-28"
    >
      {/* Ambient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(139,26,26,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═══ Two-column flex layout ═══ */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* ── Left: Copy + Controls ── */}
          <div ref={leftRef} className="flex-1 mb-12 lg:mb-0">
            {/* Kicker */}
            <div className="burn-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-scarlet/15 bg-scarlet/[0.06] px-3.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(232,77,14,0.8)]" />
              </span>
              <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/65">
                $MBP Burn Mechanism
              </span>
            </div>

            {/* Headline */}
            <h2 className="burn-reveal font-beast text-5xl leading-[0.9] text-bone sm:text-6xl lg:text-7xl xl:text-8xl">
              FEED THE
              <br />
              <span
                style={{
                  WebkitTextStroke: "2px #e84d0e",
                  color: "transparent",
                  textShadow:
                    "0 0 30px rgba(232,77,14,0.2), 0 0 60px rgba(192,57,43,0.1)",
                }}
              >
                FIRE
              </span>
            </h2>

            <p className="burn-reveal mt-5 max-w-sm font-display text-sm tracking-[0.12em] uppercase text-ash/40 leading-relaxed">
              Every transaction feeds the furnace. Every burn makes the pack
              stronger.
            </p>

            {/* Progress bar */}
            <div className="burn-reveal mt-8 max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-[9px] tracking-[0.25em] uppercase text-ash/30">
                  Burn Progress
                </span>
                <span className="font-display text-[9px] tracking-[0.25em] uppercase text-scarlet/60">
                  183.12M / 1B
                </span>
              </div>
              <div className="relative h-1 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  ref={progressFillRef}
                  className="absolute inset-y-0 left-0 w-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #8b1a1a, #c0392b, #e84d0e)",
                    boxShadow: "0 0 12px rgba(232,77,14,0.3)",
                  }}
                />
              </div>
            </div>

            {/* Stoke button */}
            <div className="burn-reveal mt-7 flex items-center gap-4">
              <button
                ref={stokeRef}
                onClick={handleStoke}
                className="btn-beast btn-beast-primary"
              >
                <span className="btn-edge-bar" />
                <span className="btn-text flex items-center gap-2">
                  Stoke the Beast
                </span>
              </button>
              <span className="font-display text-[9px] tracking-[0.2em] uppercase text-ash/20 hidden sm:inline">
                Click to intensify
              </span>
            </div>
          </div>

          {/* ── Center: Furnace ── */}
          <div
            className="relative flex-shrink-0 flex items-center justify-center order-first lg:order-none mb-10 lg:mb-0"
            style={{ perspective: 900 }}
            onMouseMove={handleFurnaceMove}
            onMouseLeave={handleFurnaceLeave}
          >
            <div
              ref={furnaceRef}
              className="relative flex items-center justify-center"
              style={{
                width: 300,
                height: 300,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Outer glow */}
              <div
                ref={outerGlowRef}
                className="absolute inset-0 m-auto rounded-full pointer-events-none"
                style={{
                  width: 300,
                  height: 300,
                  background:
                    "radial-gradient(circle, rgba(192,57,43,0.1) 0%, rgba(232,77,14,0.04) 40%, transparent 70%)",
                  filter: "blur(35px)",
                  opacity: 0.25,
                }}
              />

              {/* Ring */}
              <BurnRing progress={18.31} size={280} stroke={2} />

              {/* Inner glow */}
              <div
                ref={innerGlowRef}
                className="absolute inset-0 m-auto rounded-full pointer-events-none"
                style={{
                  width: 160,
                  height: 160,
                  background:
                    "radial-gradient(circle, rgba(232,77,14,0.18) 0%, rgba(192,57,43,0.08) 45%, transparent 70%)",
                  filter: "blur(25px)",
                  opacity: 0.5,
                }}
              />

              {/* Core orb */}
              <div
                ref={coreRef}
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: 120,
                  height: 120,
                  background:
                    "radial-gradient(circle at 42% 38%, rgba(232,77,14,0.12) 0%, rgba(139,26,26,0.08) 50%, rgba(10,13,8,0.95) 100%)",
                  border: "1px solid rgba(232,77,14,0.08)",
                  boxShadow: isHot
                    ? "0 0 50px rgba(232,77,14,0.25), inset 0 0 30px rgba(192,57,43,0.1)"
                    : "0 0 20px rgba(232,77,14,0.08), inset 0 0 15px rgba(192,57,43,0.04)",
                  transition: "box-shadow 0.5s ease",
                  zIndex: 4,
                }}
              >
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span
                      ref={percentRef}
                      className="font-beast text-2xl text-bone tabular-nums"
                    >
                      0
                    </span>
                    <span className="font-beast text-xl text-scarlet ml-0.5">
                      %
                    </span>
                  </div>
                  <div className="font-display text-[7px] tracking-[0.3em] uppercase text-ash/35 mt-0.5">
                    Consumed
                  </div>
                </div>
              </div>

              {/* Shockwave ring */}
              <div
                ref={pulseRingRef}
                className="absolute inset-0 m-auto rounded-full pointer-events-none"
                style={{
                  width: 120,
                  height: 120,
                  border: "1.5px solid rgba(232,77,14,0.4)",
                  opacity: 0,
                  zIndex: 5,
                }}
              />

              {/* Embers */}
              <EmberField intensity={emberIntensity} />

              {/* Orbiting dots */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="burn-orbit absolute inset-0 m-auto pointer-events-none"
                  style={{
                    width: 240,
                    height: 240,
                    animation: `burn-orbit ${7 + i * 3.5}s linear infinite`,
                    animationDelay: `${i * -2.5}s`,
                    zIndex: 3,
                  }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 2.5 + i * 0.5,
                      height: 2.5 + i * 0.5,
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: ["#e84d0e", "#c0392b", "#e8dcc8"][i],
                      boxShadow: `0 0 ${5 + i * 2}px ${["rgba(232,77,14,0.5)", "rgba(192,57,43,0.4)", "rgba(232,220,200,0.3)"][i]}`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Burned / Remaining under furnace */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5">
              <div className="text-center">
                <span className="font-display text-[7px] tracking-[0.3em] uppercase text-ash/25 block">
                  Burned
                </span>
                <span className="font-beast text-sm text-ember">183.12M</span>
              </div>
              <div className="w-px h-6 bg-white/[0.05]" />
              <div className="text-center">
                <span className="font-display text-[7px] tracking-[0.3em] uppercase text-ash/25 block">
                  Alive
                </span>
                <span className="font-beast text-sm text-bone/60">625.2M</span>
              </div>
            </div>
          </div>

          {/* ── Right: Stats ── */}
          <div ref={rightRef} className="flex-1">
            <div className="space-y-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="burn-stat-row group/s relative overflow-hidden rounded-lg border border-white/[0.03] bg-white/[0.01] transition-all duration-400 hover:border-white/[0.07] hover:bg-white/[0.025]"
                >
                  {/* Accent line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-px opacity-25 group-hover/s:opacity-70 transition-opacity duration-500"
                    style={{ background: stat.accent }}
                  />

                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Dot */}
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-shadow duration-500 group-hover/s:shadow-[0_0_12px_var(--g)]"
                      style={
                        {
                          background: stat.accent,
                          "--g": `${stat.accent}88`,
                        } as React.CSSProperties
                      }
                    />

                    {/* Label */}
                    <span className="font-display text-[9px] tracking-[0.25em] uppercase text-ash/40 flex-1">
                      {stat.label}
                    </span>

                    {/* Value */}
                    <span className="font-beast text-2xl text-bone tabular-nums">
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini descriptor */}
            <div className="mt-5 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(232,77,14,0.6)]" />
              <span className="font-display text-[9px] tracking-[0.25em] uppercase text-ash/25">
                All metrics update in real time
              </span>
            </div>
          </div>
        </div>

        {/* Closing divider */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-scarlet/12" />
          <p className="font-display text-[9px] tracking-[0.3em] uppercase text-ash/20">
            The fire keeps the forest alive
          </p>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-scarlet/12" />
        </div>
      </div>
    </section>
  );
}
