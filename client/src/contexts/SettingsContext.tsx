import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { type Lang, translate } from "@/lib/i18n";

export type UserRole = "operator" | "manager" | "technician" | "researcher";

export interface UserProfile {
  name: string;
  role: UserRole;
}

interface SettingsContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_LANG = "tracetex-lang";
const STORAGE_HC = "tracetex-hc";
const STORAGE_USER = "tracetex-user";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem(STORAGE_LANG) as Lang) || "ar";
    } catch {
      return "ar";
    }
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_HC) === "true";
    } catch {
      return false;
    }
  });
  const [user, setUserState] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Apply lang + dir to <html>
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_LANG, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  // Apply high contrast class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("hc");
    } else {
      root.classList.remove("hc");
    }
    try {
      localStorage.setItem(STORAGE_HC, String(highContrast));
    } catch {
      /* ignore */
    }
  }, [highContrast]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER);
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((p) => (p === "ar" ? "en" : "ar")), []);
  const toggleHighContrast = useCallback(() => setHighContrast((p) => !p), []);
  const setUser = useCallback((u: UserProfile | null) => setUserState(u), []);
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang],
  );

  return (
    <SettingsContext.Provider value={{ lang, setLang, toggleLang, highContrast, toggleHighContrast, user, setUser, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
