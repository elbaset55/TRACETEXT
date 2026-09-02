import { Button } from "@/components/ui/button";
import { Contrast, Globe, LayoutDashboard, Settings2 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function SettingsTab() {
  const { t, lang, setLang, highContrast, toggleHighContrast } = useSettings();

  return (
    <div className="space-y-4">
      {/* Settings header */}
      <div className="flex items-center gap-2 rounded-2xl border border-[#000066]/10 bg-white p-4 shadow-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000066] text-white">
          <Settings2 className="h-4.5 w-4.5" />
        </span>
        <h2 className="font-display text-xl font-extrabold text-[#000066]">{t("settings.title")}</h2>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#000066]" />
          <h3 className="font-display text-lg font-extrabold text-[#000066]">{t("settings.language")}</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setLang("ar")}
            className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${lang === "ar" ? "border-[#000066] bg-[#000066] text-white shadow-sm" : "border-[#000066]/8 bg-[#FCFBF8] text-[#5A5F7A]"}`}
          >
            العربية
          </button>
          <button
            onClick={() => setLang("en")}
            className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${lang === "en" ? "border-[#000066] bg-[#000066] text-white shadow-sm" : "border-[#000066]/8 bg-[#FCFBF8] text-[#5A5F7A]"}`}
          >
            English
          </button>
        </div>
      </div>

      {/* Accessibility */}
      <div className="rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="h-5 w-5 text-[#000066]" />
            <div>
              <h3 className="font-display text-lg font-extrabold text-[#000066]">{t("profile.highContrast")}</h3>
              <p className="text-xs text-[#5A5F7A]">{t("profile.highContrastDesc")}</p>
            </div>
          </div>
          <button
            onClick={toggleHighContrast}
            role="switch"
            aria-checked={highContrast}
            aria-label={t("profile.highContrast")}
            className={`relative h-7 w-12 rounded-full transition-colors ${highContrast ? "bg-[#000066]" : "bg-[#000066]/15"}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${highContrast ? "left-1" : "left-6"}`} />
          </button>
        </div>
      </div>

      {/* Admin link */}
      <a href="/admin" className="block">
        <div className="flex items-center justify-between rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-[#000066]" />
            <h3 className="font-display text-lg font-extrabold text-[#000066]">{t("settings.adminLink")}</h3>
          </div>
          <span className="text-[#9CA0B8]">←</span>
        </div>
      </a>
    </div>
  );
}
