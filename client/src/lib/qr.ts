import type { BatchEntry } from "./types";
import { ROUTES } from "./types";

export type QRPayload = {
  app: "TRACETEX";
  id: string;
  source: string;
  material: string;
  date: string;
  mass: string;
  route: string;
  routeTitle: string;
  outcome: string;
  demo: boolean;
};

export function encodeBatch(entry: BatchEntry): string {
  const route = ROUTES.find((r) => r.id === entry.route);
  const payload: QRPayload = {
    app: "TRACETEX",
    id: entry.id,
    source: entry.source,
    material: entry.material,
    date: entry.date,
    mass: entry.mass,
    route: entry.route,
    routeTitle: route?.title ?? entry.route,
    outcome: entry.outcome,
    demo: entry.demo,
  };
  return JSON.stringify(payload);
}

export function decodeQR(text: string): QRPayload | null {
  try {
    const data = JSON.parse(text);
    if (data?.app === "TRACETEX" && typeof data.id === "string") {
      return data as QRPayload;
    }
    return null;
  } catch {
    return null;
  }
}
