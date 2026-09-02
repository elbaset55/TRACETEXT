export type RouteId = "A" | "B" | "C" | "D" | "E";

export type BatchEntry = {
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

export const ROUTES: Array<{
  id: RouteId;
  title: string;
  helper: string;
  outcome: string;
  color: string;
  bg: string;
  border: string;
}> = [
  { id: "A", title: "إعادة استخدام مباشر", helper: "أعلى قيمة للقصاصة النظيفة الصالحة.", outcome: "جهة/استخدام موثق", color: "#1D3A30", bg: "#E0E8E4", border: "#1D3A30" },
  { id: "B", title: "بحث مشروط", helper: "قطن نظيف معلوم المصدر فقط.", outcome: "مراجعة إشرافية مطلوبة", color: "#8B6539", bg: "#F0E8DE", border: "#A67D55" },
  { id: "C", title: "وجهة معلنة", helper: "لا يُسمى تدويرًا بلا دليل وجهة.", outcome: "وجهة قيد التوثيق", color: "#1F4F55", bg: "#E0F0EE", border: "#3F7E84" },
  { id: "D", title: "رفض آمن", helper: "مجهول المصدر أو مختلط أو غير آمن.", outcome: "مسار الجامعة المعتمد", color: "#8B3F2D", bg: "#F5E3DC", border: "#B85F47" },
  { id: "E", title: "إعادة التدوير", helper: "تحويل القصاصات إلى مواد خام لإنتاج جديد.", outcome: "مُعاد تدويره", color: "#2E7D32", bg: "#E3F2E3", border: "#4CAF50" },
];

export const STORAGE_KEY = "tracetex-local-ledger-v1";
