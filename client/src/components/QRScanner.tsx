import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { ScanLine, Camera, CameraOff, CheckCircle2, CircleAlert } from "lucide-react";
import { decodeQR, type QRPayload } from "@/lib/qr";
import { ROUTES } from "@/lib/types";
import { useSettings } from "@/contexts/SettingsContext";

const SCANNER_ID = "tracetex-qr-reader";

export default function QRScanner() {
  const { t, lang } = useSettings();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<QRPayload | null>(null);
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  async function startScan() {
    setError("");
    setResult(null);
    try {
      const scanner = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded) => {
          const payload = decodeQR(decoded);
          if (payload) {
            setResult(payload);
            stopScan();
          }
        },
        () => {
          /* per-frame errors are normal — ignore */
        },
      );
      setScanning(true);
    } catch {
      setError(t("scan.cameraError"));
    }
  }

  async function stopScan() {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch {
        /* already stopped */
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, []);

  const route = result ? ROUTES.find((r) => r.id === result.route) : null;
  const routeTitle = result ? (lang === "ar" ? result.routeTitle : route?.titleEn ?? result.routeTitle) : null;

  return (
    <div className="rounded-2xl border border-[#000066]/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#000066]/8 pb-4">
        <h2 className="font-display text-xl font-extrabold text-[#000066]">{t("scan.title")}</h2>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#66FF00]/10 text-[#2E7D32]">
          <ScanLine className="h-4 w-4" />
        </span>
      </div>

      {!result && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div
            id={SCANNER_ID}
            className="w-full max-w-xs overflow-hidden rounded-xl border-2 border-[#000066]/10 bg-[#F5F2ED]"
            style={{ minHeight: scanning ? undefined : 200 }}
          >
            {!scanning && (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-[#9CA0B8]">
                <Camera className="h-10 w-10" />
                <span className="text-xs font-bold">{t("scan.cameraOff")}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#B85F47]/25 bg-[#F5E3DC] px-4 py-2 text-sm font-bold text-[#8B3F2D]">
              <CircleAlert className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {scanning ? (
            <Button onClick={stopScan} variant="outline" className="h-11 rounded-xl border-[#B85F47]/30 px-5 font-bold text-[#8B3F2D] hover:bg-[#F5E3DC]">
              <CameraOff className="ml-2 h-4 w-4" /> {t("scan.stop")}
            </Button>
          ) : (
            <Button onClick={startScan} className="h-11 rounded-xl bg-[#000066] px-5 font-bold text-white hover:bg-[#00004d]">
              <Camera className="ml-2 h-4 w-4" /> {t("scan.start")}
            </Button>
          )}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-[#2E7D32]/25 bg-[#E3F2E3] px-4 py-2.5 text-sm font-bold text-[#2E7D32]">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {t("scan.success")}
          </div>
          <div className="rounded-xl border border-[#000066]/10 bg-[#F5F2ED] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-lg font-extrabold text-[#000066]">{result.id}</span>
              <span
                className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                style={{ background: route?.color ?? "#000066" }}
              >
                {result.route} — {routeTitle}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailItem label={t("scan.source")} value={result.source} />
              <DetailItem label={t("scan.material")} value={result.material} />
              <DetailItem label={t("scan.date")} value={result.date} />
              <DetailItem label={t("scan.mass")} value={`${result.mass} kg`} />
              <DetailItem label={t("scan.outcome")} value={result.outcome} />
              <DetailItem label={t("scan.status")} value={result.demo ? t("ledger.simulation") : t("ledger.field")} />
            </div>
          </div>
          <Button
            onClick={() => { setResult(null); startScan(); }}
            className="h-11 w-full rounded-xl bg-[#000066] font-bold text-white hover:bg-[#00004d]"
          >
            <Camera className="ml-2 h-4 w-4" /> {t("scan.another")}
          </Button>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-[#5A5F7A]">{label}</p>
      <p className="mt-0.5 font-bold text-[#000033]">{value}</p>
    </div>
  );
}
