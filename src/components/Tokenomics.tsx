"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   Token distribution
   ═══════════════════════════════════════════════════════ */
const SEGMENTS = [
  { label: "Liquidity Pool", pct: 50, color: "#4a7c59", desc: "Locked & secured" },
  { label: "Burned", pct: 18.31, color: "#c0392b", desc: "Permanently removed" },
  { label: "Community", pct: 15, color: "#7ec8e3", desc: "Airdrops & rewards" },
  { label: "Team", pct: 10, color: "#e84d0e", desc: "Vested 12 months" },
  { label: "Marketing", pct: 6.69, color: "#e8dcc8", desc: "Growth & partnerships" },
];

const KEY_STATS = [
  { label: "Total Supply", value: "1,000,000,000", sub: "$MBP tokens" },
  { label: "Circulating", value: "816,880,000", sub: "Available supply" },
  { label: "Buy / Sell Tax", value: "0% / 0%", sub: "Zero-tax trading" },
];

const TRUST = [
  { label: "LP Locked", sub: "Liquidity secured" },
  { label: "No Mint", sub: "Fixed supply forever" },
  { label: "Renounced", sub: "Ownership removed" },
  { label: "Zero Tax", sub: "0% buy and sell" },
];

/* ── Ring geometry ── */
const R = 110;
const CIRC = 2 * Math.PI * R;
const SW = 26;
const GAP = 4;
const MAX_PCT = Math.max(...SEGMENTS.map((s) => s.pct));

const SEG_GEO = SEGMENTS.map((seg, i) => {
  const prev = SEGMENTS.slice(0, i).reduce((s, x) => s + x.pct, 0);
  return {
    ...seg,
    startAngle: -90 + (prev / 100) * 360,
    segLen: (seg.pct / 100) * CIRC - GAP,
  };
});

/* ── Trust badge SVG icons ── */
function TrustIcon({ index }: { index: number }) {
  const shared = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (index === 0)
    return (
      <svg {...shared}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  if (index === 1)
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="10" />
        <line x1="4" y1="4" x2="20" y2="20" />
      </svg>
    );
  if (index === 2)
    return (
      <svg {...shared}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  return (
    <svg {...shared}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════ */
export default function Tokenomics() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const segs = section.querySelectorAll<SVGCircleElement>(".ring-seg");
      const bars = section.querySelectorAll<HTMLDivElement>(".tok-bar");

      /* Initial states */
      segs.forEach((seg, i) => {
        gsap.set(seg, { strokeDashoffset: SEG_GEO[i].segLen });
      });
      gsap.set(bars, { width: "0%" });

      /* Master timeline */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          once: true,
        },
      });

      /* Header */
      tl.fromTo(
        ".tok-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
        },
      );

      /* Stats slide in from left */
      tl.fromTo(
        ".tok-stat",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power3.out",
          immediateRender: false,
        },
        "-=0.2",
      );

      /* Ring segments draw on */
      segs.forEach((seg, i) => {
        tl.to(
          seg,
          {
            strokeDashoffset: 0,
            duration: 0.4 + SEG_GEO[i].pct * 0.008,
            ease: "power2.out",
          },
          i === 0 ? "<" : "<+=0.08",
        );
      });

      /* Center label */
      tl.fromTo(
        ".tok-center",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          immediateRender: false,
        },
        "-=0.4",
      );

      /* Tick marks */
      tl.fromTo(
        ".tok-tick",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, immediateRender: false },
        "<",
      );

      /* Legend items slide in from right */
      tl.fromTo(
        ".tok-legend",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
        },
        "<-=0.3",
      );

      /* Legend bar fills */
      bars.forEach((bar) => {
        tl.to(
          bar,
          { width: bar.dataset.target, duration: 0.5, ease: "power2.out" },
          "<+=0.04",
        );
      });

      /* Trust badges */
      tl.fromTo(
        ".tok-trust",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          immediateRender: false,
        },
        "-=0.2",
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="tokenomics"
      ref={sectionRef}
      className="relative py-24 lg:py-36 bg-gradient-to-b from-[#0a0d08] to-[#0d1a0e] overflow-hidden"
    >
      {/* Atmospheric glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="tok-reveal mb-4 inline-flex items-center gap-2 rounded-sm border border-moss/15 bg-moss/[0.06] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-scarlet" />
            </span>
            <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/60">
              Token Distribution
            </span>
          </div>

          <h2 className="tok-reveal font-beast text-5xl lg:text-7xl xl:text-8xl text-bone leading-[0.9] mb-4">
            TOKE
            <span
              style={{
                WebkitTextStroke: "2px #c0392b",
                color: "transparent",
                textShadow:
                  "0 0 30px rgba(192,57,43,0.2), 0 0 60px rgba(192,57,43,0.1)",
              }}
            >
              NOMICS
            </span>
          </h2>

          <p className="tok-reveal font-display text-sm tracking-[0.2em] uppercase text-ash/40 max-w-md mx-auto">
            A savage allocation. Transparent. Immutable. Built for the pack.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-[260px_1fr_280px] gap-8 lg:gap-12 items-center mb-16 lg:mb-24">
          {/* Left — Key stats */}
          <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {KEY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="tok-stat group p-4 lg:p-5 rounded-lg border border-moss/8 bg-white/[0.02] hover:border-moss/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="font-display text-[9px] tracking-[0.25em] uppercase text-ash/35 mb-2">
                  {stat.label}
                </div>
                <div className="font-beast text-lg lg:text-2xl text-bone leading-none mb-1">
                  {stat.value}
                </div>
                <div className="font-display text-[9px] tracking-wider text-ash/25 hidden lg:block">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Center — Ring chart */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-full max-w-[380px]">
              <svg viewBox="0 0 300 300" className="w-full">
                <defs>
                  <filter id="tok-glow">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Base ring */}
                <circle
                  cx="150"
                  cy="150"
                  r={R}
                  fill="none"
                  stroke="rgba(74,124,89,0.06)"
                  strokeWidth={SW}
                />

                {/* Decorative dashed rings */}
                <circle
                  cx="150"
                  cy="150"
                  r={R - SW / 2 - 8}
                  fill="none"
                  stroke="rgba(74,124,89,0.08)"
                  strokeWidth="0.5"
                  strokeDasharray="3 7"
                />
                <circle
                  cx="150"
                  cy="150"
                  r={R + SW / 2 + 8}
                  fill="none"
                  stroke="rgba(74,124,89,0.08)"
                  strokeWidth="0.5"
                  strokeDasharray="3 7"
                />

                {/* Tick marks */}
                <g className="tok-tick">
                  {Array.from({ length: 60 }, (_, i) => {
                    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                    const major = i % 5 === 0;
                    const r1 = R + SW / 2 + 4;
                    const r2 = r1 + (major ? 8 : 4);
                    return (
                      <line
                        key={i}
                        x1={150 + Math.cos(a) * r1}
                        y1={150 + Math.sin(a) * r1}
                        x2={150 + Math.cos(a) * r2}
                        y2={150 + Math.sin(a) * r2}
                        stroke={`rgba(74,124,89,${major ? 0.2 : 0.07})`}
                        strokeWidth={major ? "1" : "0.5"}
                      />
                    );
                  })}
                </g>

                {/* Segments */}
                {SEG_GEO.map((d, i) => (
                  <circle
                    key={i}
                    className="ring-seg"
                    cx="150"
                    cy="150"
                    r={R}
                    fill="none"
                    stroke={d.color}
                    strokeDasharray={`${d.segLen} ${CIRC}`}
                    strokeLinecap="butt"
                    transform={`rotate(${d.startAngle} 150 150)`}
                    style={{
                      strokeWidth: activeIdx === i ? SW + 6 : SW,
                      opacity: activeIdx !== null && activeIdx !== i ? 0.2 : 1,
                      filter: activeIdx === i ? "url(#tok-glow)" : "none",
                      transition:
                        "stroke-width 0.35s ease, opacity 0.35s ease, filter 0.35s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />
                ))}

                {/* Segment boundary dots */}
                {SEG_GEO.map((d, i) => {
                  const a = ((d.startAngle + 90) * Math.PI) / 180 - Math.PI / 2;
                  return (
                    <circle
                      key={`dot-${i}`}
                      cx={150 + Math.cos(a) * R}
                      cy={150 + Math.sin(a) * R}
                      r="2"
                      fill="rgba(10,13,8,0.9)"
                      stroke="rgba(74,124,89,0.15)"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </svg>

              {/* Center overlay */}
              <div className="tok-center absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-beast text-3xl lg:text-4xl text-bone leading-none">
                  $MBP
                </span>
                <span className="font-display text-[8px] tracking-[0.35em] uppercase text-ash/30 mt-1.5">
                  1B Total Supply
                </span>
              </div>
            </div>
          </div>

          {/* Right — Distribution legend */}
          <div className="order-3 space-y-1">
            {SEGMENTS.map((seg, i) => {
              const isActive = activeIdx === i;
              return (
                <div
                  key={seg.label}
                  className={`tok-legend group p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? "bg-white/[0.04] border-moss/15"
                      : "border-transparent hover:bg-white/[0.02]"
                  }`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full transition-shadow duration-300 flex-shrink-0"
                        style={{
                          backgroundColor: seg.color,
                          boxShadow: isActive
                            ? `0 0 10px ${seg.color}90`
                            : "none",
                        }}
                      />
                      <span className="font-display text-[11px] tracking-wider uppercase text-bone/70">
                        {seg.label}
                      </span>
                    </div>
                    <span
                      className="font-beast text-sm transition-colors duration-300"
                      style={{ color: isActive ? seg.color : "#e8dcc8" }}
                    >
                      {seg.pct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-[3px] rounded-full bg-white/[0.04] overflow-hidden ml-5">
                    <div
                      className="tok-bar h-full rounded-full transition-[filter] duration-300"
                      data-target={`${(seg.pct / MAX_PCT) * 100}%`}
                      style={{
                        backgroundColor: seg.color,
                        filter: isActive
                          ? `drop-shadow(0 0 4px ${seg.color}80)`
                          : "none",
                      }}
                    />
                  </div>

                  <div className="ml-5 mt-1">
                    <span className="font-display text-[9px] tracking-wider text-ash/25">
                      {seg.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Trust features ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TRUST.map((feat, i) => (
            <div
              key={feat.label}
              className="tok-trust group flex items-center gap-3 p-4 rounded-lg border border-moss/8 bg-white/[0.015] hover:border-moss/15 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-moss/15 bg-moss/[0.06] flex items-center justify-center text-moss/60 group-hover:text-moss group-hover:border-moss/30 transition-colors duration-300">
                <TrustIcon index={i} />
              </div>
              <div>
                <div className="font-display text-[11px] tracking-wider uppercase text-bone/70 leading-tight">
                  {feat.label}
                </div>
                <div className="font-display text-[9px] tracking-wider text-ash/25 mt-0.5">
                  {feat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
