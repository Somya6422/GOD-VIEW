from app.database.neo4j import db_conn
from app.ingestion.models import StructuredIntelligence

def ingest_to_graph(intel: StructuredIntelligence):
    # push extracted nodes + edges into neo4j
    for ent in intel.entities:
        q = f"""
        MERGE (n:{ent.type} {{name: $name}})
        SET n += $props
        """
        db_conn.query(q, params={"name": ent.name, "props": ent.properties})

    for rel in intel.relationships:
        q = f"""
        MATCH (a {{name: $src}}), (b {{name: $tgt}})
        MERGE (a)-[r:{rel.type}]->(b)
        SET r += $props
        """
        db_conn.query(q, params={"src": rel.source_entity, "tgt": rel.target_entity, "props": rel.properties})

    print(f"ingested {len(intel.entities)} entities, {len(intel.relationships)} rels")
    return {"status": "success"}
