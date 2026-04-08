"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONTRACT_ADDRESS = "0xMBP...SUI1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f";
const DISPLAY_ADDRESS = "0xMBP...SUI1a2b3c4d5e6f";

const SCRAMBLE_CHARS = "ABCDEF0123456789xX☠🐾◆▲";

function useScrambleText(target: string, trigger: boolean) {
  const [displayed, setDisplayed] = useState(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;

    let frame = 0;
    const totalFrames = 28;
    const chars = "ABCDEF0123456789";

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * target.length);

      setDisplayed(
        target
          .split("")
          .map((ch, i) =>
            i < resolved
              ? ch
              : ch === "." || ch === "x" || ch === "0"
              ? ch
              : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target]);

  return displayed;
}

/* Particle burst on copy */
function spawnParticles(origin: DOMRect) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.style.cssText = `
      position:fixed;
      left:${origin.left + origin.width / 2}px;
      top:${origin.top + origin.height / 2}px;
      width:${4 + Math.random() * 6}px;
      height:${4 + Math.random() * 6}px;
      border-radius:50%;
      background:${i % 3 === 0 ? "#c0392b" : i % 3 === 1 ? "#e84d0e" : "#e8dcc8"};
      pointer-events:none;
      z-index:9999;
    `;
    document.body.appendChild(el);

    const angle = (i / count) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      opacity: 0,
      scale: 0,
      duration: 0.7 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  }
}

export default function ContractAddress() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const clawsRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrambleActive, setScrambleActive] = useState(false);

  const scrambled = useScrambleText(DISPLAY_ADDRESS, scrambleActive);

  /* ── Scroll entrance ─────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });

    // Section fades + rises
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    // Claw marks slash in
    const claws = clawsRef.current?.querySelectorAll(".ca-claw");
    if (claws?.length) {
      tl.fromTo(
        claws,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.07,
          ease: "power4.in",
          transformOrigin: "left center",
        },
        "-=0.3"
      );
    }

    // Scanline sweeps once across the address
    tl.fromTo(
      scanlineRef.current,
      { x: "-100%", opacity: 1 },
      { x: "110%", duration: 0.8, ease: "power2.inOut" },
      "-=0.1"
    );

    // Trigger scramble then settle
    tl.call(() => setScrambleActive(true), [], "-=0.2");
    tl.call(() => setScrambleActive(false), [], "+=0.6");

    // Address field glows in
    tl.fromTo(
      addressRef.current,
      { boxShadow: "0 0 0 rgba(192,57,43,0)" },
      {
        boxShadow: "0 0 30px rgba(192,57,43,0.25), inset 0 0 20px rgba(192,57,43,0.05)",
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5"
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  /* ── Copy handler ─────────────────────────────────────── */
  const handleCopy = useCallback(() => {
    if (copied) return;

    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      // Claw-strike button animation
      if (copyBtnRef.current) {
        gsap.timeline()
          .to(copyBtnRef.current, { scale: 0.88, rotateZ: -3, duration: 0.08, ease: "power4.in" })
          .to(copyBtnRef.current, { scale: 1.08, rotateZ: 1, duration: 0.15, ease: "back.out(3)" })
          .to(copyBtnRef.current, { scale: 1, rotateZ: 0, duration: 0.2, ease: "power2.out" });
      }

      // Particle burst
      if (copyBtnRef.current) {
        spawnParticles(copyBtnRef.current.getBoundingClientRect());
      }

      // Stamp seal drops
      if (stampRef.current) {
        gsap.timeline()
          .set(stampRef.current, { display: "flex" })
          .fromTo(
            stampRef.current,
            { scale: 2.5, opacity: 0, rotation: -15 },
            { scale: 1, opacity: 1, rotation: -8, duration: 0.4, ease: "back.out(2)" }
          )
          .to(stampRef.current, { opacity: 0, scale: 0.8, duration: 0.3, delay: 1.4, ease: "power2.in" })
          .set(stampRef.current, { display: "none" });
      }

      // Address field flash
      if (addressRef.current) {
        gsap.timeline()
          .to(addressRef.current, {
            boxShadow: "0 0 60px rgba(192,57,43,0.6), inset 0 0 30px rgba(192,57,43,0.15)",
            borderColor: "rgba(192,57,43,0.8)",
            duration: 0.15,
          })
          .to(addressRef.current, {
            boxShadow: "0 0 30px rgba(192,57,43,0.25), inset 0 0 20px rgba(192,57,43,0.05)",
            borderColor: "rgba(192,57,43,0.3)",
            duration: 0.6,
          });
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [copied]);

  /* ── Address hover scramble ──────────────────────────── */
  const handleAddressHover = useCallback(() => {
    setHovered(true);
    setScrambleActive(true);
    setTimeout(() => setScrambleActive(false), 500);
  }, []);

  /* ── Button hover pulse ──────────────────────────────── */
  const handleBtnEnter = useCallback(() => {
    if (!copyBtnRef.current || copied) return;
    gsap.to(copyBtnRef.current, {
      scale: 1.04,
      boxShadow: "0 0 30px rgba(192,57,43,0.4), 4px 4px 0 #8b1a1a",
      duration: 0.2,
      ease: "power2.out",
    });
  }, [copied]);

  const handleBtnLeave = useCallback(() => {
    if (!copyBtnRef.current) return;
    gsap.to(copyBtnRef.current, {
      scale: 1,
      boxShadow: "4px 4px 0 #8b1a1a",
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 bg-[#060a05] overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          zIndex: 0,
        }}
      />

      {/* Ambient glow spot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 300,
          background: "radial-gradient(ellipse, rgba(192,57,43,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-scarlet/40" />
          <span className="font-display text-xs tracking-[0.35em] uppercase text-scarlet/70">
            ⚠ Classified Specimen
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-scarlet/40" />
        </div>

        {/* Main card */}
        <div
          ref={containerRef}
          className="relative opacity-0"
          style={{ opacity: 0 }}
        >
          {/* Claw marks — top-left decoration */}
          <div ref={clawsRef} className="absolute -top-3 -left-2 z-20 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="ca-claw absolute"
                style={{
                  width: 60 - i * 8,
                  height: 3,
                  background: "linear-gradient(90deg, rgba(192,57,43,0.9), transparent)",
                  top: i * 9,
                  left: i * 4,
                  transform: `rotate(${12 - i * 4}deg) scaleX(0)`,
                  borderRadius: 2,
                  boxShadow: "0 0 8px rgba(192,57,43,0.4)",
                }}
              />
            ))}
          </div>

          {/* Corner accents */}
          {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} pointer-events-none`}
              style={{ zIndex: 10 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M0 0 L14 0 L14 2 L2 2 L2 14 L0 14 Z" fill="rgba(192,57,43,0.5)" />
              </svg>
            </div>
          ))}

          {/* Card body */}
          <div
            className="relative border border-scarlet/20 bg-gradient-to-b from-[#0d1a0e] to-[#080c07]"
            style={{
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
            }}
          >
            {/* Top stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-blood via-scarlet to-ember" />

            <div className="p-6 sm:p-8">
              {/* Header row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-beast text-2xl sm:text-3xl text-bone mb-1 leading-none">
                    CONTRACT ADDRESS
                  </h2>
                  <p className="font-display text-xs tracking-[0.2em] uppercase text-moss">
                    $MBP · Sui Network · Specimen #001
                  </p>
                </div>

                {/* SUI network badge */}
                <div
                  className="flex items-center gap-1.5 border border-sky-ice/20 bg-sky-ice/5 px-3 py-1.5 shrink-0"
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-ice opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-ice" />
                  </span>
                  <span className="font-display text-[10px] tracking-widest uppercase text-sky-ice">
                    SUI
                  </span>
                </div>
              </div>

              {/* Address + copy row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Address field */}
                <div
                  ref={addressRef}
                  className="relative flex-1 overflow-hidden cursor-pointer group"
                  style={{
                    border: "1px solid rgba(192,57,43,0.3)",
                    background: "rgba(10,13,8,0.8)",
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    transition: "border-color 0.3s ease",
                  }}
                  onMouseEnter={handleAddressHover}
                  onMouseLeave={() => setHovered(false)}
                  onClick={handleCopy}
                >
                  {/* Scanline sweep */}
                  <div
                    ref={scanlineRef}
                    className="absolute inset-y-0 w-16 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(192,57,43,0.15), transparent)",
                      zIndex: 5,
                    }}
                  />

                  {/* Address text */}
                  <div className="px-4 py-4 flex items-center gap-3">
                    <span
                      className="text-[10px] font-display tracking-widest uppercase text-scarlet/50 shrink-0 hidden sm:block"
                    >
                      CA
                    </span>
                    <div className="w-px h-5 bg-scarlet/20 shrink-0 hidden sm:block" />
                    <span
                      className="font-mono text-sm text-bone/90 tracking-wider break-all leading-relaxed group-hover:text-bone transition-colors duration-200"
                      style={{
                        textShadow: hovered
                          ? "0 0 12px rgba(192,57,43,0.4)"
                          : "none",
                        transition: "text-shadow 0.3s ease",
                      }}
                    >
                      {scrambleActive ? scrambled : DISPLAY_ADDRESS}
                    </span>
                  </div>

                  {/* Hover shimmer overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(192,57,43,0.04) 50%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Copy button */}
                <button
                  ref={copyBtnRef}
                  onClick={handleCopy}
                  onMouseEnter={handleBtnEnter}
                  onMouseLeave={handleBtnLeave}
                  disabled={copied}
                  className="relative shrink-0 font-display font-bold text-sm tracking-widest uppercase overflow-hidden"
                  style={{
                    padding: "14px 28px",
                    background: copied ? "rgba(46,139,87,0.2)" : "#c0392b",
                    color: copied ? "#4a7c59" : "#e8dcc8",
                    border: copied ? "1px solid rgba(46,139,87,0.4)" : "none",
                    clipPath:
                      "polygon(8px 0, calc(100% - 0px) 0, 100% 8px, 100% 100%, calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    boxShadow: "4px 4px 0 #8b1a1a",
                    transition: "background 0.3s ease, color 0.3s ease",
                    cursor: copied ? "default" : "pointer",
                  }}
                >
                  {/* Shimmer sweep */}
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
                      transform: "translateX(-100%) skewX(-20deg)",
                      animation: copied ? "none" : "btnShimmer 3s ease-in-out infinite",
                    }}
                  />

                  {/* Label */}
                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7L5.5 10.5L12 3.5" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        SEIZED
                      </>
                    ) : (
                      <>
                        <ClawIcon />
                        COPY CA
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Bottom meta row */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  {[
                    { label: "Network", value: "Sui" },
                    { label: "Symbol", value: "$MBP" },
                    { label: "Type", value: "Meme Token" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                      <span className="font-display text-[9px] tracking-[0.2em] uppercase text-ash/40">
                        {label}
                      </span>
                      <span className="font-display text-xs tracking-wider text-moss font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="font-display text-[9px] tracking-widest uppercase text-ash/30 text-right">
                  Always verify CA before interacting
                </p>
              </div>
            </div>

            {/* Bottom stripe */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-scarlet/20 to-transparent" />
          </div>

          {/* Stamp seal overlay (hidden by default) */}
          <div
            ref={stampRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ display: "none", zIndex: 30 }}
          >
            <div
              style={{
                border: "4px solid rgba(192,57,43,0.7)",
                borderRadius: "50%",
                width: 130,
                height: 130,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-8deg)",
                boxShadow: "0 0 40px rgba(192,57,43,0.4), inset 0 0 20px rgba(192,57,43,0.1)",
                background: "rgba(10,13,8,0.85)",
              }}
            >
              <span style={{ fontSize: 28 }}>🐾</span>
              <span
                className="font-beast text-xs text-scarlet tracking-widest mt-1"
                style={{ textShadow: "0 0 10px rgba(192,57,43,0.6)" }}
              >
                SEIZED
              </span>
            </div>
          </div>
        </div>

        {/* Below-card disclaimer */}
        <p className="mt-6 text-center font-display text-[10px] tracking-widest uppercase text-ash/30">
          🐾 The Beast does not give financial advice · DYOR · Not a man. Not a bear. Not a pig.
        </p>
      </div>

      {/* Scoped keyframes */}
      <style jsx>{`
        @keyframes btnShimmer {
          0%,
          100% {
            transform: translateX(-100%) skewX(-20deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          60% {
            transform: translateX(200%) skewX(-20deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

/* Tiny claw icon for the copy button */
function ClawIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M2 11 Q3 7 5 5 Q5 3 4 2"
        stroke="#e8dcc8"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 11 Q5.5 7 6.5 5.5 Q6.5 3.5 6 2"
        stroke="#e8dcc8"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 11 Q7.5 7 7.5 5.5 Q8 3.5 9 2.5"
        stroke="#e8dcc8"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
