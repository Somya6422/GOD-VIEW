"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchStatus } from "@/lib/api";

export default function NeuralAnalyticsHub() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [backendStatus, setBackendStatus] = useState<"connected" | "offline" | "checking">("checking");
    const [latency, setLatency] = useState<number | null>(null);
    const [uptime, setUptime] = useState<string>("--");

    // Check backend status on mount and every 10 seconds
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const { data, latencyMs } = await fetchStatus();
                setBackendStatus(data.status === "online" ? "connected" : "offline");
                setLatency(latencyMs);
                // Format uptime
                const mins = Math.floor(data.uptime_seconds / 60);
                const hrs = Math.floor(mins / 60);
                if (hrs > 0) setUptime(`${hrs}h ${mins % 60}m`);
                else setUptime(`${mins}m ${Math.round(data.uptime_seconds % 60)}s`);
            } catch {
                setBackendStatus("offline");
                setLatency(null);
                setUptime("--");
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    // Animated neural network canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 120;
        canvas.height = 60;

        let frame = 0;
        let animId: number;
        const draw = () => {
            ctx.clearRect(0, 0, 120, 60);

            // Neural network nodes
            const layers = [[15, 15], [15, 35], [15, 55], [60, 10], [60, 30], [60, 50], [105, 20], [105, 40]];

            // Draw connections
            for (let i = 0; i < 3; i++) {
                for (let j = 3; j < 6; j++) {
                    const alpha = 0.1 + Math.sin(frame * 0.03 + i + j) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(layers[i][0], layers[i][1]);
                    ctx.lineTo(layers[j][0], layers[j][1]);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            for (let i = 3; i < 6; i++) {
                for (let j = 6; j < 8; j++) {
                    const alpha = 0.1 + Math.sin(frame * 0.03 + i + j) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(layers[i][0], layers[i][1]);
                    ctx.lineTo(layers[j][0], layers[j][1]);
                    ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Draw nodes
            layers.forEach((pos, i) => {
                const pulse = Math.sin(frame * 0.04 + i) * 1.5 + 3;
                ctx.beginPath();
                ctx.arc(pos[0], pos[1], pulse, 0, Math.PI * 2);
                ctx.fillStyle = i < 3 ? "rgba(0, 240, 255, 0.2)" : i < 6 ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 255, 136, 0.2)";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(pos[0], pos[1], 2, 0, Math.PI * 2);
                ctx.fillStyle = i < 3 ? "#00f0ff" : i < 6 ? "#a855f7" : "#00ff88";
                ctx.fill();
            });

            frame++;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, []);

    const statusColor = backendStatus === "connected" ? "#00ff88" : backendStatus === "offline" ? "#ff4444" : "#ffaa00";
    const statusLabel = backendStatus === "connected" ? "Connected" : backendStatus === "offline" ? "Offline" : "Checking...";

    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="card-title">Neural Analytics Hub</div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <canvas ref={canvasRef} style={{ width: "120px", height: "60px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: statusColor,
                        boxShadow: `0 0 6px ${statusColor}`,
                        animation: backendStatus === "connected" ? "pulse 2s infinite" : "none",
                    }} />
                    <span style={{ fontSize: "0.65rem", color: statusColor, fontWeight: 600 }}>
                        Backend: {statusLabel}
                    </span>
                </div>
                <div style={{ fontSize: "0.5rem", color: "#64748b", textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>
                    {backendStatus === "connected" ? (
                        <>Latency: {latency}ms · Uptime: {uptime}</>
                    ) : (
                        <>FastAPI on :8000 unreachable</>
                    )}
                </div>
            </div>

            <style jsx>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        </div>
    );
}
