import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

# connect to aura cloud or local docker — env vars override defaults
_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
_usr = os.getenv("NEO4J_USER", "neo4j")
_pwd = os.getenv("NEO4J_PASSWORD", "password")

class Neo4jConn:
    def __init__(self, uri, usr, pwd):
        self._drv = None
        try:
            self._drv = GraphDatabase.driver(uri, auth=(usr, pwd))
        except Exception as e:
            print("neo4j driver init failed:", e)

    def close(self):
        if self._drv: self._drv.close()

    def query(self, q, params=None, db=None):
        assert self._drv, "driver not initialized"
        sess = None
        resp = None
        try:
            sess = self._drv.session(database=db) if db else self._drv.session()
            resp = list(sess.run(q, params))
        except Exception as e:
            print("query failed:", e)
        finally:
            if sess: sess.close()
        return resp

db_conn = Neo4jConn(_uri, _usr, _pwd)
