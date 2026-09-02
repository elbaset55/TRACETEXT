import { useEffect, useState } from "react";

/**
 * TRACETEX — Splash Screen
 * Smooth animated entry using requestAnimationFrame for a polished,
 * performant feel. Duration ~1.8s.
 */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = 1600;
    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setFading(true);
        setTimeout(onDone, 400);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#000066] via-[#000080] to-[#000066] transition-opacity duration-400 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {/* neon grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(102,255,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(102,255,0,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#66FF00]/10 blur-3xl" />

      <div className="relative flex flex-col items-center">
        {/* logo with glow ring */}
        <div className="relative mb-5">
          <div className="absolute inset-0 -z-10 animate-[ping_2.5s_ease-in-out_infinite] rounded-full bg-[#66FF00]/15 blur-2xl" />
          <div className="animate-[pulse_2s_ease-in-out_infinite]">
            <img
              src="/assets/tracetex-logo.png"
              alt="TRACETEX"
              className="h-40 w-auto drop-shadow-[0_0_36px_rgba(102,255,0,0.5)]"
            />
          </div>
        </div>

        <p className="font-display text-2xl font-bold tracking-[0.4em] text-white">
          TRACETEX
        </p>
        <p className="mt-2 text-sm font-medium tracking-wider text-[#66FF00]">
          من المصدر إلى المصير
        </p>
      </div>

      <div className="relative mt-6 flex items-center gap-2">
        <img
          src="/assets/benha-university-logo.png"
          alt="Benha University"
          className="h-7 w-7 object-contain brightness-0 invert"
        />
        <span className="text-xs font-bold text-[#A0A8C8]">جامعة بنها · Benha University</span>
      </div>

      {/* progress bar */}
      <div className="relative mt-8 h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-none"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #66FF00, #00E5FF)",
          }}
        />
      </div>
    </div>
  );
}
