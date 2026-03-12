"use client";

import React from "react";

const barData = [
    { year: "2019", val: 45 },
    { year: "2020", val: 65 },
    { year: "2021", val: 50 },
    { year: "2022", val: 80 },
    { year: "2023", val: 70 },
    { year: "2024", val: 90 },
    { year: "2025", val: 75 },
];

export default function GlobalPortfolioGrowth() {
    const maxVal = Math.max(...barData.map(d => d.val));

    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="card-title">Global Portfolio Growth</div>

            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "6px", padding: "8px 0 4px" }}>
                {barData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{
                            width: "100%",
                            maxWidth: "18px",
                            height: `${(d.val / maxVal) * 80}%`,
                            minHeight: "8px",
                            background: `linear-gradient(180deg, #00f0ff, rgba(0, 240, 255, 0.2))`,
                            borderRadius: "3px 3px 1px 1px",
                            transition: "height 0.5s ease",
                            boxShadow: "0 0 8px rgba(0, 240, 255, 0.2)",
                        }} />
                        <span style={{ fontSize: "0.5rem", color: "#64748b" }}>{d.year}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
