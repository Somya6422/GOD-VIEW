// frontend api client — all backend calls go through here

export const BACKEND_URL = process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";

export interface FlightState {
    icao24: string;
    callsign: string;
    origin_country: string;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    velocity: number | null;
    true_track: number | null;
    on_ground: boolean;
}

export interface BackendStatus {
    status: string;
    uptime_seconds: number;
    services: Record<string, string>;
}

export interface IngestResult {
    status: string;
    extracted?: number;
    added_to_graph?: { status: string };
    message?: string;
}

// fetch live flights from opensky via backend proxy
export async function fetchFlights(bbox?: string): Promise<FlightState[]> {
    const url = bbox
        ? `${BACKEND_URL}/api/feeds/flights?bbox=${bbox}`
        : `${BACKEND_URL}/api/feeds/flights`;

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`flights api error: ${res.status}`);

    const d = await res.json();
    if (d.status !== "success" || !d.data) return [];

    // opensky returns arrays — map to named fields
    return d.data.map((s: any[]) => ({
        icao24: s[0] || "",
        callsign: (s[1] || "").trim(),
        origin_country: s[2] || "",
        longitude: s[5],
        latitude: s[6],
        baro_altitude: s[7],
        velocity: s[9],
        true_track: s[10],
        on_ground: s[8] ?? false,
    }));
}

// health check + round-trip latency
export async function fetchStatus(): Promise<{ data: BackendStatus; latencyMs: number }> {
    const t0 = performance.now();
    const res = await fetch(`${BACKEND_URL}/api/status`, { signal: AbortSignal.timeout(5000) });
    const ms = Math.round(performance.now() - t0);

    if (!res.ok) throw new Error(`status api error: ${res.status}`);

    const data: BackendStatus = await res.json();
    return { data, latencyMs: ms };
}

// ingest unstructured text -> llm -> neo4j graph
export async function ingestText(text: string): Promise<IngestResult> {
    const res = await fetch(`${BACKEND_URL}/api/ingest/unstructured`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) throw new Error(`ingest api error: ${res.status}`);
    return res.json();
}
