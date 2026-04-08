import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ManBearPig ($MBP) — The Beast of Sui",
  description: "Half Man. Half Bear. Half Pig. 100% Chaos. The legendary meme beast forged on Sui.",
  openGraph: {
    title: "ManBearPig ($MBP) — The Beast of Sui",
    description: "Half Man. Half Bear. Half Pig. 100% Chaos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Oswald:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-forest-black antialiased">
        {children}
      </body>
    </html>
  );
}
