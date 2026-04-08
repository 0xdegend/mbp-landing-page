"use client";

const tickers = [
  "🐾 $MBP",
  "THE BEAST OF SUI",
  "HALF MAN",
  "HALF BEAR",
  "HALF PIG",
  "100% CHAOS",
  "BURN THE WEAK",
  "FEED THE LEGEND",
  "FORGED ON SUI",
  "JOIN THE PACK",
  "🔥 RAID SEASON",
];

export default function BeastMarquee() {
  const doubled = [...tickers, ...tickers];

  return (
    <div className="relative overflow-hidden bg-scarlet py-3 border-y border-blood z-20">
      <div className="marquee-track will-change-transform">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-6 font-display font-700 text-sm tracking-widest uppercase text-bone"
          >
            {item}
            <span className="text-blood opacity-60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
