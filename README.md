<div align="center">

# 🌐 GOD VIEW
### **Global Ontology Engine for Digital Intelligence**
*Built by **Team ASTRA-X** • Hackathon Submission: Digital Democracy Domain*

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![CesiumJS](https://img.shields.io/badge/3D%20Engine-CesiumJS-blue?logo=cesium)](https://cesium.com/)
[![Python](https://img.shields.io/badge/Backend-Python%20FastAPI-3776AB?logo=python)](https://fastapi.tiangolo.com/)
[![Neo4j](https://img.shields.io/badge/Graph%20DB-Neo4j%20AuraDB-008CC1?logo=neo4j)](https://neo4j.com/)
[![Sarvam AI](https://img.shields.io/badge/AI%20Engine-Sarvam%20AI-FF6B00)](https://sarvam.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> *"The map is not the territory — GOD VIEW is the cognitive layer between them."*

</div>

---

## 🚨 The Problem: Fragmented OSINT in a Hyper-Connected World

Modern decision-making — whether in defense, geopolitics, or economic strategy — suffers from a **fundamental information architecture crisis**:

| Fragmentation Vector | Impact |
|---|---|
| Siloed data streams (satellites, flights, seismic, traffic) | No unified operational picture |
| Reactive dashboards (you see events after they happen) | Zero predictive capacity |
| English-only AI analysis tools | Excludes Indian language speakers and policymakers |
| No entity-relationship mapping | Can't understand *how* a conflict in the Red Sea affects a Surat textile exporter |

Intelligence agencies, defense analysts, and national security planners are forced to manually correlate dozens of fragmented sources — by hand, in real-time, under pressure.

---

## 💡 The Solution: A Sovereign Cognitive Digital Twin

**GOD VIEW** is not a map. It is an **AI-powered Global Ontology Engine** — a living, 3D cognitive digital twin of planet Earth.

It ingests multi-domain OSINT streams, constructs a **live relationship graph** of all entities (flights, earthquakes, maritime routes, economic corridors), and uses **Sarvam AI** — India's own sovereign AI — to generate real-time, *interconnected* strategic insight.

> Example: *A military anomaly in the South China Sea → triggers a rerouted shipping lane → increases freight costs for Indian importers → Sarvam AI surfaces this chain of causality proactively, in Hindi, on the dashboard.*

---

## 🏗️ Architecture

![GOD VIEW System Architecture](./assets/architecture.png)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              GOD VIEW — SYSTEM ARCHITECTURE                         │
├──────────────────┬────────────────────────┬─────────────────────┬───────────────────┤
│   DATA SOURCES   │   BACKEND / ONTOLOGY   │   3D GLOBE ENGINE   │  INTELLIGENCE OUT │
│                  │                        │                     │                   │
│ ✈ OpenSky ADS-B  │  Python FastAPI        │  Next.js + React    │  Live Flight HUD  │
│ 🛰 CelesTrak TLE  │  ↓                     │  ↓                  │  Military Lock-On │
│ 🌍 USGS Earthquke │  Neo4j AuraDB          │  CesiumJS WebGL     │  Conflict Heatmap │
│ 🗺 Google 3D Tiles│  (Graph Ontology)      │  ↓                  │  Sarvam Insights  │
│ 📹 YouTube Live   │  ↓                     │  Custom GLSL        │  Subsea Cables    │
│                  │  Sarvam AI 30B/105B    │  (NVG/FLIR/Normal)  │  Neural Analytics │
└──────────────────┴────────────────────────┴─────────────────────┴───────────────────┘
```

---

## ✨ Core Features

### ✈️ Dynamic Global Flight Intelligence
- **Live Commercial Flights** — Real-time ADS-B via OpenSky Network. Default **white** icons with **cyan target-lock** on selection.
- **Military / ADS-B Surveillance** — Classified transponder filtering renders tactical assets as **orange directional cursors**.
- **Spy-Cam Target Lock** — Clicking a military asset triggers a steep-angle "dive bomb" camera lock (`viewFrom: Cartesian3(0, -1000, 500)`) that bolts the camera directly behind the aircraft.
- **Smooth Interpolation** — `Cesium.SampledPositionProperty` with `EXTRAPOLATE` mode ensures entities glide continuously at 60fps between 15-second API data polls.
- **Tactical HUD Labels** — Real-time `VT323` monospace HUD overlays showing Callsign / Altitude / Speed / Operator.

### 🛰️ Global Infrastructure & Environment
- **CelesTrak Satellite Orbits** — Live TLE propagation of 1,000+ active satellites using `satellite.js`.
- **Live Earthquakes (24h)** — USGS ATOM feed, color-coded by magnitude, glowing point entities.
- **Weather Radar** — Animated weather overlay layers across major regions.
- **Subsea Cable & Pipeline Network** — Glowing polylines tracing the world's critical underwater data and energy infrastructure.

### 🗺️ World Monitor Capabilities
- **2D/3D Dual Map** — Runtime-switchable between flat Mercator projection and photorealistic 3D globe with Google Maps photorealistic tiles.
- **Global Instability Heatmap** — Country-level choropleth with a 1–5 risk scoring model for geopolitical events.
- **Live Street Traffic Arteries** — Ground-clamped particle flow systems along major GeoJSON highway routes.
- **CCTV Mesh Network** — Autoplaying public YouTube Live Earth/Traffic cams embedded as live-video HTML labels for cities globally.

### 🧠 Neural Analytics Hub & Sarvam AI Ontology Engine
- **Neo4j AuraDB Graph** — All entities (flights, events, corridors, chokepoints) are nodes. The edges represent ontological relationships (e.g., `AFFECTS`, `REROUTES_VIA`, `DEPENDS_ON`).
- **Sarvam AI Integration** — India's sovereign 30B / 105B parameter LLM reads the live entity subgraphs and generates contextual, interconnected intelligence insights — in English and Indic languages.
- **Real-time Inference** — The Neural Analytics Hub streams Sarvam's analysis conclusions directly to the dashboard dashboard panel.

### 🎨 Multi-Mode Tactical Visuals (GLSL Post-Processing)
| Mode | Description |
|---|---|
| **NORMAL** | CRT scanline overlay, high-contrast bloom, cinematic atmosphere |
| **NVG** | Phosphor-green tactical GLSL shader with ambient ambient floor, dampened bloom |
| **FLIR** | Thermal infrared simulation with heat-signature color palette |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **3D Globe Engine** | [CesiumJS](https://cesium.com/) + Google Photorealistic 3D Tiles |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (React, TypeScript) |
| **Shaders** | Custom GLSL Fragment Shaders (`PostProcessStage`) |
| **Backend API** | Python [FastAPI](https://fastapi.tiangolo.com/) (async) |
| **Graph Database** | [Neo4j AuraDB](https://neo4j.com/cloud/aura/) — Ontology / Knowledge Graph |
| **Sovereign AI** | [Sarvam AI](https://sarvam.ai/) (30B & 105B parameter Indic models) |
| **Flight Data** | [OpenSky Network](https://opensky-network.org/) ADS-B REST API |
| **Satellite Data** | [CelesTrak](https://celestrak.com/) TLE + `satellite.js` propagator |
| **Seismic Data** | [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/) |
| **Deployment** | Vercel (Frontend) + Railway/Docker (Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A valid [Cesium Ion](https://ion.cesium.com/) access token
- A [Google Maps API Key](https://developers.google.com/maps) with Maps Tiles API enabled
- Neo4j AuraDB connection credentials
- Sarvam AI API key

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/god-view.git
cd god-view
```

### 2. Configure Environment
**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_CESIUM_ION_TOKEN=your_cesium_ion_token
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
NEO4J_URI=neo4j+s://your-aura-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password
SARVAM_API_KEY=your_sarvam_key
```

### 3. Start the Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate       # Windows
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:3000` 🌍

---

## 🇮🇳 Impact on Digital Democracy

### Atmanirbhar Bharat — The Self-Reliant AI Imperative

> *Every intelligence platform used by India's planners today is built on foreign LLM infrastructure. GOD VIEW changes that.*

| Principle | GOD VIEW Implementation |
|---|---|
| **Sovereign AI** | Sarvam AI (India's own 30B/105B model) — no data leaves Indian servers |
| **Indic Language Analysis** | Insights generated natively in Hindi, Tamil, Telugu, and more |
| **Open OSINT** | No classified data dependency; entirely open-source data feeds |
| **Decision Democratization** | Any ministry analyst can query global geopolitics in their native language |

By replacing foreign LLM dependency with **Sarvam AI**, GOD VIEW ensures that India's most sensitive geopolitical reasoning remains under Indian digital sovereignty. This is the operational definition of *Digital Democracy* — intelligence infrastructure that serves the people, by the people, powered by their own language and their own AI.

---

## 👥 Team ASTRA-X

| Role | Contributor |
|---|---|
| Full-Stack Architecture & 3D Engine | Smruti |
| AI / Ontology Graph Design | Team ASTRA-X |
| Backend Data Ingestion | Team ASTRA-X |
| UI/UX & Shader Design | Team ASTRA-X |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**GOD VIEW — ASTRA-X** • Built with 🇮🇳 for Digital Democracy

*"See everything. Understand the connections. Act before the event."*

</div>
