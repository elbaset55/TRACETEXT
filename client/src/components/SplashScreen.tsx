import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1800);
    const t2 = setTimeout(onDone, 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000066] transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="animate-[pulse_1.5s_ease-in-out_infinite]">
        <img src="/assets/tracetex-logo.png" alt="TRACETEX" className="h-24 w-auto drop-shadow-[0_0_20px_rgba(102,255,0,0.4)]" />
      </div>
      <p className="mt-4 font-display text-lg font-bold tracking-[0.3em] text-white">TRACETEX</p>
      <div className="mt-2 flex items-center gap-2">
        <img src="/assets/benha-university-logo.png" alt="Benha University" className="h-8 w-8 object-contain brightness-0 invert" />
        <span className="text-xs font-bold text-[#A0A8C8]">جامعة بنها · Benha University</span>
      </div>
      <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full origin-left animate-[sweep_1.8s_ease-in-out]" style={{ background: "linear-gradient(90deg, transparent, #66FF00, transparent)" }} />
      </div>
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
