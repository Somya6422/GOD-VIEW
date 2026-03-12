"use client";

import React from "react";

interface ClassificationBannerProps {
    activeStyle: string;
    detectionMode: string | null;
    density: number;
    renderedCount: number;
}

export default function ClassificationBanner({ activeStyle, detectionMode, density, renderedCount }: ClassificationBannerProps) {
    return (
        <div>
            {/* Top Diagnostic HUD Line */}
            <div style={{
                fontSize: "0.55rem",
                color: "#f59e0b",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: "12px",
                letterSpacing: "0.08em",
            }}>
                {detectionMode || "OPTIC"} VIS:{renderedCount} SRC:258 DENS:{(density / 100 * 2.5).toFixed(2)} 8.0ms
            </div>

            {/* Brand */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "4px",
            }}>
                <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(0, 240, 255, 0.1)",
                    border: "1px solid rgba(0, 240, 255, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                    </svg>
                </div>
                <div>
                    <div style={{
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: "#e2e8f0",
                        letterSpacing: "0.35em",
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        GOD VIEW
                    </div>
                    <div style={{
                        fontSize: "0.45rem",
                        color: "#475569",
                        letterSpacing: "0.2em",
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        NO PLACE LEFT BEHIND
                    </div>
                </div>
            </div>

            {/* Classification Line */}
            <div style={{
                fontSize: "0.55rem",
                color: "#ffd700",
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: "12px",
                textShadow: "0 0 8px rgba(255, 215, 0, 0.3)",
            }}>
                TOP SECRET // SI-TK // NOFORN
            </div>

            {/* Designator */}
            <div style={{
                fontSize: "0.6rem",
                color: "#64748b",
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: "2px",
                letterSpacing: "0.05em",
            }}>
                KH11-4094 DPS-4168
            </div>

            {/* Active Style */}
            <div style={{
                fontSize: "0.75rem",
                color: "#00f0ff",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: "4px",
                textShadow: "0 0 10px rgba(0, 240, 255, 0.4)",
            }}>
                {activeStyle}
            </div>

            {/* Summary line */}
            <div style={{
                fontSize: "0.5rem",
                color: "#475569",
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: "6px",
                letterSpacing: "0.03em",
            }}>
                SUMMARY
            </div>
            <div style={{
                fontSize: "0.5rem",
                color: "#64748b",
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: "2px",
                maxWidth: "300px",
            }}>
                {activeStyle} STREET NEAR STRATEGIC ASSETS (GLOBAL)
            </div>
        </div>
    );
}
