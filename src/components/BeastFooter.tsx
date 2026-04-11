"use client";

export default function BeastFooter() {
  const currentYear = new Date().getFullYear();

  const links = {
    "The Beast": [
      { label: "About $MBP", href: "#lore" },
      { label: "Burn Mechanics", href: "#burn" },
      { label: "The Ecosystem", href: "#ecosystem" },
      { label: "Alliance", href: "#alliance" },
    ],
    "The Pack": [
      { label: "Telegram", href: "https://t.me/manbearpig_25" },
      { label: "Twitter / X", href: "https://x.com/ManBearPig_25" },
      { label: "Discord", href: "https://discord.gg/P6J99uXnnp" },
      {
        label: "DexScreener",
        href: "https://dexscreener.com/sui/0x4d68a38f0c7abcea02106da3bab76f5e6b0b242c100746eb1ef9692cd1129d25::mbp::MBP",
      },
    ],
    "The Forest": [
      {
        label: "PandaSui",
        href: "https://www.pandasui.com/projects/manbearpig",
      },
      // { label: "Sui Ecosystem", href: "https://sui.io" },
      // { label: "CoinGecko", href: "#" },
      // { label: "CMC", href: "#" },
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
                <div className="font-display text-xs tracking-widest text-moss uppercase">
                  $MBP · Sui
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-ash/70 leading-relaxed mb-4">
              The most savage meme beast on the Sui blockchain. Half man. Half
              bear. Half pig. 100% community.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: "X (Twitter)",
                  href: "https://x.com/ManBearPig_25",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "Discord",
                  href: "https://discord.gg/P6J99uXnnp",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  ),
                },
                {
                  label: "Telegram",
                  href: "https://t.me/manbearpig_25",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-forest-green/30 text-ash/70 hover:text-bone hover:border-scarlet/50 hover:bg-scarlet/10 transition-all duration-200"
                  style={{
                    clipPath:
                      "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-display text-xs tracking-[0.3em] uppercase text-scarlet mb-4">
                {group}
              </h4>
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
              © {currentYear} ManBearPig. All rights reserved. Built on Sui.
            </p>
            <p className="font-display text-xs tracking-wider text-ash/30 italic">
              "Not financial advice. The beast is not responsible for your
              bags."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
