"use client";

import React, { useState, useEffect } from "react";
import GlobeViewer from "@/components/GlobeViewer";
import DataLayersPanel from "@/components/panels/DataLayersPanel";
import StylePresets from "@/components/panels/StylePresets";
import HUDControls from "@/components/panels/HUDControls";
import ClassificationBanner from "@/components/panels/ClassificationBanner";
import LocationInfo from "@/components/panels/LocationInfo";
import RecordingIndicator from "@/components/panels/RecordingIndicator";
import NeuralAnalyticsHub from "@/components/panels/NeuralAnalyticsHub";
import RecentFlightTracking from "@/components/panels/RecentFlightTracking";

export default function Home() {
    const [style, setStyle] = useState("NORMAL");
    const [layers, setLayers] = useState({
        liveFlights: false,
        militaryFlights: false,
        earthquakes: false,
        satellites: false,
        streetTraffic: false,
        weatherRadar: false,
        cctvMesh: false,
        bikeshare: false,
    });
    const [hud, setHud] = useState({
        bloom: 50,
        sharpen: 49,
        sensitivity: 75,
        whotBhot: 60,
        pixelation: 30,
    });
    const [layout, setLayout] = useState("Tactical");
    const [uiVisible, setUiVisible] = useState(true);
    const [detMode, setDetMode] = useState<string | null>(null);
    const [dens, setDens] = useState(58);
    const [tracked, setTracked] = useState<{
        name: string;
        noradId: string;
        altitude: string;
        screenX?: number;
        screenY?: number;
    } | null>(null);

    // expose setter so the globe viewer can push tracked entity info up
    useEffect(() => {
        (window as any).__setTrackedSatellite = setTracked;
        return () => { delete (window as any).__setTrackedSatellite; };
    }, []);

    const toggle = (k: string) => {
        setLayers((prev) => ({ ...prev, [k]: !prev[k as keyof typeof prev] }));
    };

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            background: "#050a0f",
            overflow: "hidden",
            position: "relative",
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}>

            {/* nvg tint — very subtle, main green is from the css filter */}
            {style === "NVG" && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0, 255, 50, 0.02)",
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                    zIndex: 100,
                }} />
            )}

            {/* vignette */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
                pointerEvents: "none",
                zIndex: 90,
            }} />

            {/* 3d viewport */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <GlobeViewer activeStyle={style} layers={layers} detectionMode={detMode} density={dens} />
            </div>

            {/* overlays */}
            {uiVisible && (
                <>
                    {/* top left — classification */}
                    <div style={{ position: "absolute", top: 0, left: 0, zIndex: 200, padding: "16px 20px" }}>
                        <ClassificationBanner
                            activeStyle={style}
                            detectionMode={detMode}
                            density={dens}
                            renderedCount={Math.floor(258 * (dens / 100))}
                        />
                    </div>

                    {/* top right — rec indicator */}
                    <div style={{ position: "absolute", top: 0, right: 0, zIndex: 200, padding: "16px 20px" }}>
                        <RecordingIndicator activeStyle={style} />
                    </div>

                    {/* left — data layers + neural hub */}
                    <div style={{ position: "absolute", top: "120px", left: "20px", zIndex: 200, display: "flex", flexDirection: "column", gap: "12px", height: "calc(100vh - 200px)" }}>
                        <DataLayersPanel layers={layers} toggleLayer={toggle} density={dens} />
                        <div style={{ height: "180px" }}>
                            <NeuralAnalyticsHub />
                        </div>
                    </div>

                    {/* top center — location/search */}
                    <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 300 }}>
                        <LocationInfo />
                    </div>

                    {/* bottom center — presets */}
                    <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 200 }}>
                        <StylePresets activeStyle={style} setActiveStyle={setStyle} />
                    </div>

                    {/* right column — hud + flight tracking */}
                    <div style={{ position: "absolute", top: "120px", right: "20px", zIndex: 200, display: "flex", flexDirection: "column", gap: "20px", height: "calc(100vh - 200px)" }}>
                        <HUDControls
                            hudParams={hud}
                            setHudParams={setHud}
                            layout={layout}
                            setLayout={setLayout}
                            setShowUI={setUiVisible}
                            detectionMode={detMode}
                            setDetectionMode={setDetMode}
                            density={dens}
                            setDensity={setDens}
                        />
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <RecentFlightTracking />
                        </div>
                    </div>

                    {/* zoom buttons */}
                    <div style={{
                        position: "absolute",
                        right: "24px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 200,
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                    }}>
                        {[
                            { label: "+", delta: -0.3 },
                            { label: "−", delta: 0.3 },
                            { label: "⌂", delta: 0 },
                        ].map((btn) => (
                            <button
                                key={btn.label}
                                title={btn.delta === 0 ? "Reset View to Default" : undefined}
                                onClick={() => {
                                    const v = (window as any).__cesiumViewer;
                                    const C = (window as any).Cesium;
                                    if (!v || v.isDestroyed()) return;

                                    if (btn.delta === 0 && C) {
                                        v.camera.flyTo({
                                            destination: C.Cartesian3.fromDegrees(80.0, 20.0, 18000000),
                                            orientation: {
                                                heading: C.Math.toRadians(0.0),
                                                pitch: C.Math.toRadians(-90.0),
                                                roll: 0.0,
                                            },
                                            duration: 1.5,
                                        });
                                        return;
                                    }

                                    const cam = v.camera;
                                    const h = cam.positionCartographic.height;
                                    if (btn.delta < 0) cam.zoomIn(h * Math.abs(btn.delta));
                                    else cam.zoomOut(h * btn.delta);
                                }}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(5,15,25,0.75)",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(0,240,255,0.3)",
                                    borderRadius: "4px",
                                    color: "#00f0ff",
                                    fontSize: "1.2rem",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    lineHeight: 1,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(0,240,255,0.15)";
                                    e.currentTarget.style.borderColor = "rgba(0,240,255,0.6)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(5,15,25,0.75)";
                                    e.currentTarget.style.borderColor = "rgba(0,240,255,0.3)";
                                }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* sat status bar */}
                    {layers.satellites && (
                        <div style={{
                            position: "absolute",
                            bottom: "20px",
                            left: "20px",
                            zIndex: 200,
                            background: "rgba(8, 14, 22, 0.85)",
                            border: "1px solid rgba(30, 41, 59, 0.6)",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            backdropFilter: "blur(12px)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}>
                            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
                                SATELLITES
                            </div>
                            <div style={{ fontSize: "0.55rem", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>—</div>
                            <div style={{
                                fontSize: "0.55rem",
                                color: detMode ? "#ffc800" : "#64748b",
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: "0.05em",
                            }}>
                                {detMode ? `${detMode.toUpperCase()} Detection` : "Orbital Tracking"}
                            </div>
                        </div>
                    )}

                    {/* tracked entity overlay */}
                    {tracked && (
                        <div
                            id="sat-tracker-overlay"
                            style={{
                                position: "absolute",
                                left: "-1000px",
                                top: "-1000px",
                                zIndex: 150,
                                pointerEvents: "none",
                                background: "rgba(10, 15, 20, 0.85)",
                                border: "1px solid #ffc800",
                                borderRadius: "4px",
                                padding: "6px 10px",
                                backdropFilter: "blur(4px)",
                                minWidth: "140px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                transition: "opacity 0.1s",
                            }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ffc800", fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>
                                {tracked.name}
                            </div>
                            <div style={{ fontSize: "0.55rem", color: "#ffc800", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                                {tracked.altitude} · NORAD {tracked.noradId}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* restore ui toggle */}
            {!uiVisible && (
                <button
                    onClick={() => setUiVisible(true)}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        zIndex: 200,
                        background: "rgba(0,240,255,0.1)",
                        border: "1px solid rgba(0,240,255,0.3)",
                        color: "#00f0ff",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                    }}
                >
                    SHOW UI
                </button>
            )}
        </div>
    );
}
