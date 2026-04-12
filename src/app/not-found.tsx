export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0d08] text-bone">
      <h1 className="font-beast text-8xl mb-4">404</h1>
      <p className="font-display text-sm tracking-widest uppercase text-ash/50">
        Page not found
      </p>
      <a
        href="/"
        className="mt-8 font-display text-xs tracking-widest uppercase text-moss/70 hover:text-moss transition-colors"
      >
        Return home
      </a>
    </main>
  );
}
