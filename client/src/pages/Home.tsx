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
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, STORAGE_KEY, type BatchEntry, type RouteId } from "@/lib/types";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [batchId, setBatchId] = useState("");
  const [source, setSource] = useState("");
  const [material, setMaterial] = useState("قطن");
  const [date, setDate] = useState(getToday());
  const [mass, setMass] = useState("");
  const [route, setRoute] = useState<RouteId>("A");
  const [outcome, setOutcome] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [ledger, setLedger] = useState<BatchEntry[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setLedger(JSON.parse(saved));
    } catch {
      setNotice("تعذر قراءة السجل المحلي.");
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    } catch {
      setNotice("لم يُحفظ السجل محليًا.");
    }
  }, [ledger]);

  const activeRoute = ROUTES.find((r) => r.id === route) ?? ROUTES[0];
  const valid = Boolean(batchId.trim() && source.trim() && material.trim() && Number(mass) > 0);
  const routeCounts = useMemo(
    () => ROUTES.map((r) => ({ ...r, count: ledger.filter((e) => e.route === r.id).length })),
    [ledger],
  );
  const totalCount = ledger.length;

  function resetForm() {
    setBatchId("");
    setSource("");
    setMaterial("قطن");
    setDate(getToday());
    setMass("");
    setRoute("A");
    setOutcome("");
    setDemoMode(false);
  }

  function loadDemo() {
    setBatchId("DEMO-001");
    setSource("ورشة محاكاة — لا تمثل شريكًا");
    setMaterial("قطن");
    setDate(getToday());
    setMass("0.25");
    setRoute("A");
    setOutcome("عرض حي فقط — لا وجهة فعلية");
    setDemoMode(true);
    setNotice("تم تحميل حالة عرض توضيحية. لا تستخدمها في تقرير فعلي.");
  }

  function registerBatch() {
    if (!valid) {
      setNotice("أكمل رمز الدفعة والمصدر والخامة والكتلة قبل التسجيل.");
      return;
    }
    const entry: BatchEntry = {
      id: batchId.trim(),
      source: source.trim(),
      material: material.trim(),
      date,
      mass,
      route,
      outcome: outcome.trim() || activeRoute.outcome,
      demo: demoMode,
      createdAt: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };
    setLedger((items) => [entry, ...items]);
    setNotice(demoMode ? "سُجلت حالة محاكاة في السجل المحلي." : "سُجل قرار الدفعة محليًا.");
    resetForm();
  }

  function clearLedger() {
    setLedger([]);
    setNotice("تم حذف السجل المحلي.");
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#000033]" dir="rtl">
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 border-b border-[#000066]/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <img src="/assets/tracetex-logo.png" alt="TRACETEX" className="h-8 w-auto" />
          <nav className="hidden items-center gap-1 sm:flex">
            <a href="#register" className="rounded-lg px-3 py-1.5 text-sm font-bold text-[#4A5470] transition-colors hover:bg-[#000066]/5 hover:text-[#000066]">تسجيل دفعة</a>
            <a href="#ledger" className="rounded-lg px-3 py-1.5 text-sm font-bold text-[#4A5470] transition-colors hover:bg-[#000066]/5 hover:text-[#000066]">السجل</a>
            <a href="/admin" className="rounded-lg bg-[#000066]/5 px-3 py-1.5 text-sm font-bold text-[#000066] transition-colors hover:bg-[#000066]/10">الإدارة</a>
          </nav>
          <div className="flex items-center gap-3">
            <img src="/assets/benha-university-logo.png" alt="جامعة بنها" className="h-7 w-7 object-contain" />
            <span className="flex items-center gap-1.5 rounded-full border border-[#000066]/12 px-3 py-1 text-xs font-bold text-[#000066]">
              <span className="neon-node" /> تخزين محلي
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* ═══ TITLE + STATS ═══ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#000066]">لوحة تتبع القصاصات</h1>
            <p className="mt-1 text-sm text-[#5A5F7A]">{totalCount} دفعة مسجلة محليًا</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#000066]/10 bg-white px-4 py-2 text-xs text-[#5A5F7A]">
            <Database className="h-4 w-4 text-[#000066]" />
            <span>البيانات محفوظة في هذا المتصفح فقط</span>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {routeCounts.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#000066]/8 bg-white p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-sm font-bold text-white" style={{ background: r.color }}>{r.id}</span>
                <span className="font-display text-3xl font-extrabold text-[#000066]">{r.count}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-[#3D4566]">{r.title}</p>
            </div>
          ))}
        </div>

        {/* ═══ REGISTRATION ═══ */}
        <div id="register" className="mt-6 rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between border-b border-[#000066]/8 pb-4">
            <h2 className="font-display text-xl font-extrabold text-[#000066]">تسجيل دفعة جديدة</h2>
            <span className="font-mono text-xs font-bold text-[#3F7E84]">{route} — {activeRoute.title}</span>
          </div>

          {/* Form fields */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="رقم الدفعة" required>
              <input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="TT-001" className="trace-input" />
            </Field>
            <Field label="التاريخ">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="trace-input" />
            </Field>
            <Field label="المصدر / الورشة" required>
              <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="اسم المصدر" className="trace-input" />
            </Field>
            <Field label="الخامة" required>
              <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="قطن / خليط" className="trace-input" />
            </Field>
            <Field label="الكتلة (كجم)" required>
              <input value={mass} onChange={(e) => setMass(e.target.value)} inputMode="decimal" placeholder="0.00" className="trace-input font-mono" />
            </Field>
            <Field label="المصير / السبب">
              <input value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder={activeRoute.outcome} className="trace-input" />
            </Field>
          </div>

          {demoMode && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#F7941D]/25 bg-[#FFF7E8] px-4 py-2.5 text-sm text-[#7A5520]">
              <CircleAlert className="h-4 w-4 shrink-0" />
              <span><strong>وضع عرض:</strong> بيانات محاكاة — لا تستخدمها في تقرير فعلي.</span>
            </div>
          )}

          {/* Route selection */}
          <div className="mt-5">
            <p className="mb-2 text-sm font-bold text-[#3D4566]">اختر المسار</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
                  <p className="mt-2 text-sm font-bold text-[#000066]">{r.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#5A5F7A]">{r.helper}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#000066]/8 pt-4">
            <Button onClick={registerBatch} className="h-11 rounded-xl bg-[#000066] px-5 font-bold text-white hover:bg-[#00004d]">
              <CheckCircle2 className="ml-2 h-4 w-4" /> تسجيل القرار
            </Button>
            <Button onClick={loadDemo} variant="outline" className="h-11 rounded-xl border-[#000066]/20 px-5 font-bold text-[#000066] hover:bg-[#000066]/5">
              <Play className="ml-2 h-4 w-4" /> وضع العرض
            </Button>
            {demoMode && (
              <Button onClick={resetForm} variant="ghost" className="h-11 rounded-xl px-4 text-sm text-[#5A5F7A]">
                إعادة تعيين
              </Button>
            )}
          </div>

          {/* Notice */}
          {notice && (
            <div role="status" className="mt-4 flex items-center gap-2 rounded-lg border-r-4 border-[#F7941D] bg-[#FFF7E8] px-4 py-2.5 text-sm font-bold text-[#7A5520]">
              <CircleAlert className="h-4 w-4 shrink-0" />
              {notice}
            </div>
          )}
        </div>

        {/* ═══ LEDGER ═══ */}
        <div id="ledger" className="mt-6 rounded-2xl border border-[#000066]/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#000066]/8 px-5 py-4">
            <h2 className="font-display text-xl font-extrabold text-[#000066]">السجل المحلي</h2>
            <Button onClick={clearLedger} variant="outline" className="h-9 rounded-lg border-[#B85F47]/30 px-3 text-sm text-[#8B3F2D] hover:bg-[#F5E3DC]">
              <Trash2 className="ml-2 h-3.5 w-3.5" /> مسح السجل
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right">
              <thead>
                <tr className="bg-[#000066] text-white">
                  {["الدفعة", "المصدر", "الخامة", "الكتلة", "المسار", "المصير", "الحالة", "الوقت"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-[#5A5F7A]">
                      لا توجد دفعات مسجلة. استخدم «وضع العرض» أو ابدأ ببيانات حقيقية.
                    </td>
                  </tr>
                ) : (
                  ledger.map((e, i) => (
                    <tr key={`${e.id}-${i}`} className="border-b border-[#000066]/6 last:border-0 hover:bg-[#F5F2ED]/50">
                      <td className="px-4 py-3 font-mono text-sm font-bold text-[#000066]">{e.id}</td>
                      <td className="px-4 py-3 text-sm">{e.source}</td>
                      <td className="px-4 py-3 text-sm">{e.material}</td>
                      <td className="px-4 py-3 font-mono text-sm">{e.mass} kg</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold text-white" style={{ background: ROUTES.find((r) => r.id === e.route)?.color }}>{e.route}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#3D4566]">{e.outcome}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{
                          background: e.demo ? "rgba(167,125,85,0.12)" : "rgba(0,0,102,0.08)",
                          color: e.demo ? "#8B6539" : "#000066",
                        }}>
                          {e.demo ? "محاكاة" : "ميداني"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#5A5F7A]">{e.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-6 border-t border-[#000066]/10 bg-[#000066] py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/assets/benha-university-logo.png" alt="جامعة بنها" className="h-7 w-7 object-contain" />
            <span className="text-sm text-[#A0A8C8]">TRACETEX · جامعة بنها · 2026</span>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold text-[#66FF00]">
            <ShieldCheck className="h-3.5 w-3.5" /> يعتمد التقرير على سجل الفريق الحقيقي
          </span>
        </div>
      </footer>
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
