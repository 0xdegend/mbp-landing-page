"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingParticleLayer from "./FloatingParticleLayer";

gsap.registerPlugin(ScrollTrigger);

interface StatPanelProps {
  label: string;
  value: string;
  suffix?: string;
  description: string;
  icon: string;
  index: number;
}

function StatPanel({ label, value, suffix = "", description, icon, index }: StatPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.15,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      }
    );

    // Number count-up
    const numEl = numRef.current;
    if (!numEl) return;
    const endVal = parseFloat(value.replace(/[^0-9.]/g, ""));
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const decimals = value.includes(".") ? value.split(".")[1]?.length || 0 : 0;

    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(
          { val: 0 },
          {
            val: endVal,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              numEl.textContent = prefix + this.targets()[0].val.toFixed(decimals);
            },
          }
        );
      },
    });
  }, [value, index]);

  return (
    <div ref={ref} className="stat-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      {/* Corner claw */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
        <div className="absolute top-0 right-0 border-t-2 border-r-2 border-scarlet/40 w-full h-full" />
      </div>

      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-display text-xs tracking-widest uppercase text-moss mb-2">{label}</div>
      <div className="flex items-baseline gap-1 mb-2">
        <span
          ref={numRef}
          className="font-beast text-3xl lg:text-4xl text-bone"
        >
          {value}
        </span>
        <span className="font-display text-scarlet font-bold text-lg">{suffix}</span>
      </div>
      <p className="font-body text-xs text-ash/80">{description}</p>

      {/* Hover glow */}
      <div className="absolute inset-0 bg-scarlet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

export default function BurnComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: { trigger: headlineRef.current, start: "top 80%" },
      }
    );

    // Ring pulse animation
    gsap.to(ringRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Burn meter fill animation
    ScrollTrigger.create({
      trigger: meterRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          meterRef.current,
          { width: "0%" },
          { width: "73%", duration: 2.5, ease: "power2.out" }
        );
      },
    });
  }, []);

  const stats = [
    {
      label: "Total Burned",
      value: "420",
      suffix: "M",
      description: "Tokens sent to the eternal furnace",
      icon: "🔥",
    },
    {
      label: "Current Supply",
      value: "580",
      suffix: "M",
      description: "Remaining in the beast's domain",
      icon: "💀",
    },
    {
      label: "Burn Rate",
      value: "2.4",
      suffix: "%",
      description: "Devoured with every transaction",
      icon: "⚡",
    },
    {
      label: "Holders",
      value: "12",
      suffix: "K+",
      description: "Brave souls in the forest",
      icon: "🐾",
    },
  ];

  return (
    <section
      id="burn"
      ref={sectionRef}
      className="relative py-24 lg:py-36 bg-gradient-to-b from-[#0a0d08] via-[#120808] to-[#0a0d08] overflow-hidden"
    >
      {/* Ember particles */}
      <FloatingParticleLayer count={40} type="ember" />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(139,26,26,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blood/20 border border-blood/40 px-4 py-2 mb-6">
            <span className="text-ember text-sm">🔥</span>
            <span className="font-display text-xs tracking-widest uppercase text-blood">Burn Mechanics</span>
          </div>

          <h2
            ref={headlineRef}
            className="font-beast text-5xl lg:text-7xl text-bone mb-4"
            style={{ textShadow: "0 0 40px rgba(232,77,14,0.3)" }}
          >
            BURN THE
            <span className="block" style={{ WebkitTextStroke: "3px #e84d0e", color: "transparent" }}>
              WEAK
            </span>
          </h2>
          <p className="font-display text-lg tracking-wider text-tan uppercase">
            Feed the Legend. Every token destroyed makes the beast{" "}
            <span className="text-scarlet">hungrier.</span>
          </p>
        </div>

        {/* Central burn ring */}
        <div className="flex justify-center mb-16">
          <div className="relative" style={{ width: "280px", height: "280px" }}>
            {/* Outer ring */}
            <div
              ref={ringRef}
              className="absolute inset-0 rounded-full"
              style={{
                border: "3px solid rgba(192,57,43,0.5)",
                boxShadow: "0 0 60px rgba(192,57,43,0.3), inset 0 0 60px rgba(192,57,43,0.1)",
              }}
            />
            {/* Second ring */}
            <div
              className="absolute inset-6 rounded-full"
              style={{
                border: "2px solid rgba(232,77,14,0.3)",
                animation: "spin 8s linear infinite reverse",
              }}
            />
            {/* SVG progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 280 280">
              <circle
                cx="140" cy="140" r="120"
                fill="none"
                stroke="rgba(139,26,26,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="140" cy="140" r="120"
                fill="none"
                stroke="url(#burnGrad)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 120 * 0.73} ${2 * Math.PI * 120 * 0.27}`}
                strokeLinecap="butt"
              />
              <defs>
                <linearGradient id="burnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c0392b" />
                  <stop offset="100%" stopColor="#e84d0e" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl mb-1">🔥</span>
              <span className="font-beast text-4xl text-scarlet">73%</span>
              <span className="font-display text-xs tracking-widest uppercase text-ash">Burned</span>
            </div>
          </div>
        </div>

        {/* Burn meter bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex justify-between items-center mb-3">
            <span className="font-display text-xs tracking-widest uppercase text-ash">Burn Progress</span>
            <span className="font-display text-xs text-scarlet font-bold">420M / 1B Destroyed</span>
          </div>
          <div className="h-4 bg-pine-dark border border-forest-green/30 relative overflow-hidden"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%)" }}>
            <div
              ref={meterRef}
              className="absolute left-0 top-0 h-full"
              style={{
                width: "0%",
                background: "linear-gradient(90deg, #8b1a1a, #c0392b, #e84d0e)",
                boxShadow: "0 0 20px rgba(232,77,14,0.6)",
              }}
            />
            {/* Ember sparkles on bar */}
            {[20, 40, 60].map((pos) => (
              <div
                key={pos}
                className="absolute top-0 h-full w-px bg-white/30"
                style={{ left: `${pos}%` }}
              />
            ))}
          </div>
        </div>

        {/* Stat panels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatPanel key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-16">
          <div className="inline-block border-t border-b border-scarlet/30 py-4 px-8">
            <p className="font-display text-lg tracking-wider text-tan italic">
              "The fire keeps the forest alive."
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
