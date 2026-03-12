from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import time
from app.api import ingestion_routes, live_feeds

load_dotenv()

app = FastAPI(title="GOD VIEW — Global Ontology Engine")

# cors — frontend at :3000 needs access to api endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_boot = time.time()

app.include_router(ingestion_routes.router)
app.include_router(live_feeds.router)


@app.get("/api/status")
def status():
    up = time.time() - _boot
    return {
        "status": "online",
        "uptime_seconds": round(up, 1),
        "services": {
            "ontology_engine": "active",
            "live_feeds": "active",
            "ingestion": "active",
        }
    }


# static export mount — must stay last so it doesn't shadow /api routes
base = os.path.dirname(os.path.abspath(__file__))
fe_out = os.path.join(base, "..", "frontend", "out")
if os.path.isdir(fe_out):
    app.mount("/", StaticFiles(directory=fe_out, html=True), name="frontend")
else:
    # TODO: add CI step that auto-builds frontend before backend starts
    print(f"Warning: frontend build not found at {fe_out}")
