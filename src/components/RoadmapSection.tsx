"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TrailStoneProps {
  phase: string;
  title: string;
  status: "done" | "active" | "upcoming";
  items: string[];
  index: number;
  total: number;
}

function TrailStone({ phase, title, status, items, index, total }: TrailStoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        x: isLeft ? -80 : 80,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      }
    );
  }, [isLeft, index]);

  const statusColors = {
    done: { border: "#4a7c59", glow: "rgba(74,124,89,0.4)", badge: "#4a7c59", text: "COMPLETE" },
    active: { border: "#c0392b", glow: "rgba(192,57,43,0.5)", badge: "#c0392b", text: "ACTIVE" },
    upcoming: { border: "#6b7280", glow: "rgba(107,114,128,0.2)", badge: "#6b7280", text: "UPCOMING" },
  };

  const sc = statusColors[status];

  return (
    <div ref={ref} className={`relative flex ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"} flex-col items-start lg:items-center gap-6 mb-8`}>
      {/* Content card */}
      <div className={`flex-1 ${isLeft ? "lg:text-right" : "lg:text-left"} text-left`}>
        <div
          className="inline-block p-6 w-full lg:w-auto lg:min-w-[300px]"
          style={{
            background: status === "active"
              ? "linear-gradient(135deg, rgba(139,26,26,0.2), rgba(10,13,8,0.95))"
              : "linear-gradient(135deg, rgba(26,46,27,0.6), rgba(10,13,8,0.9))",
            border: `1px solid ${sc.border}50`,
            boxShadow: status === "active" ? `0 0 30px ${sc.glow}` : "none",
            clipPath: isLeft
              ? "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)"
              : "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)",
          }}
        >
          {/* Status badge */}
          <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1 ${isLeft ? "" : ""}`}
            style={{ background: `${sc.badge}20`, border: `1px solid ${sc.badge}50` }}
          >
            {status === "done" && <span className="text-xs">✓</span>}
            {status === "active" && <span className="text-xs animate-pulse">●</span>}
            {status === "upcoming" && <span className="text-xs opacity-50">○</span>}
            <span className="font-display text-xs tracking-widest uppercase" style={{ color: sc.badge }}>
              {sc.text}
            </span>
          </div>

          <div className="font-display text-xs tracking-widest uppercase text-ash mb-2">{phase}</div>
          <h3 className="font-beast text-2xl lg:text-3xl text-bone mb-4">{title}</h3>

          <ul className={`space-y-2 ${isLeft ? "lg:items-end" : "items-start"}`}>
            {items.map((item) => (
              <li
                key={item}
                className={`flex items-center gap-2 text-sm font-body text-ash/90 ${isLeft ? "lg:flex-row-reverse lg:text-right" : ""}`}
              >
                <span className="text-xs" style={{ color: sc.border }}>
                  {status === "done" ? "✓" : "›"}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Center node */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-beast text-sm z-10"
          style={{
            background: `linear-gradient(135deg, ${sc.border}, ${sc.border}80)`,
            boxShadow: `0 0 ${status === "active" ? "30px" : "15px"} ${sc.glow}`,
            border: `2px solid ${sc.border}`,
          }}
        >
          {index + 1}
        </div>
        {/* Connector line */}
        {index < total - 1 && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-px"
            style={{
              height: "60px",
              background: `linear-gradient(180deg, ${sc.border}80, rgba(74,124,89,0.2))`,
            }}
          />
        )}
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden lg:block" />
    </div>
  );
}

export default function RoadmapSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);

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
  }, []);

  const phases = [
    {
      phase: "Phase I — The Emergence",
      title: "INTO THE WILD",
      status: "done" as const,
      items: [
        "Token Launch on Sui",
        "Community Bootstrap",
        "Initial Liquidity Pool",
        "PandaSui Partnership",
        "Website & Socials Live",
      ],
    },
    {
      phase: "Phase II — The Stalk",
      title: "THE HUNT BEGINS",
      status: "active" as const,
      items: [
        "CEX Listings (Tier 2)",
        "NFT Collection Drop",
        "Burn Mechanic Launch",
        "10,000 Holders Target",
        "Alliance Expansion",
      ],
    },
    {
      phase: "Phase III — The Feeding",
      title: "FEEDING GROUNDS",
      status: "upcoming" as const,
      items: [
        "Major CEX Listing",
        "ManBearPig DAO",
        "Cross-Chain Bridge",
        "Beast Staking Vaults",
        "50,000 Holders Target",
      ],
    },
    {
      phase: "Phase IV — The Legend",
      title: "BECOME LEGEND",
      status: "upcoming" as const,
      items: [
        "ManBearPig Game Launch",
        "Metaverse Beast Den",
        "100,000 Holders",
        "Top 100 Crypto by MCap",
        "The forest never sleeps.",
      ],
    },
  ];

  return (
    <section
      id="roadmap"
      className="relative py-24 lg:py-36 bg-gradient-to-b from-[#0a0d08] to-[#0d1a0e] overflow-hidden"
    >
      {/* Forest floor texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(26,46,27,0.3) 20px, rgba(26,46,27,0.3) 21px)",
        }}
      />

      {/* Left pine silhouette */}
      <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none opacity-20">
        {[0, 150, 300, 450, 600].map((y, i) => (
          <div key={i} className="absolute" style={{ top: y + "px", left: 0 }}>
            <svg width="80" height="120" viewBox="0 0 80 120">
              <polygon points="40,0 15,60 65,60" fill="#1a3a1c" />
              <polygon points="40,30 10,90 70,90" fill="#0f2210" />
              <rect x="35" y="90" width="10" height="30" fill="#3a2018" />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-forest-green/20 border border-forest-green/40 px-4 py-2 mb-6">
            <span className="text-xs">🗺️</span>
            <span className="font-display text-xs tracking-widest uppercase text-moss">
              Tracks Through the Forest
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-beast text-5xl lg:text-7xl text-bone mb-4"
          >
            THE
            <span className="block" style={{ WebkitTextStroke: "2px #4a7c59", color: "transparent" }}>
              HUNT
            </span>
          </h2>
          <p className="font-display text-base tracking-wider text-ash uppercase">
            Follow the tracks. The beast always finds its prey.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden lg:block"
            style={{
              background: "linear-gradient(180deg, rgba(74,124,89,0.5), rgba(74,124,89,0.1))",
            }}
          />

          {phases.map((phase, i) => (
            <TrailStone
              key={phase.title}
              phase={phase.phase}
              title={phase.title}
              status={phase.status}
              items={phase.items}
              index={i}
              total={phases.length}
            />
          ))}
        </div>

        {/* Final note */}
        <div className="text-center mt-16">
          <p className="font-display text-sm tracking-[0.2em] uppercase text-ash/60 italic">
            "The trail does not end. The hunt never stops."
          </p>
        </div>
      </div>
    </section>
  );
}
