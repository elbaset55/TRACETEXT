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
  titleEn: string;
  helper: string;
  helperEn: string;
  outcome: string;
  outcomeEn: string;
  color: string;
  bg: string;
  border: string;
}> = [
  { id: "A", title: "إعادة استخدام مباشر", titleEn: "Direct Reuse", helper: "أعلى قيمة للقصاصة النظيفة الصالحة.", helperEn: "Highest value for clean, usable scrap.", outcome: "جهة/استخدام موثق", outcomeEn: "Verified party/use", color: "#1D3A30", bg: "#E0E8E4", border: "#1D3A30" },
  { id: "B", title: "بحث مشروط", titleEn: "Conditional Research", helper: "قطن نظيف معلوم المصدر فقط.", helperEn: "Clean cotton with known source only.", outcome: "مراجعة إشرافية مطلوبة", outcomeEn: "Supervisory review required", color: "#8B6539", bg: "#F0E8DE", border: "#A67D55" },
  { id: "C", title: "وجهة معلنة", titleEn: "Declared Destination", helper: "لا يُسمى تدويرًا بلا دليل وجهة.", helperEn: "No recycling claim without destination proof.", outcome: "وجهة قيد التوثيق", outcomeEn: "Destination under review", color: "#1F4F55", bg: "#E0F0EE", border: "#3F7E84" },
  { id: "D", title: "رفض آمن", titleEn: "Safe Rejection", helper: "مجهول المصدر أو مختلط أو غير آمن.", helperEn: "Unknown source, mixed, or unsafe.", outcome: "مسار الجامعة المعتمد", outcomeEn: "University approved path", color: "#8B3F2D", bg: "#F5E3DC", border: "#B85F47" },
  { id: "E", title: "إعادة التدوير", titleEn: "Recycling", helper: "تحويل القصاصات إلى مواد خام لإنتاج جديد.", helperEn: "Converting scraps into raw materials for new production.", outcome: "مُعاد تدويره", outcomeEn: "Recycled", color: "#2E7D32", bg: "#E3F2E3", border: "#4CAF50" },
];

export const STORAGE_KEY = "tracetex-local-ledger-v1";
