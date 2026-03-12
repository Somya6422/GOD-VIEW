"use client";

import React, { useState } from "react";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
    { id: "globe", label: "Globe", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
    { id: "radar", label: "Radar", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="6" /></svg> },
    { id: "graph", label: "Graph", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6" /></svg> },
    { id: "analytics", label: "Analytics", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M21 3v9h-9" /></svg> },
];

export default function Sidebar() {
    const [cur, setCur] = useState("dashboard");

    return (
        <div style={{
            width: "52px",
            height: "100vh",
            background: "#0c1119",
            borderRight: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "16px",
            gap: "4px",
        }}>
            {/* brand mark */}
            <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #00f0ff, #00a8b5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "12px",
                fontWeight: 800,
                color: "#0a0e17",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)",
            }}>
                GV
            </div>

            {NAV_ITEMS.map((n) => (
                <div
                    key={n.id}
                    className={`sidebar-icon ${cur === n.id ? "active" : ""}`}
                    onClick={() => setCur(n.id)}
                    title={n.label}
                >
                    {n.svg}
                </div>
            ))}

            <div style={{ flex: 1 }} />

            {/* settings — always pinned bottom */}
            <div className="sidebar-icon" style={{ marginBottom: "16px" }} title="Settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            </div>
        </div>
    );
}
