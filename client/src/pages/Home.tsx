/**
 * TRACETEX / Material Trace Console
 * Design reminder: warm ivory operations desk, forest-green structure, kraft for B only,
 * teal for documented route C, rust only for safe reject D. The UI must foreground source,
 * mass, route and outcome—not claim environmental results.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
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

const ROUTES: Array<{ id: RouteId; title: string; helper: string; outcome: string; color: string; bg: string; border: string }> = [
  { id: "A", title: "إعادة استخدام مباشر", helper: "أعلى قيمة للقصاصة النظيفة الصالحة.", outcome: "جهة/استخدام موثق", color: "#174C3C", bg: "#E3EEE8", border: "#174C3C" },
  { id: "B", title: "بحث مشروط", helper: "قطن نظيف معلوم المصدر فقط؛ لا يفتح بحثًا تلقائيًا.", outcome: "مراجعة إشرافية مطلوبة", color: "#84562F", bg: "#F2E6D8", border: "#A06A3B" },
  { id: "C", title: "وجهة معلنة", helper: "لا يُسمى تدويرًا من دون دليل وجهة.", outcome: "وجهة قيد/تحت التوثيق", color: "#1F6668", bg: "#E0F0EE", border: "#2C7A7B" },
  { id: "D", title: "رفض آمن", helper: "مجهول المصدر أو مختلط أو غير آمن.", outcome: "مسار الجامعة المعتمد", color: "#873E2B", bg: "#F5E4DF", border: "#B6583A" },
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
    <main className="min-h-screen bg-[#F3F0E8] text-[#17342B]" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-[#174C3C]/12 bg-[#F3F0E8]/95 px-5 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3" aria-label="العودة إلى منصة TRACETEX">
            <div className="flex h-11 w-11 items-center justify-center bg-[#174C3C] text-[#E8F3EE] [clip-path:polygon(16%_0,84%_0,100%_16%,100%_84%,84%_100%,16%_100%,0_84%,0_16%)]"><ScanLine className="h-5 w-5" /></div>
            <div><p className="font-display text-xl font-extrabold leading-none text-[#174C3C]">TRACETEX</p><p className="mt-1 font-mono text-[10px] font-bold tracking-[0.13em] text-[#65736D]" dir="ltr">MATERIAL TRACE CONSOLE</p></div>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#50615A] lg:flex"><a href="#console" className="hover:text-[#174C3C]">تسجيل دفعة</a><a href="#ledger" className="hover:text-[#174C3C]">السجل المحلي</a><a href="#jury" className="hover:text-[#174C3C]">وضع اللجنة</a></nav>
          <div className="flex items-center gap-2 border border-[#174C3C]/14 bg-white px-3 py-2 text-xs font-bold text-[#174C3C]"><span className="h-2 w-2 bg-[#2C7A7B]" />تتبع محلي · بلا نتائج بيئية</div>
        </div>
      </header>

      <section id="top" className="border-b border-[#174C3C]/12 px-5 py-12 md:px-8 md:py-18">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="eyebrow">TRACETEX DOCK · ورقة تشغيل ميدانية</p>
            <div className="mt-5 flex max-w-xl items-center gap-2 overflow-hidden border-y border-[#174C3C]/18 py-2 font-mono text-[10px] font-bold tracking-[0.08em] text-[#496259]" dir="ltr"><span>SOURCE</span><i className="h-px flex-1 bg-[#A06A3B]" /><span>MASS</span><i className="h-px flex-1 bg-[#2C7A7B]" /><span>ROUTE</span><i className="h-px flex-1 bg-[#174C3C]" /><span>LEDGER</span></div>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.1] tracking-[-0.045em] text-[#174C3C] md:text-7xl">المصدر المعروف <span className="text-[#2C7A7B]">يسبق النتيجة.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4E6158]">TRACETEX دفتر تشغيل مادي لقصاصة قطن: بطاقة دفعة، كتلة، مسار، ومصير. يعمل بالبطاقات والميزان والسجل المحلي؛ والإضافة الإلكترونية لا تلغي الورقة ولا توقف القرار.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="h-12 rounded-none bg-[#174C3C] px-6 text-base font-bold text-white hover:bg-[#0F3C2F]"><a href="#console"><Tag className="ml-2 h-4 w-4" />ابدأ تسجيل دفعة</a></Button><Button onClick={loadDemo} variant="outline" className="h-12 rounded-none border-[#174C3C]/25 bg-transparent px-6 text-base font-bold text-[#174C3C] hover:bg-[#E0EBE5]"><Workflow className="ml-2 h-4 w-4" />حمّل وضع العرض</Button></div>
            <p className="mt-6 flex items-start gap-2 border-r-2 border-[#A06A3B] pr-3 text-sm leading-6 text-[#637169]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#174C3C]" />لا تُحوّل المنصة البيانات إلى أثر بيئي أو شراكة أو نتائج مختبرية. كل قرار يحتاج دليلًا فعليًا من الفريق.</p>
          </div>
          <div className="border border-[#174C3C]/14 bg-[#174C3C] p-3 shadow-[0_28px_70px_rgba(23,76,60,0.16)]"><img src="/manus-storage/tracetex-hero_980b4f02.png" alt="محطة TRACETEX لتسجيل وتخصيص دفعات قصاصات النسيج" className="h-[330px] w-full object-cover md:h-[480px]" /><div className="mt-3 grid grid-cols-4 gap-1 bg-white/8 p-2 text-center font-mono text-xs font-bold"><span className="bg-[#174C3C] py-2 text-white">A</span><span className="bg-[#A06A3B] py-2 text-white">B</span><span className="bg-[#2C7A7B] py-2 text-white">C</span><span className="bg-[#B6583A] py-2 text-white">D</span></div><div className="mt-1 grid grid-cols-[1.2fr_1fr] gap-1 bg-white/8 p-2 text-xs"><div className="bg-[#F3F0E8] px-3 py-2 font-bold text-[#174C3C]">قصاصة نظيفة + بطاقة دفعة</div><div className="bg-[#D8ECE7] px-3 py-2 font-mono font-bold tracking-[0.1em] text-[#174C3C]" dir="ltr">C0 · C1 · T1 · C2</div></div></div>
        </div>
      </section>

      <section id="console" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:items-end"><div><p className="eyebrow">TRACE CONSOLE</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#174C3C] md:text-5xl">سجّل ما حدث، ثم اتخذ القرار.</h2><p className="mt-4 max-w-lg leading-8 text-[#5E6E65]">هذه واجهة العرض الحي: اكتب البيانات كما هي في بطاقة الدفعة، أضف الكتلة، اختر المسار، ثم احفظ القرار محليًا.</p></div><div className="flex items-center gap-4 border-r-4 border-[#2C7A7B] bg-[#E6F0EC] p-5 text-sm leading-7 text-[#456057]"><Database className="h-7 w-7 shrink-0 text-[#174C3C]" /><p><strong className="text-[#174C3C]">مكان التخزين:</strong> داخل هذا المتصفح فقط. لا يرسل TRACETEX بيانات إلى خادم ولا يصنع تقريرًا مركزيًا تلقائيًا.</p></div></div>

          <div className="mt-7 flex flex-wrap items-center gap-2 border-r-2 border-[#A06A3B] bg-[#FBF6EC] px-4 py-3 text-sm leading-6 text-[#66533D]"><Tag className="h-5 w-5 text-[#A06A3B]" /><strong>قاعدة تشغيل:</strong><span>لا تمر القطعة إلى B قبل معرفة المصدر والكتلة، ولا تُعرض C0/C1/T1/C2 كنتيجة؛ بل كبوابة دليل جافة تحت إشراف.</span></div>
          <div className="mt-9 grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={(event) => { event.preventDefault(); registerBatch(); }} className="border border-[#174C3C]/14 bg-white p-5 shadow-[0_16px_44px_rgba(23,76,60,0.06)] md:p-7">
              <div className="flex items-center justify-between border-b border-[#174C3C]/12 pb-5"><div><p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#2C7A7B]">STEP 01 — IDENTIFY</p><h3 className="mt-1 font-display text-2xl font-extrabold text-[#174C3C]">تعريف الدفعة وكتلتها</h3></div><QrCode className="h-7 w-7 text-[#174C3C]" /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Batch ID / رقم تسلسلي" required><input value={batchId} onChange={(event) => setBatchId(event.target.value)} placeholder="مثال: TT-001" className="trace-input" /></Field>
                <Field label="التاريخ"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="trace-input" /></Field>
                <Field label="المصدر / الورشة" required><input value={source} onChange={(event) => setSource(event.target.value)} placeholder="اسم المصدر الحقيقي" className="trace-input" /></Field>
                <Field label="الخامة المعلنة" required><input value={material} onChange={(event) => setMaterial(event.target.value)} placeholder="قطن / خليط معلن" className="trace-input" /></Field>
                <Field label="الكتلة (كجم)" required><input value={mass} onChange={(event) => setMass(event.target.value)} inputMode="decimal" placeholder="0.00" className="trace-input font-mono" /></Field>
                <Field label="المصير أو السبب"><input value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder={activeRoute.outcome} className="trace-input" /></Field>
              </div>
              {demoMode && <div className="mt-5 flex gap-3 border border-[#A06A3B]/30 bg-[#F7EEDF] p-4 text-sm leading-6 text-[#754A28]"><CircleAlert className="h-5 w-5 shrink-0" /><span><strong>وضع عرض:</strong> هذه حقول محاكاة، لا تضعها في تقريركم أو ملف التقديم.</span></div>}
            </form>

            <section className="border border-[#174C3C]/14 bg-[#F8F7F2] p-5 md:p-7"><div className="flex items-center justify-between border-b border-[#174C3C]/12 pb-5"><div><p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#2C7A7B]">STEP 02 — ROUTE</p><h3 className="mt-1 font-display text-2xl font-extrabold text-[#174C3C]">اختيار أعلى مسار قيمة آمن</h3></div><Workflow className="h-7 w-7 text-[#174C3C]" /></div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">{ROUTES.map((item) => <button key={item.id} type="button" onClick={() => setRoute(item.id)} className={`min-h-36 border p-4 text-right transition-transform active:scale-[0.98] ${route === item.id ? "-translate-y-1 shadow-[0_12px_26px_rgba(23,76,60,0.12)]" : "bg-white hover:-translate-y-0.5"}`} style={{ borderColor: route === item.id ? item.border : "#174C3C22", background: route === item.id ? item.bg : undefined }}><div className="flex items-center justify-between"><span className="font-mono text-lg font-bold" style={{ color: item.color }}>{item.id}</span><span className="h-3 w-3" style={{ background: item.color }} /></div><h4 className="mt-5 font-display text-xl font-extrabold text-[#174C3C]">{item.title}</h4><p className="mt-2 text-sm leading-6 text-[#617168]">{item.helper}</p></button>)}</div>
              <div className="mt-6 flex flex-col gap-4 border-t border-[#174C3C]/12 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="flex max-w-md items-start gap-2 text-sm leading-6 text-[#596D64]"><ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-[#2C7A7B]" /><span>قرارك الحالي: <strong className="text-[#174C3C]">{route} — {activeRoute.title}</strong>. المخرج الافتراضي: {activeRoute.outcome}.</span></p><Button type="submit" onClick={registerBatch} className="h-12 rounded-none bg-[#174C3C] px-5 text-white hover:bg-[#0F3C2F]"><CheckCircle2 className="ml-2 h-4 w-4" />تسجيل القرار</Button></div>
            </section>
          </div>
          {notice && <div role="status" className="mt-5 flex items-center gap-3 border-r-4 border-[#A06A3B] bg-[#F8F0E6] p-4 text-sm font-bold text-[#714C30]"><CircleAlert className="h-5 w-5" />{notice}</div>}
        </div>
      </section>

      <section id="ledger" className="border-y border-[#174C3C]/12 bg-[#E7ECE6] px-5 py-16 md:px-8 md:py-20"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">LOCAL TRACE LEDGER</p><h2 className="mt-4 font-display text-4xl font-extrabold text-[#174C3C] md:text-5xl">السجل المحلي للدفعات.</h2><p className="mt-4 max-w-xl leading-8 text-[#5E6E65]">هذه البيانات محفوظة في المتصفح الحالي فقط؛ صدّروا البيانات الحقيقية يدويًا إلى سجل Excel الرسمي بعد التشغيل.</p></div><Button onClick={clearLedger} variant="outline" className="h-11 rounded-none border-[#B6583A]/35 text-[#873E2B] hover:bg-[#F5E4DF]"><Trash2 className="ml-2 h-4 w-4" />مسح السجل المحلي</Button></div>
        <div className="mt-8 grid gap-2 border border-[#174C3C]/12 bg-[#174C3C]/12 md:grid-cols-4">{routeCounts.map((item) => <div key={item.id} className="bg-[#F8F7F2] p-5"><p className="font-mono text-xs font-bold" style={{ color: item.color }}>{item.id} / {item.title}</p><p className="mt-3 font-display text-4xl font-extrabold text-[#174C3C]">{item.count}</p><p className="mt-1 text-xs text-[#66746D]">دفعة في هذا المتصفح</p></div>)}</div>
        <div className="mt-6 overflow-x-auto border border-[#174C3C]/14 bg-white"><table className="min-w-[900px] w-full text-right"><thead className="bg-[#174C3C] text-white"><tr>{["الدفعة", "المصدر", "الخامة", "الكتلة", "المسار", "المصير", "الحالة"].map((label) => <th key={label} className="px-4 py-4 text-sm font-bold">{label}</th>)}</tr></thead><tbody>{ledger.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-[#66746D]">لا توجد دفعات مسجلة بعد. استخدم «وضع العرض» أو ابدأ ببيانات ميدانية حقيقية.</td></tr> : ledger.map((entry, index) => <tr key={`${entry.id}-${index}`} className="border-t border-[#174C3C]/10"><td className="px-4 py-4 font-mono font-bold text-[#174C3C]">{entry.id}</td><td className="px-4 py-4">{entry.source}</td><td className="px-4 py-4">{entry.material}</td><td className="px-4 py-4 font-mono">{entry.mass} kg</td><td className="px-4 py-4"><span className="inline-flex h-7 w-7 items-center justify-center font-mono font-bold text-white" style={{ background: ROUTES.find((item) => item.id === entry.route)?.color }}>{entry.route}</span></td><td className="px-4 py-4">{entry.outcome}</td><td className="px-4 py-4 text-sm font-bold" style={{ color: entry.demo ? "#84562F" : "#174C3C" }}>{entry.demo ? "محاكاة" : "ميداني"}</td></tr>)}</tbody></table></div>
      </div></section>

      <section id="jury" className="px-5 py-16 md:px-8 md:py-20"><div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.78fr_1.22fr]"><div><p className="eyebrow">60-SECOND JURY MODE</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#174C3C] md:text-5xl">اعرض ما تعرفه، لا ما تتمنى إثباته.</h2><p className="mt-5 max-w-md leading-8 text-[#596D64]">لا تحتاجون إنترنت أو بيانات مزعومة. حمّلوا حالة عرض معلّمة بوضوح أو سجّلوا قصاصة حقيقية، ثم مروا بخطوات السجل أمام اللجنة.</p></div><div className="grid gap-px border border-[#174C3C]/14 bg-[#174C3C]/14 md:grid-cols-4"><JuryStep no="01" icon={<QrCode className="h-5 w-5" />} title="عرّف" copy="بطاقة ورقم دفعة ومصدر." /><JuryStep no="02" icon={<Gauge className="h-5 w-5" />} title="زِن" copy="اكتب كتلة الدفعة كما قرأها الميزان." /><JuryStep no="03" icon={<Workflow className="h-5 w-5" />} title="خصّص" copy="اختر A/B/C/D واذكر سبب القرار." /><JuryStep no="04" icon={<ClipboardList className="h-5 w-5" />} title="وثّق" copy="اعرض المصير داخل السجل المحلي." /></div></div></section>

      <footer className="border-t border-[#174C3C]/12 px-5 py-8 text-sm text-[#65736D] md:px-8"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 md:flex-row"><span>TRACETEX · منصة عرض أولية لمسابقة إدارة المخلفات الجامعية 2026</span><span className="flex items-center gap-2 font-bold text-[#174C3C]"><ShieldCheck className="h-4 w-4" />التقرير الرسمي يعتمد على سجل الفريق الحقيقي فقط.</span></div></footer>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-[#405249]"><span>{label}{required && <b className="mr-1 text-[#B6583A]">*</b>}</span>{children}</label>;
}

function JuryStep({ no, icon, title, copy }: { no: string; icon: React.ReactNode; title: string; copy: string }) {
  return <article className="min-h-44 bg-[#F8F7F2] p-5"><div className="flex items-center justify-between text-[#174C3C]"><span className="font-mono text-xs font-bold">{no}</span>{icon}</div><h3 className="mt-7 font-display text-2xl font-extrabold text-[#174C3C]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#617168]">{copy}</p></article>;
}
