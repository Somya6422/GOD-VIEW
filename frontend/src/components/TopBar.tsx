"use client";

import React, { useState, useEffect } from "react";

export default function TopBar() {
    const [ts, setTs] = useState("");

    useEffect(() => {
        const tick = () => {
            const d = new Date();
            setTs(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) + " UTC");
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{
            height: "48px",
            background: "#0c1119",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
        }}>
            {/* brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.04em" }}>
                    <span className="glow-text">◉</span> GOD VIEW
                </span>
                <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 500 }}>Global Ops Intelligence</span>
            </div>

            {/* search */}
            <div style={{ position: "relative" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    className="search-input"
                    placeholder="Search Operations..."
                    type="text"
                />
            </div>

            {/* status cluster */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "0.7rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
                    <span style={{ color: "#94a3b8" }}>LIVE</span>
                </div>
                <span style={{ color: "#94a3b8", fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem" }}>{ts}</span>
                <span style={{ color: "#64748b" }}>22°C</span>
                <span style={{ color: "#64748b" }}>PM2.5 <span style={{ color: "#00ff88" }}>15</span></span>
            </div>
        </div>
    );
}
