/**
 * TRACETEX — Landing / Main Page
 * Dark navy hero with neon-green accents. Entry point so the app
 * doesn't open directly on the registration form.
 */
import { ArrowLeft, BarChart3, FilePlus2, LayoutDashboard, QrCode, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { useSettings } from "@/contexts/SettingsContext";

export default function Landing() {
  const { t } = useSettings();
  const [, setLocation] = useLocation();

  const features = [
    { icon: FilePlus2, title: t("landing.f1t"), desc: t("landing.f1d"), color: "#66FF00" },
    { icon: QrCode, title: t("landing.f2t"), desc: t("landing.f2d"), color: "#00E5FF" },
    { icon: BarChart3, title: t("landing.f3t"), desc: t("landing.f3d"), color: "#F7941D" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#000066] via-[#000080] to-[#000066] text-white">
      {/* neon grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(102,255,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(102,255,0,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* center glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#66FF00]/12 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center px-6 py-10">
        {/* logo */}
        <img
          src="/assets/tracetex-logo.png"
          alt="TRACETEX"
          className="h-32 w-auto drop-shadow-[0_0_30px_rgba(102,255,0,0.5)]"
        />

        {/* title */}
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight">{t("landing.title")}</h1>
        <p className="mt-2 text-lg font-bold text-[#66FF00]">{t("landing.tagline")}</p>
        <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-[#A0A8C8]">{t("landing.desc")}</p>

        {/* action buttons */}
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <button
            onClick={() => setLocation("/track")}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#66FF00] font-bold text-[#000033] shadow-lg shadow-[#66FF00]/20 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <FilePlus2 className="h-5 w-5" />
            {t("landing.start")}
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLocation("/admin")}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <LayoutDashboard className="h-5 w-5" />
            {t("landing.admin")}
          </button>
        </div>

        {/* features */}
        <div className="mt-10 grid w-full gap-3 sm:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${f.color}22`, color: f.color }}
              >
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-sm font-bold">{f.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#A0A8C8]">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* footer */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/benha-university-logo.png"
              alt="Benha University"
              className="h-8 w-8 object-contain brightness-0 invert"
            />
            <span className="text-sm font-bold text-[#A0A8C8]">
              {t("landing.university")} · {t("landing.year")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#66FF00]">
            <ShieldCheck className="h-4 w-4" /> {t("footer.trust")}
          </div>
        </div>
      </div>
    </div>
  );
}
