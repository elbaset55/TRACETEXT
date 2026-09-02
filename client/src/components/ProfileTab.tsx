import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Contrast, Globe, UserCog } from "lucide-react";
import { useSettings, type UserRole } from "@/contexts/SettingsContext";

const ROLES: UserRole[] = ["operator", "manager", "technician", "researcher"];

export default function ProfileTab() {
  const { t, lang, setLang, highContrast, toggleHighContrast, user, setUser } = useSettings();
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<UserRole | "">(user?.role ?? "");
  const [saved, setSaved] = useState(false);

  function save() {
    if (!name.trim() || !role) return;
    setUser({ name: name.trim(), role: role as UserRole });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      {/* User identity card */}
      <div className="rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#000066]/8 pb-4">
          <h2 className="font-display text-xl font-extrabold text-[#000066]">{t("profile.title")}</h2>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#000066]/5 text-[#000066]">
            <UserCog className="h-4 w-4" />
          </span>
        </div>

        {user && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#66FF00]/25 bg-[#66FF00]/5 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000066] font-display text-sm font-bold text-white">
              {user.name.charAt(0)}
            </span>
            <div>
              <p className="font-bold text-[#000066]">{user.name}</p>
              <p className="text-xs text-[#5A5F7A]">{t(`profile.roles.${user.role}`)}</p>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-[#3D4566]">{t("profile.name")}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.namePlaceholder")}
              className="trace-input"
            />
          </label>

          <div>
            <span className="text-sm font-bold text-[#3D4566]">{t("profile.role")}</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all ${role === r ? "border-[#000066] bg-[#000066]/5 text-[#000066] shadow-sm" : "border-[#000066]/8 bg-[#FCFBF8] text-[#5A5F7A] hover:border-[#000066]/15"}`}
                >
                  {t(`profile.roles.${r}`)}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={save}
            disabled={!name.trim() || !role}
            className="h-11 w-full rounded-xl bg-[#000066] font-bold text-white hover:bg-[#00004d] disabled:opacity-40"
          >
            <CheckCircle2 className="ml-2 h-4 w-4" /> {t("profile.save")}
          </Button>

          {saved && (
            <p className="text-center text-sm font-bold text-[#2E7D32]">{t("profile.saved")}</p>
          )}
        </div>
      </div>

      {/* Language toggle */}
      <div className="rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#000066]" />
          <h3 className="font-display text-lg font-extrabold text-[#000066]">{t("profile.language")}</h3>
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

      {/* High contrast toggle */}
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
    </div>
  );
}
