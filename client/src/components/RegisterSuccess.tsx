import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer } from "lucide-react";
import { ROUTES, type BatchEntry } from "@/lib/types";
import { encodeBatch } from "@/lib/qr";
import { useSettings } from "@/contexts/SettingsContext";

export default function RegisterSuccess({
  entry,
  open,
  onClose,
}: {
  entry: BatchEntry | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t, lang } = useSettings();
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!entry) return null;

  const route = ROUTES.find((r) => r.id === entry.route);
  const routeTitle = lang === "ar" ? route?.title : route?.titleEn;
  const qrData = encodeBatch(entry);

  function handlePrint() {
    const canvas = canvasRef.current?.querySelector("canvas");
    const dataUrl = canvas?.toDataURL("image/png") ?? "";

    const rows = [
      [t("qr.batchId"), entry!.id],
      [t("qr.source"), entry!.source],
      [t("qr.material"), entry!.material],
      [t("qr.date"), entry!.date],
      [t("qr.mass"), `${entry!.mass} ${lang === "ar" ? "كجم" : "kg"}`],
      [t("qr.route"), `${entry!.route} — ${lang === "ar" ? route?.title : route?.titleEn}`],
      [t("qr.outcome"), entry!.outcome],
      [t("qr.status"), entry!.demo ? (lang === "ar" ? "محاكاة" : "Demo") : (lang === "ar" ? "ميداني" : "Field")],
    ];

    const win = window.open("", "_blank", "width=420,height=620");
    if (!win) return;
    win.document.write(`<!doctype html><html dir="${lang === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>QR — ${entry!.id}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:"Alexandria",system-ui,sans-serif;padding:32px;color:#000033}
      .logo{font-size:20px;font-weight:800;color:#000066;letter-spacing:1px}
      .sub{font-size:11px;color:#5A5F7A;margin-top:2px}
      .qr{margin:20px auto;width:220px;height:220px}
      .qr img{width:100%;height:100%}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      td{padding:6px 8px;border-bottom:1px solid #eee;font-size:12px}
      td:first-child{color:#5A5F7A;font-weight:700;width:35%}
      td:last-child{font-weight:600}
      .footer{margin-top:24px;padding-top:12px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#9CA0B8}
    </style></head><body>
    <div class="logo">TRACETEX</div>
    <div class="sub">${t("qr.receipt")}</div>
    <div class="qr">${dataUrl ? `<img src="${dataUrl}" />` : ""}</div>
    <table>
      ${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
    </table>
    <div class="footer">${t("qr.scanHint")}</div>
    </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-lg text-[#000066]">
            {t("home.successTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#66FF00]/15">
            <CheckCircle2 className="h-8 w-8 text-[#2E7D32]" />
          </div>
          <div ref={canvasRef} className="rounded-xl border border-[#000066]/10 bg-white p-4">
            <QRCodeCanvas value={qrData} size={180} level="M" includeMargin={false} />
          </div>
          <div className="w-full space-y-1.5 rounded-xl bg-[#F5F2ED] p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#5A5F7A]">{t("qr.batchId")}</span>
              <span className="font-mono font-bold text-[#000033]">{entry.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A5F7A]">{t("qr.source")}</span>
              <span className="font-bold text-[#000033]">{entry.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A5F7A]">{t("qr.route")}</span>
              <span className="font-bold text-[#000033]">{entry.route} — {routeTitle}</span>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Button onClick={handlePrint} className="h-11 flex-1 rounded-xl bg-[#000066] font-bold text-white hover:bg-[#00004d]">
              <Printer className="ml-2 h-4 w-4" /> {t("home.successPrintQR")}
            </Button>
            <Button onClick={onClose} variant="outline" className="h-11 rounded-xl border-[#000066]/20 px-5 font-bold text-[#000066] hover:bg-[#000066]/5">
              {t("home.successDone")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
