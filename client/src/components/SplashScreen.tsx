import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setShowBar(true), 600);
    const t1 = setTimeout(() => setFading(true), 2200);
    const t2 = setTimeout(onDone, 2700);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#000066] via-[#000080] to-[#000066] transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      {/* Glow ring */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 animate-[ping_2s_ease-in-out_infinite] rounded-full bg-[#66FF00]/20 blur-2xl" />
        <div className="animate-[pulse_1.8s_ease-in-out_infinite]">
          <img
            src="/assets/tracetex-logo.png"
            alt="TRACETEX"
            className="h-28 w-auto drop-shadow-[0_0_24px_rgba(102,255,0,0.45)]"
          />
        </div>
      </div>

      <p className="font-display text-xl font-bold tracking-[0.35em] text-white">
        TRACETEX
      </p>
      <p className="mt-1.5 text-xs font-medium tracking-wider text-[#A0A8C8]">
        منصة تتبع القصاصات
      </p>

      <div className="mt-5 flex items-center gap-2">
        <img
          src="/assets/benha-university-logo.png"
          alt="Benha University"
          className="h-7 w-7 object-contain brightness-0 invert"
        />
        <span className="text-xs font-bold text-[#A0A8C8]">جامعة بنها · Benha University</span>
      </div>

      {/* Progress bar */}
      <div className="mt-8 h-1 w-36 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-[1600ms] ease-out"
          style={{
            width: showBar ? "100%" : "0%",
            background: "linear-gradient(90deg, #66FF00, #00E5FF, #66FF00)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s linear infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
