"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxMountainBackdropProps {
  className?: string;
  variant?: "dark" | "forest" | "ember";
}

export default function ParallaxMountainBackdrop({
  className = "",
  variant = "dark",
}: ParallaxMountainBackdropProps) {
  const layerFarRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerNearRef = useRef<HTMLDivElement>(null);

  const gradients = {
    dark: {
      sky: "linear-gradient(180deg, #0a1a2e 0%, #0d1a0e 60%, #0a0d08 100%)",
      mtn: ["#0d2a0e", "#0a2010", "#051008"],
    },
    forest: {
      sky: "linear-gradient(180deg, #0d1a0e 0%, #162e18 60%, #0a0d08 100%)",
      mtn: ["#162e18", "#1a3a1c", "#0d2a0e"],
    },
    ember: {
      sky: "linear-gradient(180deg, #1a0808 0%, #120808 60%, #0a0d08 100%)",
      mtn: ["#2a0e0e", "#1a0808", "#0a0505"],
    },
  };

  const g = gradients[variant];

  useEffect(() => {
    const layers = [layerFarRef.current, layerMidRef.current, layerNearRef.current];
    const speeds = [0.15, 0.25, 0.35];

    layers.forEach((layer, i) => {
      if (!layer) return;
      gsap.to(layer, {
        yPercent: speeds[i] * 100,
        ease: "none",
        scrollTrigger: {
          trigger: layer.closest("section") || document.body,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0" style={{ background: g.sky }} />

      {/* Far mountains */}
      <div ref={layerFarRef} className="absolute inset-0">
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
        >
          <path
            d={`M0,500 L0,280 L90,180 L180,220 L300,100 L420,160 L540,80 L660,140 L780,60 L900,120 L1020,50 L1140,110 L1260,70 L1380,120 L1440,100 L1440,500 Z`}
            fill={g.mtn[0]}
            opacity="0.5"
          />
          {/* Snow caps */}
          <path d="M300,100 L328,132 L272,132 Z" fill="rgba(255,255,255,0.25)" />
          <path d="M780,60 L808,92 L752,92 Z" fill="rgba(255,255,255,0.25)" />
          <path d="M1020,50 L1046,80 L994,80 Z" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>

      {/* Mid pine forest */}
      <div ref={layerMidRef} className="absolute inset-0">
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
        >
          {/* Groups of pines spaced across width */}
          {Array.from({ length: 22 }).map((_, i) => {
            const x = (i / 21) * 1440;
            const h = 80 + (i % 4) * 20;
            const spread = 16 + (i % 3) * 4;
            const y = 380 - (i % 3) * 15;
            return (
              <g key={i}>
                <polygon
                  points={`${x},${y - h} ${x - spread},${y} ${x + spread},${y}`}
                  fill={g.mtn[1]}
                  opacity="0.85"
                />
                <polygon
                  points={`${x},${y - h * 1.3} ${x - spread * 0.7},${y - h * 0.4} ${x + spread * 0.7},${y - h * 0.4}`}
                  fill={g.mtn[0]}
                  opacity="0.7"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Near ground mist */}
      <div ref={layerNearRef} className="absolute bottom-0 left-0 right-0 h-48">
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(0deg, ${variant === "ember" ? "rgba(13,5,5,0.95)" : "#0a0d08"} 0%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}
