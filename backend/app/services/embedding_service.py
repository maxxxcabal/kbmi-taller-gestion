from typing import List

# Model configuration
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

# Model singleton to avoid reload overhead
_model = None

def get_model():
    global _model
    if _model is None:
        print("Cargando modelo de embeddings (paraphrase-multilingual-MiniLM-L12-v2)...")
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def generate_embedding(text: str) -> List[float]:
    """
    Generates a 384-dimension vector from the given text.
    """
    if not text:
        return [0.0] * 384
    
    model = get_model()
    embedding = model.encode(text)
    return embedding.tolist()

def generate_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Efficiently generates embeddings for a list of texts.
    """
    if not texts:
        return []
    
    model = get_model()
    embeddings = model.encode(texts)
    return embeddings.tolist()
