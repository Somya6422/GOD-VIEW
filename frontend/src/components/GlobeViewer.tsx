"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { BACKEND_URL } from "@/lib/api";

interface GlobeViewerProps {
    activeStyle: string;
    layers: Record<string, boolean>;
    detectionMode?: string | null;
    density?: number;
}

// css filter + overlay presets per visual mode
const STYLE_FX: Record<string, {
    filter: string;
    overlays: Array<React.CSSProperties>;
    vignette: string;
}> = {
    NVG: {
        filter: "sepia(1) hue-rotate(75deg) saturate(2.0) brightness(0.85) contrast(1.2)",
        overlays: [
            {
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 13,
                backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 3px)",
                mixBlendMode: "multiply" as const,
            },
            {
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 14,
                background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"><filter id=\"n\"><feTurbulence baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.03\"/></svg>')",
                mixBlendMode: "overlay" as const,
            },
        ],
        vignette: "radial-gradient(ellipse at center, transparent 45%, rgba(0,15,0,0.6) 100%)",
    },
    FLIR: {
        filter: "grayscale(1) contrast(1.5) brightness(1.1)",
        overlays: [],
        vignette: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)",
    },
    NORMAL: {
        filter: "brightness(0.98) contrast(1.02) saturate(1.0)",
        overlays: [],
        vignette: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)",
    },
};

// sat visual config — keep colors in one place
const SAT_CLR = {
    NORM_LBL: "#D27300",
    SEL_LBL: "#E5B800",
    NORM_PT: "#00e0ff",
    SEL_PT: "#FFFF00",
    SEL_ORB: "#FFFF00",
    NORM_ORB: "rgba(255, 50, 50, 0.5)",
};

class TLEParser {
    static parse(sat: any, satJs: any) {
        return satJs.twoline2satrec(sat.line1, sat.line2);
    }
}

class OrbitPropagator {
    static curPos(rec: any, satJs: any, dt: Date) {
        const pv = satJs.propagate(rec, dt);
        if (pv && pv.position && typeof pv.position !== "boolean") {
            const gmst = satJs.gstime(dt);
            const geo = satJs.eciToGeodetic(pv.position, gmst);
            return { alt: Math.round(geo.height).toString(), posEci: pv.position };
        }
        return { alt: "--", posEci: null };
    }

    static staticPos(rec: any, satJs: any, C: any, dt: Date) {
        const pv = satJs.propagate(rec, dt);
        if (pv && pv.position && typeof pv.position !== "boolean") {
            const gmst = satJs.gstime(dt);
            const p = satJs.eciToEcf(pv.position, gmst);
            return new C.Cartesian3(p.x * 1000, p.y * 1000, p.z * 1000);
        }
        return C.Cartesian3.ZERO;
    }

    static fullOrbit(rec: any, satJs: any, C: any, now: any) {
        const pp = new C.SampledPositionProperty();
        const nowJs = C.JulianDate.toDate(now);

        // freeze gmst at selection instant so the orbit renders as a solid
        // inertial ring rather than a helix ground track
        const frozenGmst = satJs.gstime(nowJs);

        // derive period from mean motion (satRec.no is rads/min)
        let periodMin = 100;
        if (rec.no) periodMin = (2 * Math.PI) / rec.no;

        const half = periodMin / 2;
        const step = periodMin / 120;

        for (let off = -half; off <= half + step; off += step) {
            const t = C.JulianDate.addMinutes(now, off, new C.JulianDate());
            const d = C.JulianDate.toDate(t);
            const pv = satJs.propagate(rec, d);
            if (pv && pv.position && typeof pv.position !== "boolean") {
                const p = satJs.eciToEcf(pv.position as any, frozenGmst);
                pp.addSample(t, new C.Cartesian3(p.x * 1000, p.y * 1000, p.z * 1000));
            }
        }
        return pp;
    }
}

class SatLabelSys {
    static normalLbl(norad: string, C: any) {
        return {
            text: `SAT-${norad}\n[   ]\n `,
            font: "10px 'JetBrains Mono', monospace",
            style: C.LabelStyle.FILL_AND_OUTLINE,
            fillColor: C.Color.fromCssColorString(SAT_CLR.NORM_LBL),
            outlineColor: C.Color.BLACK,
            outlineWidth: 2,
            verticalOrigin: C.VerticalOrigin.CENTER,
            horizontalOrigin: C.HorizontalOrigin.CENTER,
            pixelOffset: new C.Cartesian2(0, 0),
            showBackground: false,
        };
    }

    static selLbl(name: string, altKm: string, norad: string, C: any) {
        return {
            text: `[ + ]`,
            font: "14px 'JetBrains Mono', monospace",
            style: C.LabelStyle.FILL_AND_OUTLINE,
            fillColor: C.Color.fromCssColorString(SAT_CLR.SEL_LBL),
            outlineColor: C.Color.BLACK,
            outlineWidth: 3,
            verticalOrigin: C.VerticalOrigin.CENTER,
            horizontalOrigin: C.HorizontalOrigin.CENTER,
            pixelOffset: new C.Cartesian2(0, 0),
            showBackground: false,
        };
    }
}

class SparseVis {
    static depthTest(_C: any) { return undefined; }
    static distCond(C: any) { return new C.DistanceDisplayCondition(0, 10000000); }
    static apply(ents: any, C: any, v: any) {
        for (const e of ents) {
            if (v && v.trackedEntity && e.id === v.trackedEntity.id) continue;
            if (!e.label) continue;
            e.label.show = true;
            e.label.disableDepthTestDistance = this.depthTest(C);
            e.label.distanceDisplayCondition = this.distCond(C);
        }
    }
}

class PanopticVis {
    static depthTest(_C: any) { return Number.POSITIVE_INFINITY; }
    static distCond(C: any) { return new C.DistanceDisplayCondition(0, 50000000); }
    static apply(ents: any, C: any, v: any) {
        for (const e of ents) {
            if (v && v.trackedEntity && e.id === v.trackedEntity.id) continue;
            if (!e.label) continue;
            e.label.show = true;
            e.label.disableDepthTestDistance = this.depthTest(C);
            e.label.distanceDisplayCondition = this.distCond(C);
        }
    }
}

class OrbitGfx {
    static createPath(C: any) {
        return {
            show: false,
            leadTime: 86400,
            trailTime: 86400,
            width: 1.5,
            resolution: 1,
            material: new C.PolylineGlowMaterialProperty({
                glowPower: 0.15,
                color: C.Color.fromCssColorString(SAT_CLR.NORM_ORB),
            }),
        };
    }

    static highlight(e: any, C: any) {
        if (!e.path) return;
        e.path.show = true;
        e.path.width = 2.5;
        const mat = new C.ColorMaterialProperty(C.Color.fromCssColorString(SAT_CLR.SEL_ORB));
        e.path.material = mat;
        e.path.depthFailMaterial = mat;
    }

    static unhighlight(e: any, C: any) {
        if (!e.path) return;
        e.path.show = false;
        e.path.width = 1.5;
        e.path.material = new C.PolylineGlowMaterialProperty({
            glowPower: 0.15,
            color: C.Color.fromCssColorString(SAT_CLR.NORM_ORB),
        });
    }
}

class SatRenderer {
    static build(sat: any, norad: string, altKm: string, posProp: any, mode: string, C: any) {
        const dc = mode === "PANOPTIC" ? PanopticVis.distCond(C) : SparseVis.distCond(C);
        const dt = mode === "PANOPTIC" ? PanopticVis.depthTest(C) : SparseVis.depthTest(C);
        return {
            id: `sat_${sat.name}`,
            name: sat.name,
            description: `NORAD: ${norad}`,
            position: posProp,
            point: {
                pixelSize: 4,
                color: C.Color.fromCssColorString(SAT_CLR.NORM_PT),
                outlineColor: C.Color.BLACK,
                outlineWidth: 1,
            },
            label: {
                ...SatLabelSys.normalLbl(norad, C),
                show: mode !== null,
                disableDepthTestDistance: dt,
                distanceDisplayCondition: dc,
            },
            path: OrbitGfx.createPath(C),
            properties: {
                noradId: norad,
                altKm: altKm,
                originalName: sat.name,
                tleLine1: sat.line1,
                tleLine2: sat.line2,
                staticPosition: posProp,
            }
        };
    }
}

class SatSelSys {
    static select(e: any, prev: any, C: any) {
        if (prev) this.deselect(prev, C);

        if (e.point) {
            e.point.color = C.Color.fromCssColorString(SAT_CLR.SEL_PT);
            e.point.pixelSize = 8;
            e.point.outlineColor = C.Color.BLACK;
        }

        if (e.label) {
            const p = e.properties;
            const norad = p?.noradId?.getValue() || "--";
            const alt = p?.altKm?.getValue() || "--";
            const nm = p?.originalName?.getValue() || "--";

            const lbl = SatLabelSys.selLbl(nm, alt, norad, C);
            e.label.text = lbl.text;
            e.label.fillColor = lbl.fillColor;
            e.label.outlineWidth = lbl.outlineWidth;
            e.label.show = true;
            e.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;

            // compute full orbit ring only on click — expensive, so lazy eval
            if (p?.tleLine1 && p?.tleLine2 && (window as any)._satelliteJsCache) {
                const sJs = (window as any)._satelliteJsCache;
                const rec = TLEParser.parse({ line1: p.tleLine1.getValue(), line2: p.tleLine2.getValue() }, sJs);
                const orbit = OrbitPropagator.fullOrbit(rec, sJs, C, (window as any)._cesiumNowCache || C.JulianDate.now());
                e.position = orbit;
            }
        }

        OrbitGfx.highlight(e, C);
        return e;
    }

    static deselect(e: any, C: any) {
        if (!e) return;

        if (e.point) {
            e.point.color = C.Color.fromCssColorString(SAT_CLR.NORM_PT);
            e.point.pixelSize = 4;
            e.point.outlineColor = C.Color.BLACK;
        }

        if (e.label) {
            const p = e.properties;
            const norad = p?.noradId?.getValue() || "";
            const lbl = SatLabelSys.normalLbl(norad, C);
            e.label.text = lbl.text;
            e.label.fillColor = lbl.fillColor;
            e.label.outlineWidth = lbl.outlineWidth;

            const curMode = (window as any).__currentDetectionMode;
            if (curMode === "PANOPTIC") {
                e.label.disableDepthTestDistance = PanopticVis.depthTest(C);
                e.label.distanceDisplayCondition = PanopticVis.distCond(C);
            } else if (curMode === "SPARSE") {
                e.label.disableDepthTestDistance = SparseVis.depthTest(C);
                e.label.distanceDisplayCondition = SparseVis.distCond(C);
            } else {
                e.label.show = false;
            }

            // snap back to static placement
            if (p?.staticPosition) e.position = p.staticPosition.getValue();
        }

        OrbitGfx.unhighlight(e, C);
    }
}

class CamVisDet {
    static update(ents: any, mode: string | null, v: any, C: any) {
        if (!ents) return;
        if (mode === "SPARSE") return SparseVis.apply(ents, C, v);
        if (mode === "PANOPTIC") return PanopticVis.apply(ents, C, v);
        for (const e of ents) {
            if (v && v.trackedEntity && e.id === v.trackedEntity.id) continue;
            if (e.label) e.label.show = false;
        }
    }
}

class RTUpdater {
    static attach(v: any, C: any) {
        const now = C.JulianDate.now();
        const start = C.JulianDate.addMinutes(now, -30, new C.JulianDate());
        const stop = C.JulianDate.addMinutes(now, 30, new C.JulianDate());
        v.clock.startTime = start;
        v.clock.stopTime = stop;
        v.clock.currentTime = now;
        v.clock.clockRange = C.ClockRange.LOOP_STOP;
        v.clock.multiplier = 1;
        return now;
    }
}

// flight layer config
const FLT_CLR = {
    COMMERCIAL: "#00FFFF",
    MILITARY: "#FFA500",
    SEL_LBL: "#FFFFFF",
    SEL_PATH: "#ff0000",
};

class FltLblSys {
    static normalLbl(cs: string, mil: boolean, C: any) {
        return {
            text: `FLT-${cs}\n `,
            font: "10px 'JetBrains Mono', monospace",
            style: C.LabelStyle.FILL_AND_OUTLINE,
            fillColor: mil ? C.Color.fromCssColorString(FLT_CLR.MILITARY) : C.Color.fromCssColorString(FLT_CLR.COMMERCIAL),
            outlineColor: C.Color.BLACK,
            outlineWidth: 2,
            verticalOrigin: C.VerticalOrigin.CENTER,
            horizontalOrigin: C.HorizontalOrigin.CENTER,
            pixelOffset: new C.Cartesian2(0, -60),
            showBackground: false,
            backgroundColor: new C.Color(0, 0, 0, 0),
            backgroundPadding: new C.Cartesian2(0, 0),
        };
    }

    static panopticLbl(cs: string, altM: number, velMs: number, country: string, mil: boolean, C: any) {
        const ft = Math.round(altM * 3.28084);
        const kts = Math.round(velMs * 1.94384);
        const txt = mil
            ? `[ ${cs} ]\n TYPE - UNKNOWN \n Operator: ${country} - ${ft} ft`
            : `[ ${cs} ] • FL${Math.round(ft / 100)} • ${kts} kts`;
        return {
            text: txt,
            font: "14px 'VT323', monospace",
            style: C.LabelStyle.FILL_AND_OUTLINE,
            fillColor: mil ? C.Color.fromCssColorString(FLT_CLR.MILITARY) : C.Color.fromCssColorString(FLT_CLR.COMMERCIAL),
            outlineColor: C.Color.TRANSPARENT,
            outlineWidth: 0,
            verticalOrigin: C.VerticalOrigin.CENTER,
            horizontalOrigin: C.HorizontalOrigin.CENTER,
            pixelOffset: new C.Cartesian2(0, -60),
            showBackground: true,
            backgroundColor: new C.Color(0, 0, 0, 0.8),
            backgroundPadding: new C.Cartesian2(7, 5),
        };
    }
}

class FltRenderer {
    static build(d: any, mode: string, C: any) {
        // opensky array layout:
        // [0:icao24, 1:callsign, 2:origin_country, 3:time_position, 4:last_contact,
        //  5:longitude, 6:latitude, 7:baro_altitude, 8:on_ground, 9:velocity, 10:true_track, ...]
        const icao = d[0];
        const cs = (d[1] || icao).trim();
        const country = d[2] || "Unknown";
        const lng = d[5], lat = d[6];
        const alt = d[7] || 0;
        const vel = d[9] || 0;
        const hdg = d[10] || 0;
        const grounded = d[8];
        const mil = d[d.length - 1] === true;

        if (lng === null || lat === null) return null;

        const pp = new C.SampledPositionProperty();
        const t = C.JulianDate.now();
        pp.addSample(t, C.Cartesian3.fromDegrees(lng, lat, alt));

        // extrapolate 15s ahead so camera tracks smoothly between polls
        if (vel > 0) {
            const tf = C.JulianDate.addSeconds(t, 15, new C.JulianDate());
            const dist = vel * 15;
            const lr = C.Math.toRadians(lat);
            const hr = C.Math.toRadians(hdg);
            const dLat = (dist * Math.cos(hr)) / 111111;
            const dLng = (dist * Math.sin(hr)) / (111111 * Math.cos(lr));
            pp.addSample(tf, C.Cartesian3.fromDegrees(lng + dLng, lat + dLat, alt));
            pp.forwardExtrapolationType = mil ? C.ExtrapolationType.EXTRAPOLATE : C.ExtrapolationType.HOLD;
            if (mil) pp.forwardExtrapolationDuration = 15;
            pp.backwardExtrapolationType = C.ExtrapolationType.HOLD;
        }

        const dc = mode === "PANOPTIC" ? PanopticVis.distCond(C) : SparseVis.distCond(C);
        const dt = mode === "PANOPTIC" ? PanopticVis.depthTest(C) : SparseVis.depthTest(C);
        const lbl = mode === "PANOPTIC"
            ? FltLblSys.panopticLbl(cs, alt, vel, country, mil, C)
            : FltLblSys.normalLbl(cs, mil, C);

        return {
            id: `flt_${icao}`,
            name: cs,
            description: `ICAO: ${icao}`,
            position: pp,
            viewFrom: mil ? new C.Cartesian3(0.0, -1500.0, 800.0) : new C.Cartesian3(0, -20000, 15000),
            billboard: {
                image: mil ? '/cursor.svg' : '/plane.svg',
                scale: 0.8,
                color: mil ? C.Color.ORANGE : C.Color.WHITE,
                rotation: C.Math.toRadians(hdg),
                alignedAxis: C.Cartesian3.UNIT_Z,
                distanceDisplayCondition: new C.DistanceDisplayCondition(0.0, 50000000.0),
            },
            label: {
                ...lbl,
                show: mode !== null && mode !== undefined && mode !== "null",
                disableDepthTestDistance: dt,
                distanceDisplayCondition: dc,
            },
            properties: {
                icao24: icao,
                callsign: cs,
                altMeters: alt,
                velMs: vel,
                isGrounded: grounded,
                isFlight: true,
                isMilitary: mil,
                origin_country: country,
            }
        };
    }
}

class FltSelSys {
    static select(e: any, prev: any, C: any) {
        if (prev) {
            if (prev.properties?.isFlight?.getValue()) {
                this.deselect(prev, C);
            } else {
                SatSelSys.deselect(prev, C);
            }
        }

        if (e.billboard) {
            const mil = e.properties?.isMilitary?.getValue() || false;
            if (!mil) e.billboard.color = C.Color.fromCssColorString(FLT_CLR.COMMERCIAL);
            e.billboard.scale = 1.3;
        }

        // trail path on select
        if (!e.path) {
            e.path = new C.PathGraphics({
                resolution: 1,
                material: new C.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: C.Color.fromCssColorString(FLT_CLR.SEL_PATH),
                }),
                width: 3,
                leadTime: 0,
                trailTime: 120,
            });
        }

        if (e.label) {
            const p = e.properties;
            const cs = p?.callsign?.getValue() || "--";
            const alt = p?.altMeters?.getValue() || 0;
            const vel = p?.velMs?.getValue() || 0;
            const country = p?.origin_country?.getValue() || "Unknown";
            const mil = p?.isMilitary?.getValue() || false;

            const sl = FltLblSys.panopticLbl(cs, alt, vel, country, mil, C);
            e.label.text = sl.text;
            e.label.fillColor = C.Color.fromCssColorString(FLT_CLR.SEL_LBL);
            e.label.font = sl.font;
            e.label.showBackground = sl.showBackground;
            e.label.backgroundColor = sl.backgroundColor;
            e.label.backgroundPadding = sl.backgroundPadding;
            e.label.show = true;
            e.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }

        return e;
    }

    static deselect(e: any, C: any) {
        if (!e || !e.properties?.isFlight?.getValue()) return;

        if (e.billboard) {
            const mil = e.properties?.isMilitary?.getValue() || false;
            e.billboard.color = mil ? C.Color.fromCssColorString(FLT_CLR.MILITARY) : C.Color.WHITE;
            e.billboard.scale = 0.8;
        }

        if (e.path) e.path = undefined;

        if (e.label) {
            const p = e.properties;
            const cs = p?.callsign?.getValue() || "";
            const alt = p?.altMeters?.getValue() || 0;
            const vel = p?.velMs?.getValue() || 0;
            const country = p?.origin_country?.getValue() || "Unknown";
            const mil = p?.isMilitary?.getValue() || false;

            const curMode = (window as any).__currentDetectionMode;
            const ld = curMode === "PANOPTIC"
                ? FltLblSys.panopticLbl(cs, alt, vel, country, mil, C)
                : FltLblSys.normalLbl(cs, mil, C);

            e.label.text = ld.text;
            e.label.fillColor = ld.fillColor;
            e.label.outlineWidth = ld.outlineWidth;
            e.label.font = ld.font;
            e.label.showBackground = ld.showBackground;
            e.label.backgroundColor = ld.backgroundColor;
            e.label.backgroundPadding = ld.backgroundPadding;

            if (curMode === "PANOPTIC") {
                e.label.show = true;
                e.label.disableDepthTestDistance = PanopticVis.depthTest(C);
                e.label.distanceDisplayCondition = PanopticVis.distCond(C);
            } else if (curMode === "SPARSE") {
                e.label.show = true;
                e.label.disableDepthTestDistance = SparseVis.depthTest(C);
                e.label.distanceDisplayCondition = SparseVis.distCond(C);
            } else {
                e.label.show = false;
            }
        }
    }
}

export default function GlobeViewer({ activeStyle, layers, detectionMode, density = 100 }: GlobeViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const [ready, setReady] = useState(false);
    const [fallback, setFallback] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const fx = useMemo(() => STYLE_FX[activeStyle] || STYLE_FX.NORMAL, [activeStyle]);

    // cesium init
    useEffect(() => {
        let dead = false;

        const boot = async () => {
            try {
                const C = await import("cesium");
                if (dead || !containerRef.current) return;

                (window as any).Cesium = C;
                (window as any).CESIUM_BASE_URL = "/cesium/";

                const tok = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
                if (tok && tok !== "your_cesium_ion_token_here") C.Ion.defaultAccessToken = tok;

                // bump concurrent tile requests for google's server
                (C.RequestScheduler as any).requestsByServer = {
                    ...(C.RequestScheduler as any).requestsByServer,
                    "tile.googleapis.com:443": 18,
                };

                const v = new C.Viewer(containerRef.current, {
                    // @ts-ignore
                    imageryProvider: new C.IonImageryProvider({ assetId: 2 }) as any,
                    baseLayerPicker: false,
                    geocoder: false,
                    homeButton: false,
                    sceneModePicker: false,
                    selectionIndicator: false,
                    timeline: false,
                    animation: false,
                    navigationHelpButton: false,
                    fullscreenButton: false,
                    infoBox: false,
                    creditContainer: document.createElement("div"),
                    msaaSamples: 2,
                    shadows: false,
                    terrain: undefined,
                    skyBox: false,
                    contextOptions: { webgl: { alpha: true } },
                } as any);

                viewerRef.current = v;
                (window as any).__cesiumViewer = v;

                // hdr off — prevents deserts from blowing out
                v.scene.highDynamicRange = false;
                v.scene.backgroundColor = C.Color.TRANSPARENT;
                v.scene.globe.show = true;
                v.scene.globe.baseColor = C.Color.fromCssColorString("#0a1520");
                v.scene.globe.enableLighting = false;
                if (v.scene.skyAtmosphere) v.scene.skyAtmosphere.show = false;

                // enable all camera controls
                const ctrl = v.scene.screenSpaceCameraController;
                ctrl.enableZoom = true;
                ctrl.enableRotate = true;
                ctrl.enableTilt = true;
                ctrl.enableLook = true;
                ctrl.enableTranslate = true;
                ctrl.zoomEventTypes = [C.CameraEventType.WHEEL, C.CameraEventType.PINCH];
                ctrl.tiltEventTypes = [
                    C.CameraEventType.MIDDLE_DRAG,
                    C.CameraEventType.RIGHT_DRAG,
                    { eventType: C.CameraEventType.LEFT_DRAG, modifier: C.KeyboardEventModifier.CTRL },
                ];

                v.camera.setView({
                    destination: C.Cartesian3.fromDegrees(30, 20, 25000000),
                    orientation: { heading: C.Math.toRadians(0), pitch: C.Math.toRadians(-90), roll: 0 },
                });

                try { v.scene.postProcessStages.bloom.enabled = false; } catch { /* bloom n/a */ }

                setReady(true);

                // google 3d tiles — try api key first, then ion fallback
                const gKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                let tiles3d = false;

                if (gKey && gKey.startsWith("AIza")) {
                    try {
                        const ts = await C.Cesium3DTileset.fromUrl(
                            `https://tile.googleapis.com/v1/3dtiles/root.json?key=${gKey}`
                        );
                        if (!dead && !v.isDestroyed()) { v.scene.primitives.add(ts); tiles3d = true; }
                    } catch (e) { console.warn("google tiles failed, trying ion:", e); }
                }

                if (!tiles3d) {
                    try {
                        const ts = await C.Cesium3DTileset.fromIonAssetId(2275207);
                        if (!dead && !v.isDestroyed()) { v.scene.primitives.add(ts); tiles3d = true; }
                    } catch (e) { console.warn("ion 3d tiles also unavailable:", e); }
                }

                // only load cesium terrain if no 3d tiles (they conflict)
                if (!tiles3d) {
                    try {
                        const terrain = await C.CesiumTerrainProvider.fromIonAssetId(1);
                        if (!dead && !v.isDestroyed()) v.terrainProvider = terrain;
                    } catch (e) { console.warn("terrain unavailable:", e); }
                }

            } catch (err: any) {
                console.error("cesium init failed:", err);
                if (!dead) setFallback(true);
            }
        };

        boot();

        return () => {
            dead = true;
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    // prevent browser from eating trackpad scroll — let cesium zoom
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onWheel = (evt: WheelEvent) => { evt.preventDefault(); };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [ready]);

    // post-processing shaders
    useEffect(() => {
        if (!viewerRef.current || viewerRef.current.isDestroyed()) return;
        const v = viewerRef.current;
        const C = (window as any).Cesium;

        v.resolutionScale = 1.0;
        if (v.scene.canvas) v.scene.canvas.style.imageRendering = "auto";

        try {
            // cleanup previous custom stages
            if ((v as any)._phosphorStage) {
                v.scene.postProcessStages.remove((v as any)._phosphorStage);
                (v as any)._phosphorStage = null;
            }
            if ((v as any)._cinStage) {
                v.scene.postProcessStages.remove((v as any)._cinStage);
                (v as any)._cinStage = null;
            }

            if (activeStyle === "NVG") {
                // phosphor green + scanlines
                const nvgFrag = `
                    uniform sampler2D colorTexture;
                    in vec2 v_textureCoordinates;
                    out vec4 fragColor;
                    void main(void) {
                        vec4 color = texture(colorTexture, v_textureCoordinates);
                        float lum = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
                        vec3 phosphorGreen = vec3(0.08, 1.0, 0.15) * lum * 1.35 + vec3(0.0, 0.15, 0.0);
                        float scanline = sin(gl_FragCoord.y * 2.5) * 0.06;
                        vec3 finalColor = mix(color.rgb, phosphorGreen, 0.85) - scanline;
                        fragColor = vec4(finalColor * 0.85, color.a);
                    }
                `;
                (v as any)._phosphorStage = new C.PostProcessStage({ fragmentShader: nvgFrag });
                v.scene.postProcessStages.add((v as any)._phosphorStage);

                v.scene.postProcessStages.bloom.enabled = true;
                v.scene.postProcessStages.bloom.uniforms.contrast = 90;
                v.scene.postProcessStages.bloom.uniforms.brightness = -0.3;
                v.scene.postProcessStages.bloom.uniforms.glowOnly = false;
                v.scene.postProcessStages.bloom.uniforms.delta = 1.0;
                v.scene.postProcessStages.bloom.uniforms.sigma = 2.0;

                v.scene.globe.enableLighting = false;
            } else {
                v.scene.postProcessStages.bloom.enabled = false;

                if (activeStyle === "NORMAL") {
                    v.scene.globe.enableLighting = true;

                    // cinematic post-proc — high contrast + scanlines + film grain
                    v.scene.postProcessStages.bloom.enabled = true;
                    v.scene.postProcessStages.bloom.uniforms.glowOnly = false;
                    v.scene.postProcessStages.bloom.uniforms.contrast = 150;
                    v.scene.postProcessStages.bloom.uniforms.brightness = -0.4;
                    v.scene.postProcessStages.bloom.uniforms.delta = 1.5;
                    v.scene.postProcessStages.bloom.uniforms.sigma = 3.5;

                    const cinFrag = `
                        uniform sampler2D colorTexture;
                        in vec2 v_textureCoordinates;
                        out vec4 fragColor;

                        vec3 sharpen(sampler2D tex, vec2 uv) {
                            vec2 step = 1.0 / vec2(textureSize(tex, 0));
                            vec3 sum = vec3(0.0);
                            sum += texture(tex, uv + vec2(-step.x, -step.y)).rgb * -1.0;
                            sum += texture(tex, uv + vec2(0.0, -step.y)).rgb * -1.0;
                            sum += texture(tex, uv + vec2(step.x, -step.y)).rgb * -1.0;
                            sum += texture(tex, uv + vec2(-step.x, 0.0)).rgb * -1.0;
                            sum += texture(tex, uv).rgb * 9.0;
                            sum += texture(tex, uv + vec2(step.x, 0.0)).rgb * -1.0;
                            sum += texture(tex, uv + vec2(-step.x, step.y)).rgb * -1.0;
                            sum += texture(tex, uv + vec2(0.0, step.y)).rgb * -1.0;
                            sum += texture(tex, uv + vec2(step.x, step.y)).rgb * -1.0;
                            return sum;
                        }

                        void main(void) {
                            vec3 color = mix(texture(colorTexture, v_textureCoordinates).rgb, sharpen(colorTexture, v_textureCoordinates), 0.25);
                            color = clamp((color - 0.5) * 1.25 + 0.5, 0.0, 1.0);
                            float lum = dot(color, vec3(0.299, 0.587, 0.114));
                            vec3 shadows = vec3(0.0, 0.05, 0.1);
                            vec3 highlights = vec3(1.0, 0.95, 0.9);
                            color = mix(color + shadows * (1.0 - lum), color * highlights, lum);
                            float scanline = sin(gl_FragCoord.y * 1.8) * 0.15;
                            color -= scanline;
                            float noise = fract(sin(dot(v_textureCoordinates, vec2(12.9898, 78.233))) * 43758.5453);
                            color -= noise * 0.02;
                            fragColor = vec4(color, 1.0);
                        }
                    `;
                    (v as any)._cinStage = new C.PostProcessStage({ fragmentShader: cinFrag });
                    v.scene.postProcessStages.add((v as any)._cinStage);

                } else if (activeStyle === "FLIR") {
                    v.scene.globe.enableLighting = false;
                }
            }
        } catch { /* post-processing might not be available */ }
    }, [activeStyle, ready]);

    // satellite layer
    useEffect(() => {
        if (!ready || !viewerRef.current || viewerRef.current.isDestroyed()) return;
        const v = viewerRef.current;
        const C = (window as any).Cesium;

        if (!layers.satellites) {
            const existing = v.dataSources.getByName("SatelliteFeeds");
            if (existing && existing.length > 0) v.dataSources.remove(existing[0], true);
            if ((v as any)._satClickH) { (v as any)._satClickH.destroy(); (v as any)._satClickH = null; }
            if ((v as any)._satPreRH) { v.scene.preRender.removeEventListener((v as any)._satPreRH); (v as any)._satPreRH = null; }
            (v as any)._satStop = true;
            const setTr = (window as any).__setTrackedSatellite;
            if (setTr) setTr(null);
            v.trackedEntity = undefined;
            return;
        }

        let alive = true;
        (v as any)._satStop = false;

        const load = async () => {
            try {
                const existing = v.dataSources.getByName("SatelliteFeeds");
                if (existing && existing.length > 0) v.dataSources.remove(existing[0], true);

                const ds = new C.CustomDataSource("SatelliteFeeds");
                v.dataSources.add(ds);

                // equatorial reference ring
                ds.entities.add(new C.Entity({
                    id: "earth_equatorial_axis",
                    polyline: {
                        positions: C.Cartesian3.fromDegreesArray([-180, 0, -90, 0, 0, 0, 90, 0, 180, 0]),
                        width: 2.0,
                        material: new C.ColorMaterialProperty(C.Color.fromCssColorString("rgba(150, 0, 0, 0.7)")),
                        depthFailMaterial: new C.ColorMaterialProperty(C.Color.fromCssColorString("rgba(150, 0, 0, 0.7)")),
                    }
                }));

                const satMod = await import("satellite.js");
                const satJs = satMod.default ? satMod.default : satMod;
                const now = RTUpdater.attach(v, C);

                const loaded = new Set<string>();

                // chunk processor — avoids blocking main thread
                const ingest = (json: any, bg: boolean = false) => {
                    return new Promise<void>((resolve) => {
                        if (!alive || json.status !== "success" || !json.data) { resolve(); return; }

                        let cap = Math.max(1, Math.floor(json.data.length * (density / 100)));
                        const isDev = process.env.NODE_ENV === 'development' || (import.meta as any).env?.DEV;
                        if (isDev) cap = Math.min(cap, 150);
                        const batch = json.data.slice(0, cap);

                        if (!bg) {
                            for (const sat of batch) {
                                const nid = sat.line2.substring(2, 7).trim();
                                if (loaded.has(nid)) continue;
                                loaded.add(nid);
                                const rec = TLEParser.parse(sat, satJs);
                                if (!rec) continue;
                                const info = OrbitPropagator.curPos(rec, satJs, new Date());
                                const sPos = OrbitPropagator.staticPos(rec, satJs, C, new Date());
                                const dm = (window as any).__currentDetectionMode || "SPARSE";
                                ds.entities.add(SatRenderer.build(sat, nid, info.alt, sPos, dm, C));
                            }
                            resolve();
                        } else {
                            let idx = 0;
                            const chunk = 200;
                            const tick = () => {
                                if (!alive || (v as any)._satStop) { resolve(); return; }
                                const end = Math.min(idx + chunk, batch.length);
                                for (; idx < end; idx++) {
                                    const sat = batch[idx];
                                    const nid = sat.line2.substring(2, 7).trim();
                                    if (loaded.has(nid)) continue;
                                    loaded.add(nid);
                                    const rec = TLEParser.parse(sat, satJs);
                                    if (!rec) continue;
                                    const info = OrbitPropagator.curPos(rec, satJs, new Date());
                                    const sPos = OrbitPropagator.staticPos(rec, satJs, C, new Date());
                                    const dm = (window as any).__currentDetectionMode || "SPARSE";
                                    ds.entities.add(SatRenderer.build(sat, nid, info.alt, sPos, dm, C));
                                }
                                if (idx < batch.length) setTimeout(tick, 5);
                                else resolve();
                            };
                            tick();
                        }
                    });
                };

                // phase 1: military assets
                try {
                    const r = await fetch(`${BACKEND_URL}/api/feeds/satellites?group=stations`);
                    await ingest(await r.json(), false);
                } catch (e) { console.error("phase 1 crash:", e); }

                // phase 2: comms block
                try {
                    const r = await fetch(`${BACKEND_URL}/api/feeds/satellites?group=visual`);
                    await ingest(await r.json(), false);
                } catch (e) { console.error("phase 2 crash:", e); }

                // phase 3: background catalog (debris, commercial, etc)
                try {
                    const r = await fetch(`${BACKEND_URL}/api/feeds/satellites?group=active`);
                    await ingest(await r.json(), true);
                } catch (e) { console.error("phase 3 crash:", e); }

                // click-to-track handler
                if ((v as any)._satClickH) (v as any)._satClickH.destroy();
                const handler = new C.ScreenSpaceEventHandler(v.scene.canvas);
                (v as any)._satClickH = handler;
                let prev: any = null;

                handler.setInputAction((click: any) => {
                    const pick = v.scene.pick(click.position);
                    if (C.defined(pick) && pick.id && pick.id.name) {
                        const ent = pick.id;
                        prev = SatSelSys.select(ent, prev, C);
                        v.trackedEntity = ent;
                        const setTr = (window as any).__setTrackedSatellite;
                        if (setTr) {
                            const p = ent.properties;
                            setTr({
                                name: ent.name,
                                noradId: p?.noradId?.getValue() || "--",
                                altitude: `${p?.altKm?.getValue() || "--"} km`,
                            });
                        }
                    } else {
                        SatSelSys.deselect(prev, C);
                        prev = null;
                        v.trackedEntity = undefined;
                        const setTr = (window as any).__setTrackedSatellite;
                        if (setTr) setTr(null);
                    }
                }, C.ScreenSpaceEventType.LEFT_CLICK);

                // sync html overlay to tracked entity screen position
                if ((v as any)._satPreRH) v.scene.preRender.removeEventListener((v as any)._satPreRH);
                const syncOvl = () => {
                    const tr = v.trackedEntity;
                    const ovl = document.getElementById("sat-tracker-overlay");
                    if (tr && tr.position && ovl) {
                        const pos = tr.position.getValue(v.clock.currentTime);
                        if (pos) {
                            const cp = C.SceneTransforms.worldToWindowCoordinates(v.scene, pos);
                            if (cp) {
                                ovl.style.left = `${Math.round(cp.x) + 20}px`;
                                ovl.style.top = `${Math.round(cp.y) - 60}px`;
                                ovl.style.opacity = "1";
                            } else {
                                ovl.style.opacity = "0";
                            }
                        }
                    } else if (ovl) {
                        ovl.style.opacity = "0";
                    }
                };
                v.scene.preRender.addEventListener(syncOvl);
                (v as any)._satPreRH = syncOvl;

            } catch (err: any) {
                console.error("sat load failed:", err);
                alert("CRASH: " + err.toString() + "\n" + (err.stack || ""));
            }
        };

        load();
        return () => { alive = false; };
    }, [layers.satellites, ready, density]);

    // detection mode effect
    useEffect(() => {
        if (!ready || !viewerRef.current || viewerRef.current.isDestroyed()) return;
        const v = viewerRef.current;
        const C = (window as any).Cesium;

        const satL = v.dataSources.getByName("SatelliteFeeds");
        if (satL && satL.length > 0) CamVisDet.update(satL[0].entities.values, detectionMode || null, v, C);

        const fltL = v.dataSources.getByName("FlightFeeds");
        if (fltL && fltL.length > 0) CamVisDet.update(fltL[0].entities.values, detectionMode || null, v, C);

        if (!detectionMode || detectionMode === 'null') {
            const setTr = (window as any).__setTrackedSatellite;
            if (setTr) setTr(null);
            v.trackedEntity = undefined;
        }
    }, [detectionMode, ready]);

    // live flights layer
    useEffect(() => {
        if (!ready || !viewerRef.current || viewerRef.current.isDestroyed()) return;
        const v = viewerRef.current;
        const C = (window as any).Cesium;

        if (!layers.liveFlights && !layers.militaryFlights) {
            const existing = v.dataSources.getByName("FlightFeeds");
            if (existing && existing.length > 0) v.dataSources.remove(existing[0], true);
            if ((v as any)._fltClickH) { (v as any)._fltClickH.destroy(); (v as any)._fltClickH = null; }
            if ((v as any)._fltPreRH) { v.scene.preRender.removeEventListener((v as any)._fltPreRH); (v as any)._fltPreRH = null; }
            if ((v as any)._fltPoll) clearTimeout((v as any)._fltPoll);
            (v as any)._fltStop = true;

            if (v.trackedEntity && v.trackedEntity.properties?.isFlight?.getValue()) {
                const setTr = (window as any).__setTrackedSatellite;
                if (setTr) setTr(null);
                v.trackedEntity = undefined;
            }

            const setTrG = (window as any).__setTrackedSatellite;
            if (setTrG) setTrG(null);
            return;
        }

        let alive = true;
        (v as any)._fltStop = false;

        const ds = new C.CustomDataSource("FlightFeeds");
        v.dataSources.add(ds);

        const cache = new Map<string, any>();

        const poll = async () => {
            if (!alive || (v as any)._fltStop) return;

            try {
                const res = await fetch(`${BACKEND_URL}/api/feeds/flights`);
                const json = await res.json();

                if (!alive || (v as any)._fltStop || json.status !== "success" || !json.data) return;

                const isDev = process.env.NODE_ENV === 'development' || (import.meta as any).env?.DEV;
                const data = isDev && json.data ? json.data.slice(0, 150) : json.data;

                // keep-alive: if api returns nothing, preserve existing entities
                if (data.length === 0) {
                    if (alive && !(v as any)._fltStop) (v as any)._fltPoll = setTimeout(poll, 4000);
                    return;
                }

                const dm = (window as any).__currentDetectionMode || "SPARSE";
                const seen = new Set<string>();
                let idx = 0;
                const chunk = 250;

                const step = () => {
                    if (!alive || (v as any)._fltStop) return;
                    const end = Math.min(idx + chunk, data.length);

                    for (; idx < end; idx++) {
                        const d = data[idx];
                        const icao = d[0];
                        if (!icao) continue;

                        const mil = d[d.length - 1] === true;
                        if (mil && !layers.militaryFlights) continue;
                        if (!mil && !layers.liveFlights) continue;

                        seen.add(icao);

                        if (!cache.has(icao)) {
                            const ent = FltRenderer.build(d, dm, C);
                            if (ent) cache.set(icao, ds.entities.add(ent));
                        } else {
                            // update existing entity position
                            const e = cache.get(icao);
                            const lng = d[5], lat = d[6], alt = d[7] || 0;
                            const vel = d[9] || 0, hdg = d[10] || 0;

                            if (lng !== null && lat !== null) {
                                const t = C.JulianDate.now();
                                e.position.addSample(t, C.Cartesian3.fromDegrees(lng, lat, alt));

                                if (vel > 0) {
                                    const tf = C.JulianDate.addSeconds(t, 15, new C.JulianDate());
                                    const dist = vel * 15;
                                    const lr = C.Math.toRadians(lat);
                                    const hr = C.Math.toRadians(hdg);
                                    const dLat = (dist * Math.cos(hr)) / 111111;
                                    const dLng = (dist * Math.sin(hr)) / (111111 * Math.cos(lr));
                                    e.position.addSample(tf, C.Cartesian3.fromDegrees(lng + dLng, lat + dLat, alt));
                                }

                                if (e.properties) {
                                    e.properties.altMeters = alt;
                                    e.properties.velMs = vel;
                                    e.properties.isGrounded = d[8];
                                }

                                // refresh label for tracked vs untracked
                                if (v.trackedEntity && v.trackedEntity.id === e.id) {
                                    FltSelSys.select(e, null, C);
                                } else {
                                    FltSelSys.deselect(e, C);
                                }
                            }
                        }
                    }

                    if (idx < data.length) {
                        setTimeout(step, 2);
                    } else {
                        // prune disappeared flights
                        const rm: string[] = [];
                        for (const [icao, ent] of cache.entries()) {
                            if (!seen.has(icao)) { ds.entities.remove(ent); rm.push(icao); }
                        }
                        for (const k of rm) cache.delete(k);

                        if (alive && !(v as any)._fltStop) {
                            (v as any)._fltPoll = setTimeout(poll, 15000);
                        }
                    }
                };
                step();

            } catch (err) {
                console.error("flight poll failed:", err);
                if (alive && !(v as any)._fltStop) {
                    (v as any)._fltPoll = setTimeout(poll, 15000);
                }
            }
        };

        poll();

        // click handler for flights
        if (!(v as any)._fltClickH) {
            const handler = new C.ScreenSpaceEventHandler(v.scene.canvas);
            (v as any)._fltClickH = handler;
            let prev: any = null;

            handler.setInputAction((click: any) => {
                const pick = v.scene.pick(click.position);
                if (C.defined(pick) && pick.id && pick.id.name) {
                    const ent = pick.id;

                    if (ent.properties?.isFlight?.getValue()) {
                        if (prev) {
                            if (prev.properties?.isFlight?.getValue()) FltSelSys.deselect(prev, C);
                            else SatSelSys.deselect(prev, C);
                        }
                        prev = FltSelSys.select(ent, prev, C);
                        ent.viewFrom = new C.Cartesian3(0.0, -1000.0, 500.0);
                        v.trackedEntity = ent;

                    } else if (ent.properties?.noradId) {
                        if (prev) {
                            if (prev.properties?.isFlight?.getValue()) FltSelSys.deselect(prev, C);
                            else SatSelSys.deselect(prev, C);
                        }
                        prev = SatSelSys.select(ent, prev, C);
                        v.trackedEntity = ent;
                        const setTr = (window as any).__setTrackedSatellite;
                        if (setTr) {
                            const p = ent.properties;
                            setTr({
                                name: ent.name,
                                noradId: p?.noradId?.getValue() || "--",
                                altitude: `${p?.altKm?.getValue() || "--"} km`,
                            });
                        }
                    }
                } else {
                    if (prev) {
                        if (prev.properties?.isFlight?.getValue()) FltSelSys.deselect(prev, C);
                        else SatSelSys.deselect(prev, C);
                    }
                    prev = null;
                    v.trackedEntity = undefined;
                    const setTr = (window as any).__setTrackedSatellite;
                    if (setTr) setTr(null);
                }
            }, C.ScreenSpaceEventType.LEFT_CLICK);

            // overlay sync
            const syncOvl = () => {
                const tr = v.trackedEntity;
                const ovl = document.getElementById("sat-tracker-overlay");
                if (tr && tr.position && ovl) {
                    const pos = tr.position.getValue(v.clock.currentTime);
                    if (pos) {
                        const cp = C.SceneTransforms.worldToWindowCoordinates(v.scene, pos);
                        if (cp) {
                            ovl.style.left = `${Math.round(cp.x) + 20}px`;
                            ovl.style.top = `${Math.round(cp.y) - 60}px`;
                            ovl.style.opacity = "1";
                        } else { ovl.style.opacity = "0"; }
                    }
                } else if (ovl) { ovl.style.opacity = "0"; }
            };
            v.scene.preRender.addEventListener(syncOvl);
            (v as any)._fltPreRH = syncOvl;
        }

        return () => { alive = false; };

    }, [layers.liveFlights, layers.militaryFlights, ready, density]);

    if (fallback) return <CanvasFallbackGlobe activeStyle={activeStyle} layers={layers} canvasRef={canvasRef} />;

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#000" }}>
            {/* deep space bg */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(circle at center, #050a10 0%, #000000 100%)" }} />
            {/* subtle css stars */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px", backgroundPosition: "0 0, 30px 30px" }} />

            {/* cesium container */}
            <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 1, filter: fx.filter, transition: "filter 0.5s ease", cursor: "grab" }} />

            {/* style overlays (scanlines etc) */}
            {fx.overlays.map((o, i) => (
                <div key={`${activeStyle}-ovl-${i}`} style={{ ...o, zIndex: 10 + i }} />
            ))}

            {/* vignette */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 15, background: fx.vignette, transition: "background 0.5s ease" }} />

            {/* loading spinner */}
            {!ready && !fallback && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,10,15,0.9)", zIndex: 20 }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: "40px", height: "40px", border: "2px solid #1e293b", borderTop: "2px solid #00f0ff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                        <div style={{ color: "#00f0ff", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>INITIALIZING CESIUM ENGINE...</div>
                    </div>
                </div>
            )}

            <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// TODO: move this to its own file when we refactor the canvas fallback out
function CanvasFallbackGlobe({ activeStyle, layers, canvasRef }: { activeStyle: string; layers: Record<string, boolean>; canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;
        const resize = () => { cvs.width = cvs.parentElement?.clientWidth || 800; cvs.height = cvs.parentElement?.clientHeight || 600; };
        resize(); window.addEventListener("resize", resize);
        let frame = 0, animId: number;
        const sc: Record<string, { p: string; g: string; b: string; a: number }> = {
            NVG: { p: "#00ff50", g: "rgba(0,255,80,", b: "rgba(0,30,0,", a: 0.12 },
            FLIR: { p: "#cccccc", g: "rgba(200,200,200,", b: "rgba(20,20,20,", a: 0.1 }, NORMAL: { p: "#4488ff", g: "rgba(68,136,255,", b: "rgba(10,15,30,", a: 0.06 },
        };
        const cities = [{ n: "NEW YORK", x: -0.3, y: -0.12 }, { n: "LONDON", x: 0, y: -0.2 }, { n: "MUMBAI", x: 0.28, y: 0.08 }, { n: "TOKYO", x: 0.48, y: -0.1 }, { n: "DELHI", x: 0.26, y: -0.02 }, { n: "DUBAI", x: 0.2, y: 0 }, { n: "SINGAPORE", x: 0.38, y: 0.15 }, { n: "SYDNEY", x: 0.5, y: 0.32 }, { n: "MOSCOW", x: 0.15, y: -0.28 }, { n: "BEIJING", x: 0.4, y: -0.13 }];
        const arcs = [[0, 1], [1, 3], [2, 5], [3, 6], [0, 9], [1, 8], [4, 6], [2, 6]];
        const draw = () => {
            const w = cvs.width, h = cvs.height, cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38, s = sc[activeStyle] || sc.NORMAL;
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = "rgba(30,41,59,0.08)"; ctx.lineWidth = 0.5;
            for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
            for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
            const bg = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.6); bg.addColorStop(0, s.g + "0.08)"); bg.addColorStop(0.4, s.g + "0.03)"); bg.addColorStop(1, "transparent"); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = s.g + "0.35)"; ctx.lineWidth = 2; ctx.stroke();
            const gg = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r); gg.addColorStop(0, s.g + "0.1)"); gg.addColorStop(0.5, s.b + "0.2)"); gg.addColorStop(1, s.b + "0.4)"); ctx.fillStyle = gg; ctx.fill();
            ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.05, r * 0.35, frame * 0.0005, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,70,70,0.4)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
            ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - 1, 0, Math.PI * 2); ctx.clip();
            for (let i = -4; i <= 4; i++) { const yo = i * r * 0.2, lr = Math.sqrt(Math.max(0, r * r - yo * yo)); ctx.beginPath(); ctx.ellipse(cx, cy + yo, lr, lr * 0.12, 0, 0, Math.PI * 2); ctx.strokeStyle = s.g + `${s.a})`; ctx.lineWidth = 0.5; ctx.stroke(); }
            for (let i = 0; i < 12; i++) { const a2 = (i / 12) * Math.PI + frame * 0.0004, xs = Math.cos(a2); ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(xs) * r, r, 0, 0, Math.PI * 2); ctx.strokeStyle = s.g + `${s.a * 0.6 + Math.abs(xs) * s.a})`; ctx.lineWidth = 0.5; ctx.stroke(); }
            cities.forEach(c => { const px = cx + c.x * r * 1.5, py = cy + c.y * r * 1.5; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = s.p; ctx.fill(); ctx.font = "600 7px 'JetBrains Mono',monospace"; ctx.fillStyle = s.g + "0.7)"; ctx.textAlign = "center"; ctx.fillText(c.n, px, py - 10); });
            arcs.forEach(([a2, b2], idx) => { const c1 = cities[a2], c2 = cities[b2], x1 = cx + c1.x * r * 1.5, y1 = cy + c1.y * r * 1.5, x2 = cx + c2.x * r * 1.5, y2 = cy + c2.y * r * 1.5, d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - d * 0.2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.strokeStyle = s.g + "0.08)"; ctx.lineWidth = 1; ctx.stroke(); const t = ((frame * 0.008 + idx * 0.5) % 1), dx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2, dy = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2; ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, Math.PI * 2); ctx.fillStyle = s.p; ctx.fill(); });
            ctx.restore();
            ctx.strokeStyle = s.g + "0.2)"; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 8, cy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 20, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy - 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy + 20); ctx.stroke();
            frame++; animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
    }, [activeStyle, layers]);
    return <div style={{ width: "100%", height: "100%", position: "relative" }}><canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} /></div>;
}
