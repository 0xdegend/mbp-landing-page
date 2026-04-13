import type { Metadata } from "next";
import "./globals.css";
import { Black_Han_Sans, Oswald, DM_Sans } from "next/font/google";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-beast",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const BASE_URL = "https://mbp-landing-page.vercel.app"; // ← replace with your live domain

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "ManBearPig ($MBP) — The Beast of Sui",
    template: "%s | ManBearPig $MBP",
  },
  description:
    "Half Man. Half Bear. Half Pig. 100% Chaos. ManBearPig ($MBP) is the legendary meme beast forged on the Sui blockchain — a force of nature the chain can barely contain.",
  keywords: [
    "ManBearPig",
    "MBP",
    "$MBP",
    "ManBearPig Sui",
    "Sui meme coin",
    "Sui blockchain",
    "Sui ecosystem",
    "Sui token",
    "crypto meme",
    "Web3 meme coin",
    "Beast of Sui",
    "SUI DeFi",
    "meme coin 2025",
  ],
  authors: [{ name: "ManBearPig", url: BASE_URL }],
  creator: "ManBearPig",
  publisher: "ManBearPig",
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "ManBearPig $MBP",
    title: "ManBearPig ($MBP) — The Beast of Sui",
    description:
      "Half Man. Half Bear. Half Pig. 100% Chaos. The legendary meme beast forged on Sui — a force of nature the chain can barely contain.",
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ManBearPig ($MBP) — The Beast of Sui",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@ManBearPigSui", // ← replace with real handle
    creator: "@ManBearPigSui",
    title: "ManBearPig ($MBP) — The Beast of Sui",
    description:
      "Half Man. Half Bear. Half Pig. 100% Chaos. The legendary meme beast forged on Sui.",
    images: [`${BASE_URL}/images/og-image.png`],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ManBearPig $MBP",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${blackHanSans.variable} ${oswald.variable} ${dmSans.variable}`}
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a0d08" />

        {/* Structured data — WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ManBearPig $MBP",
              description:
                "Half Man. Half Bear. Half Pig. 100% Chaos. The legendary meme beast forged on the Sui blockchain.",
              url: BASE_URL,
              sameAs: [
                "https://x.com/ManBearPigSui", // ← replace with real URLs
                "https://t.me/ManBearPigSui",
              ],
            }),
          }}
        />

        {/* Structured data — token as a financial product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "ManBearPig Token ($MBP)",
              description:
                "ManBearPig ($MBP) is a meme coin built on the Sui blockchain. Half man, half bear, half pig, 100% chaos.",
              brand: {
                "@type": "Brand",
                name: "ManBearPig",
              },
              url: BASE_URL,
            }),
          }}
        />
      </head>
      <body
        className={`bg-forest-black text-bone font-body antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
