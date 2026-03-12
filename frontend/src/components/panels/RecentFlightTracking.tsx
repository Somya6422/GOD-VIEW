"use client";

import React, { useState, useEffect, useCallback } from "react";
import { fetchFlights, FlightState } from "@/lib/api";

export default function RecentFlightTracking() {
    const [flights, setFlights] = useState<FlightState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>("--");

    const loadFlights = useCallback(async () => {
        try {
            const data = await fetchFlights();
            setFlights(data.slice(0, 8)); // Show top 8 flights
            setError(null);
            setLastUpdate(new Date().toLocaleTimeString("en-US", { hour12: false }));
        } catch (e: any) {
            console.warn("Flight fetch failed:", e.message);
            setError("OFFLINE");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFlights();
        const interval = setInterval(loadFlights, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [loadFlights]);

    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="card-title" style={{ marginBottom: 0 }}>Recent Flight Tracking</div>
                <div style={{ fontSize: "0.45rem", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                    {error ? (
                        <span style={{ color: "#ff4444" }}>● {error}</span>
                    ) : (
                        <span style={{ color: "#00ff88" }}>● LIVE {lastUpdate}</span>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, overflow: "auto", marginTop: "6px" }}>
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", fontSize: "0.6rem" }}>
                        Loading live feeds...
                    </div>
                ) : flights.length === 0 ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", fontSize: "0.6rem" }}>
                        {error ? "Backend unreachable" : "No flight data available"}
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ICAO</th>
                                <th>CALL</th>
                                <th>COUNTRY</th>
                                <th>ALT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((f, i) => (
                                <tr key={f.icao24 + i}>
                                    <td><span className={`flight-status ${f.on_ground ? "warning" : "active"}`} /></td>
                                    <td style={{ color: "#00f0ff", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem" }}>{f.icao24}</td>
                                    <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem" }}>{f.callsign || "---"}</td>
                                    <td style={{ fontSize: "0.55rem" }}>{f.origin_country}</td>
                                    <td style={{ fontSize: "0.55rem", fontFamily: "JetBrains Mono, monospace" }}>
                                        {f.baro_altitude ? `${Math.round(f.baro_altitude)}m` : "GND"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
