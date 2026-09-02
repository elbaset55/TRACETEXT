import { ClipboardList, QrCode, ScanLine, User } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export type TabId = "register" | "ledger" | "scan" | "profile";

const ICONS: Record<TabId, typeof ClipboardList> = {
  register: ClipboardList,
  ledger: QrCode,
  scan: ScanLine,
  profile: User,
};

export default function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const { t } = useSettings();
  const tabs: TabId[] = ["register", "ledger", "scan", "profile"];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#000066]/10 bg-white/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = ICONS[tab];
          const isActive = active === tab;
          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors"
              aria-label={t(`nav.${tab}`)}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${isActive ? "scale-110 bg-[#000066] text-white shadow-md" : "text-[#9CA0B8]"}`}
              >
                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              </span>
              <span className={`text-[10px] font-bold ${isActive ? "text-[#000066]" : "text-[#9CA0B8]"}`}>
                {t(`nav.${tab}`)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
