"""
Fase 2 (parte 1): Embeddings Modulares + vectorstore.
"""
import os
from langchain_community.vectorstores import FAISS

from config import obtener_embeddings

INDEX_PATH = "data/faiss_index"

def construir_vectorstore(chunks):
    """
    Constructs a FAISS vectorstore from document chunks and persists it to disk.

    Args:
        chunks (List[Document]): A list of LangChain Document objects representing
                                 the text chunks to be embedded and indexed.

    Returns:
        FAISS: The constructed FAISS vectorstore instance.
    """
    embeddings = obtener_embeddings()

    vectorstore = FAISS.from_documents(chunks, embeddings)

    vectorstore.save_local(INDEX_PATH)
    return vectorstore

def cargar_vectorstore():
    """
    Loads an existing FAISS vectorstore from the local disk.

    Returns:
        FAISS: The loaded FAISS vectorstore instance.
    """
    embeddings = obtener_embeddings()
    return FAISS.load_local(
        INDEX_PATH, embeddings, allow_dangerous_deserialization=True
    )

if __name__ == "__main__":
    from loader import cargar_y_trocear

    chunks = cargar_y_trocear()
    construir_vectorstore(chunks)