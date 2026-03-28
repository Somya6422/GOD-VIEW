<div align="center">

# 🌐 GOD VIEW
### **Global Ontology Engine for Digital Intelligence**
*Built by **Team ASTRA-X** • Hackathon Submission: Digital Democracy Domain (Domain 2)*

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

<img width="1909" height="911" alt="Screenshot 2026-03-10 072421" src="https://github.com/user-attachments/assets/719a2077-0940-4cb4-a3fa-ba4381879c7a" />
<img width="1901" height="913" alt="Screenshot 2026-03-10 072456" src="https://github.com/user-attachments/assets/b0793901-5c5e-48a8-a741-e8faaf34cccd" />

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

<img width="1907" height="907" alt="Screenshot 2026-03-10 072728" src="https://github.com/user-attachments/assets/3053d41a-6b60-430b-aa8c-32c239ae3509" />
<img width="511" height="132" alt="Screenshot 2026-03-09 091116" src="https://github.com/user-attachments/assets/65fe9a6a-63b9-4e72-8fb1-62bf18454037" />
<img width="517" height="217" alt="Screenshot 2026-03-10 071820" src="https://github.com/user-attachments/assets/c815280c-4c92-4206-afd9-ae54a7c2ae84" />
- **Live Commercial Flights** — Real-time Flight data via OpenSky Network. Default **white** icons with **cyan target-lock** on selection.
- **Military / ADS-B Surveillance** — Classified transponder filtering renders tactical assets as **orange directional cursors** uses ADS-B.
- **Spy-Cam Target Lock** — Clicking a military asset triggers a steep-angle "dive bomb" camera lock (`viewFrom: Cartesian3(0, -1000, 500)`) that bolts the camera directly behind the aircraft.
- **Smooth Interpolation** — `Cesium.SampledPositionProperty` with `EXTRAPOLATE` mode ensures entities glide continuously at 60fps between 15-second API data polls.
- **Tactical HUD Labels** — Real-time `VT323` monospace HUD overlays showing Callsign / Altitude / Speed / Operator.

### 🛰️ Global Infrastructure & Environment

<img width="1888" height="901" alt="Screenshot 2026-03-10 072846" src="https://github.com/user-attachments/assets/fc0ee558-54e4-4c19-a3d3-2a62637c873e" />
<img width="1868" height="693" alt="Screenshot 2026-03-10 072934" src="https://github.com/user-attachments/assets/d024e8e3-d799-41d3-b2a4-7f226e7a11a5" />

- **CelesTrak Satellite Orbits** — Live TLE propagation of 1,000+ active satellites using `satellite.js` with their names and visual orbit in which they currently are and the area they are covering .
- **Live Earthquakes (24h)** — USGS ATOM feed, color-coded by magnitude, glowing point entities.
- **Weather Radar** — Animated weather overlay layers across major regions (uses NOAA'S NEXRAD AND IMD SERVICES{INDIA}).
- **Subsea Cable & Pipeline Network** — Glowing polylines tracing the world's critical underwater data and energy infrastructure.

### 🗺️ World Monitor Capabilities

<img width="1902" height="921" alt="Screenshot 2026-03-10 073129" src="https://github.com/user-attachments/assets/63f02e33-d559-4ee8-a130-4efde34feb4c" />
<img width="1909" height="913" alt="Screenshot 2026-03-10 073245" src="https://github.com/user-attachments/assets/e0063631-592f-4039-8bff-d4d0b42fd93f" />

- **2D/3D Dual Map** — Runtime-switchable between flat Mercator projection and photorealistic 3D globe with Google Maps photorealistic tiles.
- **Global Instability Heatmap** — Country-level choropleth with a 1–5 risk scoring model for geopolitical events.
- **Live Street Traffic Arteries** — Ground-clamped particle flow systems along major GeoJSON highway routes THAT mimicks the flow but shows actual realtime traffic data.
- **CCTV Mesh Network** — Autoplaying public YouTube Live Earth/Traffic cams embedded as live-video HTML labels for cities globally in such a way that you can view the 3D representation of the area the camera feeds or live data ( aross yt channels, new and all other resources live feeds) it is coveringcurated into one single dashboard.

### 🧠 Neural Analytics Hub & Sarvam AI Ontology Engine
- **Neo4j AuraDB Graph** — All entities (flights, events, corridors, chokepoints) are nodes. The edges represent ontological relationships (e.g., `AFFECTS`, `REROUTES_VIA`, `DEPENDS_ON`).
- **Sarvam AI Integration** — India's sovereign 30B / 105B parameter LLM reads the live entity subgraphs and generates contextual, interconnected intelligence insights — in English and Indic languages {it is additionally trained to give accurate insights without hallucination we are using 30B LLM currently}.
- **Real-time Inference** — The Neural Analytics Hub streams Sarvam's analysis conclusions directly to the dashboard dashboard panel in nodes or a hexagonal available in 3D/2D graph showing relationship between different domains like tech finance or wars like iran currently going on all into one single intelligent insight on how it will affect INDIA it is buit for better decision making for India and India only  .

### 🎨 Multi-Mode Tactical Visuals (GLSL Post-Processing)
| Mode | Description |
|---|---|
| **NORMAL** | CRT scanline overlay, high-contrast bloom, cinematic atmosphere |
| **NVG** | Phosphor-green tactical GLSL shader with ambient ambient floor, dampened bloom |
| **FLIR** | Thermal infrared simulation with heat-signature color palette |
|**playback**| Shows all data of playback on worlds current condition where you see all flghts changing routes, satellites over a specific country etc, with a live situation overlay |
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
Navigate to `https://frontend-five-nu-57.vercel.app/` 🌍

NOTE THE PROJECT IS IN DEVLOPMENT PHASE ACTUAL VERCEL LINK WILL BE PROVIDED SOON
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

By replacing foreign LLM dependency with **Sarvam AI**, GOD VIEW ensures that India's most sensitive geopolitical reasoning remains under Indian digital sovereignty. This is the operational definition of *Digital Democracy* — intelligence infrastructure that serves the people, by the people, powered by their own language and their own AI ,we are focusing on eliminating majour outside dependencies we possibly can .

---

## 👥 Team ASTRA-X

| Role | Contributor |
|---|---|
| Full-Stack Architecture & 3D Engine | SWAGAT SWARUP SAHU (TEAM LEADER) |
| AI / Ontology Graph Design | SHUBHAM MOHAPATRA |
| Backend Data Ingestion | SOMYA RANJAN SAHOO|
| UI/UX & Shader Design | Team ASTRA-X |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**GOD VIEW — ASTRA-X** • Built with 🇮🇳 for Digital Democracy

*"See everything. Understand the connections. Act before the event."*

</div>

