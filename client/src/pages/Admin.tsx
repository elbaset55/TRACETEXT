/**
 * TRACETEX — Admin Dashboard (University Administration)
 * Reads the same localStorage ledger as the operator console.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Beaker,
  Download,
  FlaskConical,
  Package,
  Scale,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeButton } from "@/components/QRCodeDisplay";
import { useLocation } from "wouter";
import { ROUTES, STORAGE_KEY, type BatchEntry, type RouteId } from "@/lib/types";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [ledger, setLedger] = useState<BatchEntry[]>([]);
  const [routeFilter, setRouteFilter] = useState<RouteId | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "field" | "demo">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setLedger(JSON.parse(saved));
    } catch {
      /* empty */
    }
  }, []);

  function saveLedger(items: BatchEntry[]) {
    setLedger(items);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* empty */
    }
  }

  function deleteRow(index: number) {
    saveLedger(ledger.filter((_, i) => i !== index));
  }

  // ── Stats ──
  const totalCount = ledger.length;
  const totalMass = ledger.reduce((s, e) => s + (parseFloat(e.mass) || 0), 0);
  const fieldCount = ledger.filter((e) => !e.demo).length;
  const demoCount = ledger.filter((e) => e.demo).length;
  const maxRouteCount = Math.max(1, ...ROUTES.map((r) => ledger.filter((e) => e.route === r.id).length));

  const routeStats = ROUTES.map((r) => {
    const items = ledger.filter((e) => e.route === r.id);
    return {
      ...r,
      count: items.length,
      mass: items.reduce((s, e) => s + (parseFloat(e.mass) || 0), 0),
      pct: totalCount > 0 ? Math.round((items.length / totalCount) * 100) : 0,
    };
  });

  // ── Filtering ──
  const filtered = useMemo(() => {
    return ledger
      .map((e, originalIndex) => ({ ...e, originalIndex }))
      .filter((e) => {
        if (routeFilter !== "ALL" && e.route !== routeFilter) return false;
        if (statusFilter === "field" && e.demo) return false;
        if (statusFilter === "demo" && !e.demo) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          return (
            e.id.toLowerCase().includes(q) ||
            e.source.toLowerCase().includes(q) ||
            e.material.toLowerCase().includes(q) ||
            e.outcome.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [ledger, routeFilter, statusFilter, search]);

  function exportCSV() {
    const headers = ["الدفعة", "المصدر", "الخامة", "التاريخ", "الكتلة (كجم)", "المسار", "المصير", "الحالة", "الوقت"];
    const rows = ledger.map((e) => [
      e.id, e.source, e.material, e.date, e.mass, e.route, e.outcome,
      e.demo ? "محاكاة" : "ميداني", e.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tracetex-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = [
    { label: "إجمالي الدفعات", value: totalCount, icon: Package, color: "#000066" },
    { label: "إجمالي الكتلة", value: `${totalMass.toFixed(2)} kg`, icon: Scale, color: "#3F7E84" },
    { label: "دفعات ميدانية", value: fieldCount, icon: ShieldCheck, color: "#1D3A30" },
    { label: "دفعات محاكاة", value: demoCount, icon: FlaskConical, color: "#A67D55" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#000033]" dir="rtl">
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 border-b border-[#000066]/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
          <div className="flex items-center gap-3">
            <img src="/assets/tracetex-logo.png" alt="TRACETEX" className="h-12 w-auto" />
            <span className="rounded-full bg-[#000066] px-3 py-0.5 text-xs font-bold text-white">الإدارة</span>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="h-9 rounded-lg px-3 text-sm font-bold text-[#4A5470] hover:bg-[#000066]/5 hover:text-[#000066]"
          >
            لوحة التتبع <ArrowRight className="mr-1 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <img src="/assets/benha-university-logo.png" alt="جامعة بنها" className="h-7 w-7 object-contain" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* ═══ TITLE ═══ */}
        <div className="mb-5">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#000066]">لوحة إدارة الجامعة</h1>
          <p className="mt-1 text-sm text-[#5A5F7A]">نظرة شاملة على جميع دفعات القصاصات المسجلة</p>
        </div>

        {/* ═══ STATS ═══ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#000066]/8 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${s.color}12`, color: s.color }}>
                  <s.icon className="h-4 w-4" />
                </span>
                <span className="font-display text-2xl font-extrabold text-[#000066]">{s.value}</span>
              </div>
              <p className="mt-2 text-xs font-bold text-[#5A5F7A]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ═══ ROUTE DISTRIBUTION ═══ */}
        <div className="mt-5 rounded-2xl border border-[#000066]/8 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-extrabold text-[#000066]">توزيع المسارات</h2>
          <div className="mt-4 space-y-3">
            {routeStats.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white" style={{ background: r.color }}>{r.id}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#3D4566]">{r.title}</span>
                    <span className="font-mono text-[#5A5F7A]">{r.count} دفعة · {r.mass.toFixed(2)} kg · {r.pct}%</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#000066]/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(r.count / maxRouteCount) * 100}%`, background: r.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ FILTERS + TABLE ═══ */}
        <div className="mt-5 rounded-2xl border border-[#000066]/8 bg-white shadow-sm">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-[#000066]/8 px-5 py-3">
            {/* Route filter pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRouteFilter("ALL")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${routeFilter === "ALL" ? "bg-[#000066] text-white" : "text-[#4A5470] hover:bg-[#000066]/5"}`}
              >
                الكل
              </button>
              {ROUTES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRouteFilter(r.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${routeFilter === r.id ? "text-white" : "text-[#4A5470] hover:bg-[#000066]/5"}`}
                  style={routeFilter === r.id ? { background: r.color } : undefined}
                >
                  {r.id}
                </button>
              ))}
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1">
              {[
                { key: "ALL" as const, label: "الكل" },
                { key: "field" as const, label: "ميداني" },
                { key: "demo" as const, label: "محاكاة" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${statusFilter === s.key ? "bg-[#3F7E84] text-white" : "text-[#4A5470] hover:bg-[#000066]/5"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA0B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث برقم الدفعة، المصدر، الخامة..."
                className="w-full rounded-lg border border-[#000066]/12 bg-[#FCFBF8] py-2 pr-9 pl-3 text-sm text-[#000033] outline-none transition-colors focus:border-[#000066] focus:ring-2 focus:ring-[#66FF00]/15"
              />
            </div>

            {/* Export */}
            <Button onClick={exportCSV} disabled={ledger.length === 0} className="h-9 rounded-lg bg-[#000066] px-3 text-xs font-bold text-white hover:bg-[#00004d] disabled:opacity-40">
              <Download className="ml-1.5 h-3.5 w-3.5" /> تصدير CSV
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-right">
              <thead>
                <tr className="bg-[#000066] text-white">
                  {["الدفعة", "المصدر", "الخامة", "التاريخ", "الكتلة", "المسار", "المصير", "الحالة", "الوقت", "QR", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-xs font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-sm text-[#5A5F7A]">
                      {ledger.length === 0 ? "لا توجد دفعات مسجلة بعد." : "لا توجد نتائج مطابقة للفلاتر."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={`${e.id}-${e.originalIndex}`} className="border-b border-[#000066]/6 last:border-0 hover:bg-[#F5F2ED]/50">
                      <td className="px-4 py-3 font-mono text-sm font-bold text-[#000066]">{e.id}</td>
                      <td className="px-4 py-3 text-sm">{e.source}</td>
                      <td className="px-4 py-3 text-sm">{e.material}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#5A5F7A]">{e.date}</td>
                      <td className="px-4 py-3 font-mono text-sm">{e.mass} kg</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold text-white" style={{ background: ROUTES.find((r) => r.id === e.route)?.color }}>{e.route}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#3D4566]">{e.outcome}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold" style={{
                          background: e.demo ? "rgba(167,125,85,0.12)" : "rgba(0,0,102,0.08)",
                          color: e.demo ? "#8B6539" : "#000066",
                        }}>
                          {e.demo ? <Beaker className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                          {e.demo ? "محاكاة" : "ميداني"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#5A5F7A]">{e.createdAt}</td>
                      <td className="px-4 py-3"><QRCodeButton entry={e} /></td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteRow(e.originalIndex)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#B85F47] transition-colors hover:bg-[#B85F47]/10"
                          title="حذف"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#000066]/8 px-5 py-2.5 text-xs text-[#5A5F7A]">
              <span>عرض {filtered.length} من {totalCount} دفعة</span>
              {filtered !== ledger && (
                <button
                  onClick={() => { setRouteFilter("ALL"); setStatusFilter("ALL"); setSearch(""); }}
                  className="font-bold text-[#000066] hover:underline"
                >
                  إزالة الفلاتر
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-6 border-t border-[#000066]/10 bg-[#000066] py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <img src="/assets/benha-university-logo.png" alt="جامعة بنها" className="h-7 w-7 object-contain" />
            <span className="text-sm text-[#A0A8C8]">TRACETEX · لوحة الإدارة · جامعة بنها · 2026</span>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold text-[#66FF00]">
            <ShieldCheck className="h-3.5 w-3.5" /> يعتمد التقرير على سجل الفريق الحقيقي
          </span>
        </div>
      </footer>
    </div>
  );
}
