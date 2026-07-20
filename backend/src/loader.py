"""
Fase 1: Lectura y procesamiento de documentos.
"""
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


def cargar_y_trocear(carpeta: str = "../data"):
    """Carga todos los PDFs de la carpeta y los divide en fragmentos."""
    docs = []
    for archivo in os.listdir(carpeta):
        if archivo.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(carpeta, archivo))
            docs.extend(loader.load())

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_documents(docs)

    n_pdfs = len([f for f in os.listdir(carpeta) if f.endswith(".pdf")])
    print(f"📄 {len(docs)} páginas cargadas de {n_pdfs} PDFs")
    print(f"✂️ {len(chunks)} fragmentos generados")
    return chunks


if __name__ == "__main__":
    chunks = cargar_y_trocear()
