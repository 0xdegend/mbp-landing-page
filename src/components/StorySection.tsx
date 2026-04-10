"use client";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHAPTERS = [
  {
    num: "01",
    title: "The Mist",
    tag: "Primordial Origins",
    body: "From the blackened forests of Sui, where the pines grow old and the mountains never sleep, a mist began to gather. Ancient. Hungry. Waiting.",
  },
  {
    num: "02",
    title: "The Convergence",
    tag: "Three Become One",
    body: "Man's cunning. Bear's might. Pig's insatiable hunger. Three forces collided in the mist, and something ancient stirred beneath the chain.",
  },
  {
    num: "03",
    title: "The Awakening",
    tag: "The Beast Emerges",
    body: "The blockchain trembled. The forest went silent. ManBearPig was born — a force of nature the chain could barely contain. The legend begins now.",
  },
];

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const frameCornersRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video || !pinRef.current || !sectionRef.current) return;

      // ── tryPlay: attempt with sound, fall back to muted→unmuted ──
      const tryPlay = () => {
        video.play().catch(() => {
          video.muted = true;
          video
            .play()
            .then(() => {
              video.muted = false;
            })
            .catch(() => {});
        });
      };

      // ── Refresh ScrollTrigger once the page is fully loaded ──
      // This is the key fix for the reload case: layout is fully
      // settled before scroll positions are calculated.
      const onLoad = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") {
        // Already loaded (e.g. fast reload from cache)
        ScrollTrigger.refresh();
      } else {
        window.addEventListener("load", onLoad, { once: true });
      }

      // ── Title characters ──
      const chars = titleRef.current?.querySelectorAll(".story-char");
      if (chars?.length) {
        gsap.fromTo(
          chars,
          { opacity: 0, y: 80, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // ── Reveals ──
      gsap.fromTo(
        ".story-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );

      // ── Pin timeline ──
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top 80px",
          end: "+=2400",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setActiveChapter(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${p * 100}%`;
            }
          },
        },
      });

      pinTl
        .fromTo(
          ".story-video-frame",
          { scale: 0.92, filter: "brightness(0.6) saturate(0.7)" },
          {
            scale: 1,
            filter: "brightness(1) saturate(1)",
            duration: 1,
            ease: "power2.out",
          },
          0,
        )
        .fromTo(
          ".story-corner",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05 },
          0.1,
        )
        .fromTo(
          ".chapter-1",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.2,
        )
        .to(".chapter-1", { opacity: 0, y: -40, duration: 0.6 }, 1.4)
        .fromTo(
          ".chapter-2",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.7,
        )
        .to(".chapter-2", { opacity: 0, y: -40, duration: 0.6 }, 2.9)
        .fromTo(
          ".chapter-3",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          3.2,
        );

      // ── Mist particles ──
      sectionRef.current
        .querySelectorAll<HTMLDivElement>(".story-mist")
        .forEach((p, i) => {
          gsap.set(p, {
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0,
          });
          gsap.to(p, {
            opacity: 0.15 + Math.random() * 0.2,
            duration: 2 + Math.random() * 2,
            delay: i * 0.3,
            ease: "sine.inOut",
          });
          gsap.to(p, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            duration: 14 + Math.random() * 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4,
          });
        });

      // ── Video play trigger — registered AFTER pin ──
      // toggleActions alone isn't enough because scrub:true disables
      // the standard toggle. We use the callbacks directly.
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top 80px",
        end: "+=2400",
        onEnter: () => {
          video.currentTime = 0;
          tryPlay();
        },
        onEnterBack: () => {
          tryPlay();
        },
        onLeave: () => {
          video.pause();
          video.currentTime = 0;
        },
        onLeaveBack: () => {
          video.pause();
          video.currentTime = 0;
        },
      });
    },
    // scope: ties the gsap context to this element — cleanup is automatic
    { scope: sectionRef },
  );

  return (
    <section
      id="lore"
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#0d1a0e] via-[#0a0d08] to-[#0d1a0e] overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 900,
          background:
            "radial-gradient(circle, rgba(192,57,43,0.05) 0%, rgba(74,124,89,0.04) 30%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Mist particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`m-${i}`}
          className="story-mist absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            background:
              i % 3 === 0
                ? "rgba(192,57,43,0.6)"
                : i % 3 === 1
                  ? "rgba(74,124,89,0.6)"
                  : "rgba(232,220,200,0.5)",
            boxShadow: "0 0 10px currentColor",
          }}
        />
      ))}

      {/* ── Header ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-10">
        <div className="text-center">
          <div className="story-reveal mb-4 inline-flex items-center gap-2 rounded-sm border border-moss/15 bg-moss/[0.06] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-scarlet" />
            </span>
            <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/60">
              Chapter One · The Legend
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-beast text-5xl lg:text-7xl xl:text-8xl leading-[0.9] mb-4"
            style={{ perspective: 800 }}
          >
            <span
              className="inline-block text-bone"
              style={{ transformStyle: "preserve-3d" }}
            >
              {"THE ".split("").map((ch, i) => (
                <span
                  key={`a-${i}`}
                  className="story-char inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <span
              className="inline-block"
              style={{
                transformStyle: "preserve-3d",
                WebkitTextStroke: "2px #c0392b",
                color: "transparent",
                textShadow:
                  "0 0 30px rgba(192,57,43,0.25), 0 0 60px rgba(192,57,43,0.12)",
              }}
            >
              {"$MBP ".split("").map((ch, i) => (
                <span
                  key={`b-${i}`}
                  className="story-char inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <span
              className="inline-block text-bone"
              style={{ transformStyle: "preserve-3d" }}
            >
              {"STORY".split("").map((ch, i) => (
                <span
                  key={`c-${i}`}
                  className="story-char inline-block"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h2>

          <p className="story-reveal font-display text-sm tracking-[0.2em] uppercase text-ash/40 max-w-xl mx-auto">
            Carved into stone. Burned into chain. The legend of ManBearPig.
          </p>
        </div>
      </div>

      {/* ── Pinned video stage ── */}
      <div
        ref={pinRef}
        className="relative h-screen flex items-center justify-center"
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10 items-center">
            {/* ── Video frame ── */}
            <div className="relative">
              <div
                className="story-video-frame relative aspect-video w-full overflow-hidden rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #0a0d08 0%, #0d1a0e 100%)",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(74,124,89,0.12), inset 0 0 0 1px rgba(232,220,200,0.04)",
                }}
              >
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  preload="auto"
                  poster="/story-poster.jpg"
                  aria-label="The legend of $MBP"
                >
                  <source src="/videos/mbp-video-1.mp4" type="video/mp4" />
                </video>

                {/* Edge gradient vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,13,8,0.35) 0%, transparent 20%, transparent 70%, rgba(10,13,8,0.75) 100%)",
                  }}
                />

                {/* ── Animated frame corners ── */}
                <div
                  ref={frameCornersRef}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[
                    "top-3 left-3 border-l-2 border-t-2",
                    "top-3 right-3 border-r-2 border-t-2",
                    "bottom-3 left-3 border-l-2 border-b-2",
                    "bottom-3 right-3 border-r-2 border-b-2",
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className={`story-corner absolute w-6 h-6 ${cls} border-scarlet/60`}
                      style={{
                        filter: "drop-shadow(0 0 4px rgba(192,57,43,0.5))",
                      }}
                    />
                  ))}
                </div>

                {/* ── Top-left recording indicator ── */}
                <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-scarlet" />
                  </span>
                  <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/70">
                    Rec · Live
                  </span>
                </div>

                {/* ── Bottom chapter indicator ── */}
                <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/50">
                      Chapter {CHAPTERS[activeChapter]?.num}
                    </span>
                    <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/50">
                      {String(activeChapter + 1).padStart(2, "0")} /{" "}
                      {String(CHAPTERS.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      ref={progressFillRef}
                      className="h-full bg-gradient-to-r from-scarlet via-ember to-scarlet"
                      style={{
                        width: "0%",
                        boxShadow: "0 0 8px rgba(192,57,43,0.6)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Decorative side ticks */}
              <div className="absolute top-0 -left-4 bottom-0 hidden lg:flex flex-col justify-between py-4 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-px bg-moss/20"
                    style={{ width: i % 2 === 0 ? 8 : 4 }}
                  />
                ))}
              </div>
              <div className="absolute top-0 -right-4 bottom-0 hidden lg:flex flex-col justify-between py-4 items-end pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-px bg-moss/20"
                    style={{ width: i % 2 === 0 ? 8 : 4 }}
                  />
                ))}
              </div>
            </div>

            {/* ── Chapter text (animated in/out) ── */}
            <div className="relative min-h-[260px] lg:min-h-[340px]">
              {CHAPTERS.map((ch, i) => (
                <div
                  key={ch.num}
                  className={`chapter-${i + 1} absolute inset-0 flex flex-col justify-center`}
                  style={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-beast text-5xl lg:text-6xl"
                      style={{
                        WebkitTextStroke: "1.5px #c0392b",
                        color: "transparent",
                      }}
                    >
                      {ch.num}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-scarlet/50 to-transparent" />
                  </div>
                  <div className="font-display text-[10px] tracking-[0.35em] uppercase text-scarlet/80 mb-2">
                    {ch.tag}
                  </div>
                  <h3 className="font-beast text-3xl lg:text-4xl text-bone mb-4 leading-[0.95]">
                    {ch.title}
                  </h3>
                  <p className="font-body text-sm lg:text-base text-ash/70 leading-relaxed max-w-sm">
                    {ch.body}
                  </p>

                  {/* Chapter index dots */}
                  <div className="flex gap-2 mt-6">
                    {CHAPTERS.map((_, j) => (
                      <div
                        key={j}
                        className="h-[2px] rounded-full transition-all duration-500"
                        style={{
                          width: j === i ? 24 : 10,
                          backgroundColor:
                            j === i
                              ? "#c0392b"
                              : j < i
                                ? "rgba(192,57,43,0.4)"
                                : "rgba(232,220,200,0.15)",
                          boxShadow:
                            j === i ? "0 0 8px rgba(192,57,43,0.6)" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Closing inscription ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <div className="story-reveal flex items-center justify-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-scarlet/40" />
          <span className="font-beast text-xl text-scarlet">ManBearPig</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-scarlet/40" />
        </div>
        <p className="story-reveal font-display text-xs tracking-[0.25em] uppercase text-ash/30 italic max-w-md mx-auto">
          &ldquo;The chain gave it purpose. The forest gave it form. The pack
          gives it life.&rdquo;
        </p>
      </div>
    </section>
  );
}
