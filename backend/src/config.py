import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.embeddings.minimax import MiniMaxEmbeddings

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

def obtener_embeddings():
    proveedor = os.getenv("PROVEEDOR_EMBEDDINGS", "local").lower().strip()

    if proveedor == "local":
        return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    elif proveedor == "google":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("La variable GOOGLE_API_KEY no está definida en el .env")
        return GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", google_api_key=api_key)

    #Task: no se conecta aún
    elif proveedor == "minimax":
        return MiniMaxEmbeddings(
            minimax_group_id=os.getenv("MINIMAX_GROUP_ID"),
            minimax_api_key=os.getenv("MINIMAX_API_KEY")
        )
    else:
        raise ValueError(f"Proveedor '{proveedor}' no reconocido.")
