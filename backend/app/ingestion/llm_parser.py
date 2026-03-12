import os
from openai import AsyncOpenAI
from app.ingestion.models import StructuredIntelligence
import json

# lazy init — avoids crash if key is missing at import time
_cli = None

def _client():
    global _cli
    if not _cli:
        key = os.getenv("OPENAI_API_KEY")
        if not key: raise RuntimeError("OPENAI_API_KEY not set")
        _cli = AsyncOpenAI(api_key=key)
    return _cli

async def parse_unstructured_text(text: str) -> StructuredIntelligence:
    # extract graph entities + relationships via llm function calling
    sys_prompt = """
    You are an expert intelligence analyst for the God View Ontology Engine.
    Read unstructured news/intel/social feeds and extract structured data for a Knowledge Graph.
    Extract core Entities (Countries, Corporations, People, Military Assets, Infrastructure, Events)
    and Relationships between them. Return ONLY valid JSON matching the requested schema.
    """

    try:
        comp = await _client().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": f"Extract intelligence from this text: {text}"},
            ],
            response_format={"type": "json_object"},
            tools=[{
                "type": "function",
                "function": {
                    "name": "extract_intelligence",
                    "description": "Extract entities and relationships",
                    "parameters": StructuredIntelligence.model_json_schema(),
                },
            }],
            tool_choice={"type": "function", "function": {"name": "extract_intelligence"}},
        )

        raw = comp.choices[0].message.tool_calls[0].function.arguments
        return StructuredIntelligence.model_validate_json(raw)

    except Exception as e:
        print(f"llm parse error: {e}")
        return StructuredIntelligence(entities=[], relationships=[])
