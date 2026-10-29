/**
 * Placeholder pricing — NOT approved. Edit these values once the project team confirms pricing.
 */
export const PRICING = {
  currency: "S/",
  monthly: "00.00",
  annual: "000.00",
};

export type Quake = {
  id: string;
  mag: number;
  depth: number;
  place: string;
  time: number;
  lat: number;
  lon: number;
  source: "USGS" | "IGP (demo)";
};

// Demonstration data used when the live USGS feed is unavailable.
const now = Date.now();
const h = 3600_000;
export const DEMO_QUAKES: Quake[] = [
  { id: "d1", mag: 4.6, depth: 38, place: "28 km SO de Chilca, Lima", time: now - 5 * h, lat: -12.7, lon: -76.9, source: "IGP (demo)" },
  { id: "d2", mag: 3.9, depth: 102, place: "15 km N de Arequipa", time: now - 20 * h, lat: -16.3, lon: -71.5, source: "IGP (demo)" },
  { id: "d3", mag: 5.1, depth: 24, place: "Costa de Ica", time: now - 46 * h, lat: -14.4, lon: -76.4, source: "IGP (demo)" },
  { id: "d4", mag: 4.2, depth: 140, place: "Moyobamba, San Martín", time: now - 70 * h, lat: -6.0, lon: -76.9, source: "IGP (demo)" },
  { id: "d5", mag: 3.5, depth: 60, place: "Callao (mar)", time: now - 90 * h, lat: -12.1, lon: -77.4, source: "IGP (demo)" },
  { id: "d6", mag: 4.8, depth: 33, place: "Tacna, frontera sur", time: now - 120 * h, lat: -18.1, lon: -70.6, source: "IGP (demo)" },
  { id: "d7", mag: 3.7, depth: 45, place: "Chimbote, Áncash", time: now - 150 * h, lat: -9.1, lon: -78.7, source: "IGP (demo)" },
];

// Peru bounding box
export const BOUNDS = { minLat: -18.5, maxLat: -0.5, minLon: -81.5, maxLon: -68.5 };

export const REGIONS = [
  { id: "all", es: "Todo el Perú", en: "All of Peru", lat: [-18.5, -0.5], lon: [-81.5, -68.5] },
  { id: "north", es: "Norte", en: "North", lat: [-9, -0.5], lon: [-81.5, -68.5] },
  { id: "center", es: "Centro", en: "Center", lat: [-14, -9], lon: [-81.5, -68.5] },
  { id: "south", es: "Sur", en: "South", lat: [-18.5, -14], lon: [-81.5, -68.5] },
] as const;

export async function fetchQuakes(days = 30): Promise<{ quakes: Quake[]; live: boolean }> {
  try {
    const end = new Date();
    const start = new Date(Date.now() - days * 86400_000);
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start.toISOString().slice(0, 10)}&endtime=${end.toISOString().slice(0, 10)}&minlatitude=${BOUNDS.minLat}&maxlatitude=${BOUNDS.maxLat}&minlongitude=${BOUNDS.minLon}&maxlongitude=${BOUNDS.maxLon}&minmagnitude=3&orderby=time&limit=80`;
    const r = await fetch(url);
    if (!r.ok) throw new Error();
    const j = await r.json();
    const quakes: Quake[] = j.features.map((f: any) => ({
      id: f.id,
      mag: f.properties.mag,
      depth: Math.round(f.geometry.coordinates[2]),
      place: f.properties.place,
      time: f.properties.time,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      source: "USGS",
    }));
    if (!quakes.length) throw new Error();
    return { quakes, live: true };
  } catch {
    return { quakes: DEMO_QUAKES, live: false };
  }
}

// Aggregated, anonymized canine observations — DEMO, experimental.
export const DOG_OBS = [
  { lat: -12.05, lon: -77.0, n: 42 },
  { lat: -12.1, lon: -76.95, n: 18 },
  { lat: -16.4, lon: -71.53, n: 21 },
  { lat: -14.07, lon: -75.73, n: 12 },
  { lat: -8.1, lon: -79.03, n: 15 },
  { lat: -6.77, lon: -79.84, n: 9 },
  { lat: -13.53, lon: -71.97, n: 11 },
  { lat: -18.01, lon: -70.25, n: 7 },
];

export const WEEKLY_TREND = [
  { week: "S1", obs: 120, quakes: 6 },
  { week: "S2", obs: 98, quakes: 4 },
  { week: "S3", obs: 134, quakes: 7 },
  { week: "S4", obs: 110, quakes: 5 },
  { week: "S5", obs: 142, quakes: 8 },
  { week: "S6", obs: 105, quakes: 3 },
  { week: "S7", obs: 127, quakes: 6 },
  { week: "S8", obs: 118, quakes: 5 },
];

export const BEHAVIOR_SHARE = [
  { k: "bark", es: "Ladridos inusuales", en: "Unusual barking", v: 34 },
  { k: "rest", es: "Inquietud", en: "Restlessness", v: 28 },
  { k: "hide", es: "Esconderse", en: "Hiding", v: 21 },
  { k: "act", es: "Cambio de actividad", en: "Activity change", v: 17 },
];

export const SOURCES = [
  { es: "Albergues participantes", en: "Participating shelters", v: 46 },
  { es: "Dueños voluntarios", en: "Volunteer owners", v: 38 },
  { es: "Socios de investigación", en: "Research partners", v: 16 },
];
