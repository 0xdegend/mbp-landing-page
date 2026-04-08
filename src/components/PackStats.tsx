"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TalismanProps {
  label: string;
  value: string;
  sub: string;
  icon: string;
  index: number;
}

function Talisman({ label, value, sub, icon, index }: TalismanProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const angle = (index / 6) * Math.PI * 2;
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale: 0.5,
        rotation: (angle * 180) / Math.PI,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        delay: index * 0.1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center group cursor-default"
    >
      {/* Talisman shape */}
      <div
        className="relative mb-4 w-28 h-28 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #1a2e1b, #0d1a0e)",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          border: "2px solid rgba(74,124,89,0.4)",
          boxShadow: "0 0 20px rgba(74,124,89,0.2)",
        }}
      >
        <div className="text-3xl">{icon}</div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(192,57,43,0.2) 0%, transparent 70%)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />
      </div>
      <div className="font-beast text-2xl text-bone mb-1">{value}</div>
      <div className="font-display text-xs tracking-widest uppercase text-scarlet mb-1">{label}</div>
      <div className="font-body text-xs text-ash/70">{sub}</div>
    </div>
  );
}

export default function PackStats() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const fireRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: { trigger: titleRef.current, start: "top 80%" },
      }
    );

    // Fire flicker
    gsap.to(fireRef.current, {
      scale: 1.1,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const stats = [
    { label: "Pack Members", value: "12K+", sub: "Savage holders", icon: "🐾" },
    { label: "Raids Launched", value: "340+", sub: "Community attacks", icon: "⚔️" },
    { label: "Market Cap", value: "$4.2M", sub: "Growing daily", icon: "📈" },
    { label: "Daily Volume", value: "$890K", sub: "Beast liquidity", icon: "💧" },
    { label: "Telegram Pack", value: "8.5K", sub: "Active warriors", icon: "📡" },
    { label: "Twitter Roars", value: "25K", sub: "Followers gained", icon: "🦅" },
  ];

  const callouts = [
    "JOIN THE PACK",
    "FOLLOW THE ROAR",
    "RAID SEASON BEGINS",
    "THE FOREST IS GROWING",
  ];

  return (
    <section
      id="pack"
      className="relative py-24 lg:py-36 bg-gradient-to-b from-[#0d1a0e] to-[#0a0d08] overflow-hidden"
    >
      {/* Forest firepit glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(232,77,14,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-forest-green/20 border border-forest-green/40 px-4 py-2 mb-6">
            <span className="text-xs">🔥</span>
            <span className="font-display text-xs tracking-widest uppercase text-moss">
              The Pack Gathers
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-beast text-5xl lg:text-7xl text-bone mb-4"
          >
            JOIN THE
            <span className="block text-scarlet">PACK</span>
          </h2>
          <p className="font-display text-base tracking-wider text-ash uppercase">
            The forest is growing. Every holder a hunter. Every raid a legend.
          </p>
        </div>

        {/* Campfire central icon */}
        <div className="flex justify-center mb-16">
          <div
            ref={fireRef}
            className="text-7xl"
            style={{ filter: "drop-shadow(0 0 20px rgba(232,77,14,0.6))" }}
          >
            🔥
          </div>
        </div>

        {/* Talisman grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {stats.map((stat, i) => (
            <Talisman key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Callout banners */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {callouts.map((callout, i) => (
            <div
              key={callout}
              className="p-4 text-center border border-forest-green/30 bg-pine-dark/50 hover:border-scarlet/50 hover:bg-blood/10 transition-all duration-300 cursor-pointer"
              style={{
                clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
              }}
            >
              <p className="font-display text-sm font-700 tracking-[0.2em] uppercase text-bone">
                {callout}
              </p>
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "𝕏 Twitter / X", href: "#", color: "#7ec8e3" },
            { label: "📢 Telegram", href: "#", color: "#4a9ebb" },
            { label: "💬 Discord", href: "#", color: "#7289da" },
            { label: "🌐 DexScreener", href: "#", color: "#4a7c59" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="btn-beast btn-beast-outline text-sm"
              style={{ borderColor: s.color + "80", color: s.color }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
