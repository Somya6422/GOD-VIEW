"use client";

import React from "react";

export default function LogisticsStream() {
    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="card-title">Logistics Stream</div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {/* Monthly */}
                <div>
                    <div style={{ fontSize: "0.55rem", color: "#64748b", marginBottom: "2px" }}>Monthly</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                        <span className="stat-value" style={{ fontSize: "1.4rem" }}>32,540</span>
                        <span className="badge badge-green">+10%</span>
                    </div>
                    <div style={{ fontSize: "0.5rem", color: "#64748b", marginTop: "2px" }}>Compared to 31,493 metric</div>
                </div>

                {/* Parcels */}
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.55rem", color: "#64748b", marginBottom: "2px" }}>Parcels in way</div>
                    <div className="stat-value" style={{ fontSize: "1.4rem" }}>24/75</div>
                    <div style={{ fontSize: "0.5rem", color: "#64748b", marginTop: "2px" }}>+15% vs. last month</div>
                </div>
            </div>

            <div style={{ marginTop: "12px", borderTop: "1px solid #1e293b", paddingTop: "10px" }}>
                <div style={{ fontSize: "0.55rem", color: "#64748b", marginBottom: "2px" }}>Yearly</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span className="stat-value" style={{ fontSize: "1.2rem" }}>1,387,456</span>
                    <span className="badge badge-green">+4%</span>
                </div>
                <div style={{ fontSize: "0.5rem", color: "#64748b", marginTop: "2px" }}>Compared to 1,321,475 last yr</div>
            </div>
        </div>
    );
}
