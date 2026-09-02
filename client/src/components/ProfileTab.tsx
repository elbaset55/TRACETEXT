import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2, UserCog, BookOpen, Database } from "lucide-react";
import { useSettings, type UserRole } from "@/contexts/SettingsContext";
import { ROUTES, type BatchEntry } from "@/lib/types";
import { QRCodeButton } from "@/components/QRCodeDisplay";

const ROLES: UserRole[] = ["operator", "manager", "technician", "researcher"];

export default function ProfileTab({
  ledger,
  clearLedger,
}: {
  ledger: BatchEntry[];
  clearLedger: () => void;
}) {
  const { t, lang, user, setUser } = useSettings();
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<UserRole | "">(user?.role ?? "");
  const [saved, setSaved] = useState(false);

  const rt = (r: (typeof ROUTES)[number]) => (lang === "ar" ? r.title : r.titleEn);

  const routeCounts = useMemo(
    () => ROUTES.map((r) => ({ ...r, count: ledger.filter((e) => e.route === r.id).length })),
    [ledger],
  );
  const totalCount = ledger.length;

  function save() {
    if (!name.trim() || !role) return;
    setUser({ name: name.trim(), role: role as UserRole });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      {/* Dashboard title + stats */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#000066]">{t("home.title")}</h1>
            <p className="mt-0.5 text-sm text-[#5A5F7A]">{totalCount} {t("home.batchCount")}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#000066]/10 bg-white px-3 py-2 text-xs text-[#5A5F7A]">
            <Database className="h-4 w-4 text-[#000066]" />
            <span>{t("home.localData")}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {routeCounts.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#000066]/8 bg-white p-3 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold text-white" style={{ background: r.color }}>{r.id}</span>
                <span className="font-display text-2xl font-extrabold text-[#000066]">{r.count}</span>
              </div>
              <p className="mt-1.5 text-[11px] font-bold leading-tight text-[#3D4566]">{rt(r)}</p>
            </div>
          ))}
        </div>
      </div>

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

      {/* Ledger */}
      <div className="rounded-2xl border border-[#000066]/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#000066]/8 px-5 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#000066]" />
            <h2 className="font-display text-lg font-extrabold text-[#000066]">{t("ledger.title")}</h2>
          </div>
          {ledger.length > 0 && (
            <Button onClick={clearLedger} variant="outline" className="h-9 rounded-lg border-[#B85F47]/30 px-3 text-sm text-[#8B3F2D] hover:bg-[#F5E3DC]">
              <Trash2 className="ml-2 h-3.5 w-3.5" /> {t("ledger.clear")}
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right">
            <thead>
              <tr className="bg-[#000066] text-white">
                {["ledger.col.batch", "ledger.col.source", "ledger.col.material", "ledger.col.mass", "ledger.col.route", "ledger.col.outcome", "ledger.col.status", "ledger.col.time", "ledger.col.qr"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-[#5A5F7A]">
                    {t("ledger.empty")}
                  </td>
                </tr>
              ) : (
                ledger.map((e, i) => {
                  const r = ROUTES.find((rr) => rr.id === e.route);
                  return (
                    <tr key={`${e.id}-${i}`} className="border-b border-[#000066]/6 last:border-0 hover:bg-[#F5F2ED]/50">
                      <td className="px-4 py-3 font-mono text-sm font-bold text-[#000066]">{e.id}</td>
                      <td className="px-4 py-3 text-sm">{e.source}</td>
                      <td className="px-4 py-3 text-sm">{e.material}</td>
                      <td className="px-4 py-3 font-mono text-sm">{e.mass} kg</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold text-white" style={{ background: r?.color }}>{e.route}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#3D4566]">{e.outcome}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{
                          background: e.demo ? "rgba(167,125,85,0.12)" : "rgba(0,0,102,0.08)",
                          color: e.demo ? "#8B6539" : "#000066",
                        }}>
                          {e.demo ? t("ledger.simulation") : t("ledger.field")}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#5A5F7A]">{e.createdAt}</td>
                      <td className="px-4 py-3"><QRCodeButton entry={e} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
