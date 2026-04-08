"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LoreCardProps {
  stage: string;
  title: string;
  tagline: string;
  lore: string;
  icon: string;
  color: string;
  index: number;
}

function LoreCard({ stage, title, tagline, lore, icon, color, index }: LoreCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        x: index % 2 === 0 ? -60 : 60,
        rotationY: index % 2 === 0 ? -15 : 15,
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={ref}
      className="relative group"
      style={{ perspective: "1000px" }}
    >
      {/* Card */}
      <div
        className="relative bg-pine-dark border overflow-hidden transition-transform duration-300 group-hover:-translate-y-2"
        style={{
          borderColor: `${color}40`,
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
        }}
      >
        {/* Stage header */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ background: `${color}20`, borderBottom: `1px solid ${color}30` }}
        >
          <span className="font-display text-xs tracking-[0.3em] uppercase" style={{ color }}>
            {stage}
          </span>
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-beast text-4xl text-bone mb-2 leading-none">{title}</h3>
          <p className="font-display text-sm tracking-wider uppercase mb-4" style={{ color }}>
            {tagline}
          </p>
          <p className="font-body text-ash/90 leading-relaxed">{lore}</p>
        </div>

        {/* Claw marks overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
          }}
        />

        {/* Corner cut accent */}
        <div
          className="absolute top-0 right-0 w-5 h-5"
          style={{
            background: color,
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            opacity: 0.6,
          }}
        />

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `${color}60` }} />
      </div>
    </div>
  );
}

export default function LoreSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stoneRef = useRef<HTMLDivElement>(null);

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
      stoneRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        scrollTrigger: { trigger: stoneRef.current, start: "top 85%" },
      }
    );
  }, []);

  const loreCards = [
    {
      stage: "Origin I",
      title: "THE MAN",
      tagline: "Intelligence born from code",
      lore: "From the depths of civilization came the cunning mind — sharp, calculating, relentless. It gave the beast its awareness, its ability to stalk markets and dominate chains.",
      icon: "🧠",
      color: "#7ec8e3",
    },
    {
      stage: "Origin II",
      title: "THE BEAR",
      tagline: "Strength forged in the wild",
      lore: "The mountain gave it brute force. Unbreakable, immovable, hibernating through dips and emerging with ferocity no chart can contain. The bear gave the beast its power.",
      icon: "🐻",
      color: "#a0856a",
    },
    {
      stage: "Origin III",
      title: "THE PIG",
      tagline: "Hunger that never dies",
      lore: "Neither refined nor restrained. The pig gave it appetite — for gains, for chaos, for community. An insatiable drive to devour whatever stands in the forest.",
      icon: "🐷",
      color: "#c0392b",
    },
    {
      stage: "Origin IV",
      title: "THE BEAST",
      tagline: "The chain gave it purpose",
      lore: "When the three converged on Sui, something ancient and terrible was born. ManBearPig. A force of nature that the blockchain could barely contain. The legend begins now.",
      icon: "⛓️",
      color: "#4a7c59",
    },
  ];

  return (
    <section
      id="lore"
      className="relative py-24 lg:py-36 bg-gradient-to-b from-[#0a0d08] to-[#0d1a0e] overflow-hidden"
    >
      {/* Stone texture background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(74,124,89,0.3) 40px,
            rgba(74,124,89,0.3) 41px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 60px,
            rgba(74,124,89,0.2) 60px,
            rgba(74,124,89,0.2) 61px
          )`,
        }}
      />

      {/* Pine silhouette corners */}
      <div className="absolute top-0 left-0 opacity-20 pointer-events-none">
        <svg width="200" height="300" viewBox="0 0 200 300">
          <polygon points="100,0 60,100 140,100" fill="#1a3a1c" />
          <polygon points="100,60 50,170 150,170" fill="#162e18" />
          <polygon points="100,120 30,250 170,250" fill="#0f2210" />
          <rect x="90" y="250" width="20" height="50" fill="#3a2018" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 opacity-20 pointer-events-none scale-x-[-1]">
        <svg width="200" height="300" viewBox="0 0 200 300">
          <polygon points="100,0 60,100 140,100" fill="#1a3a1c" />
          <polygon points="100,60 50,170 150,170" fill="#162e18" />
          <polygon points="100,120 30,250 170,250" fill="#0f2210" />
          <rect x="90" y="250" width="20" height="50" fill="#3a2018" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-forest-green/20 border border-forest-green/40 px-4 py-2 mb-6">
            <span className="text-xs">📜</span>
            <span className="font-display text-xs tracking-widest uppercase text-moss">
              The Ancient Texts
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-beast text-5xl lg:text-7xl text-bone mb-4"
          >
            THE LORE
            <span className="block text-moss" style={{ WebkitTextStroke: "2px #4a7c59", color: "transparent" }}>
              ORIGIN
            </span>
          </h2>
          <p className="font-display text-base tracking-wider text-ash uppercase max-w-lg mx-auto">
            Carved into stone. Burned into chain. The legend of ManBearPig.
          </p>
        </div>

        {/* Stone inscription box */}
        <div
          ref={stoneRef}
          className="max-w-2xl mx-auto mb-16 p-6 text-center"
          style={{
            background: "rgba(26, 46, 27, 0.3)",
            border: "2px solid rgba(74,124,89,0.3)",
            clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
          }}
        >
          <p className="font-display text-tan text-sm tracking-[0.2em] uppercase italic">
            "In the forests of Sui, where the pines grow black and the mountains never sleep, a creature emerged from the primordial mist — born of man's cunning, bear's might, and pig's insatiable hunger. The blockchain trembled."
          </p>
        </div>

        {/* Lore cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loreCards.map((card, i) => (
            <LoreCard key={card.title} {...card} index={i} />
          ))}
        </div>

        {/* Bottom myth line */}
        <div className="text-center mt-16 flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent to-scarlet/40" />
          <span className="font-beast text-xl text-scarlet">ManBearPig</span>
          <div className="flex-1 max-w-xs h-px bg-gradient-to-l from-transparent to-scarlet/40" />
        </div>
      </div>
    </section>
  );
}
