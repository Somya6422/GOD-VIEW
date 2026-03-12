from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ingestion.llm_parser import parse_unstructured_text
from app.database.ingest import ingest_to_graph

router = APIRouter(prefix="/api/ingest", tags=["Ingestion"])

class TextPayload(BaseModel):
    text: str

@router.post("/unstructured")
async def ingest_text(payload: TextPayload):
    # raw text -> llm extract -> neo4j graph
    try:
        intel = await parse_unstructured_text(payload.text)

        if intel and intel.entities:
            res = ingest_to_graph(intel)
            return {"status": "success", "extracted": len(intel.entities), "added_to_graph": res}

        return {"status": "warning", "message": "no entities found in text"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
