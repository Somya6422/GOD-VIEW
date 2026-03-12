"use client";

import React from "react";

const layerConfig = [
    { key: "liveFlights", label: "Live Flights", icon: "✈", source: "OpenSky Network", lastUpdate: "never" },
    { key: "militaryFlights", label: "Military Flights", icon: "⚔", source: "ADS-B Exchange", lastUpdate: "never" },
    { key: "earthquakes", label: "Earthquakes (24h)", icon: "🌍", source: "USGS", lastUpdate: "never" },
    { key: "satellites", label: "Satellites", icon: "🛰", source: "CelesTrak", lastUpdate: "just now", count: 180 },
    { key: "streetTraffic", label: "Street Traffic", icon: "🚗", source: "OpenStreetMap", lastUpdate: "never" },
    { key: "weatherRadar", label: "Weather Radar", icon: "🌧", source: "NASA EONET / Globe Overlay", lastUpdate: "never" },
    { key: "cctvMesh", label: "CCTV Mesh", icon: "📹", source: "CCTV Hest + Street View Fallback", lastUpdate: "never" },
    { key: "bikeshare", label: "Bikeshare", icon: "🚲", source: "GBFS", lastUpdate: "never" },
];

interface DataLayersPanelProps {
    layers: Record<string, boolean>;
    toggleLayer: (key: string) => void;
    density: number;
}

export default function DataLayersPanel({ layers, toggleLayer, density }: DataLayersPanelProps) {
    return (
        <div style={{
            background: "rgba(8, 14, 22, 0.85)",
            border: "1px solid rgba(30, 41, 59, 0.6)",
            borderRadius: "8px",
            padding: "14px",
            width: "260px",
            backdropFilter: "blur(12px)",
        }}>
            <div style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "#64748b",
                marginBottom: "12px",
                textTransform: "uppercase",
            }}>
                DATA LAYERS
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {layerConfig.map((layer) => {
                    const isOn = layers[layer.key as keyof typeof layers];
                    const displayCount = layer.key === "satellites" ? Math.floor(258 * (density / 100)) : layer.count;
                    return (
                        <div
                            key={layer.key}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px 6px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background 0.15s",
                                background: isOn ? "rgba(0, 240, 255, 0.05)" : "transparent",
                            }}
                            onClick={() => toggleLayer(layer.key)}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", flex: 1 }}>
                                <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>{layer.icon}</span>
                                <div>
                                    <div style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                        color: isOn ? "#e2e8f0" : "#94a3b8",
                                        fontFamily: "'Inter', sans-serif",
                                    }}>
                                        {layer.label}
                                        {displayCount && <span style={{ color: "#00f0ff", marginLeft: "8px", fontSize: "0.65rem" }}>{displayCount}</span>}
                                    </div>
                                    <div style={{
                                        fontSize: "0.5rem",
                                        color: "#475569",
                                        marginTop: "1px",
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}>
                                        {layer.source} · {layer.lastUpdate}
                                    </div>
                                </div>
                            </div>

                            {/* Toggle */}
                            <div style={{
                                width: "40px",
                                height: "18px",
                                borderRadius: "9px",
                                background: isOn ? "rgba(0, 240, 255, 0.3)" : "rgba(30, 41, 59, 0.8)",
                                border: `1px solid ${isOn ? "rgba(0, 240, 255, 0.5)" : "rgba(51, 65, 85, 0.5)"}`,
                                position: "relative",
                                transition: "all 0.2s",
                                flexShrink: 0,
                                marginLeft: "8px",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: "2px",
                                    left: isOn ? "22px" : "2px",
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    background: isOn ? "#00f0ff" : "#475569",
                                    boxShadow: isOn ? "0 0 8px #00f0ff" : "none",
                                    transition: "all 0.2s",
                                }} />
                                <span style={{
                                    position: "absolute",
                                    right: isOn ? "auto" : "6px",
                                    left: isOn ? "6px" : "auto",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: "0.4rem",
                                    fontWeight: 700,
                                    color: isOn ? "#00f0ff" : "#475569",
                                    letterSpacing: "0.05em",
                                }}>
                                    {isOn ? "ON" : "OFF"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
