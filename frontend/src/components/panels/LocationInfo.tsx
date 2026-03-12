"use client";

import React, { useState } from "react";
import { BACKEND_URL } from "@/lib/api";

export default function LocationInfo() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setErrorMsg("");

        try {
            const v = (window as any).__cesiumViewer;
            const Cesium = (window as any).Cesium;

            if (v && !v.isDestroyed() && Cesium) {
                // Call backend proxy for OpenStreetMap Nominatim
                const res = await fetch(`${BACKEND_URL}/api/feeds/geocode?q=${encodeURIComponent(searchQuery)}`);
                const json = await res.json();

                if (json.status === "success" && json.data && json.data.length > 0) {
                    const result = json.data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);

                    // Default altitude / angles for search results
                    const isCity = result.type === "city" || result.type === "administrative";
                    const alt = isCity ? 5000 : 800;
                    const pitchDeg = -35;
                    const pitchRad = Cesium.Math.toRadians(pitchDeg);

                    // Calculate offset so the camera looks AT the target coordinate
                    // Earth's latitudinal degree is roughly 111,111 meters
                    const distance = alt / Math.tan(Math.abs(pitchRad));
                    const offsetDeg = distance / 111111;
                    const cameraLat = lat - offsetDeg;

                    v.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(lon, cameraLat, alt),
                        orientation: {
                            heading: 0.0,
                            pitch: pitchRad,
                            roll: 0.0
                        },
                        duration: 3.0,
                    });

                    setSearchQuery(""); // clear on success
                } else {
                    setErrorMsg("Location not found");
                }
            } else {
                setErrorMsg("Globe not ready");
            }
        } catch (err) {
            console.error("Geocoding failed:", err);
            setErrorMsg("Search failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            background: "rgba(8, 14, 22, 0.85)",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            borderRadius: "24px",
            padding: "8px 16px",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            width: "400px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(0, 240, 255, 0.1)",
        }}>
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Search global locations or landmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isLoading}
                    style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#00f0ff",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.8rem",
                        flex: 1,
                        letterSpacing: "0.05em",
                    }}
                />
                {isLoading && (
                    <div style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(0, 240, 255, 0.2)",
                        borderTop: "2px solid #00f0ff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }} />
                )}
            </form>
            {errorMsg && (
                <div style={{
                    color: "#ff3366",
                    fontSize: "0.65rem",
                    fontFamily: "'Inter', sans-serif",
                    marginTop: "6px",
                    textAlign: "center"
                }}>
                    {errorMsg}
                </div>
            )}
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                input::placeholder { color: rgba(0, 240, 255, 0.4); }
            `}</style>
        </div>
    );
}
