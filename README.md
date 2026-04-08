# 🐾 ManBearPig ($MBP) — The Beast of Sui

> Half Man. Half Bear. Half Pig. 100% Chaos.

A premium, cinematic meme landing page for the ManBearPig ($MBP) token on the Sui ecosystem. Built with Next.js 15, TypeScript, Tailwind CSS, and GSAP for animations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with font imports
│   ├── page.tsx            # Main page — assembles all sections
│   └── globals.css         # Global styles, CSS variables, utilities
├── components/
│   ├── BeastNavbar.tsx         # Fixed top navbar with scroll-aware styling
│   ├── HeroPage.tsx            # Full cinematic hero with parallax & GSAP
│   ├── BeastMarquee.tsx        # Scrolling ticker marquee
│   ├── BurnComponent.tsx       # Burn mechanics section with stats
│   ├── LoreSection.tsx         # Origin story — 4-card lore grid
│   ├── PackStats.tsx           # Community stats with hexagon talismans
│   ├── AllianceComponent.tsx   # PandaSui alliance / partner section
│   ├── RoadmapSection.tsx      # "The Hunt" roadmap timeline
│   ├── FinalCTA.tsx            # "Summon the Beast" closing section
│   ├── BeastFooter.tsx         # Site footer with links
│   ├── FloatingParticleLayer.tsx   # Canvas-based ember/dust/fog particles
│   └── ParallaxMountainBackdrop.tsx # Reusable parallax mountain backdrop
public/
├── mascot.jpg      # Beast mascot image (the muscular bear with chain)
└── banner.png      # Banner image (beast in forest with warning sign)
```

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `forest-black` | `#0a0d08` | Base background |
| `pine-dark` | `#0d1a0e` | Section backgrounds |
| `pine-mid` | `#1a2e1b` | Card backgrounds |
| `forest-green` | `#2d5a2e` | Borders, accents |
| `moss` | `#4a7c59` | Secondary text, borders |
| `scarlet` | `#c0392b` | Primary accent, CTAs |
| `blood` | `#8b1a1a` | Dark red, shadows |
| `ember` | `#e84d0e` | Fire/glow effects |
| `bone` | `#e8dcc8` | Primary text |
| `sky-ice` | `#7ec8e3` | Cool accent |
| `silver` | `#b8c5cc` | Metallic accents |

### Typography
- **Headlines**: `Black Han Sans` — monstrous, compressed display font
- **Subheadings / UI**: `Oswald` — uppercase, military-grade labels
- **Body**: `DM Sans` — clean, legible body text

### Utility Classes
- `.btn-beast` — Base beast button clip-path style
- `.btn-beast-primary` — Scarlet filled CTA
- `.btn-beast-outline` — Outline variant
- `.stat-card` — Rugged metric card with corner cut
- `.jagged-bottom` / `.jagged-top` — Jagged SVG clip-path edges
- `.font-beast` — Apply Black Han Sans
- `.font-display` — Apply Oswald
- `.shine-text` — Animated shimmer text
- `.claw-text` — Outlined stroke-only text
- `.warning-sign` — Warning sign styled div
- `.noise-overlay` — Adds film grain texture overlay

---

## ⚡ GSAP Animations

### Hero Entrance (Choreographed Timeline)
1. Mountains drift up (layered, staggered)
2. Warning sign swings in from left
3. Beast emerges from below
4. Headline slams with screen shake
5. Subheadline, tagline, microcopy cascade in
6. CTA buttons spring in
7. Token badge pops in
8. Beast begins infinite breathing loop
9. Mouse parallax on mountains

### Scroll-Triggered Animations
- **BurnComponent**: Stat panels reveal with stagger, burn ring pulses, meter bar fills
- **LoreSection**: Cards slide in from alternating sides with 3D rotation
- **PackStats**: Talismans spin in from angles, campfire flickers
- **AllianceComponent**: Alliance crest springs in, ally cards stagger from below
- **RoadmapSection**: Trail stones slide in from left/right alternating
- **FinalCTA**: Fog rolls, beast erupts, title slams, glow pulses

### Particle Systems (Canvas-based)
Three particle types via `FloatingParticleLayer`:
- `ember` — Glowing orange/red rising embers with radial glow
- `dust` — Subtle white/silver floating motes
- `fog` — Large translucent atmospheric fog blobs

---

## 📱 Responsive Design
- Mobile-first layouts
- Stacked columns on mobile → side-by-side on desktop
- Hamburger menu on mobile with slide-down panel
- All font sizes scale with `sm:`, `lg:`, `xl:` breakpoints

---

## 🔧 Customization

### Update Token Address
In `FinalCTA.tsx`, replace:
```tsx
0x...MBP...SUI (TBA)
```
with the real contract address.

### Update Social Links
Search for `href="#"` in:
- `BeastNavbar.tsx`
- `PackStats.tsx`
- `BeastFooter.tsx`

Replace with real Telegram, Twitter, Discord, DexScreener links.

### Update Stats
In `BurnComponent.tsx`, update the `stats` array values.
In `PackStats.tsx`, update the `stats` array values.

### Roadmap Phase Status
In `RoadmapSection.tsx`, update each phase's `status`:
- `"done"` — green, shows checkmark
- `"active"` — scarlet, pulses
- `"upcoming"` — gray, subdued

---

## 🎯 Production Checklist
- [ ] Replace contract address in FinalCTA
- [ ] Update all social media links
- [ ] Update live stats (holders, volume, market cap)
- [ ] Add real CoinGecko / CMC links
- [ ] Add real DexScreener link
- [ ] Update roadmap phase statuses
- [ ] Configure SEO metadata in `layout.tsx`
- [ ] Add Open Graph image (`/public/og-image.png`)
- [ ] Add favicon (`/public/favicon.ico`)

---

## 🛠️ Built With
- [Next.js 15](https://nextjs.org)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP 3](https://greensock.com/gsap/)
- [Google Fonts](https://fonts.google.com) — Black Han Sans, Oswald, DM Sans

---

*"The forest has spoken. The beast is here."*

🐾 **$MBP — ManBearPig on Sui**
