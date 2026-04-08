"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FloatingParticleLayerProps {
  count?: number;
  type?: "ember" | "dust" | "fog";
  className?: string;
}

export default function FloatingParticleLayer({
  count = 30,
  type = "ember",
  className = "",
}: FloatingParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = {
      ember: ["#e84d0e", "#c0392b", "#ff6b35", "#ffaa00", "#ff8c00"],
      dust: ["rgba(232,220,200,0.6)", "rgba(184,197,204,0.4)", "rgba(255,255,255,0.3)"],
      fog: ["rgba(45,90,46,0.15)", "rgba(74,124,89,0.1)", "rgba(27,42,28,0.2)"],
    };

    const spawnParticle = (): Particle => {
      const maxLife = type === "ember" ? 120 + Math.random() * 80 : 200 + Math.random() * 100;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: type === "ember"
          ? 1 + Math.random() * 4
          : type === "fog"
          ? 60 + Math.random() * 120
          : 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * (type === "ember" ? 1.5 : 0.3),
        speedY: -(0.3 + Math.random() * (type === "ember" ? 1.5 : 0.5)),
        opacity: type === "ember" ? 0.8 + Math.random() * 0.2 : 0.1 + Math.random() * 0.3,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        life: 0,
        maxLife,
      };
    };

    // Seed initial particles at random life stages
    for (let i = 0; i < count; i++) {
      const p = spawnParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        const fadeOpacity = lifeRatio < 0.2
          ? (lifeRatio / 0.2) * p.opacity
          : lifeRatio > 0.7
          ? ((1 - lifeRatio) / 0.3) * p.opacity
          : p.opacity;

        if (type === "ember") {
          // Draw ember as glowing dot
          ctx.save();
          ctx.globalAlpha = fadeOpacity;
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (type === "dust") {
          ctx.save();
          ctx.globalAlpha = fadeOpacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = fadeOpacity * 0.15;
          const fog = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          fog.addColorStop(0, p.color);
          fog.addColorStop(1, "transparent");
          ctx.fillStyle = fog;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Respawn at bottom
        if (p.life >= p.maxLife || p.y < -20) {
          particles[i] = spawnParticle();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count, type]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 2 }}
    />
  );
}
