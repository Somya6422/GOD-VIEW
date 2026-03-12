"use client";

import React, { useState, useEffect } from "react";

interface RecordingIndicatorProps {
    activeStyle: string;
}

export default function RecordingIndicator({ activeStyle }: RecordingIndicatorProps) {
    const [time, setTime] = useState("");
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "-");
            const timeStr = now.toISOString().slice(11, 19).replace(/:/g, ":") + "Z";
            setTime(`${dateStr} ${timeStr}`);
            setBlink((prev) => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ textAlign: "right" }}>
            {/* Active Style indicator */}
            <div style={{
                fontSize: "0.5rem",
                color: "#475569",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.1em",
                marginBottom: "2px",
            }}>
                ACTIVE STYLE
            </div>
            <div style={{
                fontSize: "0.8rem",
                color: "#00f0ff",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em",
                textShadow: "0 0 10px rgba(0, 240, 255, 0.4)",
                marginBottom: "10px",
            }}>
                {activeStyle}
            </div>

            {/* REC indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginBottom: "4px" }}>
                <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#ff4444",
                    boxShadow: blink ? "0 0 10px #ff4444" : "none",
                    transition: "box-shadow 0.5s",
                }} />
                <span style={{
                    fontSize: "0.6rem",
                    color: "#ff4444",
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.1em",
                }}>
                    REC
                </span>
                <span style={{
                    fontSize: "0.6rem",
                    color: "#94a3b8",
                    fontFamily: "'JetBrains Mono', monospace",
                }}>
                    {time}
                </span>
            </div>

            {/* Orbital data */}
            <div style={{
                fontSize: "0.55rem",
                color: "#475569",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.05em",
            }}>
                ORB: 47696 PASS: DESC-284
            </div>
        </div>
    );
}
