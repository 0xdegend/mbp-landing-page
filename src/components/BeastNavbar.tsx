"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function BeastNavbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 },
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Origin", href: "#lore" },
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "Burn", href: "#burn" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Alliance", href: "#alliance" },
  ];

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-forest-black/95 backdrop-blur-md shadow-sm shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div
              ref={logoRef}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative">
                <div className="w-10 h-10 clip-hex overflow-hidden rounded-full">
                  <Image
                    src="/favicon.png"
                    alt="ManBearPig logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <div>
                <span className="font-beast text-xl text-bone tracking-wider">
                  M<span className="text-scarlet">B</span>P
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-display text-sm font-500 tracking-widest uppercase text-ash hover:text-bone transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-scarlet group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* CTA + Mobile Menu */}
            <div className="flex  items-center gap-3">
              <a
                href="https://app.cetus.zone/swap/0x2::sui::SUI/0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP"
                target="_blank"
                rel="noopener noreferrer"
                className="!hidden lg:!inline-flex btn-beast btn-beast-primary text-sm"
              >
                Buy $MBP
              </a>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-bone transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block w-6 h-0.5 bg-bone transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block w-6 h-0.5 bg-bone transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-96  border-forest-green/30" : "max-h-0"
          }`}
        >
          <div className="bg-forest-black/95 backdrop-blur-md shadow-sm shadow-black/50 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-display text-sm tracking-widest uppercase text-bone text-left py-2 border-b border-forest-green/20"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://app.cetus.zone/swap/0x2::sui::SUI/0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-beast btn-beast-primary text-sm text-center"
            >
              Buy $MBP
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
