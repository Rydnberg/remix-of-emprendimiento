import { useQuery } from "@tanstack/react-query";
import { fetchQuakes } from "./demo-data";

export function useQuakes(days = 30) {
  return useQuery({ queryKey: ["quakes", days], queryFn: () => fetchQuakes(days), staleTime: 5 * 60_000 });
}

export function timeAgo(ms: number, lang: "es" | "en") {
  const h = Math.round((Date.now() - ms) / 3600_000);
  if (h < 1) return lang === "es" ? "hace minutos" : "minutes ago";
  if (h < 24) return lang === "es" ? `hace ${h} h` : `${h} h ago`;
  const d = Math.round(h / 24);
  return lang === "es" ? `hace ${d} d` : `${d} d ago`;
}
