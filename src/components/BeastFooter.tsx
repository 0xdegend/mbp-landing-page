"use client";

export default function BeastFooter() {
  const links = {
    "The Beast": [
      { label: "About $MBP", href: "#lore" },
      { label: "Burn Mechanics", href: "#burn" },
      { label: "The Hunt (Roadmap)", href: "#roadmap" },
      { label: "Alliance", href: "#alliance" },
    ],
    "The Pack": [
      { label: "Telegram", href: "#" },
      { label: "Twitter / X", href: "#" },
      { label: "Discord", href: "#" },
      { label: "DexScreener", href: "#" },
    ],
    "The Forest": [
      { label: "PandaSui", href: "#" },
      { label: "Sui Ecosystem", href: "https://sui.io" },
      { label: "CoinGecko", href: "#" },
      { label: "CMC", href: "#" },
    ],
  };

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(href, "_blank");
    }
  };

  return (
    <footer className="relative bg-[#050705] border-t border-forest-green/20 overflow-hidden">
      {/* Scratch mark decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-scarlet/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🐾</div>
              <div>
                <div className="font-beast text-xl text-bone">
                  MAN<span className="text-scarlet">BEAR</span>PIG
                </div>
                <div className="font-display text-xs tracking-widest text-moss uppercase">$MBP · Sui</div>
              </div>
            </div>
            <p className="font-body text-sm text-ash/70 leading-relaxed mb-4">
              The most savage meme beast on the Sui blockchain. Half man. Half bear. Half pig. 100% community.
            </p>
            <div className="flex gap-3">
              {["𝕏", "📢", "💬"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center border border-forest-green/30 hover:border-scarlet/50 hover:bg-scarlet/10 transition-all duration-200 text-sm"
                  style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-display text-xs tracking-[0.3em] uppercase text-scarlet mb-4">{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => scrollTo(item.href)}
                      className="font-body text-sm text-ash/70 hover:text-bone transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-3 h-px bg-forest-green/40 group-hover:bg-scarlet/60 transition-colors duration-200 flex-shrink-0" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-forest-green/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-xs tracking-widest uppercase text-ash/40">
              © 2024 ManBearPig ($MBP). All rights reserved. Built on Sui.
            </p>
            <p className="font-display text-xs tracking-wider text-ash/30 italic">
              "Not financial advice. The beast is not responsible for your bags."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
