/**
 * TRACETEX — Material Trace Console (Production)
 * Navy #000066 / Neon Green #66FF00 / Orange #F7941D / Cream #F5F2ED
 * Route palette from the physical prototype bins.
 */
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Database,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, STORAGE_KEY, type BatchEntry, type RouteId } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";
import QRScanner from "@/components/QRScanner";
import ProfileTab from "@/components/ProfileTab";
import SettingsTab from "@/components/SettingsTab";
import BottomNav, { type TabId } from "@/components/BottomNav";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const { t, lang, user } = useSettings();
  const [tab, setTab] = useState<TabId>("register");

  const [batchId, setBatchId] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [sourceOther, setSourceOther] = useState("");
  const [material, setMaterial] = useState(lang === "ar" ? "قطن" : "Cotton");
  const [date, setDate] = useState(getToday());
  const [mass, setMass] = useState("");
  const [route, setRoute] = useState<RouteId>("A");
  const [outcome, setOutcome] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [ledger, setLedger] = useState<BatchEntry[]>([]);
  const [notice, setNotice] = useState("");

  const source = sourceType === "other" ? sourceOther.trim() : sourceType;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setLedger(JSON.parse(saved));
    } catch {
      setNotice(t("home.readError"));
    }
  }, [t]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    } catch {
      setNotice(t("home.saveError"));
    }
  }, [ledger, t]);

  const rt = (r: (typeof ROUTES)[number]) => (lang === "ar" ? r.title : r.titleEn);
  const rh = (r: (typeof ROUTES)[number]) => (lang === "ar" ? r.helper : r.helperEn);
  const ro = (r: (typeof ROUTES)[number]) => (lang === "ar" ? r.outcome : r.outcomeEn);

  const activeRoute = ROUTES.find((r) => r.id === route) ?? ROUTES[0];
  const valid = Boolean(batchId.trim() && source.trim() && material.trim() && Number(mass) > 0);
  const routeCounts = useMemo(
    () => ROUTES.map((r) => ({ ...r, count: ledger.filter((e) => e.route === r.id).length })),
    [ledger],
  );
  const totalCount = ledger.length;

  const sourceOptions = [
    { value: "applied-arts", label: t("source.appliedArts") },
    { value: "fine-arts", label: t("source.fineArts") },
  ];

  function resetForm() {
    setBatchId("");
    setSourceType("");
    setSourceOther("");
    setMaterial(lang === "ar" ? "قطن" : "Cotton");
    setDate(getToday());
    setMass("");
    setRoute("A");
    setOutcome("");
    setDemoMode(false);
  }

  function loadDemo() {
    setBatchId("DEMO-001");
    setSourceType("applied-arts");
    setSourceOther("");
    setMaterial(lang === "ar" ? "قطن" : "Cotton");
    setDate(getToday());
    setMass("0.25");
    setRoute("A");
    setOutcome(lang === "ar" ? "عرض حي فقط — لا وجهة فعلية" : "Demo only — no real destination");
    setDemoMode(true);
    setNotice(t("home.demoNotice"));
  }

  function registerBatch() {
    if (!valid) {
      setNotice(t("home.incomplete"));
      return;
    }
    const entry: BatchEntry = {
      id: batchId.trim(),
      source: source.trim(),
      material: material.trim(),
      date,
      mass,
      route,
      outcome: outcome.trim() || ro(activeRoute),
      demo: demoMode,
      createdAt: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    setLedger((items) => [entry, ...items]);
    setNotice(demoMode ? t("home.registeredDemo") : t("home.registered"));
    resetForm();
  }

  function clearLedger() {
    setLedger([]);
    setNotice(t("home.cleared"));
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-24 text-[#000033]">
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-30 border-b border-[#000066]/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
          <a href="/" aria-label="TRACETEX — الرئيسية" className="flex items-center transition-transform hover:scale-105">
            <img src="/assets/tracetex-logo.png" alt="TRACETEX" className="h-14 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={() => setTab("profile")}
                className="flex items-center gap-2 rounded-full border border-[#000066]/12 px-2.5 py-1"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#000066] text-xs font-bold text-white">
                  {user.name.charAt(0)}
                </span>
                <span className="hidden text-xs font-bold text-[#000066] sm:inline">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setTab("profile")}
                className="flex items-center gap-1.5 rounded-full border border-[#000066]/12 px-2.5 py-1 text-xs font-bold text-[#5A5F7A]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#000066]/5 text-xs font-bold text-[#000066]">
                  ?
                </span>
                <span className="hidden sm:inline">{t("profile.noUser")}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-4">
        {/* ═══ TITLE + STATS ═══ */}
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

        {/* Stats cards */}
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

        {/* ═══ TAB CONTENT ═══ */}
        {tab === "register" && (
          <div className="mt-5 rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#000066]/8 pb-4">
              <h2 className="font-display text-xl font-extrabold text-[#000066]">{t("home.registerNew")}</h2>
              <span className="font-mono text-xs font-bold text-[#3F7E84]">{route} — {rt(activeRoute)}</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label={t("home.batchId")} required>
                <input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="TT-001" className="trace-input" />
              </Field>
              <Field label={t("home.date")}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="trace-input" />
              </Field>
              <Field label={t("home.source")} required>
                <select
                  value={sourceType === "other" ? "other" : sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="trace-input"
                >
                  <option value="">{t("source.select")}</option>
                  {sourceOptions.map((o) => (
                    <option key={o.value} value={o.label}>{o.label}</option>
                  ))}
                  <option value="other">{t("source.other")}</option>
                </select>
              </Field>
              {sourceType === "other" && (
                <Field label={t("source.otherPlaceholder")} required>
                  <input
                    value={sourceOther}
                    onChange={(e) => setSourceOther(e.target.value)}
                    placeholder={t("source.otherPlaceholder")}
                    className="trace-input"
                  />
                </Field>
              )}
              <Field label={t("home.material")} required>
                <input value={material} onChange={(e) => setMaterial(e.target.value)} className="trace-input" />
              </Field>
              <Field label={t("home.mass")} required>
                <input value={mass} onChange={(e) => setMass(e.target.value)} inputMode="decimal" placeholder="0.00" className="trace-input font-mono" />
              </Field>
              <Field label={t("home.outcome")}>
                <input value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder={ro(activeRoute)} className="trace-input" />
              </Field>
            </div>

            {demoMode && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#F7941D]/25 bg-[#FFF7E8] px-4 py-2.5 text-sm text-[#7A5520]">
                <CircleAlert className="h-4 w-4 shrink-0" />
                <span><strong>{t("home.demoMode")}:</strong> {t("home.demoNotice2")}</span>
              </div>
            )}

            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-[#3D4566]">{t("home.selectRoute")}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {ROUTES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoute(r.id)}
                    className={`rounded-xl border-2 p-3 text-right transition-all ${route === r.id ? "-translate-y-0.5 shadow-md" : "border-[#000066]/8 bg-[#FCFBF8] hover:border-[#000066]/15"}`}
                    style={route === r.id ? { borderColor: r.border, background: r.bg } : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold" style={{ color: r.color }}>{r.id}</span>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    </div>
                    <p className="mt-2 text-sm font-bold text-[#000066]">{rt(r)}</p>
                    <p className="mt-1 text-xs leading-5 text-[#5A5F7A]">{rh(r)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#000066]/8 pt-4">
              <Button onClick={registerBatch} className="h-11 rounded-xl bg-[#000066] px-5 font-bold text-white hover:bg-[#00004d]">
                <CheckCircle2 className="ml-2 h-4 w-4" /> {t("home.register")}
              </Button>
              <Button onClick={loadDemo} variant="outline" className="h-11 rounded-xl border-[#000066]/20 px-5 font-bold text-[#000066] hover:bg-[#000066]/5">
                <Play className="ml-2 h-4 w-4" /> {t("home.demoMode")}
              </Button>
              {demoMode && (
                <Button onClick={resetForm} variant="ghost" className="h-11 rounded-xl px-4 text-sm text-[#5A5F7A]">
                  {t("home.reset")}
                </Button>
              )}
            </div>

            {notice && (
              <div role="status" className="mt-4 flex items-center gap-2 rounded-lg border-r-4 border-[#F7941D] bg-[#FFF7E8] px-4 py-2.5 text-sm font-bold text-[#7A5520]">
                <CircleAlert className="h-4 w-4 shrink-0" />
                {notice}
              </div>
            )}
          </div>
        )}

        {tab === "scan" && (
          <div className="mt-5">
            <QRScanner />
          </div>
        )}

        {tab === "profile" && (
          <div className="mt-5">
            <ProfileTab ledger={ledger} clearLedger={clearLedger} />
          </div>
        )}

        {tab === "settings" && (
          <div className="mt-5">
            <SettingsTab />
          </div>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-6 border-t border-[#000066]/10 bg-[#000066] py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/assets/benha-university-logo.png" alt="Benha University" className="h-7 w-7 object-contain" />
            <span className="text-sm text-[#A0A8C8]">{t("footer.text")}</span>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold text-[#66FF00]">
            <ShieldCheck className="h-3.5 w-3.5" /> {t("footer.trust")}
          </span>
        </div>
      </footer>

      {/* ═══ BOTTOM NAV ═══ */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[#3D4566]">{label}{required && <b className="mr-1 text-[#B85F47]">*</b>}</span>
      {children}
    </label>
  );
}
