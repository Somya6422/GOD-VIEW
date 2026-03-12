"use client";

import React, { useState } from "react";

interface HUDParams {
    bloom: number;
    sharpen: number;
    sensitivity: number;
    whotBhot: number;
    pixelation: number;
}

interface HUDControlsProps {
    hudParams: HUDParams;
    setHudParams: React.Dispatch<React.SetStateAction<HUDParams>>;
    layout: string;
    setLayout: (layout: string) => void;
    setShowUI: (show: boolean) => void;
    detectionMode: string | null;
    setDetectionMode: (mode: string | null) => void;
    density: number;
    setDensity: (val: number) => void;
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <span style={{
                fontSize: "0.65rem",
                color: "#94a3b8",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                minWidth: "75px",
            }}>
                {label}
            </span>
            <div style={{ flex: 1, position: "relative", height: "16px", display: "flex", alignItems: "center" }}>
                <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "2px",
                    background: "rgba(30, 41, 59, 0.8)",
                    borderRadius: "1px",
                }} />
                <div style={{
                    position: "absolute",
                    width: `${value}%`,
                    height: "2px",
                    background: "rgba(0, 240, 255, 0.4)",
                    borderRadius: "1px",
                }} />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "16px",
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 2,
                    }}
                />
                <div style={{
                    position: "absolute",
                    left: `calc(${value}% - 6px)`,
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#00f0ff",
                    boxShadow: "0 0 10px rgba(0, 240, 255, 0.6)",
                    transition: "left 0.1s",
                    pointerEvents: "none",
                }} />
            </div>
            <span style={{
                fontSize: "0.55rem",
                color: "#00f0ff",
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: "24px",
                textAlign: "right",
            }}>
                {value}%
            </span>
        </div>
    );
}

export default function HUDControls({ hudParams, setHudParams, layout, setLayout, setShowUI, detectionMode, setDetectionMode, density, setDensity }: HUDControlsProps) {
    const [showParams, setShowParams] = useState(true);

    const handleDetectionCycle = () => {
        if (!detectionMode) setDetectionMode("SPARSE");
        else if (detectionMode === "SPARSE") setDetectionMode("PANOPTIC");
        else setDetectionMode(null);
    };

    const updateParam = (key: string, val: number) => {
        setHudParams((prev) => ({ ...prev, [key]: val }));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "220px" }}>
            {/* Post-processing */}
            <div style={{
                background: "rgba(8, 14, 22, 0.85)",
                border: "1px solid rgba(30, 41, 59, 0.6)",
                borderRadius: "8px",
                padding: "12px",
                backdropFilter: "blur(12px)",
            }}>
                <div style={{
                    fontSize: "0.55rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "#64748b",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                }}>
                    POST
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
                    <button style={{
                        background: "rgba(15, 21, 32, 0.8)",
                        border: "1px solid rgba(30, 41, 59, 0.6)",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        color: "#94a3b8",
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        ✦ BLOOM
                    </button>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(0, 240, 255, 0.08)",
                        border: "1px solid rgba(0, 240, 255, 0.2)",
                        borderRadius: "4px",
                        padding: "4px 10px",
                    }}>
                        <span style={{ fontSize: "0.6rem", color: "#00f0ff", fontWeight: 600 }}>◉ SHARPEN</span>
                        <span style={{ fontSize: "0.55rem", color: "#00f0ff", fontFamily: "'JetBrains Mono', monospace" }}>{hudParams.sharpen}%</span>
                    </div>
                </div>
            </div>

            {/* HUD */}
            <div style={{
                background: "rgba(0, 240, 255, 0.08)",
                border: "1px solid rgba(0, 240, 255, 0.25)",
                borderRadius: "8px",
                padding: "10px 12px",
                cursor: "pointer",
            }}>
                <div style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#00f0ff",
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                    HUD
                </div>
            </div>

            {/* Layout */}
            <div style={{
                background: "rgba(8, 14, 22, 0.85)",
                border: "1px solid rgba(30, 41, 59, 0.6)",
                borderRadius: "8px",
                padding: "8px 12px",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <span style={{ fontSize: "0.55rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.1em" }}>LAYOUT</span>
                <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    style={{
                        background: "rgba(15, 21, 32, 0.9)",
                        border: "1px solid rgba(30, 41, 59, 0.6)",
                        borderRadius: "4px",
                        color: "#e2e8f0",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "4px 8px",
                        fontFamily: "'Inter', sans-serif",
                        cursor: "pointer",
                    }}
                >
                    <option value="Tactical">Tactical</option>
                    <option value="Recon">Recon</option>
                    <option value="Strategic">Strategic</option>
                </select>
            </div>

            {/* Detection & Clean UI */}
            <div style={{
                background: "rgba(8, 14, 22, 0.85)",
                border: `1px solid ${detectionMode ? "rgba(255, 200, 0, 0.4)" : "rgba(30, 41, 59, 0.6)"}`,
                borderRadius: "8px",
                padding: "8px 12px",
                backdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}>
                <button
                    onClick={handleDetectionCycle}
                    style={{
                        background: detectionMode ? "rgba(255, 200, 0, 0.1)" : "rgba(15, 21, 32, 0.9)",
                        border: `1px solid ${detectionMode ? "rgba(255, 200, 0, 0.8)" : "rgba(30, 41, 59, 0.6)"}`,
                        borderRadius: "4px",
                        padding: "8px",
                        color: detectionMode ? "#ffc800" : "#94a3b8",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s",
                    }}
                >
                    {/* Checkbox Icon */}
                    <div style={{
                        width: "12px",
                        height: "12px",
                        background: detectionMode ? "#ffc800" : "transparent",
                        border: `1px solid ${detectionMode ? "#ffc800" : "rgba(148, 163, 184, 0.5)"}`,
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {detectionMode && (
                            <div style={{ width: "6px", height: "6px", background: "#000", borderRadius: "1px" }} />
                        )}
                    </div>
                    {detectionMode ? detectionMode.toUpperCase() : "DETECT"}
                </button>

                {detectionMode && (
                    <Slider label="DENSITY" value={density} onChange={setDensity} />
                )}
            </div>

            <button
                onClick={() => setShowUI(false)}
                style={{
                    background: "rgba(8, 14, 22, 0.85)",
                    border: "1px solid rgba(30, 41, 59, 0.6)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    color: "#94a3b8",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                    backdropFilter: "blur(12px)",
                }}
            >
                CLEAN UI
            </button>

            {/* Parameters */}
            <div style={{
                background: "rgba(8, 14, 22, 0.85)",
                border: "1px solid rgba(30, 41, 59, 0.6)",
                borderRadius: "8px",
                padding: "12px",
                backdropFilter: "blur(12px)",
            }}>
                <div
                    onClick={() => setShowParams(!showParams)}
                    style={{
                        fontSize: "0.55rem",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        color: "#64748b",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: showParams ? "12px" : 0,
                    }}
                >
                    PARAMETERS
                    <span style={{ fontSize: "0.7rem", color: "#475569" }}>{showParams ? "−" : "+"}</span>
                </div>

                {showParams && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Slider label="Sensitivity" value={hudParams.sensitivity} onChange={(v) => updateParam("sensitivity", v)} />
                        <Slider label="Bloom" value={hudParams.bloom} onChange={(v) => updateParam("bloom", v)} />
                        <Slider label="WHOT/BHOT" value={hudParams.whotBhot} onChange={(v) => updateParam("whotBhot", v)} />
                        <Slider label="Pixelation" value={hudParams.pixelation} onChange={(v) => updateParam("pixelation", v)} />
                    </div>
                )}
            </div>
        </div>
    );
}
