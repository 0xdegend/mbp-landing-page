"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AllyCardProps {
  name: string;
  role: string;
  icon: string;
  desc: string;
  index: number;
}

function AllyCard({ name, role, icon, desc, index }: AllyCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50, rotation: index % 2 === 0 ? -3 : 3 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.6,
        delay: index * 0.12,
        ease: "back.out(1.2)",
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
      className="relative group cursor-pointer"
    >
      {/* Rugged card */}
      <div
        className="relative p-6 bg-gradient-to-br from-pine-mid to-pine-dark border border-forest-green/30 hover:border-forest-green/60 transition-all duration-300 hover:-translate-y-1"
        style={{
          clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
        }}
      >
        {/* Claw scratch lines top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest-green/40 to-transparent" />

        {/* Icon */}
        <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block">
          {icon}
        </div>

        {/* Name */}
        <h4 className="font-beast text-2xl text-bone mb-1">{name}</h4>
        <div className="font-display text-xs tracking-widest uppercase text-moss mb-3">{role}</div>
        <p className="font-body text-sm text-ash/80 leading-relaxed">{desc}</p>

        {/* Hover state */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
            background: "linear-gradient(135deg, rgba(45,90,46,0.1) 0%, transparent 60%)",
          }}
        />

        {/* Top-right corner cut */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-forest-green/20"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
        />
      </div>

      {/* Chain connector line */}
      {index < 2 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 z-10"
          style={{
            background: "repeating-linear-gradient(90deg, rgba(74,124,89,0.6) 0px, rgba(74,124,89,0.6) 4px, transparent 4px, transparent 8px)",
          }}
        />
      )}
    </div>
  );
}

export default function AllianceComponent() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const crestRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

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

    gsap.fromTo(
      crestRef.current,
      { opacity: 0, scale: 0.7, rotation: -10 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: crestRef.current, start: "top 80%" },
      }
    );

    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: { trigger: quoteRef.current, start: "top 85%" },
      }
    );
  }, []);

  const allies = [
    {
      name: "PandaSui",
      role: "The Launchpad",
      icon: "🐼",
      desc: "The den where legends are born. PandaSui forges the mightiest beasts of the Sui ecosystem.",
    },
    {
      name: "SuiPack",
      role: "The Hunters",
      icon: "🗡️",
      desc: "A coalition of apex predators. Together they raid. Together they conquer. The pack never breaks.",
    },
    {
      name: "ForestDAO",
      role: "The Council",
      icon: "🌲",
      desc: "The governing body of the beast realm. Decisions carved in stone, executed on-chain.",
    },
    {
      name: "WildVault",
      role: "The Treasury",
      icon: "🏔️",
      desc: "Where the beast hoards its gold. Community-controlled, community-protected.",
    },
  ];

  const allianceMottoes = [
    "Forged on PandaSui, unleashed on Sui.",
    "Born in the den, raised in the wild.",
    "The pack behind the roar.",
    "Stronger together. Wilder together.",
  ];

  return (
    <section
      id="alliance"
      className="relative py-24 lg:py-36 bg-gradient-to-b from-[#0a0d08] via-[#0d1a0e] to-[#0a0d08] overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234a7c59' fill-opacity='0.4'%3E%3Cpath d='M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-forest-green/20 border border-forest-green/40 px-4 py-2 mb-6">
            <span className="text-xs">⚔️</span>
            <span className="font-display text-xs tracking-widest uppercase text-moss">
              The Alpha Pack
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-beast text-5xl lg:text-7xl text-bone mb-4"
          >
            THE
            <span className="block text-moss" style={{ WebkitTextStroke: "2px #4a7c59", color: "transparent" }}>
              ALLIANCE
            </span>
          </h2>
        </div>

        {/* Central Alliance Crest */}
        <div className="flex justify-center mb-16">
          <div
            ref={crestRef}
            className="relative p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(26,46,27,0.8), rgba(10,13,8,0.9))",
              border: "2px solid rgba(74,124,89,0.5)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              width: "200px",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="text-5xl mb-2">🐼</div>
            <div className="font-beast text-sm text-bone">PANDA</div>
            <div className="font-beast text-sm text-scarlet">SUI</div>
          </div>
        </div>

        {/* Motto rotator */}
        <div
          ref={quoteRef}
          className="max-w-2xl mx-auto text-center mb-16 p-6"
          style={{
            background: "rgba(26,46,27,0.3)",
            border: "1px solid rgba(74,124,89,0.3)",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
          }}
        >
          <p className="font-display text-lg tracking-wider text-sky-ice uppercase italic">
            "Forged on PandaSui, unleashed on Sui."
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {allianceMottoes.slice(1).map((m, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-forest-green/40 hover:bg-scarlet/60 transition-colors duration-200 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Alliance cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allies.map((ally, i) => (
            <AllyCard key={ally.name} {...ally} index={i} />
          ))}
        </div>

        {/* Alliance declaration */}
        <div className="mt-16 text-center">
          <div
            className="inline-block p-6"
            style={{
              background: "rgba(45,90,46,0.1)",
              border: "1px solid rgba(74,124,89,0.4)",
            }}
          >
            <p className="font-display text-sm tracking-[0.25em] uppercase text-moss">
              Where the beast meets the launchpad.{" "}
              <span className="text-bone">Where legends are forged.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
