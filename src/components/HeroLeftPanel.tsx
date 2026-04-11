"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { HeroLeftPanelRefs } from "./heroTypes";

type HeroLeftPanelProps = HeroLeftPanelRefs & {
  scrollToSection: (id: string) => void;
  socials: { label: string; href: string }[];
};

/* ═══════════════════════════════════════════════════════
   Claw Scratches — multi-layer gouged surface effect
   4 layers per scratch: deep glow → shadow → mark → highlight
   + ember sparks + debris marks + hover intensification
   ═══════════════════════════════════════════════════════ */
const CLAW_PATHS = [
  "M8,2 C22,14 45,34 82,58",
  "M17,0 C31,12 53,31 92,55",
  "M26,4 C38,15 58,33 100,56",
];

const DEBRIS = [
  { x1: 32, y1: 18, x2: 38, y2: 23, o: 0.25 },
  { x1: 55, y1: 32, x2: 60, y2: 37, o: 0.2 },
  { x1: 22, y1: 10, x2: 27, y2: 15, o: 0.15 },
  { x1: 70, y1: 42, x2: 74, y2: 46, o: 0.18 },
  { x1: 45, y1: 26, x2: 50, y2: 30, o: 0.12 },
];

const SPARKS = [
  { cx: 80, cy: 56, r: 1.2 },
  { cx: 90, cy: 53, r: 1 },
  { cx: 98, cy: 54, r: 0.8 },
  { cx: 74, cy: 50, r: 0.6 },
  { cx: 86, cy: 48, r: 0.5 },
  { cx: 95, cy: 50, r: 0.7 },
  { cx: 68, cy: 44, r: 0.4 },
];

/* ═══════════════════════════════════════════════════════
   Beast Maw — corner fangs, lurking eyes, heartbeat & roar
   A living layer of micro-interactions bound to the primary
   CTA. Drives a CSS variable --heart via GSAP for a unified
   breath across text glow, edge bar, fang bloom, and eyes.
   ═══════════════════════════════════════════════════════ */
function BeastMaw() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const btn = root.closest(".btn-beast-primary") as HTMLElement | null;
    if (!btn) return;

    const topFangs = root.querySelectorAll<SVGSVGElement>(".fang-tl, .fang-tr");
    const botFangs = root.querySelectorAll<SVGSVGElement>(".fang-bl, .fang-br");
    const fangs = root.querySelectorAll<SVGSVGElement>(".btn-fang");
    const eyes = root.querySelectorAll<HTMLSpanElement>(".btn-eye");
    const textEl = btn.querySelector<HTMLElement>(".btn-text");
    const pawEl = btn.querySelector<HTMLElement>(".btn-paw");
    const trembleTargets = [textEl, pawEl].filter(
      (el): el is HTMLElement => !!el,
    );

    // ── Resting state ──
    gsap.set(topFangs, { transformOrigin: "center top", scaleY: 0.35 });
    gsap.set(botFangs, { transformOrigin: "center bottom", scaleY: 0.35 });
    gsap.set(eyes, {
      opacity: 0.6,
      scale: 1,
      transformOrigin: "center center",
    });

    // ── Heartbeat (lub-dub) drives --heart across child glows ──
    const heartbeat = gsap.timeline({ repeat: -1, delay: 3 });
    heartbeat
      .to(btn, { "--heart": 1, duration: 0.14, ease: "power2.out" })
      .to(btn, { "--heart": 0.15, duration: 0.18, ease: "power2.in" })
      .to(btn, { "--heart": 1.2, duration: 0.12, ease: "power2.out" })
      .to(btn, { "--heart": 0, duration: 0.24, ease: "power2.in" })
      .to({}, { duration: 1.1 });

    // ── Ember-eye blink cycle ──
    const blink = gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 4.5 });
    blink
      .to(eyes, {
        opacity: 0,
        duration: 0.06,
        ease: "power2.in",
        stagger: 0.02,
      })
      .to(eyes, {
        opacity: 0.6,
        duration: 0.12,
        ease: "power2.out",
        stagger: 0.02,
      });

    // ── Growl tremor — beast is restless ──
    const growl = gsap.timeline({ repeat: -1, delay: 6.5 });
    if (trembleTargets.length) {
      growl
        .to(trembleTargets, { x: -1.2, duration: 0.04, ease: "none" })
        .to(trembleTargets, { x: 1.4, duration: 0.04, ease: "none" })
        .to(trembleTargets, { x: -0.9, duration: 0.04, ease: "none" })
        .to(trembleTargets, { x: 0.7, duration: 0.04, ease: "none" })
        .to(trembleTargets, { x: 0, duration: 0.08, ease: "none" })
        .to({}, { duration: 6.4 });
    }

    // ── Hover: fangs snap open, eyes ignite ──
    const onEnter = () => {
      blink.pause();
      gsap.to(fangs, {
        scaleY: 1.12,
        duration: 0.3,
        ease: "back.out(2.8)",
        overwrite: "auto",
      });
      gsap.to(eyes, {
        opacity: 1,
        scale: 1.45,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(fangs, {
        scaleY: 0.35,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(eyes, {
        opacity: 0.6,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          blink.restart();
        },
      });
    };

    // ── Click: fang clamp + roar shockwave rings ──
    const onClick = () => {
      gsap
        .timeline()
        .to(fangs, {
          scaleY: 1.45,
          duration: 0.08,
          ease: "power3.out",
          overwrite: "auto",
        })
        .to(fangs, {
          scaleY: 1.12,
          duration: 0.22,
          ease: "back.out(3)",
        });

      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement("div");
        ring.className = "beast-roar-ring";
        ring.style.left = `${cx}px`;
        ring.style.top = `${cy}px`;
        document.body.appendChild(ring);
        gsap.fromTo(
          ring,
          { scale: 0.35, opacity: 0.9 },
          {
            scale: 3.2 + i * 0.7,
            opacity: 0,
            duration: 0.85 + i * 0.12,
            delay: i * 0.08,
            ease: "power2.out",
            onComplete: () => ring.remove(),
          },
        );
      }
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    btn.addEventListener("click", onClick);

    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("click", onClick);
      heartbeat.kill();
      blink.kill();
      growl.kill();
      gsap.set(btn, { clearProps: "--heart" });
    };
  }, []);

  return (
    <div ref={rootRef} className="btn-maw" aria-hidden>
      {/* Shared fang gradient — bone to scarlet tip */}
      <svg className="btn-maw-defs" width="0" height="0">
        <defs>
          <linearGradient id="btn-fang-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2e6d0" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#a0856a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c0392b" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>

      {/* Corner fangs — bone tips gripping the button like a jaw */}
      <svg
        className="btn-fang fang-tl"
        width="20"
        height="16"
        viewBox="0 0 20 16"
      >
        <path d="M0,0 L20,0 L4,16 Z" />
      </svg>
      <svg
        className="btn-fang fang-tr"
        width="20"
        height="16"
        viewBox="0 0 20 16"
      >
        <path d="M0,0 L20,0 L16,16 Z" />
      </svg>
      <svg
        className="btn-fang fang-bl"
        width="20"
        height="16"
        viewBox="0 0 20 16"
      >
        <path d="M0,16 L20,16 L4,0 Z" />
      </svg>
      <svg
        className="btn-fang fang-br"
        width="20"
        height="16"
        viewBox="0 0 20 16"
      >
        <path d="M0,16 L20,16 L16,0 Z" />
      </svg>

      {/* Ember eyes — coals lurking behind the text */}
      <span className="btn-eye eye-l" />
      <span className="btn-eye eye-r" />
    </div>
  );
}

function ClawScratches() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const btn = svg.closest(".btn-beast-primary");

    const marks = svg.querySelectorAll(".claw-mark");
    const depths = svg.querySelectorAll(".claw-depth");
    const embers = svg.querySelectorAll(".claw-ember");
    const highlights = svg.querySelectorAll(".claw-hi");
    const sparks = svg.querySelectorAll(".claw-spark");
    const debris = svg.querySelectorAll(".claw-debris");

    // Prepare stroke draw-on for all paths
    const allStroked = [...marks, ...depths, ...embers, ...highlights, ...debris];
    allStroked.forEach((el) => {
      const len = (el as SVGGeometryElement).getTotalLength?.() || 80;
      (el as SVGElement).style.strokeDasharray = `${len}`;
      (el as SVGElement).style.strokeDashoffset = `${len}`;
    });

    gsap.set(sparks, { opacity: 0, y: 0 });

    // ── Entrance: scratches rip across ──
    const enterTl = gsap.timeline({ delay: 2.6 });
    enterTl
      .to(depths, {
        strokeDashoffset: 0,
        duration: 0.18,
        stagger: 0.04,
        ease: "power4.out",
      })
      .to(
        marks,
        {
          strokeDashoffset: 0,
          duration: 0.22,
          stagger: 0.04,
          ease: "power3.out",
        },
        "-=0.14",
      )
      .to(
        embers,
        {
          strokeDashoffset: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.18",
      )
      .to(
        highlights,
        {
          strokeDashoffset: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.25",
      )
      .to(
        debris,
        {
          strokeDashoffset: 0,
          duration: 0.15,
          stagger: 0.03,
          ease: "power3.out",
        },
        "-=0.2",
      );

    // ── Idle: ember glow breathes ──
    const breathAnim = gsap.to(embers, {
      opacity: 0.15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
      delay: 3.5,
    });

    const hiBreathe = gsap.to(highlights, {
      opacity: 0.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.25,
      delay: 3.8,
    });

    // ── Idle sparks: subtle drift upward ──
    const sparkTls: gsap.core.Timeline[] = [];
    sparks.forEach((spark, i) => {
      const tl = gsap.timeline({
        repeat: -1,
        delay: 3.8 + i * 0.35,
        repeatDelay: 0.8 + Math.random() * 1.5,
      });
      const rndX = -3 + Math.random() * 6;
      const rndY = -8 - Math.random() * 8;
      tl.set(spark, { opacity: 0, y: 0, x: 0 })
        .to(spark, {
          opacity: 0.5 + Math.random() * 0.3,
          y: rndY * 0.3,
          x: rndX * 0.3,
          duration: 0.25,
          ease: "power1.out",
        })
        .to(spark, {
          opacity: 0,
          y: rndY,
          x: rndX,
          duration: 0.8 + Math.random() * 0.6,
          ease: "power1.out",
        });
      sparkTls.push(tl);
    });

    // ── Hover: scratches glow hotter ──
    const onEnter = () => {
      breathAnim.pause();
      hiBreathe.pause();
      gsap.to(embers, { opacity: 0.85, duration: 0.3, overwrite: "auto" });
      gsap.to(highlights, { opacity: 0.7, duration: 0.3, overwrite: "auto" });
      gsap.to(marks, { opacity: 1, duration: 0.25, overwrite: "auto" });
    };
    const onLeave = () => {
      gsap.to(embers, {
        opacity: 0.5,
        duration: 0.5,
        overwrite: "auto",
        onComplete: () => { breathAnim.restart(); },
      });
      gsap.to(highlights, {
        opacity: 0.35,
        duration: 0.5,
        overwrite: "auto",
        onComplete: () => { hiBreathe.restart(); },
      });
      gsap.to(marks, { opacity: 0.7, duration: 0.5, overwrite: "auto" });
    };

    btn?.addEventListener("mouseenter", onEnter);
    btn?.addEventListener("mouseleave", onLeave);

    return () => {
      btn?.removeEventListener("mouseenter", onEnter);
      btn?.removeEventListener("mouseleave", onLeave);
      enterTl.kill();
      breathAnim.kill();
      hiBreathe.kill();
      sparkTls.forEach((tl) => tl.kill());
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      preserveAspectRatio="none"
      viewBox="0 0 200 60"
    >
      <defs>
        <filter id="claw-ember-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="claw-deep-glow">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Multi-layer claw marks ── */}
      {CLAW_PATHS.map((d, i) => (
        <g key={i}>
          {/* Layer 1 — Deep ember glow (fire beneath torn surface) */}
          <path
            className="claw-ember"
            d={d}
            stroke={`rgba(232,77,14,${0.35 - i * 0.05})`}
            strokeWidth={5.5 - i * 0.8}
            strokeLinecap="round"
            fill="none"
            filter="url(#claw-deep-glow)"
          />
          {/* Layer 2 — Shadow gouge (dark torn edge) */}
          <path
            className="claw-depth"
            d={d}
            stroke={`rgba(10,3,2,${0.75 - i * 0.1})`}
            strokeWidth={3.5 - i * 0.5}
            strokeLinecap="round"
            fill="none"
          />
          {/* Layer 3 — Visible scratch mark */}
          <path
            className="claw-mark"
            d={d}
            stroke={`rgba(139,26,26,${0.7 - i * 0.1})`}
            strokeWidth={2 - i * 0.3}
            strokeLinecap="round"
            fill="none"
          />
          {/* Layer 4 — Hot inner highlight (brightest core) */}
          <path
            className="claw-hi"
            d={d}
            stroke={`rgba(232,77,14,${0.5 - i * 0.1})`}
            strokeWidth={0.7}
            strokeLinecap="round"
            fill="none"
            filter="url(#claw-ember-glow)"
          />
        </g>
      ))}

      {/* ── Debris marks (small chips from the strike) ── */}
      {DEBRIS.map((db, i) => (
        <line
          key={i}
          className="claw-debris"
          x1={db.x1}
          y1={db.y1}
          x2={db.x2}
          y2={db.y2}
          stroke={`rgba(139,26,26,${db.o})`}
          strokeWidth="0.4"
          strokeLinecap="round"
        />
      ))}

      {/* ── Ember sparks (drift upward from scratch exits) ── */}
      {SPARKS.map((sp, i) => (
        <circle
          key={i}
          className="claw-spark"
          cx={sp.cx}
          cy={sp.cy}
          r={sp.r}
          fill="rgba(232,77,14,0.8)"
        />
      ))}
    </svg>
  );
}

export default function HeroLeftPanel({
  badgeRef,
  headlineRef,
  beastWordRef,
  subheadRef,
  taglineRef,
  microcopyRef,
  ctaRef,
  primaryBtnRef,
  primaryCanvasRef,
  outlineBtnRef,
  scrollToSection,
  socials,
}: HeroLeftPanelProps) {
  return (
    <div className="flex flex-col justify-center order-2 lg:order-1">
      <div
        ref={badgeRef}
        className="absolute top-8 left-4 lg:left-0 z-20 hero-float"
        style={{ opacity: 0 }}
      ></div>

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

      <p
        ref={subheadRef}
        className="font-display text-lg sm:text-xl text-sky-ice/90 mb-4 uppercase tracking-widest font-semibold"
        style={{ opacity: 0 }}
      >
        Half Man. Half Bear. Half Pig.
        <span className="text-scarlet font-bold"> 100% Chaos.</span>
      </p>

      <p
        ref={taglineRef}
        className="font-body text-base text-ash mb-2 italic max-w-sm"
        style={{ opacity: 0 }}
      >
        &ldquo;A savage meme forged in the wild.&rdquo;
      </p>

      <p
        ref={microcopyRef}
        className="font-display text-xs tracking-[0.25em] uppercase text-moss mb-8"
        style={{ opacity: 0 }}
      >
        Not a man. Not a bear. Not a pig.{" "}
        <span className="text-bone font-bold">A force.</span>
      </p>

      <div ref={ctaRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
        <button
          ref={primaryBtnRef}
          className="btn-beast btn-beast-primary"
          onClick={() => scrollToSection("#summon")}
        >
          <ClawScratches />
          <span className="btn-edge-bar" />
          <canvas ref={primaryCanvasRef} className="btn-ember-canvas" />
          <BeastMaw />
          <span className="btn-paw">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="7" cy="5" rx="2.5" ry="3" />
              <ellipse cx="17" cy="5" rx="2.5" ry="3" />
              <ellipse cx="3.5" cy="11" rx="2" ry="2.5" />
              <ellipse cx="20.5" cy="11" rx="2" ry="2.5" />
              <path d="M12 22c-4 0-7-3-7-6.5S8 10 12 10s7 2 7 5.5S16 22 12 22z" />
            </svg>
          </span>
          <span className="btn-text">Buy $MBP</span>
        </button>

        <button
          ref={outlineBtnRef}
          className="btn-beast btn-beast-outline"
          onClick={() => scrollToSection("#lore")}
        >
          <span className="btn-text">$MBP Origin</span>
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display tracking-wider uppercase text-ash/70 hover:text-scarlet transition-all duration-300 border-b border-ash/20 hover:border-scarlet pb-0.5 hover:pb-1"
            >
              {social.label}
            </a>
          ))}
        </div>
        <span className="text-ash/30">·</span>
        <span className="text-xs text-ash/40 font-display tracking-wider">
          BUILT ON SUI
        </span>
      </div>
    </div>
  );
}
