from pydantic import BaseModel
from typing import List

class Entity(BaseModel):
    name: str
    type: str    # "Country", "Corporation", "Ship", etc
    properties: dict = {}

class Relationship(BaseModel):
    source_entity: str
    target_entity: str
    type: str    # "OWNS", "DEPENDS_ON", "LOCATED_IN", etc
    properties: dict = {}

class StructuredIntelligence(BaseModel):
    entities: List[Entity]
    relationships: List[Relationship]
