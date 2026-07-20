"""
Fase 2: Construcción de Vectorstore con procesamiento por lotes (batching).
Implementa pausas automáticas para evitar límites de API (Rate Limits).
"""
import time
from pathlib import Path
from langchain_community.vectorstores import FAISS
from config import obtener_embeddings

# Path absoluto calculado desde la ubicación del archivo, no desde el cwd.
# Esto evita que se rompa si el proceso se ejecuta desde otro directorio
# (ej. uvicorn con --app-dir).
INDEX_PATH = str(Path(__file__).resolve().parent / "data" / "faiss_index")

def construir_vectorstore(chunks, batch_size: int = 20, pausa: int = 30):
    """
    Construye el índice FAISS por lotes para respetar los límites de la API.

    Args:
        chunks (list): Lista de documentos procesados.
        batch_size (int): Fragmentos por petición.
        pausa (int): Segundos de espera entre cada lote.
    """
    embeddings = obtener_embeddings()
    vectorstore = None
    total = len(chunks)

    for i in range(0, total, batch_size):
        lote = chunks[i:i + batch_size]
        print(f"⏳ Procesando lote {i // batch_size + 1} ({i}-{min(i + batch_size, total)} de {total})...")

        if vectorstore is None:
            # Crea el índice inicialmente
            vectorstore = FAISS.from_documents(lote, embeddings)
        else:
            # Añade al índice existente
            vectorstore.add_documents(lote)

        # Pausa estratégica si faltan documentos por procesar
        if i + batch_size < total:
            print(f"💤 Esperando {pausa}s para proteger cuota de API...")
            time.sleep(pausa)

    vectorstore.save_local(INDEX_PATH)
    print(f"✅ Vectorstore guardado en {INDEX_PATH}")
    return vectorstore

def cargar_vectorstore():
    """Carga el vectorstore desde disco."""
    embeddings = obtener_embeddings()
    return FAISS.load_local(
        INDEX_PATH, embeddings, allow_dangerous_deserialization=True
    )

if __name__ == "__main__":
    from loader import cargar_y_trocear
    chunks = cargar_y_trocear()
    construir_vectorstore(chunks)
