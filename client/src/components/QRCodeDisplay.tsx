import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, QrCode } from "lucide-react";
import { ROUTES, type BatchEntry } from "@/lib/types";
import { encodeBatch } from "@/lib/qr";

export function QRCodeButton({ entry }: { entry: BatchEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#000066] transition-colors hover:bg-[#000066]/10"
        title="QR Code"
      >
        <QrCode className="h-4 w-4" />
      </button>
      <QRCodeDialog entry={entry} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function QRCodeDialog({
  entry,
  open,
  onClose,
}: {
  entry: BatchEntry;
  open: boolean;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const route = ROUTES.find((r) => r.id === entry.route);
  const qrData = encodeBatch(entry);

  function handlePrint() {
    const canvas = canvasRef.current?.querySelector("canvas");
    const dataUrl = canvas?.toDataURL("image/png") ?? "";

    const win = window.open("", "_blank", "width=420,height=620");
    if (!win) return;
    win.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>QR — ${entry.id}</title>
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
      .route-badge{display:inline-block;padding:2px 8px;border-radius:6px;color:#fff;font-size:11px;font-weight:700}
      .footer{margin-top:24px;padding-top:12px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#9CA0B8}
    </style></head><body>
    <div class="logo">TRACETEX</div>
    <div class="sub">جامعة بنها · إيصال دفعة قصاصات</div>
    <div class="qr">${dataUrl ? `<img src="${dataUrl}" />` : ""}</div>
    <table>
      <tr><td>رقم الدفعة</td><td>${entry.id}</td></tr>
      <tr><td>المصدر</td><td>${entry.source}</td></tr>
      <tr><td>الخامة</td><td>${entry.material}</td></tr>
      <tr><td>التاريخ</td><td>${entry.date}</td></tr>
      <tr><td>الكتلة</td><td>${entry.mass} كجم</td></tr>
      <tr><td>المسار</td><td><span class="route-badge" style="background:${route?.color}">${entry.route} — ${route?.title ?? ""}</span></td></tr>
      <tr><td>المصير</td><td>${entry.outcome}</td></tr>
      <tr><td>الحالة</td><td>${entry.demo ? "محاكاة" : "ميداني"}</td></tr>
    </table>
    <div class="footer">امسح QR Code لعرض تفاصيل الدفعة · TRACETEX 2026</div>
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
            QR Code — {entry.id}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div ref={canvasRef} className="rounded-xl border border-[#000066]/10 bg-white p-4">
            <QRCodeCanvas value={qrData} size={200} level="M" includeMargin={false} />
          </div>
          <div className="w-full space-y-1.5 rounded-xl bg-[#F5F2ED] p-3 text-sm">
            <InfoRow label="المصدر" value={entry.source} />
            <InfoRow label="الخامة" value={entry.material} />
            <InfoRow label="الكتلة" value={`${entry.mass} كجم`} />
            <InfoRow label="المسار" value={`${entry.route} — ${route?.title ?? ""}`} />
          </div>
          <Button onClick={handlePrint} className="h-11 w-full rounded-xl bg-[#000066] font-bold text-white hover:bg-[#00004d]">
            <Printer className="ml-2 h-4 w-4" /> طباعة QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#5A5F7A]">{label}</span>
      <span className="font-bold text-[#000033]">{value}</span>
    </div>
  );
}


