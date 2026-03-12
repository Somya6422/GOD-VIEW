"use client";

import React from "react";

export default function IndustrialSpaceAssets() {
    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="card-title">Industrial Space Assets</div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                {/* Left stats */}
                <div>
                    <div style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "4px" }}>Total Land Bank</div>
                    <div className="stat-value">3,500</div>
                    <div style={{ fontSize: "0.6rem", color: "#64748b", marginTop: "2px" }}>
                        <span style={{ color: "#00f0ff" }}>USD</span>/yr
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "2px", background: "#00f0ff" }} />
                            <span style={{ fontSize: "0.55rem", color: "#64748b" }}>Park</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "2px", background: "#1e293b" }} />
                            <span style={{ fontSize: "0.55rem", color: "#64748b" }}>Industry</span>
                        </div>
                    </div>
                </div>

                {/* Right - Ring chart */}
                <div className="ring-chart" />
            </div>
        </div>
    );
}
