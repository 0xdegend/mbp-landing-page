"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { HeroBackdropRefs } from "./heroTypes";
import FloatingParticleLayer from "./FloatingParticleLayer";

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  width: number;
  height: number;
  top: string;
  left: string;
  background: string;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
  transform: string;
};

type Firefly = {
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  background: string;
  boxShadow: string;
  animationName: string;
};

export default function HeroBackdrop({
  spotlightRef,
  clawRef,
  auroraRef,
  sceneRef,
  layer1Ref,
  layer2Ref,
  layer3Ref,
  warningRef,
}: HeroBackdropRefs) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo<Star[]>(() => {
    const random = mulberry32(1337);

    return Array.from({ length: 80 }, (_, i) => ({
      width: random() * 2.5 + 0.5,
      height: random() * 2.5 + 0.5,
      top: `${random() * 45}%`,
      left: `${random() * 100}%`,
      background: i % 5 === 0 ? "#7ec8e3" : "white",
      opacity: random() * 0.7 + 0.1,
      animationDuration: `${2 + random() * 4}s`,
      animationDelay: `${random() * 5}s`,
      transform: `translateZ(${-100 - random() * 200}px)`,
    }));
  }, []);

  const fireflies = useMemo<Firefly[]>(() => {
    const random = mulberry32(4242);

    return Array.from({ length: 12 }, (_, i) => ({
      top: `${20 + random() * 60}%`,
      left: `${random() * 100}%`,
      animationDuration: `${6 + random() * 8}s`,
      animationDelay: `${random() * 6}s`,
      background: i % 3 === 0 ? "#ffaa00" : "#7ec8e3",
      boxShadow: `0 0 ${8 + i * 2}px ${
        i % 3 === 0 ? "rgba(255,170,0,0.6)" : "rgba(126,200,227,0.4)"
      }`,
      animationName: `firefly${i % 3}`,
    }));
  }, []);

  return (
    <>
      <div
        ref={spotlightRef}
        className="fixed pointer-events-none z-50"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,57,43,0.06) 0%, rgba(232,77,14,0.03) 30%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />

      <div ref={clawRef} className="absolute inset-0 z-40 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="claw-slash absolute"
            style={{
              top: `${25 + i * 18}%`,
              left: "10%",
              width: "80%",
              height: 4,
              background:
                "linear-gradient(90deg, transparent, rgba(192,57,43,0.8) 20%, rgba(232,77,14,0.6) 80%, transparent)",
              transform: `rotate(${-3 + i * 2}deg) scaleX(0)`,
              borderRadius: 2,
              boxShadow:
                "0 0 20px rgba(192,57,43,0.5), 0 0 40px rgba(232,77,14,0.3)",
            }}
          />
        ))}
      </div>

      <div
        ref={auroraRef}
        className="absolute top-0 left-0 right-0 h-[60%] pointer-events-none aurora-shimmer"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(46,139,87,0.08) 20%, rgba(192,57,43,0.05) 40%, rgba(0,100,148,0.06) 60%, rgba(46,139,87,0.04) 80%, transparent 100%)",
          backgroundSize: "200% 100%",
          filter: "blur(60px)",
          zIndex: 1,
          opacity: 0,
        }}
      />

      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ zIndex: 1, transformStyle: "preserve-3d" }}
        >
          {mounted &&
            stars.map((star, i) => (
              <div
                key={i}
                className="absolute rounded-full star-twinkle"
                style={{
                  width: star.width,
                  height: star.height,
                  top: star.top,
                  left: star.left,
                  background: star.background,
                  opacity: star.opacity,
                  animationDuration: star.animationDuration,
                  animationDelay: star.animationDelay,
                  transform: star.transform,
                }}
              />
            ))}
        </div>

        <div
          ref={layer1Ref}
          className="absolute bottom-0 left-0 right-0"
          style={{
            zIndex: 2,
            transform: "translateZ(-80px) scale(1.08)",
            opacity: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 450"
            preserveAspectRatio="none"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="mtG1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f3d15" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#071a09" />
              </linearGradient>
              <linearGradient id="mtG2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a2a0e" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#050e06" stopOpacity="0.9" />
              </linearGradient>
              <filter id="mtGlow">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <path
              d="M0,350 L60,200 L140,260 L260,110 L380,180 L500,70 L600,150 L720,40 L840,120 L960,80 L1080,160 L1180,50 L1300,130 L1380,90 L1440,170 L1440,450 L0,450Z"
              fill="url(#mtG2)"
            />
            <path
              d="M0,320 L100,190 L180,240 L300,120 L420,170 L540,90 L640,155 L740,70 L840,140 L960,100 L1080,160 L1180,80 L1300,150 L1380,110 L1440,180 L1440,450 L0,450Z"
              fill="url(#mtG1)"
            />
            <path
              d="M260,110 L295,150 L225,150Z"
              fill="white"
              opacity="0.6"
              filter="url(#mtGlow)"
            />
            <path
              d="M720,40 L755,80 L685,80Z"
              fill="white"
              opacity="0.55"
              filter="url(#mtGlow)"
            />
            <path
              d="M1180,50 L1210,85 L1150,85Z"
              fill="white"
              opacity="0.45"
              filter="url(#mtGlow)"
            />
            <path
              d="M500,70 L530,105 L470,105Z"
              fill="white"
              opacity="0.4"
              filter="url(#mtGlow)"
            />
          </svg>
        </div>

        <div
          ref={layer2Ref}
          className="absolute bottom-0 left-0 right-0"
          style={{
            zIndex: 3,
            transform: "translateZ(-40px) scale(1.04)",
            opacity: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-auto"
          >
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450].map((x, i) => (
              <g
                key={`l${i}`}
                transform={`translate(${x}, ${255 - (i % 4) * 12})`}
              >
                <polygon
                  points="0,-70 -22,0 22,0"
                  fill="#0f2210"
                  opacity="0.95"
                />
                <polygon
                  points="0,-100 -16,-35 16,-35"
                  fill="#162e18"
                  opacity="0.85"
                />
                <polygon
                  points="0,-120 -11,-60 11,-60"
                  fill="#1a3a1c"
                  opacity="0.75"
                />
              </g>
            ))}
            {[1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1440].map(
              (x, i) => (
                <g
                  key={`r${i}`}
                  transform={`translate(${x}, ${255 - (i % 4) * 10})`}
                >
                  <polygon
                    points="0,-65 -20,0 20,0"
                    fill="#0f2210"
                    opacity="0.95"
                  />
                  <polygon
                    points="0,-90 -14,-32 14,-32"
                    fill="#162e18"
                    opacity="0.85"
                  />
                  <polygon
                    points="0,-108 -9,-52 9,-52"
                    fill="#1a3a1c"
                    opacity="0.75"
                  />
                </g>
              ),
            )}
            <rect
              x="0"
              y="255"
              width="1440"
              height="65"
              fill="#0a1a0b"
              opacity="0.9"
            />
          </svg>
        </div>

        <div
          ref={layer3Ref}
          className="absolute bottom-0 left-0 right-0"
          style={{ zIndex: 4, opacity: 0 }}
        >
          <div className="relative w-full h-48">
            <div
              className="absolute inset-0 mist-layer"
              style={
                {
                  background:
                    "linear-gradient(to top, rgba(10,13,8,0.95), rgba(13,26,14,0.4), transparent)",
                  filter: "blur(15px)",
                  "--drift-time": "12s",
                } as CSSProperties & { [key: string]: string | number }
              }
            />
            <div
              className="absolute inset-0 mist-layer"
              style={
                {
                  background:
                    "linear-gradient(to top, rgba(10,13,8,0.6), rgba(45,90,46,0.1), transparent)",
                  filter: "blur(30px)",
                  animationDelay: "-5s",
                  "--drift-time": "18s",
                } as CSSProperties & { [key: string]: string | number }
              }
            />
          </div>
        </div>
      </div>

      <FloatingParticleLayer count={15} type="ember" className="z-[5]" />
      <FloatingParticleLayer count={10} type="dust" className="z-[5]" />

      <div className="absolute inset-0 z-[5] pointer-events-none">
        {mounted &&
          fireflies.map((firefly, i) => (
            <div
              key={i}
              className="absolute rounded-full firefly-glow"
              style={{
                width: 4,
                height: 4,
                background: firefly.background,
                boxShadow: firefly.boxShadow,
                top: firefly.top,
                left: firefly.left,
                animationDuration: firefly.animationDuration,
                animationDelay: firefly.animationDelay,
                animationName: firefly.animationName,
              }}
            />
          ))}
      </div>

      <div
        ref={warningRef}
        className="absolute top-28 left-4 sm:left-8 lg:left-16 z-20"
        style={{ transformOrigin: "top center", opacity: 0 }}
      >
        <div className="warning-sign rounded-sm" style={{ width: 120 }}>
          <div className="warning-header px-2 py-1 text-center text-xs">
            ⚠ WARNING
          </div>
          <div className="p-2 text-center">
            <p className="text-[9px] font-bold text-gray-900 leading-tight font-display tracking-wide uppercase">
              MAN-BEAR-PIG
              <br />
              SEEN
              <br />
              IN
              <br />
              THIS
              <br />
              AREA
            </p>
          </div>
          <div className="hidden lg:block absolute -bottom-16 left-1/2 -translate-x-1/2 w-2 bg-[#5a3a20] h-16" />
        </div>
      </div>
    </>
  );
}
