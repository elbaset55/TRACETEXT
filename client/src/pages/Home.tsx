/**
 * TRACETEX / Material Trace Console — Redesigned
 * Navy #000066 + Neon Green #66FF00 (TRACETEX logo),
 * Orange #F7941D (Benha University), Cream #F5F2ED (prototype).
 * Route colors: prototype bin palette — dark green, ochre, teal, terracotta.
 */
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Database,
  Gauge,
  ListChecks,
  QrCode,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Tag,
  Trash2,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RouteId = "A" | "B" | "C" | "D";

type BatchEntry = {
  id: string;
  source: string;
  material: string;
  date: string;
  mass: string;
  route: RouteId;
  outcome: string;
  demo: boolean;
  createdAt: string;
};

/* Route palette from the physical prototype bins */
const ROUTES: Array<{ id: RouteId; title: string; helper: string; outcome: string; color: string; bg: string; border: string }> = [
  { id: "A", title: "إعادة استخدام مباشر", helper: "أعلى قيمة للقصاصة النظيفة الصالحة.", outcome: "جهة/استخدام موثق", color: "#1D3A30", bg: "#E0E8E4", border: "#1D3A30" },
  { id: "B", title: "بحث مشروط", helper: "قطن نظيف معلوم المصدر فقط؛ لا يفتح بحثًا تلقائيًا.", outcome: "مراجعة إشرافية مطلوبة", color: "#8B6539", bg: "#F0E8DE", border: "#A67D55" },
  { id: "C", title: "وجهة معلنة", helper: "لا يُسمى تدويرًا من دون دليل وجهة.", outcome: "وجهة قيد/تحت التوثيق", color: "#1F4F55", bg: "#E0F0EE", border: "#3F7E84" },
  { id: "D", title: "رفض آمن", helper: "مجهول المصدر أو مختلط أو غير آمن.", outcome: "مسار الجامعة المعتمد", color: "#8B3F2D", bg: "#F5E3DC", border: "#B85F47" },
];

const STORAGE_KEY = "tracetex-local-ledger-v1";

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
      setNotice("تعذر قراءة السجل المحلي في هذا المتصفح.");
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    } catch {
      setNotice("لم يُحفظ السجل محليًا؛ يمكنكم نسخ البيانات يدويًا.");
    }
  }, [ledger]);

  const activeRoute = ROUTES.find((item) => item.id === route) ?? ROUTES[0];
  const valid = Boolean(batchId.trim() && source.trim() && material.trim() && Number(mass) > 0);
  const routeCounts = useMemo(() => ROUTES.map((item) => ({ ...item, count: ledger.filter((entry) => entry.route === item.id).length })), [ledger]);

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
    setNotice("تم تحميل حالة عرض توضيحية. لا تستخدم هذه البيانات في تقرير فعلي.");
  }

  function registerBatch() {
    if (!valid) {
      setNotice("أكمل رمز الدفعة والمصدر والخامة والكتلة قبل تسجيل القرار.");
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
    setNotice(demoMode ? "سُجلت حالة محاكاة بوضوح داخل السجل المحلي." : "سُجل قرار الدفعة محليًا في هذا المتصفح.");
    resetForm();
  }

  function clearLedger() {
    setLedger([]);
    setNotice("تم حذف السجل المحلي من هذا المتصفح فقط.");
  }

  return (
    <main className="min-h-screen bg-[#F5F2ED] text-[#000033]" dir="rtl">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b-2 border-[#000066]/20 bg-[#F5F2ED]/95 px-5 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3" aria-label="العودة إلى منصة TRACETEX">
            <img src="/assets/benha-university-logo.png" alt="جامعة بنها" className="h-11 w-11 object-contain" />
            <div className="h-8 w-px bg-[#000066]/15" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center border-2 border-[#000066] bg-[#000066] text-[#66FF00] [clip-path:polygon(16%_0,84%_0,100%_16%,100%_84%,84%_100%,16%_100%,0_84%,0_16%)]"><ScanLine className="h-4 w-4" /></div>
              <div><p className="font-display text-xl font-extrabold leading-none text-[#000066]">TRACE<span className="text-[#66FF00]">TEX</span></p><p className="mt-1 font-mono text-[9px] font-bold tracking-[0.13em] text-[#5A5F7A]" dir="ltr">MATERIAL TRACE CONSOLE</p></div>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#4A5470] lg:flex"><a href="#console" className="transition-colors hover:text-[#000066]">تسجيل دفعة</a><a href="#ledger" className="transition-colors hover:text-[#000066]">السجل المحلي</a><a href="#jury" className="transition-colors hover:text-[#000066]">وضع اللجنة</a></nav>
          <div className="flex items-center gap-2 border border-[#000066]/15 bg-white px-3 py-2 text-xs font-bold text-[#000066]"><span className="neon-node" />تتبع محلي · بلا نتائج بيئية</div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="top" className="circuit-grid border-b-2 border-[#000066]/15 px-5 py-12 md:px-8 md:py-18">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-12 bg-[#F7941D]" />
              <p className="eyebrow">TRACETEX DOCK · ورقة تشغيل ميدانية</p>
            </div>
            <div className="mt-5 flex max-w-xl items-center gap-2 overflow-hidden border-y border-[#000066]/18 py-2 font-mono text-[10px] font-bold tracking-[0.08em] text-[#4A5470]" dir="ltr"><span>SOURCE</span><i className="h-px flex-1 bg-[#F7941D]" /><span>MASS</span><i className="h-px flex-1 bg-[#3F7E84]" /><span>ROUTE</span><i className="h-px flex-1 bg-[#000066]" /><span>LEDGER</span></div>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.1] tracking-[-0.045em] text-[#000066] md:text-7xl">المصدر المعروف <span className="text-[#66FF00] [text-shadow:0_0_1px_rgba(0,0,102,.4)]">يسبق النتيجة.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#3D4566]">TRACETEX دفتر تشغيل مادي لقصاصة قطن: بطاقة دفعة، كتلة، مسار، ومصير. يعمل بالبطاقات والميزان والسجل المحلي؛ والإضافة الإلكترونية لا تلغي الورقة ولا توقف القرار.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="h-12 rounded-none bg-[#000066] px-6 text-base font-bold text-white hover:bg-[#00004d]"><a href="#console"><Tag className="ml-2 h-4 w-4" />ابدأ تسجيل دفعة</a></Button><Button onClick={loadDemo} variant="outline" className="h-12 rounded-none border-[#000066]/25 bg-transparent px-6 text-base font-bold text-[#000066] hover:bg-[#000066]/5"><Workflow className="ml-2 h-4 w-4" />حمّل وضع العرض</Button></div>
            <p className="mt-6 flex items-start gap-2 border-r-2 border-[#F7941D] pr-3 text-sm leading-6 text-[#5A5F7A]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#000066]" />لا تُحوّل المنصة البيانات إلى أثر بيئي أو شراكة أو نتائج مختبرية. كل قرار يحتاج دليلًا فعليًا من الفريق.</p>
          </div>
          <div className="border-2 border-[#000066]/20 bg-[#000066] p-3 shadow-[0_28px_70px_rgba(0,0,102,0.18)]">
            <img src="/assets/tracetex-prototype.png" alt="محطة TRACETEX لتسجيل وتخصيص دفعات قصاصات النسيج" className="h-[330px] w-full object-cover md:h-[480px]" />
            <div className="mt-3 grid grid-cols-4 gap-1 bg-white/8 p-2 text-center font-mono text-xs font-bold">
              <span className="bg-[#1D3A30] py-2 text-white">A</span>
              <span className="bg-[#A67D55] py-2 text-white">B</span>
              <span className="bg-[#3F7E84] py-2 text-white">C</span>
              <span className="bg-[#B85F47] py-2 text-white">D</span>
            </div>
            <div className="mt-1 grid grid-cols-[1.2fr_1fr] gap-1 bg-white/8 p-2 text-xs">
              <div className="bg-[#F5F2ED] px-3 py-2 font-bold text-[#000066]">قصاصة نظيفة + بطاقة دفعة</div>
              <div className="bg-[#E0F0EE] px-3 py-2 font-mono font-bold tracking-[0.1em] text-[#000066]" dir="ltr">C0 · C1 · T1 · C2</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSOLE ── */}
      <section id="console" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
            <div>
              <div className="flex items-center gap-2"><span className="neon-node" /><p className="eyebrow">TRACE CONSOLE</p></div>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#000066] md:text-5xl">سجّل ما حدث، ثم اتخذ القرار.</h2>
              <p className="mt-4 max-w-lg leading-8 text-[#4A5470]">هذه واجهة العرض الحي: اكتب البيانات كما هي في بطاقة الدفعة، أضف الكتلة، اختر المسار، ثم احفظ القرار محليًا.</p>
            </div>
            <div className="flex items-center gap-4 border-r-4 border-[#66FF00] bg-[#000066]/5 p-5 text-sm leading-7 text-[#3D4566]"><Database className="h-7 w-7 shrink-0 text-[#000066]" /><p><strong className="text-[#000066]">مكان التخزين:</strong> داخل هذا المتصفح فقط. لا يرسل TRACETEX بيانات إلى خادم ولا يصنع تقريرًا مركزيًا تلقائيًا.</p></div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2 border-r-2 border-[#F7941D] bg-[#FFF7E8] px-4 py-3 text-sm leading-6 text-[#7A5520]"><Tag className="h-5 w-5 text-[#F7941D]" /><strong>قاعدة تشغيل:</strong><span>لا تمر القطعة إلى B قبل معرفة المصدر والكتلة، ولا تُعرض C0/C1/T1/C2 كنتيجة؛ بل كبوابة دليل جافة تحت إشراف.</span></div>

          <div className="mt-9 grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Form */}
            <form onSubmit={(event) => { event.preventDefault(); registerBatch(); }} className="border-2 border-[#000066]/15 bg-white p-5 shadow-[0_16px_44px_rgba(0,0,102,0.08)] md:p-7">
              <div className="flex items-center justify-between border-b border-[#000066]/12 pb-5"><div><p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#3F7E84]">STEP 01 — IDENTIFY</p><h3 className="mt-1 font-display text-2xl font-extrabold text-[#000066]">تعريف الدفعة وكتلتها</h3></div><QrCode className="h-7 w-7 text-[#000066]" /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Batch ID / رقم تسلسلي" required><input value={batchId} onChange={(event) => setBatchId(event.target.value)} placeholder="مثال: TT-001" className="trace-input" /></Field>
                <Field label="التاريخ"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="trace-input" /></Field>
                <Field label="المصدر / الورشة" required><input value={source} onChange={(event) => setSource(event.target.value)} placeholder="اسم المصدر الحقيقي" className="trace-input" /></Field>
                <Field label="الخامة المعلنة" required><input value={material} onChange={(event) => setMaterial(event.target.value)} placeholder="قطن / خليط معلن" className="trace-input" /></Field>
                <Field label="الكتلة (كجم)" required><input value={mass} onChange={(event) => setMass(event.target.value)} inputMode="decimal" placeholder="0.00" className="trace-input font-mono" /></Field>
                <Field label="المصير أو السبب"><input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder={activeRoute.outcome} className="trace-input" /></Field>
              </div>
              {demoMode && <div className="mt-5 flex gap-3 border border-[#F7941D]/30 bg-[#FFF7E8] p-4 text-sm leading-6 text-[#7A5520]"><CircleAlert className="h-5 w-5 shrink-0" /><span><strong>وضع عرض:</strong> هذه حقول محاكاة، لا تضعها في تقريركم أو ملف التقديم.</span></div>}
            </form>

            {/* Route selection */}
            <section className="border-2 border-[#000066]/15 bg-[#FCFBF8] p-5 md:p-7">
              <div className="flex items-center justify-between border-b border-[#000066]/12 pb-5"><div><p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#3F7E84]">STEP 02 — ROUTE</p><h3 className="mt-1 font-display text-2xl font-extrabold text-[#000066]">اختيار أعلى مسار قيمة آمن</h3></div><Workflow className="h-7 w-7 text-[#000066]" /></div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">{ROUTES.map((item) => <button key={item.id} type="button" onClick={() => setRoute(item.id)} className={`min-h-36 border p-4 text-right transition-transform active:scale-[0.98] ${route === item.id ? "-translate-y-1 shadow-[0_12px_26px_rgba(0,0,102,0.12)]" : "bg-white hover:-translate-y-0.5"}`} style={{ borderColor: route === item.id ? item.border : "#00006622", background: route === item.id ? item.bg : undefined }}><div className="flex items-center justify-between"><span className="font-mono text-lg font-bold" style={{ color: item.color }}>{item.id}</span><span className="h-3 w-3" style={{ background: item.color }} /></div><h4 className="mt-5 font-display text-xl font-extrabold text-[#000066]">{item.title}</h4><p className="mt-2 text-sm leading-6 text-[#5A5F7A]">{item.helper}</p></button>)}</div>
              <div className="mt-6 flex flex-col gap-4 border-t border-[#000066]/12 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="flex max-w-md items-start gap-2 text-sm leading-6 text-[#4A5470]"><ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-[#3F7E84]" /><span>قرارك الحالي: <strong className="text-[#000066]">{route} — {activeRoute.title}</strong>. المخرج الافتراضي: {activeRoute.outcome}.</span></p><Button type="submit" onClick={registerBatch} className="h-12 rounded-none bg-[#000066] px-5 text-white hover:bg-[#00004d]"><CheckCircle2 className="ml-2 h-4 w-4" />تسجيل القرار</Button></div>
            </section>
          </div>
          {notice && <div role="status" className="mt-5 flex items-center gap-3 border-r-4 border-[#F7941D] bg-[#FFF7E8] p-4 text-sm font-bold text-[#7A5520]"><CircleAlert className="h-5 w-5" />{notice}</div>}
        </div>
      </section>

      {/* ── LEDGER ── */}
      <section id="ledger" className="circuit-grid border-y-2 border-[#000066]/15 bg-[#EDEAE3] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2"><span className="neon-node" /><p className="eyebrow">LOCAL TRACE LEDGER</p></div>
              <h2 className="mt-4 font-display text-4xl font-extrabold text-[#000066] md:text-5xl">السجل المحلي للدفعات.</h2>
              <p className="mt-4 max-w-xl leading-8 text-[#4A5470]">هذه البيانات محفوظة في المتصفح الحالي فقط؛ صدّروا البيانات الحقيقية يدويًا إلى سجل Excel الرسمي بعد التشغيل.</p>
            </div>
            <Button onClick={clearLedger} variant="outline" className="h-11 rounded-none border-[#B85F47]/35 text-[#8B3F2D] hover:bg-[#F5E3DC]"><Trash2 className="ml-2 h-4 w-4" />مسح السجل المحلي</Button>
          </div>

          <div className="mt-8 grid gap-2 border border-[#000066]/12 bg-[#000066]/8 md:grid-cols-4">{routeCounts.map((item) => <div key={item.id} className="bg-[#FCFBF8] p-5"><p className="font-mono text-xs font-bold" style={{ color: item.color }}>{item.id} / {item.title}</p><p className="mt-3 font-display text-4xl font-extrabold text-[#000066]">{item.count}</p><p className="mt-1 text-xs text-[#5A5F7A]">دفعة في هذا المتصفح</p></div>)}</div>

          <div className="mt-6 overflow-x-auto border-2 border-[#000066]/15 bg-white"><table className="min-w-[900px] w-full text-right"><thead className="bg-[#000066] text-white"><tr>{["الدفعة", "المصدر", "الخامة", "الكتلة", "المسار", "المصير", "الحالة"].map((label) => <th key={label} className="px-4 py-4 text-sm font-bold">{label}</th>)}</tr></thead><tbody>{ledger.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-[#5A5F7A]">لا توجد دفعات مسجلة بعد. استخدم «وضع العرض» أو ابدأ ببيانات ميدانية حقيقية.</td></tr> : ledger.map((entry, index) => <tr key={`${entry.id}-${index}`} className="border-t border-[#000066]/10"><td className="px-4 py-4 font-mono font-bold text-[#000066]">{entry.id}</td><td className="px-4 py-4">{entry.source}</td><td className="px-4 py-4">{entry.material}</td><td className="px-4 py-4 font-mono">{entry.mass} kg</td><td className="px-4 py-4"><span className="inline-flex h-7 w-7 items-center justify-center font-mono font-bold text-white" style={{ background: ROUTES.find((item) => item.id === entry.route)?.color }}>{entry.route}</span></td><td className="px-4 py-4">{entry.outcome}</td><td className="px-4 py-4 text-sm font-bold" style={{ color: entry.demo ? "#8B6539" : "#000066" }}>{entry.demo ? "محاكاة" : "ميداني"}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      {/* ── JURY MODE ── */}
      <section id="jury" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <div className="flex items-center gap-2"><span className="neon-node" /><p className="eyebrow">60-SECOND JURY MODE</p></div>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#000066] md:text-5xl">اعرض ما تعرفه، لا ما تتمنى إثباته.</h2>
            <p className="mt-5 max-w-md leading-8 text-[#4A5470]">لا تحتاجون إنترنت أو بيانات مزعومة. حمّلوا حالة عرض معلّمة بوضوح أو سجّلوا قصاصة حقيقية، ثم مروا بخطوات السجل أمام اللجنة.</p>
          </div>
          <div className="grid gap-px border-2 border-[#000066]/15 bg-[#000066]/12 md:grid-cols-4"><JuryStep no="01" icon={<QrCode className="h-5 w-5" />} title="عرّف" copy="بطاقة ورقم دفعة ومصدر." /><JuryStep no="02" icon={<Gauge className="h-5 w-5" />} title="زِن" copy="اكتب كتلة الدفعة كما قرأها الميزان." /><JuryStep no="03" icon={<Workflow className="h-5 w-5" />} title="خصّص" copy="اختر A/B/C/D واذكر سبب القرار." /><JuryStep no="04" icon={<ClipboardList className="h-5 w-5" />} title="وثّق" copy="اعرض المصير داخل السجل المحلي." /></div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-[#000066]/15 bg-[#000066] px-5 py-8 text-sm text-[#A0A8C8] md:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <img src="/assets/benha-university-logo.png" alt="جامعة بنها" className="h-9 w-9 object-contain" />
            <span className="text-[#C8CCE0]">TRACETEX · جامعة بنها · مسابقة إدارة المخلفات الجامعية 2026</span>
          </div>
          <span className="flex items-center gap-2 font-bold text-[#66FF00]"><ShieldCheck className="h-4 w-4" />التقرير الرسمي يعتمد على سجل الفريق الحقيقي فقط.</span>
        </div>
      </footer>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-[#3D4566]"><span>{label}{required && <b className="mr-1 text-[#B85F47]">*</b>}</span>{children}</label>;
}

function JuryStep({ no, icon, title, copy }: { no: string; icon: React.ReactNode; title: string; copy: string }) {
  return <article className="min-h-44 bg-[#FCFBF8] p-5"><div className="flex items-center justify-between text-[#000066]"><span className="font-mono text-xs font-bold">{no}</span>{icon}</div><h3 className="mt-7 font-display text-2xl font-extrabold text-[#000066]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5A5F7A]">{copy}</p></article>;
}
