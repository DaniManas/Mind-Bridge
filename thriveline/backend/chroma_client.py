import os
import chromadb

_chroma_client = None
_collections = {}

CHROMA_PATH = os.path.join(os.path.dirname(__file__), "chroma_data")
COLLECTION_NAMES = ["cbt_strategies", "psychoeducation", "crisis_resources"]


def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
    return _chroma_client


def get_collection(name: str):
    global _collections
    if name not in _collections:
        client = get_chroma_client()
        _collections[name] = client.get_or_create_collection(name)
    return _collections[name]


def query_knowledge_base(message: str, n_results: int = 2) -> str:
    """Query all 3 collections and return combined relevant context."""
    results = []
    for collection_name in COLLECTION_NAMES:
        try:
            collection = get_collection(collection_name)
            if collection.count() == 0:
                continue
            query_results = collection.query(
                query_texts=[message],
                n_results=min(n_results, collection.count())
            )
            if query_results and query_results.get("documents"):
                for doc in query_results["documents"][0]:
                    if doc:
                        results.append(doc)
        except Exception:
            continue

    if not results:
        return ""
    return "\n\n---\n\n".join(results[:4])
