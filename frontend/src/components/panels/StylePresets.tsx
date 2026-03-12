"use client";

import React from "react";

const styles = [
    { id: "NVG", label: "NVG" },
    { id: "FLIR", label: "FLIR" },
    { id: "NORMAL", label: "NORMAL" },
];

interface StylePresetsProps {
    activeStyle: string;
    setActiveStyle: (style: string) => void;
}

export default function StylePresets({ activeStyle, setActiveStyle }: StylePresetsProps) {
    return (
        <div style={{
            background: "rgba(8, 14, 22, 0.85)",
            border: "1px solid rgba(30, 41, 59, 0.6)",
            borderRadius: "8px",
            padding: "10px 16px",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
        }}>
            <div style={{
                fontSize: "0.55rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "#64748b",
                textTransform: "uppercase",
            }}>
                STYLE PRESETS
            </div>

            <div style={{ display: "flex", gap: "4px" }}>
                {styles.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setActiveStyle(s.id)}
                        style={{
                            background: activeStyle === s.id
                                ? "rgba(0, 240, 255, 0.15)"
                                : "rgba(15, 21, 32, 0.8)",
                            border: `1px solid ${activeStyle === s.id ? "rgba(0, 240, 255, 0.5)" : "rgba(30, 41, 59, 0.6)"}`,
                            borderRadius: "4px",
                            padding: "6px 14px",
                            color: activeStyle === s.id ? "#00f0ff" : "#64748b",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            letterSpacing: "0.08em",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            textShadow: activeStyle === s.id ? "0 0 8px rgba(0,240,255,0.5)" : "none",
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div style={{
                fontSize: "0.5rem",
                color: "#475569",
                fontFamily: "'JetBrains Mono', monospace",
            }}>
                Style: <span style={{ color: "#00f0ff", fontWeight: 700 }}>{activeStyle}</span>
            </div>
        </div>
    );
}
