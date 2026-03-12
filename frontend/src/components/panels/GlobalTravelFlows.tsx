"use client";

import React, { useEffect, useRef } from "react";

export default function GlobalTravelFlows() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 260;
        canvas.height = 80;

        const domesticData = [20, 35, 25, 45, 40, 55, 50, 60, 55, 70, 65, 75];
        const intlData = [10, 15, 20, 25, 22, 30, 35, 28, 40, 38, 45, 50];

        const drawLine = (data: number[], color: string, shadowColor: string) => {
            const maxVal = 80;
            const stepX = canvas.width / (data.length - 1);

            ctx.beginPath();
            data.forEach((val, i) => {
                const x = i * stepX;
                const y = canvas.height - (val / maxVal) * canvas.height + 5;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Fill gradient underneath
            const lastX = (data.length - 1) * stepX;
            const lastY = canvas.height - (data[data.length - 1] / maxVal) * canvas.height + 5;
            ctx.lineTo(lastX, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, color.replace(")", ", 0.15)").replace("rgb", "rgba"));
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.fill();
        };

        drawLine(domesticData, "rgb(0, 240, 255)", "#00f0ff");
        drawLine(intlData, "rgb(168, 85, 247)", "#a855f7");

    }, []);

    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="card-title" style={{ marginBottom: 0 }}>Global Travel Flows</div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ width: "8px", height: "2px", background: "#00f0ff", borderRadius: "1px" }} />
                        <span style={{ fontSize: "0.5rem", color: "#64748b" }}>Domestic</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ width: "8px", height: "2px", background: "#a855f7", borderRadius: "1px" }} />
                        <span style={{ fontSize: "0.5rem", color: "#64748b" }}>International</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "8px" }}>
                <canvas ref={canvasRef} style={{ width: "100%", height: "80px" }} />
            </div>
        </div>
    );
}
