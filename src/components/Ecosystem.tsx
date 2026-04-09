"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════ */
const CONTRACT_ADDRESS =
  "0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP";

function truncateMiddle(value: string, keepStart = 14, keepEnd = 14) {
  if (value.length <= keepStart + keepEnd + 3) return value;
  return `${value.slice(0, keepStart)}...${value.slice(-keepEnd)}`;
}

const DISPLAY_ADDRESS = truncateMiddle(CONTRACT_ADDRESS, 14, 16);

const DEXSCREENER_URL =
  "https://dexscreener.com/sui/0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP";
const SUISCAN_URL =
  "https://suiscan.xyz/mainnet/coin/0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP";

/* ═══════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════ */
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
                : chars[Math.floor(Math.random() * chars.length)],
          )
          .join(""),
      );
      if (frame < totalFrames) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target]);

  return displayed;
}

/* ═══════════════════════════════════════════════════════
   Particle burst
   ═══════════════════════════════════════════════════════ */
function spawnParticles(origin: DOMRect) {
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.style.cssText = `
      position:fixed;
      left:${origin.left + origin.width / 2}px;
      top:${origin.top + origin.height / 2}px;
      width:${4 + Math.random() * 6}px;
      height:${4 + Math.random() * 6}px;
      border-radius:50%;
      background:${i % 3 === 0 ? "#c0392b" : i % 3 === 1 ? "#e84d0e" : "#e8dcc8"};
      pointer-events:none;z-index:9999;
    `;
    document.body.appendChild(el);
    const angle = (i / 18) * Math.PI * 2;
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

/* ═══════════════════════════════════════════════════════
   Magnetic tilt on hover (shared)
   ═══════════════════════════════════════════════════════ */
function useMagneticTilt(ref: React.RefObject<HTMLDivElement | null>) {
  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(ref.current, {
        rotateY: x * 6,
        rotateX: y * -6,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [ref],
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  }, [ref]);

  return { handleMove, handleLeave };
}

/* ═══════════════════════════════════════════════════════
   Glow line component (replaces thick borders)
   ═══════════════════════════════════════════════════════ */
function GlowLine({ color }: { color: string }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-px opacity-40 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   CA Card
   ═══════════════════════════════════════════════════════ */
function CACard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [scrambleActive, setScrambleActive] = useState(false);

  const scrambled = useScrambleText(DISPLAY_ADDRESS, scrambleActive);
  const { handleMove, handleLeave } = useMagneticTilt(cardRef);

  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 85%",
        once: true,
      },
    });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
    );
    tl.call(() => setScrambleActive(true), [], "-=0.3");
    tl.call(() => setScrambleActive(false), [], "+=0.6");
  }, []);

  const handleCopy = useCallback(() => {
    if (copied) return;
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      if (copyBtnRef.current) {
        gsap
          .timeline()
          .to(copyBtnRef.current, {
            scale: 0.88,
            rotateZ: -3,
            duration: 0.08,
            ease: "power4.in",
          })
          .to(copyBtnRef.current, {
            scale: 1.08,
            rotateZ: 1,
            duration: 0.15,
            ease: "back.out(3)",
          })
          .to(copyBtnRef.current, {
            scale: 1,
            rotateZ: 0,
            duration: 0.2,
            ease: "power2.out",
          });
        spawnParticles(copyBtnRef.current.getBoundingClientRect());
      }
      if (stampRef.current) {
        gsap
          .timeline()
          .set(stampRef.current, { display: "flex" })
          .fromTo(
            stampRef.current,
            { scale: 2.5, opacity: 0, rotation: -15 },
            {
              scale: 1,
              opacity: 1,
              rotation: -8,
              duration: 0.4,
              ease: "back.out(2)",
            },
          )
          .to(stampRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            delay: 1.4,
            ease: "power2.in",
          })
          .set(stampRef.current, { display: "none" });
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [copied]);

  const handleAddressHover = useCallback(() => {
    setScrambleActive(true);
    setTimeout(() => setScrambleActive(false), 500);
    if (addressRef.current) {
      gsap.to(addressRef.current, {
        boxShadow: "0 0 20px rgba(192,57,43,0.15)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  const handleAddressLeave = useCallback(() => {
    if (addressRef.current) {
      gsap.to(addressRef.current, {
        boxShadow: "0 0 0px rgba(192,57,43,0)",
        duration: 0.4,
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="eco-card-v2 group"
      style={{ opacity: 0, perspective: 600 }}
      onMouseMove={handleMove}
      onMouseLeave={(e) => {
        handleLeave();
        handleAddressLeave();
      }}
    >
      <div className="relative bg-[#0a0e08]/80 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col border border-white/[0.04] hover:border-scarlet/20 transition-colors duration-500 overflow-hidden">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-scarlet/30 to-transparent" />
        <GlowLine color="#c0392b" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-scarlet/10 flex items-center justify-center">
              <ClawIcon color="#c0392b" />
            </div>
            <div>
              <h3 className="font-beast text-lg text-bone leading-none">
                CONTRACT
              </h3>
              <p className="font-display text-[9px] tracking-[0.2em] uppercase text-moss mt-0.5">
                Copy & Verify
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-sky-ice/5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-ice opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-ice" />
            </span>
            <span className="font-display text-[9px] tracking-widest uppercase text-sky-ice">
              SUI
            </span>
          </div>
        </div>

        {/* Address field */}
        <div
          ref={addressRef}
          className="relative overflow-hidden cursor-pointer rounded-md mb-4 transition-colors duration-300"
          style={{
            border: "1px solid rgba(192,57,43,0.15)",
            background: "rgba(10,13,8,0.6)",
          }}
          onMouseEnter={handleAddressHover}
          onClick={handleCopy}
        >
          <div className="px-3 py-3 flex items-center gap-2">
            <span className="text-[9px] font-display tracking-widest uppercase text-scarlet/40 shrink-0">
              CA
            </span>
            <div className="w-px h-4 bg-scarlet/15 shrink-0" />
            <span className="font-mono text-xs text-bone/80 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-bone transition-colors duration-200">
              {scrambleActive ? scrambled : DISPLAY_ADDRESS}
            </span>
          </div>
        </div>

        {/* Copy button */}
        <button
          ref={copyBtnRef}
          onClick={handleCopy}
          disabled={copied}
          className={`btn-beast w-full justify-center mb-4 ${copied ? "btn-beast-seized" : "btn-beast-primary"}`}
          style={{ cursor: copied ? "default" : "pointer" }}
        >
          {!copied && <span className="btn-edge-bar" />}
          <span className="btn-text flex items-center gap-2 whitespace-nowrap">
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5.5 10.5L12 3.5"
                    stroke="#4a7c59"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                SEIZED
              </>
            ) : (
              <>
                <ClawIcon color="#e8dcc8" />
                COPY CA
              </>
            )}
          </span>
        </button>

        {/* Meta - pushed to bottom */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-4">
            {[
              { l: "Network", v: "Sui" },
              { l: "Symbol", v: "$MBP" },
            ].map(({ l, v }) => (
              <div key={l} className="flex flex-col">
                <span className="font-display text-[8px] tracking-[0.2em] uppercase text-ash/40">
                  {l}
                </span>
                <span className="font-display text-[10px] tracking-wider text-moss font-semibold">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <p className="font-display text-[8px] tracking-widest uppercase text-ash/25">
            Verify before use
          </p>
        </div>

        {/* Stamp seal */}
        <div
          ref={stampRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ display: "none", zIndex: 30 }}
        >
          <div
            style={{
              border: "3px solid rgba(192,57,43,0.6)",
              borderRadius: "50%",
              width: 100,
              height: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-8deg)",
              boxShadow: "0 0 30px rgba(192,57,43,0.3)",
              background: "rgba(10,13,8,0.9)",
            }}
          >
            <span style={{ fontSize: 22 }}>🐾</span>
            <span
              className="font-beast text-xs text-scarlet tracking-widest mt-1"
              style={{ textShadow: "0 0 10px rgba(192,57,43,0.6)" }}
            >
              SEIZED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DexScreener Card
   ═══════════════════════════════════════════════════════ */
function DexScreenerCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { handleMove, handleLeave } = useMagneticTilt(cardRef);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          once: true,
        },
      },
    );
  }, []);

  const handleChartEnter = useCallback(() => {
    if (!chartRef.current) return;
    const path = chartRef.current.querySelector(
      ".eco-chart-line",
    ) as SVGPathElement | null;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1, ease: "power2.out" },
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="eco-card-v2 group"
      style={{ opacity: 0, perspective: 600 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <a
        href={DEXSCREENER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        onMouseEnter={handleChartEnter}
      >
        <div className="relative bg-[#0a0e08]/80 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col border border-white/[0.04] hover:border-ember/20 transition-colors duration-500 overflow-hidden">
          {/* Subtle top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent" />
          <GlowLine color="#e84d0e" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-md bg-ember/10 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e84d0e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-beast text-lg text-bone leading-none">
                CHARTS
              </h3>
              <p className="font-display text-[9px] tracking-[0.2em] uppercase text-moss mt-0.5">
                DexScreener
              </p>
            </div>
          </div>

          {/* Mini chart */}
          <div
            ref={chartRef}
            className="relative mb-5 flex-1 min-h-[90px] overflow-hidden rounded-md"
            style={{
              background: "rgba(10,13,8,0.5)",
              border: "1px solid rgba(232,77,14,0.08)",
            }}
          >
            <svg
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {[20, 40, 60].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="rgba(232,77,14,0.04)"
                  strokeWidth="1"
                />
              ))}
              <path
                d="M0,65 Q30,60 60,55 Q90,40 120,45 Q150,35 180,25 Q210,30 240,15 Q270,20 300,10 L300,80 L0,80Z"
                fill="url(#emberGradFill)"
              />
              <path
                className="eco-chart-line"
                d="M0,65 Q30,60 60,55 Q90,40 120,45 Q150,35 180,25 Q210,30 240,15 Q270,20 300,10"
                fill="none"
                stroke="#e84d0e"
                strokeWidth="2"
                style={{ strokeDasharray: 500, strokeDashoffset: 500 }}
              />
              <circle
                cx="300"
                cy="10"
                r="3"
                fill="#e84d0e"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <circle
                cx="300"
                cy="10"
                r="8"
                fill="rgba(232,77,14,0.2)"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
              <defs>
                <linearGradient id="emberGradFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(232,77,14,0.12)" />
                  <stop offset="100%" stopColor="rgba(232,77,14,0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* CTA row */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-display text-[8px] tracking-[0.2em] uppercase text-ash/40">
                Live
              </span>
              <span className="font-display text-[10px] tracking-wider text-ember font-semibold">
                Price & Volume
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-bone/40 group-hover:text-ember transition-colors duration-300">
              <span className="font-display text-[10px] tracking-widest uppercase">
                View
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SuiScan Card
   ═══════════════════════════════════════════════════════ */
function SuiScanCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const { handleMove, handleLeave } = useMagneticTilt(cardRef);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.24,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          once: true,
        },
      },
    );
  }, []);

  const handleBlocksEnter = useCallback(() => {
    if (!blocksRef.current) return;
    const blocks = blocksRef.current.querySelectorAll(".sui-block");
    gsap.fromTo(
      blocks,
      { scale: 0.8, opacity: 0.3 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: "back.out(2)",
        overwrite: "auto",
      },
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="eco-card-v2 group"
      style={{ opacity: 0, perspective: 600 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <a
        href={SUISCAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        onMouseEnter={handleBlocksEnter}
      >
        <div className="relative bg-[#0a0e08]/80 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col border border-white/[0.04] hover:border-sky-ice/20 transition-colors duration-500 overflow-hidden">
          {/* Subtle top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-ice/30 to-transparent" />
          <GlowLine color="#7ec8e3" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-md bg-sky-ice/10 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7ec8e3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <h3 className="font-beast text-lg text-bone leading-none">
                ON-CHAIN
              </h3>
              <p className="font-display text-[9px] tracking-[0.2em] uppercase text-moss mt-0.5">
                SuiScan Explorer
              </p>
            </div>
          </div>

          {/* Block visualization */}
          <div
            ref={blocksRef}
            className="relative mb-5 overflow-hidden rounded-md p-3"
            style={{
              background: "rgba(10,13,8,0.5)",
              border: "1px solid rgba(126,200,227,0.08)",
            }}
          >
            <div className="flex items-center justify-center gap-1.5">
              {["0x", "4d", "68", "a3", "8f"].map((hex, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="sui-block w-9 h-9 rounded border border-sky-ice/15 bg-sky-ice/[0.03] flex items-center justify-center group-hover:border-sky-ice/30 group-hover:bg-sky-ice/[0.06] transition-all duration-300">
                    <span className="font-mono text-[9px] text-sky-ice/50 group-hover:text-sky-ice/90 transition-colors duration-300">
                      {hex}
                    </span>
                  </div>
                  {i < 4 && (
                    <div className="w-2 h-px bg-sky-ice/10 group-hover:bg-sky-ice/25 group-hover:w-3 transition-all duration-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info chips */}
          <div className="flex items-center gap-2 mb-5">
            {[
              { label: "Holders", icon: "👥" },
              { label: "Txns", icon: "⚡" },
              { label: "Supply", icon: "🔥" },
            ].map(({ label, icon }) => (
              <div
                key={label}
                className="flex-1 text-center py-2 rounded border border-sky-ice/10 bg-sky-ice/[0.02] group-hover:border-sky-ice/15 transition-colors duration-300"
              >
                <span className="text-[10px]">{icon}</span>
                <p className="font-display text-[8px] tracking-widest uppercase text-sky-ice/40 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-display text-[8px] tracking-[0.2em] uppercase text-ash/40">
                Explorer
              </span>
              <span className="font-display text-[10px] tracking-wider text-sky-ice font-semibold">
                Full Transparency
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-bone/40 group-hover:text-sky-ice transition-colors duration-300">
              <span className="font-display text-[10px] tracking-widest uppercase">
                Explore
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Ecosystem Component
   ═══════════════════════════════════════════════════════ */
export default function Ecosystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      },
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-[#060a05] overflow-hidden"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          zIndex: 0,
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(192,57,43,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={titleRef}
          className="text-center mb-14"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-scarlet/40" />
            <span className="font-display text-[10px] tracking-[0.35em] uppercase text-scarlet/60">
              Beast Intelligence
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-scarlet/40" />
          </div>
          <h2 className="font-beast text-3xl sm:text-4xl text-bone mb-2">
            ECOSYSTEM
          </h2>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-ash/40">
            Track · Copy · Explore
          </p>
        </div>

        {/* Cards grid - equal height */}
        <div className="grid md:grid-cols-3 gap-5">
          <CACard />
          <DexScreenerCard />
          <SuiScanCard />
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center font-display text-[10px] tracking-widest uppercase text-ash/20">
          🐾 The Beast does not give financial advice · DYOR · Not a man. Not a
          bear. Not a pig.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   Small icons
   ═══════════════════════════════════════════════════════ */
function ClawIcon({ color = "#e8dcc8" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M2 11 Q3 7 5 5 Q5 3 4 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 11 Q5.5 7 6.5 5.5 Q6.5 3.5 6 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 11 Q7.5 7 7.5 5.5 Q8 3.5 9 2.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
