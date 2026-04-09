"use client";
import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const GALLERY = [
  { src: "/gallery/alliance-1.jpg", alt: "Sui Alliance — The Pack Unleashed" },
  { src: "/gallery/alliance-2.jpeg", alt: "Sui Alliance — Beast Warriors" },
  { src: "/gallery/alliance-3.jpg", alt: "Sui Alliance — The Charge" },
  { src: "/gallery/alliance-4.jpg", alt: "Sui Alliance — Pack Formation" },
  { src: "/gallery/alliance-5.jpg", alt: "Sui Alliance — United Front" },
  { src: "/gallery/alliance-6.jpg", alt: "Sui Alliance — The Council" },
  { src: "/gallery/alliance-7.jpg", alt: "Sui Alliance — Battle Ready" },
  { src: "/gallery/alliance-8.jpg", alt: "Sui Alliance — Night Raid" },
  { src: "/gallery/alliance-9.jpg", alt: "Sui Alliance — The Legends" },
];

/* ═══════════════════════════════════════════════════════
   Single gallery card (extracted for hooks)
   ═══════════════════════════════════════════════════════ */
function GalleryCard({
  src,
  alt,
  index,
  total,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: x * 8,
      rotateX: y * -8,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="gallery-item group relative flex-shrink-0 overflow-hidden rounded-xl cursor-pointer"
      style={{
        width: "clamp(280px, 28vw, 420px)",
        height: "clamp(400px, 75vh, 700px)",
        perspective: 600,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 80vw, 28vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Gradient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050803]/70 via-transparent to-[#050803]/20 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

      {/* Bottom info on hover */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-moss/40 to-transparent" />
          <span className="font-display text-[8px] tracking-[0.3em] uppercase text-bone/50">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Edge glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(74,124,89,0.4), transparent)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Alliance — horizontal scroll gallery
   ═══════════════════════════════════════════════════════ */
export default function AllianceComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const totalScroll = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      /* Header reveal */
      if (headerRef.current) {
        const items = headerRef.current.querySelectorAll(".gallery-reveal");
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      /* Horizontal scroll driven by vertical scroll */
      const horizTween = gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 120px",
          end: () => `+=${totalScroll}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      /* Per-image reveal as they scroll into view */
      const images = track.querySelectorAll(".gallery-item");
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              containerAnimation: horizTween,
              start: "left 95%",
              end: "left 60%",
              scrub: 0.5,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="alliance"
      ref={sectionRef}
      className="relative bg-[#050803] overflow-hidden"
    >
      <div className="relative z-10">
        {/* ── Header — pinned left while images scroll ── */}
        <div
          ref={headerRef}
          className="absolute top-0 left-0 z-20 flex flex-col justify-center h-full pl-6 sm:pl-10 lg:pl-16 pointer-events-none"
          style={{ width: "clamp(260px, 22vw, 380px)" }}
        >
          <div className="gallery-reveal mb-4 inline-flex items-center gap-2 rounded-full border border-moss/15 bg-moss/[0.06] px-3 py-1.5 pointer-events-auto w-fit">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1a9cd2] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1a9cd2]" />
            </span>
            <span className="font-display text-[9px] tracking-[0.35em] uppercase text-bone/60">
              PandaSui Projects
            </span>
          </div>

          <h2 className="gallery-reveal font-beast text-4xl leading-[0.9] text-bone sm:text-5xl lg:text-6xl xl:text-7xl">
            SUI
            <br />
            <span
              style={{
                WebkitTextStroke: "2px #1a9cd2",
                color: "transparent",
                textShadow:
                  "0 0 30px rgba(26,156,210,0.22), 0 0 60px rgba(26,156,210,0.1)",
              }}
            >
              ALLIANCE
            </span>
          </h2>

          <p className="gallery-reveal mt-4 max-w-[200px] font-display text-[11px] tracking-[0.15em] uppercase text-ash/30 leading-relaxed">
            Forged on PandaSui, unleashed on Sui.
          </p>

          {/* Scroll hint */}
          <div className="gallery-reveal mt-8 flex items-center gap-2">
            <div className="w-6 h-px bg-moss/30" />
            <span className="font-display text-[8px] tracking-[0.3em] uppercase text-ash/20">
              Scroll to explore
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-moss/30"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Fade overlay on left edge */}
        <div
          className="absolute top-0 left-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: "clamp(280px, 24vw, 420px)",
            background: "linear-gradient(90deg, #050803 60%, transparent 100%)",
          }}
        />

        {/* ── Horizontal track ── */}
        <div
          ref={trackRef}
          className="flex items-center gap-4 lg:gap-5 py-6 lg:py-8"
          style={{
            paddingLeft: "clamp(300px, 26vw, 440px)",
            paddingRight: "6vw",
          }}
        >
          {GALLERY.map((img, i) => (
            <GalleryCard
              key={img.src}
              src={img.src}
              alt={img.alt}
              index={i}
              total={GALLERY.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
