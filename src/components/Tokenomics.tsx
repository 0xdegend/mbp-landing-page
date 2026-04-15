"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchBurnData } from "@/lib/api/burn";
import { fetchCoinData } from "@/lib/api/coin";
import { Aftermath } from "aftermath-ts-sdk";
gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   Token distribution
   ───────────────────────────────────────────────────────
   Burned %  → pulled live from /api/burn (same source as
               BurnComponent)
   Circulating = 100 − burned − LP − staked (derived)
   LP & Staked are fixed project-level allocations that
   do not update from on-chain data.
   ═══════════════════════════════════════════════════════ */
const TOTAL_SUPPLY = 1_000_000_000;
const FALLBACK_BURNED = 183_120_000;
const LP_PCT = 13.75;
const STAKED_PCT = 5.4;
const FALLBACK_COIN_DECIMALS = 9;
const AFTERMATH_POOL_ID =
  "0xf09c59df4f57add24e73037a2a920e7d5c8bf6e0ae819f53e397c504cf230d25";

type SegmentMeta = {
  key: "lp" | "burned" | "circulating" | "staked";
  label: string;
  color: string;
  desc: string;
};

const SEGMENT_META: SegmentMeta[] = [
  {
    key: "lp",
    label: "Liquidity Pool",
    color: "#4a7c59",
    desc: "Locked & secured",
  },
  {
    key: "burned",
    label: "Burned",
    color: "#c0392b",
    desc: "Permanently removed",
  },
  {
    key: "circulating",
    label: "Circulating Supply",
    color: "#7ec8e3",
    desc: "Current Circulating Supply",
  },
  {
    key: "staked",
    label: "Staked",
    color: "#e84d0e",
    desc: "Staked by the community",
  },
];

const TRUST = [
  { label: "LP Locked", sub: "Liquidity secured" },
  { label: "No Mint", sub: "Fixed supply forever" },
  { label: "No Team Allocation", sub: "All fair launch" },
  { label: "Zero Tax", sub: "0% buy and sell" },
];

/* ── Ring geometry ── */
const R = 110;
const CIRC = 2 * Math.PI * R;
const SW = 26;
const GAP = 4;

type Segment = SegmentMeta & { pct: number };
type SegmentGeo = Segment & { startAngle: number; segLen: number };

/** Build the four live segments from the current burn % */
function buildSegments(burnPct: number, stakedPct: number): Segment[] {
  // Clamp so rounding noise can't produce a negative circulating slice
  const circulatingPct = Math.max(0, 100 - burnPct - LP_PCT - stakedPct);
  const pcts: Record<SegmentMeta["key"], number> = {
    lp: LP_PCT,
    burned: burnPct,
    circulating: circulatingPct,
    staked: stakedPct,
  };
  return SEGMENT_META.map((m) => ({ ...m, pct: pcts[m.key] }));
}

/** Compute start angles and dash lengths for each segment */
function buildSegGeo(segments: Segment[]): SegmentGeo[] {
  return segments.map((seg, i) => {
    const prev = segments.slice(0, i).reduce((s, x) => s + x.pct, 0);
    return {
      ...seg,
      startAngle: -90 + (prev / 100) * 360,
      segLen: (seg.pct / 100) * CIRC - GAP,
    };
  });
}

function formatUnits(value: bigint, decimals: number) {
  const zero = BigInt(0);
  const negative = value < zero;
  const abs = negative ? zero - value : value;
  const base = BigInt(10) ** BigInt(decimals);
  const whole = abs / base;
  const fraction = abs % base;

  if (decimals === 0) {
    return `${negative ? "-" : ""}${whole.toString()}`;
  }

  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return `${negative ? "-" : ""}${whole.toString()}${fractionStr ? `.${fractionStr}` : ""}`;
}

function formatCompactAmount(value: bigint, decimals: number) {
  const numeric = Number(formatUnits(value, decimals));
  if (!Number.isFinite(numeric)) return formatUnits(value, decimals);

  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(numeric);
}

function ratioToPercent(numerator: bigint, denominator: bigint, precision = 2) {
  if (denominator === BigInt(0)) return 0;

  const scale = BigInt(10) ** BigInt(precision);
  const scaled = (numerator * BigInt(100) * scale) / denominator;
  const whole = scaled / scale;
  const fraction = scaled % scale;
  return Number(
    `${whole.toString()}.${fraction.toString().padStart(precision, "0")}`,
  );
}

/* ── Magnetic tilt helpers (reused for stat + trust cards) ── */
function handleTilt(e: ReactMouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to(el, {
    rotateY: x * 6,
    rotateX: y * -6,
    duration: 0.35,
    ease: "power2.out",
    overwrite: "auto",
  });
}

function handleTiltLeave(e: ReactMouseEvent<HTMLDivElement>) {
  gsap.to(e.currentTarget, {
    rotateY: 0,
    rotateX: 0,
    duration: 0.7,
    ease: "elastic.out(1, 0.4)",
    overwrite: "auto",
  });
}

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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const centerDefaultRef = useRef<HTMLDivElement>(null);
  const centerHoverRef = useRef<HTMLDivElement>(null);
  const centerHoverValRef = useRef<HTMLSpanElement>(null);
  const centerHoverLabelRef = useRef<HTMLSpanElement>(null);
  const tickGroupRef = useRef<SVGGElement>(null);
  const shimmerRef = useRef<SVGCircleElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const pulseOuterRef = useRef<SVGCircleElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [burned, setBurned] = useState<number>(FALLBACK_BURNED);
  const [coinDecimals, setCoinDecimals] = useState<number>(
    FALLBACK_COIN_DECIMALS,
  );
  const [stakedPct, setStakedPct] = useState<number>(STAKED_PCT);
  const [stakedAmountLabel, setStakedAmountLabel] = useState<string>("—");

  const handleStakedAmount = useCallback(async () => {
    try {
      const af = new Aftermath("MAINNET");
      await af.init();

      const farms = af.Farms();
      const allFarms = await farms.getAllStakingPools();
      const myFarm = allFarms.find(
        (farm) => farm.stakingPool.objectId === AFTERMATH_POOL_ID,
      );

      const stakedAmount = myFarm?.stakingPool.stakedAmount;
      if (stakedAmount === undefined) {
        setStakedAmountLabel("Unavailable");
        setStakedPct(STAKED_PCT);
        return;
      }

      const supplyInSmallestUnits =
        BigInt(TOTAL_SUPPLY) * BigInt(10) ** BigInt(coinDecimals);
      const stakedPctOfSupply = ratioToPercent(
        stakedAmount,
        supplyInSmallestUnits,
        2,
      );

      setStakedAmountLabel(
        `${formatCompactAmount(stakedAmount, coinDecimals)} MBP`,
      );
      setStakedPct(stakedPctOfSupply);
    } catch (error) {
      setStakedAmountLabel("Unavailable");
      setStakedPct(STAKED_PCT);
    }
  }, [coinDecimals]);

  /* ── Fetch live burn data (shared source with BurnComponent) ── */
  useEffect(() => {
    const controller = new AbortController();
    fetchBurnData(controller.signal).then((result) => {
      if (result.ok) {
        setBurned(result.data.balance);
      } else if (result.error !== "aborted") {
        // eslint-disable-next-line no-console
        console.warn("[Tokenomics] burn fetch failed:", result.error);
      }
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCoinData(controller.signal).then((result) => {
      if (result.ok && typeof result.data.decimals === "number") {
        setCoinDecimals(result.data.decimals);
      }
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    void handleStakedAmount();
  }, [handleStakedAmount]);

  /* ── Derived live distribution ── */
  const burnPct = (burned / TOTAL_SUPPLY) * 100;
  const segments = useMemo(
    () => buildSegments(burnPct, stakedPct),
    [burnPct, stakedPct],
  );
  const segGeo = useMemo(() => buildSegGeo(segments), [segments]);
  const maxPct = useMemo(
    () => Math.max(...segments.map((s) => s.pct)),
    [segments],
  );
  // Circulating tokens = total − burned − LP − staked.
  // LP & staked are expressed as percentages of total supply, so
  // multiply by (TOTAL_SUPPLY / 100) to get their token counts.
  const circulatingTokens = useMemo(() => {
    const lpTokens = (LP_PCT / 100) * TOTAL_SUPPLY;
    const stakedTokens = (stakedPct / 100) * TOTAL_SUPPLY;
    return Math.max(0, TOTAL_SUPPLY - burned - lpTokens - stakedTokens);
  }, [burned, stakedPct]);

  const keyStats: {
    label: string;
    value: string;
    sub: string;
    target: number | null;
  }[] = useMemo(
    () => [
      {
        label: "Total Supply",
        value: "1,000,000,000",
        sub: "$MBP tokens",
        target: TOTAL_SUPPLY,
      },
      {
        label: "Circulating",
        value: Math.round(circulatingTokens).toLocaleString(),
        sub: "Available supply",
        target: Math.round(circulatingTokens),
      },
      {
        label: "Buy / Sell Tax",
        value: "0% / 0%",
        sub: "Zero-tax trading",
        target: null,
      },
    ],
    [circulatingTokens],
  );

  /* ── Entrance + idle animations ── */
  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      const segs = section.querySelectorAll<SVGCircleElement>(".ring-seg");
      const bars = section.querySelectorAll<HTMLDivElement>(".tok-bar");
      const chars = titleRef.current?.querySelectorAll(".tok-char");
      const statValues =
        section.querySelectorAll<HTMLDivElement>(".tok-stat-value");
      const trustStrokes = section.querySelectorAll<SVGGeometryElement>(
        ".tok-trust svg path, .tok-trust svg line, .tok-trust svg rect, .tok-trust svg circle, .tok-trust svg polyline",
      );
      const particles =
        section.querySelectorAll<HTMLDivElement>(".tok-particle");

      /* ── Initial states ── */
      segs.forEach((seg, i) => {
        gsap.set(seg, { strokeDashoffset: segGeo[i].segLen });
      });
      gsap.set(bars, { width: "0%" });

      // Prep trust icon strokes for draw-on
      trustStrokes.forEach((el) => {
        try {
          const len = el.getTotalLength?.() || 50;
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        } catch {
          /* noop */
        }
      });

      /* ── Constellation particles (bg ambiance) ── */
      particles.forEach((p, i) => {
        const startX = 8 + Math.random() * 84;
        const startY = 8 + Math.random() * 84;
        gsap.set(p, {
          left: `${startX}%`,
          top: `${startY}%`,
          opacity: 0,
        });
        gsap.to(p, {
          opacity: 0.15 + Math.random() * 0.25,
          duration: 2 + Math.random() * 2,
          delay: 0.5 + i * 0.2,
          ease: "sine.inOut",
        });
        gsap.to(p, {
          x: (Math.random() - 0.5) * 140,
          y: (Math.random() - 0.5) * 140,
          duration: 12 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });

      /* ── Slow idle rotation on outer tick marks ── */
      if (tickGroupRef.current) {
        gsap.to(tickGroupRef.current, {
          rotation: 360,
          transformOrigin: "150px 150px",
          duration: 180,
          repeat: -1,
          ease: "none",
        });
      }

      /* ═══ Master scroll-triggered timeline ═══ */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      /* Header accent + paragraph */
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

      /* Ring segments draw on immediately after entry */
      segs.forEach((seg, i) => {
        tl.to(
          seg,
          {
            strokeDashoffset: 0,
            duration: 0.12 + segGeo[i].pct * 0.0018,
            ease: "power3.out",
          },
          i === 0 ? "<+=0.02" : "<+=0.03",
        );
      });

      /* Shimmer sweep around ring after segments are drawn */
      if (shimmerRef.current) {
        const shimmer = shimmerRef.current;
        tl.set(shimmer, { strokeDashoffset: 0, opacity: 0 }, ">-0.15");
        tl.to(
          shimmer,
          { opacity: 0.55, duration: 0.08, ease: "power2.out" },
          ">",
        );
        tl.to(
          shimmer,
          { strokeDashoffset: -CIRC, duration: 0.55, ease: "power2.out" },
          "<",
        );
        tl.to(
          shimmer,
          { opacity: 0, duration: 0.15, ease: "power2.out" },
          ">-0.2",
        );
      }

      /* Title characters — 3D tumble in */
      if (chars && chars.length) {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        tl.fromTo(
          chars,
          {
            opacity: 0,
            y: isMobile ? 18 : 34,
            scale: 0.985,
            rotateX: isMobile ? 0 : -22,
            transformPerspective: 800,
            transformOrigin: "50% 100%",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: isMobile ? 0.9 : 1.05,
            stagger: 0.025,
            ease: "power3.out",
            force3D: true,
            immediateRender: false,
          },
          "-=0.4",
        );
      }

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
        "-=0.3",
      );

      /* Counter roll-up on numeric stats — sync with stats slide */
      statValues.forEach((el) => {
        const target = parseFloat(el.dataset.target || "");
        if (!target || isNaN(target)) return;
        const obj = { val: 0 };
        tl.to(
          obj,
          {
            val: target,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.floor(obj.val).toLocaleString();
            },
          },
          "-=0.6",
        );
      });

      /* Center label — crack in */
      tl.fromTo(
        ".tok-center",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          immediateRender: false,
        },
        "-=0.6",
      );

      /* Tick marks fade in */
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
          { width: bar.dataset.target, duration: 0.42, ease: "power2.out" },
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
          duration: 0.32,
          stagger: 0.06,
          ease: "power3.out",
          immediateRender: false,
        },
        "-=0.2",
      );

      /* Trust icon strokes draw on */
      if (trustStrokes.length) {
        tl.to(
          trustStrokes,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.02,
            ease: "power3.out",
          },
          "-=0.25",
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Active segment swap: center text + pulse ring ── */
  useEffect(() => {
    if (!centerDefaultRef.current || !centerHoverRef.current) return;

    if (activeIdx === null) {
      gsap.to(centerDefaultRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(centerHoverRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
      return;
    }

    const seg = segments[activeIdx];

    if (centerHoverValRef.current) {
      centerHoverValRef.current.textContent = `${seg.pct.toFixed(2)}%`;
      centerHoverValRef.current.style.color = seg.color;
    }
    if (centerHoverLabelRef.current) {
      centerHoverLabelRef.current.textContent = seg.label;
    }

    gsap.to(centerDefaultRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.fromTo(
      centerHoverRef.current,
      { opacity: 0, y: -12, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.6)",
        overwrite: "auto",
      },
    );

    /* Concentric pulse rings emit from center */
    if (pulseRef.current) {
      pulseRef.current.style.stroke = seg.color;
      gsap.fromTo(
        pulseRef.current,
        { attr: { r: R - 4 }, opacity: 0.75, strokeWidth: 3 },
        {
          attr: { r: R + 38 },
          opacity: 0,
          strokeWidth: 0.5,
          duration: 1.1,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }
    if (pulseOuterRef.current) {
      pulseOuterRef.current.style.stroke = seg.color;
      gsap.fromTo(
        pulseOuterRef.current,
        { attr: { r: R - 4 }, opacity: 0.4, strokeWidth: 2 },
        {
          attr: { r: R + 60 },
          opacity: 0,
          strokeWidth: 0.5,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.15,
          overwrite: "auto",
        },
      );
    }
  }, [activeIdx, segments]);

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

      {/* Constellation particles */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={`p-${i}`}
          className="tok-particle absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background:
              i % 3 === 0
                ? "rgba(192,57,43,0.5)"
                : i % 3 === 1
                  ? "rgba(74,124,89,0.5)"
                  : "rgba(232,220,200,0.4)",
            boxShadow: "0 0 8px currentColor",
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="tok-reveal mb-4 inline-flex items-center gap-2 rounded-sm border border-moss/15 bg-moss/[0.06] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-scarlet" />
            </span>
            <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/60">
              $MBP Distribution
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-beast text-5xl lg:text-7xl xl:text-8xl leading-[0.9] mb-4"
            style={{ perspective: 800 }}
          >
            <span
              className="inline-block text-bone"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {"TOKE".split("").map((ch, i) => (
                <span
                  key={`t-${i}`}
                  className="tok-char inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span
              className="inline-block"
              style={{
                transformStyle: "preserve-3d",
                WebkitTextStroke: "2px #c0392b",
                color: "transparent",
                textShadow:
                  "0 0 30px rgba(192,57,43,0.2), 0 0 60px rgba(192,57,43,0.1)",
                backfaceVisibility: "hidden",
              }}
            >
              {"NOMICS".split("").map((ch, i) => (
                <span
                  key={`n-${i}`}
                  className="tok-char inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h2>

          <p className="tok-reveal font-display text-sm tracking-[0.2em] uppercase text-ash/40 max-w-md mx-auto">
            A savage allocation. Transparent. Immutable. Built for the pack.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-[260px_1fr_280px] gap-8 lg:gap-12 items-center mb-16 lg:mb-24">
          {/* Left — Key stats */}
          <div
            className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3"
            style={{ perspective: 700 }}
          >
            {keyStats.map((stat) => (
              <div
                key={stat.label}
                onMouseMove={handleTilt}
                onMouseLeave={handleTiltLeave}
                className="tok-stat group p-4 lg:p-5 rounded-lg bg-white/[0.02] border border-transparent hover:border-moss/15 hover:bg-white/[0.04] transition-[background-color,border-color] duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="font-display text-[9px] tracking-[0.25em] uppercase text-ash/35 mb-2 group-hover:text-moss/70 transition-colors duration-300">
                  {stat.label}
                </div>
                <div
                  className="tok-stat-value font-beast text-lg lg:text-2xl text-bone leading-none mb-1 tabular-nums"
                  data-target={stat.target ?? ""}
                >
                  {stat.target ? "0" : stat.value}
                </div>
                <div className="font-display text-[9px] tracking-wider text-ash/25 hidden lg:block">
                  {stat.sub}
                </div>
              </div>
            ))}

            <div className="tok-stat group p-4 lg:p-5 rounded-lg bg-scarlet/[0.06] border border-scarlet/15 hover:border-scarlet/25 hover:bg-scarlet/[0.08] transition-[background-color,border-color] duration-300">
              <div className="font-display text-[9px] tracking-[0.25em] uppercase text-scarlet/70 mb-2 group-hover:text-scarlet transition-colors duration-300">
                Staked MBP
              </div>
              <div className="font-beast text-lg lg:text-2xl text-bone leading-none mb-1 tabular-nums">
                {stakedAmountLabel}
              </div>
              <div className="font-display text-[9px] tracking-wider text-ash/25 hidden lg:block">
                {stakedPct.toFixed(2)}% of supply
              </div>
            </div>
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

                {/* Tick marks — slowly rotating (rounded to avoid hydration drift) */}
                <g className="tok-tick" ref={tickGroupRef}>
                  {Array.from({ length: 60 }, (_, i) => {
                    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                    const major = i % 5 === 0;
                    const r1 = R + SW / 2 + 4;
                    const r2 = r1 + (major ? 8 : 4);
                    return (
                      <line
                        key={i}
                        x1={(150 + Math.cos(a) * r1).toFixed(3)}
                        y1={(150 + Math.sin(a) * r1).toFixed(3)}
                        x2={(150 + Math.cos(a) * r2).toFixed(3)}
                        y2={(150 + Math.sin(a) * r2).toFixed(3)}
                        stroke={`rgba(74,124,89,${major ? 0.2 : 0.07})`}
                        strokeWidth={major ? "1" : "0.5"}
                      />
                    );
                  })}
                </g>

                {/* Pulse rings (emit on segment hover) */}
                <circle
                  ref={pulseOuterRef}
                  cx="150"
                  cy="150"
                  r={R}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="1"
                  pointerEvents="none"
                  style={{ opacity: 0 }}
                />
                <circle
                  ref={pulseRef}
                  cx="150"
                  cy="150"
                  r={R}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="1"
                  pointerEvents="none"
                  style={{ opacity: 0 }}
                />

                {/* Segments */}
                {segGeo.map((d, i) => (
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

                {/* Shimmer sweep overlay (post-draw highlight pass) */}
                <circle
                  ref={shimmerRef}
                  cx="150"
                  cy="150"
                  r={R}
                  fill="none"
                  stroke="rgba(232,220,200,0.9)"
                  strokeWidth={SW}
                  strokeDasharray={`12 ${CIRC - 12}`}
                  strokeLinecap="butt"
                  transform="rotate(-90 150 150)"
                  pointerEvents="none"
                  style={{ opacity: 0, mixBlendMode: "overlay" }}
                />

                {/* Segment boundary dots */}
                {segGeo.map((d, i) => {
                  const a = ((d.startAngle + 90) * Math.PI) / 180 - Math.PI / 2;
                  return (
                    <circle
                      key={`dot-${i}`}
                      cx={(150 + Math.cos(a) * R).toFixed(3)}
                      cy={(150 + Math.sin(a) * R).toFixed(3)}
                      r="2"
                      fill="rgba(10,13,8,0.9)"
                      stroke="rgba(74,124,89,0.15)"
                      strokeWidth="0.5"
                      pointerEvents="none"
                    />
                  );
                })}
              </svg>

              {/* Center overlay — default + hover states */}
              <div className="tok-center absolute inset-0 pointer-events-none">
                <div
                  ref={centerDefaultRef}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span className="font-beast text-3xl lg:text-4xl text-bone leading-none">
                    $MBP
                  </span>
                  <span className="font-display text-[8px] tracking-[0.35em] uppercase text-ash/30 mt-1.5">
                    1B Total Supply
                  </span>
                </div>
                <div
                  ref={centerHoverRef}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ opacity: 0 }}
                >
                  <span
                    ref={centerHoverValRef}
                    className="font-beast text-5xl lg:text-6xl leading-none tabular-nums text-bone"
                  >
                    50%
                  </span>
                  <span
                    ref={centerHoverLabelRef}
                    className="font-display text-[10px] tracking-[0.3em] uppercase text-ash/50 mt-2 text-center max-w-[140px]"
                  >
                    Liquidity Pool
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Distribution legend */}
          <div className="order-3 space-y-1">
            {segments.map((seg, i) => {
              const isActive = activeIdx === i;
              return (
                <div
                  key={seg.label}
                  className={`tok-legend group relative p-3 rounded-lg cursor-pointer transition-colors duration-300 border overflow-hidden ${
                    isActive
                      ? "bg-white/[0.04] border-moss/15"
                      : "border-transparent hover:bg-white/[0.02]"
                  }`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  {/* Hover sweep */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      background: `linear-gradient(90deg, transparent 0%, ${seg.color}12 50%, transparent 100%)`,
                    }}
                  />

                  <div className="relative flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full transition-shadow duration-300 flex-shrink-0"
                        style={{
                          backgroundColor: seg.color,
                          boxShadow: isActive
                            ? `0 0 12px ${seg.color}, 0 0 4px ${seg.color}`
                            : "none",
                        }}
                      />
                      <span
                        className="font-display text-[11px] tracking-wider uppercase transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "rgba(232,220,200,0.95)"
                            : "rgba(232,220,200,0.7)",
                        }}
                      >
                        {seg.label}
                      </span>
                    </div>
                    <span
                      className="font-beast text-sm tabular-nums transition-colors duration-300"
                      style={{ color: isActive ? seg.color : "#e8dcc8" }}
                    >
                      {seg.pct.toFixed(2)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-[3px] rounded-full bg-white/[0.04] overflow-hidden ml-5">
                    <div
                      className="tok-bar h-full rounded-full transition-[filter] duration-300"
                      data-target={`${(seg.pct / maxPct) * 100}%`}
                      style={{
                        backgroundColor: seg.color,
                        filter: isActive
                          ? `drop-shadow(0 0 5px ${seg.color})`
                          : "none",
                      }}
                    />
                  </div>

                  <div className="relative ml-5 mt-1">
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
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          style={{ perspective: 700 }}
        >
          {TRUST.map((feat, i) => (
            <div
              key={feat.label}
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltLeave}
              className="tok-trust group flex items-center gap-3 p-4 rounded-lg bg-white/[0.015] border border-transparent hover:border-moss/15 hover:bg-white/[0.03] transition-[background-color,border-color] duration-300"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-moss/15 bg-moss/[0.06] flex items-center justify-center text-moss/60 group-hover:text-moss group-hover:border-moss/30 group-hover:bg-moss/[0.12] transition-colors duration-300">
                <TrustIcon index={i} />
              </div>
              <div>
                <div className="font-display text-[11px] tracking-wider uppercase text-bone/70 leading-tight group-hover:text-bone transition-colors duration-300">
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
