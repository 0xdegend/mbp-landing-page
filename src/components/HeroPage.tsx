"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroBackdrop from "./HeroBackdrop";
import HeroLeftPanel from "./HeroLeftPanel";
import HeroRightPanel from "./HeroRightPanel";

export default function HeroPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const beastWordRef = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const beastCardRef = useRef<HTMLDivElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const microcopyRef = useRef<HTMLParagraphElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const clawRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  // glowRingRef removed — energy ring replaced by mountain layers
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const primaryCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineBtnRef = useRef<HTMLButtonElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const beastEmberCanvasRef = useRef<HTMLCanvasElement>(null);

  const mistARef = useRef<HTMLDivElement>(null);
  const mistBRef = useRef<HTMLDivElement>(null);
  const beastBadgeRef = useRef<HTMLDivElement>(null);

  const socials = [
    { label: "𝕏 Twitter", href: "https://x.com/ManBearPig_25" },
    { label: "Telegram", href: "https://t.me/manbearpig_25" },
    { label: "Discord", href: "https://discord.gg/P6J99uXnnp" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      /* ── Phase 1: Atmosphere fades in ────────────────────────── */
      tl.fromTo(
        auroraRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: "power2.inOut" },
        0,
      );

      /* ── Phase 2: 3-D mountains rise from the depths ─────── */
      tl.fromTo(
        layer1Ref.current,
        { opacity: 0, y: 200 },
        { opacity: 1, y: 0, duration: 2, ease: "power3.out" },
        0.3,
      );
      tl.fromTo(
        layer2Ref.current,
        { opacity: 0, y: 150 },
        { opacity: 1, y: 0, duration: 1.8, ease: "power3.out" },
        0.5,
      );
      tl.fromTo(
        layer3Ref.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
        0.7,
      );

      /* ── Phase 3: Claw marks slash across the screen ──────── */
      const clawMarks = clawRef.current?.querySelectorAll(".claw-slash");
      if (clawMarks?.length) {
        tl.fromTo(
          clawMarks,
          { scaleX: 0, opacity: 1 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: "power4.in",
            transformOrigin: "left center",
          },
          1.2,
        ).to(clawMarks, {
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          delay: 0.2,
        });
      }

      /* ── Phase 4: "THE" drops in with weight ─────────────── */
      const theWord = headlineRef.current?.querySelector(".word-the");
      if (theWord) {
        tl.fromTo(
          theWord,
          { opacity: 0, y: -100, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          1.5,
        );
      }

      /* ── Phase 5: "BEAST" explodes in letter-by-letter ───── */
      const beastChars = beastWordRef.current?.querySelectorAll(".hero-char");
      if (beastChars?.length) {
        tl.fromTo(
          beastChars,
          {
            opacity: 0,
            scale: 0,
            rotation: () => gsap.utils.random(-45, 45),
            y: () => gsap.utils.random(-80, 80),
            x: () => gsap.utils.random(-50, 50),
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            x: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          1.8,
        );

        // Glitch shake after letters assemble
        tl.to(beastWordRef.current, {
          keyframes: [
            { x: -8, skewX: -5, duration: 0.05 },
            { x: 6, skewX: 8, duration: 0.05 },
            { x: -4, skewX: -3, duration: 0.05 },
            { x: 3, skewX: 2, duration: 0.05 },
            { x: 0, skewX: 0, duration: 0.05 },
          ],
        });
      }

      /* ── Phase 6: "OF SUI" slides up ─────────────────────── */
      const ofSui = headlineRef.current?.querySelector(".word-ofsui");
      if (ofSui) {
        tl.fromTo(
          ofSui,
          { opacity: 0, y: 60, rotateX: 45 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: "power3.out" },
          2.4,
        );
      }

      /* ── Phase 7: Mist fades in ──────────────────────────── */
      tl.fromTo(
        [mistARef.current, mistBRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power1.inOut" },
        1.5,
      );

      /* ── Phase 9: Beast emerges ──────────────────────────── */
      tl.fromTo(
        beastCardRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        1.8,
      );

      /* ── Phase 11: Warning sign swings in ────────────────── */
      tl.fromTo(
        warningRef.current,
        { opacity: 0, rotation: -45, x: -200, scale: 0.5 },
        {
          opacity: 1,
          rotation: -6,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        2.8,
      );

      /* ── Phase 12: Beast WARNING badge swings in ─────────── */
      tl.fromTo(
        beastBadgeRef.current,
        { opacity: 0, x: 30, rotation: -15 },
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.6)",
        },
        3.0,
      );

      /* ── Phase 13: Badge + copy + CTAs ───────────────────── */
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" },
        2.0,
      );
      tl.fromTo(
        subheadRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        2.8,
      );
      tl.fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        3.0,
      );
      tl.fromTo(
        microcopyRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        3.1,
      );
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.8)" },
        3.0,
      );

      /* ── Continuous loops ─────────────────────────────────── */
      // Beast breathing — subtle scale oscillation
      gsap.to(beastRef.current, {
        scale: 1.015,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 3.5,
      });
    }, sectionRef);

    /* ═══ BEAST BUTTON SYSTEMS ═══════════════════════════ */
    const cleanups: (() => void)[] = [];

    /* ── 1. Canvas ember particles (primary only) ──────── */
    const setupEmbers = () => {
      const canvas = primaryCanvasRef.current;
      const btn = primaryBtnRef.current;
      if (!canvas || !btn) return;
      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;

      interface Ember {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        life: number;
        maxLife: number;
        hue: number;
      }

      const embers: Ember[] = [];
      let isHovered = false;
      let animId = 0;

      const resize = () => {
        const rect = btn.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };
      resize();

      const spawnEmber = () => {
        const w = canvas.width;
        const h = canvas.height;
        embers.push({
          x: 8 + Math.random() * (w - 16),
          y: h - 2,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(1.2 + Math.random() * 1.5),
          size: 1.5 + Math.random() * 2.5,
          life: 1,
          maxLife: 40 + Math.random() * 30,
          hue: Math.random() > 0.5 ? 0 : 20, // scarlet or ember
        });
      };

      let spawnTimer = 0;
      const loop = () => {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);

        if (isHovered) {
          spawnTimer++;
          if (spawnTimer % 4 === 0 && embers.length < 8) spawnEmber();
        }

        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i];
          e.x += e.vx + (Math.random() - 0.5) * 0.3;
          e.y += e.vy;
          e.vy *= 0.99;
          e.life -= 1 / e.maxLife;

          if (e.life <= 0) {
            embers.splice(i, 1);
            continue;
          }

          const alpha = e.life * 0.9;
          const r = e.hue === 0 ? 192 : 232;
          const g = e.hue === 0 ? 57 : 77;
          const b = e.hue === 0 ? 43 : 14;

          // Glow
          ctx2d.beginPath();
          ctx2d.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
          ctx2d.fillStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
          ctx2d.fill();

          // Core
          ctx2d.beginPath();
          ctx2d.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx2d.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx2d.fill();

          // Hot center
          ctx2d.beginPath();
          ctx2d.arc(e.x, e.y, e.size * 0.4, 0, Math.PI * 2);
          ctx2d.fillStyle = `rgba(255,200,100,${alpha * 0.8})`;
          ctx2d.fill();
        }

        animId = requestAnimationFrame(loop);
      };

      const enter = () => {
        isHovered = true;
        spawnTimer = 0;
      };
      const leave = () => {
        isHovered = false;
      };

      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      animId = requestAnimationFrame(loop);

      cleanups.push(() => {
        cancelAnimationFrame(animId);
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
      });
    };
    setupEmbers();

    /* ── 2. Text scramble (primary button) ─────────────── */
    const setupScramble = (btn: HTMLButtonElement | null) => {
      if (!btn) return;
      const textEl = btn.querySelector(".btn-text") as HTMLElement;
      if (!textEl) return;
      const original = textEl.textContent || "";
      const scrambleChars = "!@#$%&XBEAST0123";
      let scrambleId: ReturnType<typeof setInterval>;

      const enter = () => {
        let iteration = 0;
        const len = original.length;
        scrambleId = setInterval(() => {
          textEl.textContent = original
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < iteration) return original[i];
              return scrambleChars[
                Math.floor(Math.random() * scrambleChars.length)
              ];
            })
            .join("");
          iteration += 0.4; // stagger left→right
          if (iteration >= len) {
            clearInterval(scrambleId);
            textEl.textContent = original;
          }
        }, 30); // ~200ms total for 7 chars
      };
      const leave = () => {
        clearInterval(scrambleId);
        textEl.textContent = original;
      };
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
        clearInterval(scrambleId);
      });
    };
    setupScramble(primaryBtnRef.current);

    /* ── 3. Magnetic hover + click spring (both) ───────── */
    const setupMagnetic = (btn: HTMLButtonElement | null) => {
      if (!btn) return;
      const move = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.15,
          rotateX: -y * 0.06,
          rotateY: x * 0.06,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const leave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
        });
      };
      const click = () => {
        // GSAP particle burst
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < 10; i++) {
          const dot = document.createElement("div");
          dot.className = "beast-particle";
          dot.style.left = cx + "px";
          dot.style.top = cy + "px";
          document.body.appendChild(dot);
          const angle = (i / 10) * Math.PI * 2;
          const dist = gsap.utils.random(50, 120);
          gsap.fromTo(
            dot,
            { scale: gsap.utils.random(0.6, 1.4), opacity: 1 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0,
              opacity: 0,
              duration: gsap.utils.random(0.4, 0.8),
              ease: "power3.out",
              onComplete: () => dot.remove(),
            },
          );
        }
      };
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);
      btn.addEventListener("click", click);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", leave);
        btn.removeEventListener("click", click);
      });
    };
    setupMagnetic(primaryBtnRef.current);
    setupMagnetic(outlineBtnRef.current);

    /* ── 4. SVG border draw on outline button hover ────── */
    const setupBorderDraw = () => {
      const btn = outlineBtnRef.current;
      if (!btn) return;
      const svgRect = btn.querySelector(
        ".btn-border-rect",
      ) as SVGRectElement | null;
      if (!svgRect) return;

      const measure = () => {
        const box = btn.getBoundingClientRect();
        const w = box.width - 2;
        const h = box.height - 2;
        svgRect.setAttribute("width", String(w));
        svgRect.setAttribute("height", String(h));
        const perimeter = 2 * (w + h);
        svgRect.style.strokeDasharray = `${perimeter}`;
        svgRect.style.strokeDashoffset = `${perimeter}`;
        return perimeter;
      };
      let perimeter = measure();

      const enter = () => {
        perimeter = measure();
        gsap.to(svgRect, {
          attr: { "stroke-dashoffset": 0 },
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const leave = () => {
        gsap.to(svgRect, {
          attr: { "stroke-dashoffset": perimeter },
          duration: 0.25,
          ease: "power2.in",
        });
      };
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
      });
    };
    setupBorderDraw();

    /* ── 5. Beast scene ember particles (canvas) ───────── */
    const setupBeastEmbers = () => {
      const canvas = beastEmberCanvasRef.current;
      const panel = rightPanelRef.current;
      if (!canvas || !panel) return;
      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;

      interface BeastEmber {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        life: number;
        maxLife: number;
      }

      const embers: BeastEmber[] = [];
      let isHovered = false;
      let animId = 0;
      let baseRate = 6; // idle spawn interval (frames)

      const resize = () => {
        const r = panel.getBoundingClientRect();
        canvas.width = r.width;
        canvas.height = r.height;
      };
      resize();
      window.addEventListener("resize", resize);

      const spawn = () => {
        const w = canvas.width;
        const h = canvas.height;
        embers.push({
          x: w * 0.2 + Math.random() * w * 0.6,
          y: h - 10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(0.3 + Math.random() * 0.6),
          size: 1.5 + Math.random() * 2,
          life: 1,
          maxLife: 80 + Math.random() * 60,
        });
      };

      let tick = 0;
      const loop = () => {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        tick++;
        const rate = isHovered ? 3 : baseRate;
        if (tick % rate === 0 && embers.length < (isHovered ? 20 : 15)) spawn();

        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i];
          e.x += e.vx + Math.sin(tick * 0.02 + i) * 0.15;
          e.y += e.vy;
          e.life -= 1 / e.maxLife;
          if (e.life <= 0) {
            embers.splice(i, 1);
            continue;
          }

          const a = e.life * 0.3;
          // Outer glow
          ctx2d.beginPath();
          ctx2d.arc(e.x, e.y, e.size * 4, 0, Math.PI * 2);
          ctx2d.fillStyle = `rgba(232,77,14,${a * 0.2})`;
          ctx2d.fill();
          // Core
          ctx2d.beginPath();
          ctx2d.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx2d.fillStyle = `rgba(232,77,14,${a})`;
          ctx2d.fill();
          // Hot dot
          ctx2d.beginPath();
          ctx2d.arc(e.x, e.y, e.size * 0.3, 0, Math.PI * 2);
          ctx2d.fillStyle = `rgba(255,220,100,${a * 0.7})`;
          ctx2d.fill();
        }
        animId = requestAnimationFrame(loop);
      };

      // Delay start per the timeline (2s mark)
      const startTimer = setTimeout(() => {
        animId = requestAnimationFrame(loop);
      }, 2400);

      const enter = () => {
        isHovered = true;
      };
      const leave = () => {
        isHovered = false;
      };
      panel.addEventListener("mouseenter", enter);
      panel.addEventListener("mouseleave", leave);

      cleanups.push(() => {
        clearTimeout(startTimer);
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resize);
        panel.removeEventListener("mouseenter", enter);
        panel.removeEventListener("mouseleave", leave);
      });
    };
    setupBeastEmbers();

    /* ── 6. Right panel hover → eye intensity + beast glow */
    const setupPanelHover = () => {
      const panel = rightPanelRef.current;
      const beast = beastRef.current;

      if (!panel || !beast) return;

      const enter = () => {
        gsap.to(beast.querySelector("video"), {
          filter: "brightness(1.08)",
          duration: 0.3,
          ease: "power2.out",
        });
      };
      const leave = () => {
        gsap.to(beast.querySelector("video"), {
          filter: "brightness(1)",
          duration: 0.4,
          ease: "power2.inOut",
        });
      };
      panel.addEventListener("mouseenter", enter);
      panel.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        panel.removeEventListener("mouseenter", enter);
        panel.removeEventListener("mouseleave", leave);
      });
    };
    setupPanelHover();

    /* ── 3-D mouse parallax ──────────────────────────────── */
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;

      // Rotate the whole 3-D scene slightly
      gsap.to(sceneRef.current, {
        rotateY: xRatio * 2.5,
        rotateX: -yRatio * 1.5,
        duration: 1.5,
        ease: "power2.out",
      });

      // Layer-based depth parallax
      gsap.to(layer1Ref.current, {
        x: xRatio * 30,
        y: yRatio * 15,
        duration: 1.5,
        ease: "power1.out",
      });
      gsap.to(layer2Ref.current, {
        x: xRatio * 20,
        y: yRatio * 10,
        duration: 1.5,
        ease: "power1.out",
      });
      gsap.to(layer3Ref.current, {
        x: xRatio * 10,
        y: yRatio * 5,
        duration: 1.5,
        ease: "power1.out",
      });

      // Spotlight follows cursor
      gsap.to(spotlightRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050a04]"
    >
      <HeroBackdrop
        spotlightRef={spotlightRef}
        clawRef={clawRef}
        auroraRef={auroraRef}
        sceneRef={sceneRef}
        layer1Ref={layer1Ref}
        layer2Ref={layer2Ref}
        layer3Ref={layer3Ref}
        warningRef={warningRef}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[80vh]">
          <HeroLeftPanel
            badgeRef={badgeRef}
            headlineRef={headlineRef}
            beastWordRef={beastWordRef}
            subheadRef={subheadRef}
            taglineRef={taglineRef}
            microcopyRef={microcopyRef}
            ctaRef={ctaRef}
            primaryBtnRef={primaryBtnRef}
            primaryCanvasRef={primaryCanvasRef}
            outlineBtnRef={outlineBtnRef}
            scrollToSection={scrollToSection}
            socials={socials}
          />

          <HeroRightPanel
            rightPanelRef={rightPanelRef}
            mistARef={mistARef}
            mistBRef={mistBRef}
            beastCardRef={beastCardRef}
            beastRef={beastRef}
            beastBadgeRef={beastBadgeRef}
            beastEmberCanvasRef={beastEmberCanvasRef}
          />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="font-display text-xs tracking-widest uppercase text-ash/60">
            Scroll Down
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-ash/40 to-transparent scroll-line-pulse" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 z-20">
        <svg
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,50 L0,30 L30,45 L60,25 L90,40 L120,20 L150,38 L180,18 L210,35 L240,15 L270,32 L300,12 L330,28 L360,10 L390,25 L420,8 L450,22 L480,5 L510,20 L540,3 L570,18 L600,2 L630,17 L660,0 L690,15 L720,0 L750,14 L780,2 L810,16 L840,0 L870,15 L900,3 L930,18 L960,5 L990,20 L1020,8 L1050,25 L1080,10 L1110,28 L1140,12 L1170,30 L1200,15 L1230,32 L1260,18 L1290,35 L1320,20 L1350,38 L1380,25 L1410,40 L1440,28 L1440,50Z"
            fill="#0a0d08"
          />
        </svg>
      </div>
    </section>
  );
}
