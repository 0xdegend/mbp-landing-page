"use client";
import { useCallback, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CONTRACT_ADDRESS =
  "0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP";

/* Middle-truncate long addresses: 0x4d68a38f...9692cd1129d25::mbp::MBP */
function truncateMiddle(addr: string, head = 10, tail = 18) {
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

const HOLD_DURATION = 1.6;

/* Progress circle geometry for the summon ritual */
const HOLD_R = 58;
const HOLD_CIRC = 2 * Math.PI * HOLD_R;

/* ── Magnetic tilt (shared vocab) ── */
function handleTilt(e: ReactMouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to(el, {
    rotateY: x * 7,
    rotateX: y * -7,
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

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const holdTweenRef = useRef<gsap.core.Tween | null>(null);
  const holdStateRef = useRef({ p: 0 });
  const summonedRef = useRef(false);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const copyLabelRef = useRef<HTMLSpanElement>(null);
  const copyRippleRef = useRef<HTMLSpanElement>(null);
  const addressCardRef = useRef<HTMLDivElement>(null);
  const copyResetRef = useRef<number | null>(null);
  const standingImageRef = useRef<HTMLDivElement>(null);

  const [summoned, setSummoned] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ═══ Entrance animations ═══ */
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;

      /* Title characters tumble in */
      const chars = titleRef.current?.querySelectorAll(".cta-char");
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { opacity: 0, y: 100, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.04,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      /* Reveal elements */
      gsap.fromTo(
        ".cta-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        },
      );

      /* Video frame slides in + corners draw */
      gsap.fromTo(
        videoFrameRef.current,
        { opacity: 0, x: 60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: videoFrameRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".cta-corner",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: videoFrameRef.current,
            start: "top 85%",
            once: true,
          },
          delay: 0.4,
        },
      );

      /* ── Video stays dormant until the summon ritual fires ── */
      // The video is preloaded but paused. The standing-beast image is
      // layered over it. When triggerSummon runs, we crossfade the image
      // out and call video.play() — see triggerSummon below.

      /* Refresh ScrollTrigger once layout fully settles */
      if (document.readyState === "complete") {
        ScrollTrigger.refresh();
      } else {
        window.addEventListener("load", () => ScrollTrigger.refresh(), {
          once: true,
        });
      }

      /* Initialize elements that GSAP will own to avoid React/GSAP style conflicts */
      gsap.set(".cta-spark", { opacity: 0, x: 0, y: 0, scale: 1 });
      if (videoFrameRef.current) {
        gsap.set(videoFrameRef.current, {
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(74,124,89,0.12), inset 0 0 0 1px rgba(232,220,200,0.04)",
        });
      }

      /* Idle: central glow pulse */
      gsap.to(".cta-glow", {
        scale: 1.12,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* Idle: scan line drift on video */
      gsap.to(".cta-scanlines", {
        backgroundPositionY: "+=8",
        duration: 1.2,
        repeat: -1,
        ease: "none",
      });

      /* Ambient particles */
      section
        .querySelectorAll<HTMLDivElement>(".cta-particle")
        .forEach((p, i) => {
          gsap.set(p, {
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0,
          });
          gsap.to(p, {
            opacity: 0.2 + Math.random() * 0.3,
            duration: 2 + Math.random() * 2,
            delay: i * 0.2,
            ease: "sine.inOut",
          });
          gsap.to(p, {
            x: (Math.random() - 0.5) * 220,
            y: (Math.random() - 0.5) * 220,
            duration: 14 + Math.random() * 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3,
          });
        });

      /* Rising embers */
      section.querySelectorAll<HTMLDivElement>(".cta-ember").forEach((e, i) => {
        gsap.set(e, {
          left: `${Math.random() * 100}%`,
          bottom: "-10px",
          opacity: 0,
        });
        gsap.to(e, {
          y: -window.innerHeight * 0.9,
          x: (Math.random() - 0.5) * 60,
          opacity: 0.7,
          duration: 6 + Math.random() * 3,
          delay: i * 0.4,
          repeat: -1,
          ease: "sine.out",
        });
      });

      /* Init progress ring */
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDasharray = `${HOLD_CIRC}`;
        progressCircleRef.current.style.strokeDashoffset = `${HOLD_CIRC}`;
      }

      /* Idle breathing on the dormant standing image — subtle slow pulse */
      if (standingImageRef.current) {
        gsap.to(standingImageRef.current, {
          scale: 1.015,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: sectionRef },
  );

  /* ═══ Summon burst — fires when hold ritual completes ═══ */
  const triggerSummon = useCallback(() => {
    if (summonedRef.current) return;
    summonedRef.current = true;
    setSummoned(true);

    /* Section shake — amplified */
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { x: 0, y: 0 },
        {
          keyframes: [
            { x: -16, y: 8, duration: 0.05 },
            { x: 16, y: -8, duration: 0.05 },
            { x: -12, y: 6, duration: 0.05 },
            { x: 12, y: -6, duration: 0.05 },
            { x: -6, y: 3, duration: 0.05 },
            { x: 0, y: 0, duration: 0.05 },
          ],
          overwrite: "auto",
        },
      );
    }

    /* Video boost + scarlet rim glow */
    if (videoFrameRef.current) {
      gsap.to(videoFrameRef.current, {
        filter: "brightness(1.2) saturate(1.35) contrast(1.08)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(videoFrameRef.current, {
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(192,57,43,0.7), 0 0 120px rgba(192,57,43,0.55), 0 0 60px rgba(232,77,14,0.4)",
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    /* ── Awaken: start the video and crossfade the standing image out ── */
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
    if (standingImageRef.current) {
      // Kill the idle breathing tween so it can't fight our fade
      gsap.killTweensOf(standingImageRef.current);
      gsap.to(standingImageRef.current, {
        opacity: 0,
        scale: 1.08,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    /* Burst the chaos embers faster for a moment */
    const embers = sectionRef.current?.querySelectorAll(".cta-ember");
    if (embers && embers.length) {
      gsap.to(embers, {
        opacity: 1,
        duration: 0.3,
        overwrite: "auto",
      });
    }

    /* Glow flash — kill idle pulse and replace */
    gsap.killTweensOf(".cta-glow");
    gsap.fromTo(
      ".cta-glow",
      { opacity: 0.4, scale: 1 },
      {
        opacity: 1,
        scale: 1.5,
        duration: 0.45,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Restart the idle pulse after the flash
          gsap.to(".cta-glow", {
            scale: 1.12,
            opacity: 0.8,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      },
    );

    /* Emit burst sparks from hold button */
    const sparks = sectionRef.current?.querySelectorAll(".cta-spark");
    if (sparks && sparks.length) {
      sparks.forEach((spark, i) => {
        const angle = (i / sparks.length) * Math.PI * 2;
        const dist = 130 + Math.random() * 90;
        gsap.fromTo(
          spark,
          { x: 0, y: 0, opacity: 1, scale: 1.4 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            opacity: 0,
            scale: 0.2,
            duration: 1 + Math.random() * 0.3,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      });
    }
  }, []);

  /* ═══ Hold-to-summon ritual ═══ */
  const startHold = useCallback(() => {
    if (summonedRef.current) return;
    setIsHolding(true);

    holdTweenRef.current?.kill();
    holdTweenRef.current = gsap.to(holdStateRef.current, {
      p: 1,
      duration: HOLD_DURATION * (1 - holdStateRef.current.p),
      ease: "power1.in",
      onUpdate: () => {
        if (progressCircleRef.current) {
          progressCircleRef.current.style.strokeDashoffset = `${HOLD_CIRC * (1 - holdStateRef.current.p)}`;
        }
      },
      onComplete: () => {
        triggerSummon();
      },
    });
  }, [triggerSummon]);

  const endHold = useCallback(() => {
    setIsHolding(false);
    if (summonedRef.current) return;

    holdTweenRef.current?.kill();
    holdTweenRef.current = gsap.to(holdStateRef.current, {
      p: 0,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        if (progressCircleRef.current) {
          progressCircleRef.current.style.strokeDashoffset = `${HOLD_CIRC * (1 - holdStateRef.current.p)}`;
        }
      },
    });
  }, []);

  /* ═══ Copy CA — optimistic UI + GSAP micro-interactions ═══ */
  const handleCopy = useCallback(() => {
    // Fire clipboard write in the background (do NOT await — feedback must be instant)
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(CONTRACT_ADDRESS).catch(() => {});
    }

    setCopied(true);
    if (copyResetRef.current !== null) {
      window.clearTimeout(copyResetRef.current);
    }

    /* Button bounce + border flash */
    if (copyBtnRef.current) {
      gsap.fromTo(
        copyBtnRef.current,
        { scale: 0.92 },
        {
          scale: 1,
          duration: 0.55,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        },
      );
      gsap.fromTo(
        copyBtnRef.current,
        { boxShadow: "0 0 0 0 rgba(74,124,89,0.65)" },
        {
          boxShadow: "0 0 0 8px rgba(74,124,89,0)",
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }

    /* Ripple pulse expanding out of the button */
    if (copyRippleRef.current) {
      gsap.fromTo(
        copyRippleRef.current,
        { scale: 0, opacity: 0.55 },
        {
          scale: 2.6,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }

    /* Label pop: rotate in from below with back easing */
    if (copyLabelRef.current) {
      gsap.fromTo(
        copyLabelRef.current,
        { y: 10, opacity: 0, rotateX: -80 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.45,
          ease: "back.out(2.2)",
          overwrite: "auto",
        },
      );
    }

    /* Address card brief moss-green glow */
    if (addressCardRef.current) {
      gsap.fromTo(
        addressCardRef.current,
        { boxShadow: "0 0 0 1px rgba(74,124,89,0.5), 0 0 24px rgba(74,124,89,0.35)" },
        {
          boxShadow: "0 0 0 1px rgba(74,124,89,0), 0 0 0 rgba(74,124,89,0)",
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    }

    /* Revert label after a beat */
    copyResetRef.current = window.setTimeout(() => {
      setCopied(false);
      if (copyLabelRef.current) {
        gsap.fromTo(
          copyLabelRef.current,
          { y: -6, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      }
    }, 1400);
  }, []);

  return (
    <section
      id="summon"
      ref={sectionRef}
      className="relative py-24 lg:py-32 min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#0d1a0e] via-[#0a0d08] to-[#050705]"
    >
      {/* ── Background layers ── */}
      <div
        className="cta-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 900,
          background:
            "radial-gradient(circle, rgba(192,57,43,0.16) 0%, rgba(232,77,14,0.06) 35%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      />

      {/* Grid overlay — subtle blueprint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,220,200,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,200,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          zIndex: 1,
        }}
      />

      {/* Ambient particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`p-${i}`}
          className="cta-particle absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background:
              i % 3 === 0
                ? "rgba(192,57,43,0.7)"
                : i % 3 === 1
                  ? "rgba(232,77,14,0.6)"
                  : "rgba(232,220,200,0.5)",
            boxShadow: "0 0 12px currentColor",
            zIndex: 2,
          }}
        />
      ))}

      {/* Rising embers */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={`e-${i}`}
          className="cta-ember absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background: i % 2 === 0 ? "#e84d0e" : "#c0392b",
            boxShadow: "0 0 8px currentColor, 0 0 16px currentColor",
            zIndex: 2,
          }}
        />
      ))}

      {/* Base fog */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 380,
          zIndex: 2,
          background:
            "linear-gradient(0deg, rgba(13,26,14,0.9) 0%, rgba(10,13,8,0.4) 50%, transparent 100%)",
        }}
      />

      {/* ═══ Main content ═══ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
          {/* ── LEFT · Editorial column ── */}
          <div>
            {/* Badge */}
            <div className="cta-reveal mb-6 inline-flex items-center gap-2 rounded-sm border border-scarlet/25 bg-scarlet/[0.08] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-scarlet" />
              </span>
              <span className="font-display text-[9px] tracking-[0.35em] uppercase text-scarlet/80">
                Final Chapter · The Ritual
              </span>
            </div>

            {/* Title */}
            <h2
              ref={titleRef}
              className="font-beast text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.88] mb-6"
              style={{ perspective: 800 }}
            >
              <span
                className="block text-bone"
                style={{ transformStyle: "preserve-3d" }}
              >
                {"SUMMON".split("").map((ch, i) => (
                  <span
                    key={`s-${i}`}
                    className="cta-char inline-block"
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
              <span
                className="block"
                style={{
                  transformStyle: "preserve-3d",
                  WebkitTextStroke: "3px #c0392b",
                  color: "transparent",
                  textShadow:
                    "6px 6px 0 rgba(192,57,43,0.18), 0 0 50px rgba(192,57,43,0.3)",
                }}
              >
                {"THE BEAST".split("").map((ch, i) => (
                  <span
                    key={`b-${i}`}
                    className="cta-char inline-block"
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}
              </span>
            </h2>

            {/* Divider with stat ticks */}
            <div className="cta-reveal flex items-center gap-4 mb-5 max-w-md">
              <div className="h-px flex-1 bg-gradient-to-r from-scarlet/40 to-transparent" />
              <span className="font-display text-[9px] tracking-[0.3em] uppercase text-ash/40">
                Chain · Sui
              </span>
              <div className="h-px w-4 bg-ash/20" />
              <span className="font-display text-[9px] tracking-[0.3em] uppercase text-ash/40">
                Supply · 1B
              </span>
            </div>

            {/* Tagline */}
            <p className="cta-reveal font-display text-sm sm:text-base tracking-[0.15em] uppercase text-tan mb-2">
              The forest has spoken.{" "}
              <span className="text-scarlet">The beast is here.</span>
            </p>
            <p className="cta-reveal font-body text-sm text-ash/60 mb-8 max-w-md">
              Complete the ritual below to awaken ManBearPig. Every burn. Every
              raid. Every holder. Stronger together.
            </p>

            {/* ══ Hold-to-summon ritual ══ */}
            <div className="cta-reveal flex items-center gap-5 mb-8">
              <button
                type="button"
                onPointerDown={startHold}
                onPointerUp={endHold}
                onPointerLeave={endHold}
                onPointerCancel={endHold}
                disabled={summoned}
                className="relative flex-shrink-0 select-none focus:outline-none disabled:cursor-default"
                style={{ width: 140, height: 140 }}
                aria-label="Hold to summon"
              >
                {/* Burst sparks (invisible until summon triggers) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={`spark-${i}`}
                      className="cta-spark absolute w-1.5 h-1.5 rounded-full"
                      style={{
                        background: i % 2 === 0 ? "#e84d0e" : "#c0392b",
                        boxShadow: "0 0 8px currentColor",
                      }}
                    />
                  ))}
                </div>

                {/* Progress ring */}
                <svg
                  viewBox="0 0 140 140"
                  className="absolute inset-0 w-full h-full"
                >
                  <defs>
                    <filter id="holdGlow">
                      <feGaussianBlur stdDeviation="3" />
                    </filter>
                  </defs>
                  {/* Track */}
                  <circle
                    cx="70"
                    cy="70"
                    r={HOLD_R}
                    fill="none"
                    stroke="rgba(232,220,200,0.08)"
                    strokeWidth="2"
                  />
                  {/* Tick marks — rounded to avoid hydration drift */}
                  {Array.from({ length: 32 }, (_, i) => {
                    const a = (i / 32) * Math.PI * 2 - Math.PI / 2;
                    const r1 = HOLD_R + 6;
                    const r2 = r1 + (i % 4 === 0 ? 6 : 3);
                    return (
                      <line
                        key={i}
                        x1={(70 + Math.cos(a) * r1).toFixed(3)}
                        y1={(70 + Math.sin(a) * r1).toFixed(3)}
                        x2={(70 + Math.cos(a) * r2).toFixed(3)}
                        y2={(70 + Math.sin(a) * r2).toFixed(3)}
                        stroke={`rgba(192,57,43,${i % 4 === 0 ? 0.45 : 0.18})`}
                        strokeWidth={i % 4 === 0 ? "1" : "0.5"}
                      />
                    );
                  })}
                  {/* Progress arc */}
                  <circle
                    ref={progressCircleRef}
                    cx="70"
                    cy="70"
                    r={HOLD_R}
                    fill="none"
                    stroke="#c0392b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{
                      strokeDasharray: HOLD_CIRC,
                      strokeDashoffset: HOLD_CIRC,
                      filter:
                        "drop-shadow(0 0 6px rgba(192,57,43,0.7)) drop-shadow(0 0 12px rgba(192,57,43,0.4))",
                      transition: summoned ? "stroke 0.3s ease" : undefined,
                    }}
                  />
                </svg>

                {/* Inner core */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ padding: 20 }}
                >
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: summoned
                        ? "radial-gradient(circle, rgba(192,57,43,0.35) 0%, rgba(10,13,8,0.95) 80%)"
                        : isHolding
                          ? "radial-gradient(circle, rgba(192,57,43,0.2) 0%, rgba(10,13,8,0.9) 75%)"
                          : "radial-gradient(circle, rgba(192,57,43,0.08) 0%, rgba(10,13,8,0.9) 80%)",
                      border: summoned
                        ? "1px solid rgba(192,57,43,0.6)"
                        : "1px solid rgba(192,57,43,0.25)",
                      boxShadow: summoned
                        ? "0 0 30px rgba(192,57,43,0.5), inset 0 0 20px rgba(192,57,43,0.2)"
                        : isHolding
                          ? "0 0 20px rgba(192,57,43,0.35)"
                          : "0 0 10px rgba(192,57,43,0.15)",
                      transform:
                        isHolding && !summoned ? "scale(0.96)" : "scale(1)",
                    }}
                  >
                    {/* Paw icon */}
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill={summoned ? "#e84d0e" : "#c0392b"}
                      style={{
                        filter: summoned
                          ? "drop-shadow(0 0 8px #e84d0e)"
                          : "drop-shadow(0 0 4px rgba(192,57,43,0.6))",
                        transition: "fill 0.3s ease, filter 0.3s ease",
                      }}
                    >
                      <ellipse cx="7" cy="5" rx="2.5" ry="3" />
                      <ellipse cx="17" cy="5" rx="2.5" ry="3" />
                      <ellipse cx="3.5" cy="11" rx="2" ry="2.5" />
                      <ellipse cx="20.5" cy="11" rx="2" ry="2.5" />
                      <path d="M12 22c-4 0-7-3-7-6.5S8 10 12 10s7 2 7 5.5S16 22 12 22z" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Label */}
              <div className="flex-1">
                <div
                  className="font-display text-[10px] tracking-[0.3em] uppercase mb-1 transition-colors duration-300"
                  style={{
                    color: summoned
                      ? "#4a7c59"
                      : isHolding
                        ? "#e84d0e"
                        : "rgba(107,114,128,0.4)",
                  }}
                >
                  {summoned
                    ? "· Ritual Complete ·"
                    : isHolding
                      ? "· Channeling ·"
                      : "· Press & Hold ·"}
                </div>
                <div
                  className="font-beast text-xl lg:text-2xl leading-none transition-colors duration-300"
                  style={{ color: summoned ? "#e84d0e" : "#e8dcc8" }}
                >
                  {summoned ? "BEAST SUMMONED" : "HOLD TO SUMMON"}
                </div>
                <div className="font-display text-[9px] tracking-wider text-ash/30 mt-1">
                  {summoned
                    ? "The forest answers your call."
                    : "Press and hold the sigil to awaken $MBP"}
                </div>
              </div>
            </div>

            {/* CTA row */}
            <div className="cta-reveal flex flex-wrap gap-3">
              <button className="btn-beast btn-beast-primary text-sm px-7 py-3.5">
                <span className="btn-edge-bar" />
                <span className="btn-paw">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <ellipse cx="7" cy="5" rx="2.5" ry="3" />
                    <ellipse cx="17" cy="5" rx="2.5" ry="3" />
                    <ellipse cx="3.5" cy="11" rx="2" ry="2.5" />
                    <ellipse cx="20.5" cy="11" rx="2" ry="2.5" />
                    <path d="M12 22c-4 0-7-3-7-6.5S8 10 12 10s7 2 7 5.5S16 22 12 22z" />
                  </svg>
                </span>
                <span className="btn-text">Buy $MBP</span>
              </button>
              <button className="btn-beast btn-beast-outline text-sm px-7 py-3.5">
                <span className="btn-text">Join the Pack</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT · Cinematic video column ── */}
          <div>
            <div
              ref={videoFrameRef}
              className="relative w-full overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "4 / 5",
                background: "linear-gradient(135deg, #0a0d08 0%, #0d1a0e 100%)",
              }}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/summon-beast.mp4"
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Summon the beast"
              />

              {/* ── Dormant state: standing beast image layered over the video ── */}
              <div
                ref={standingImageRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                  transformOrigin: "50% 55%",
                  willChange: "opacity, transform",
                }}
              >
                <Image
                  src="/standing-beast.jpg"
                  alt="ManBearPig standing in the mist"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* Grading tint so the dormant image matches the forest palette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,13,8,0.25) 0%, rgba(10,13,8,0) 40%, rgba(10,13,8,0.35) 100%)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>

              {/* Scan lines */}
              <div
                className="cta-scanlines absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(232,220,200,0.04) 0px, rgba(232,220,200,0.04) 1px, transparent 1px, transparent 4px)",
                  opacity: 0.5,
                }}
              />

              {/* Edge vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 55%, rgba(10,13,8,0.75) 100%)",
                }}
              />

              {/* Top gradient + HUD */}
              <div
                className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,13,8,0.85) 0%, transparent 100%)",
                }}
              />
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-scarlet" />
                  </span>
                  <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/80">
                    Rec · Live Feed
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5 font-display text-[8px] tracking-[0.3em] uppercase text-bone/50">
                  <span>Sui Mainnet</span>
                  <span>Cam · 001</span>
                </div>
              </div>

              {/* Animated frame corners */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  "top-3 left-3 border-l-2 border-t-2",
                  "top-3 right-3 border-r-2 border-t-2",
                  "bottom-3 left-3 border-l-2 border-b-2",
                  "bottom-3 right-3 border-r-2 border-b-2",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`cta-corner absolute w-6 h-6 ${cls} border-scarlet/70`}
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(192,57,43,0.6))",
                    }}
                  />
                ))}
              </div>

              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-14 h-14 opacity-20">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-bone/80" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-bone/80" />
                  <div className="absolute inset-0 border border-bone/40 rounded-full" />
                </div>
              </div>

              {/* Bottom gradient + HUD */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(10,13,8,0.85) 0%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="font-display text-[8px] tracking-[0.35em] uppercase text-bone/40 mb-0.5">
                      Subject
                    </div>
                    <div className="font-beast text-xs text-bone/90 tracking-wider">
                      MAN · BEAR · PIG
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[8px] tracking-[0.35em] uppercase text-bone/40 mb-0.5">
                      Status
                    </div>
                    <div
                      className="font-display text-[10px] tracking-widest uppercase font-semibold transition-colors duration-300"
                      style={{ color: summoned ? "#e84d0e" : "#4a7c59" }}
                    >
                      {summoned ? "Awakened" : "Dormant"}
                    </div>
                  </div>
                </div>
                {/* Waveform ticks */}
                <div className="flex items-end gap-[2px] h-4 opacity-60">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${20 + ((i * 37) % 80)}%`,
                        background: summoned
                          ? "rgba(232,77,14,0.8)"
                          : "rgba(74,124,89,0.55)",
                        transition: "background 0.4s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contract address bar ── */}
        <div
          className="cta-reveal mt-10 lg:mt-14 mx-auto max-w-2xl"
          style={{ perspective: 800 }}
        >
          <div
            ref={addressCardRef}
            onMouseMove={handleTilt}
            onMouseLeave={handleTiltLeave}
            className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-moss/15 bg-white/[0.025] px-5 py-4 transition-colors duration-300 hover:border-moss/25 hover:bg-white/[0.04]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-scarlet/30 bg-scarlet/[0.08] flex items-center justify-center text-scarlet/80">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-display text-[9px] tracking-[0.3em] uppercase text-ash/35 mb-0.5">
                  Contract Address
                </div>
                <div className="font-mono text-xs sm:text-sm text-silver tracking-wider truncate">
                  {truncateMiddle(CONTRACT_ADDRESS)}
                </div>
              </div>
            </div>
            <button
              ref={copyBtnRef}
              onClick={handleCopy}
              onMouseMove={(e) => {
                // Prevent the parent card's magnetic tilt from firing while
                // the cursor is over the button — otherwise the card rotates
                // the button in 3D, which jitters the hover state.
                e.stopPropagation();
              }}
              onMouseEnter={() => {
                // Snap the card back to neutral so the button sits flat
                if (addressCardRef.current) {
                  gsap.to(addressCardRef.current, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto",
                  });
                }
              }}
              className="group relative overflow-visible rounded-sm border border-scarlet/30 bg-scarlet/[0.08] px-4 py-2 hover:border-scarlet/60 hover:bg-scarlet/[0.15] flex-shrink-0"
              style={{ perspective: 400, transform: "translateZ(0.1px)" }}
            >
              {/* Ripple pulse */}
              <span
                ref={copyRippleRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-sm"
                style={{
                  border: "1px solid rgba(74,124,89,0.7)",
                  opacity: 0,
                }}
              />
              <span
                ref={copyLabelRef}
                className="relative inline-block font-display text-[10px] tracking-[0.25em] uppercase"
                style={{
                  color: copied ? "#4a7c59" : "#c0392b",
                  transformOrigin: "50% 50%",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom brand lockup */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 pointer-events-none">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-scarlet/30" />
          <span className="font-beast text-sm text-scarlet/50 tracking-[0.3em]">
            $MBP · BEAST OF SUI
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-scarlet/30" />
        </div>
      </div>
    </section>
  );
}
