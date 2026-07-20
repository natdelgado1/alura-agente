import os
from dotenv import load_dotenv

# Importamos los proveedores que vas a utilizar
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.embeddings import MinimaxEmbeddings

load_dotenv()

def obtener_embeddings():
    """
    Instantiates and returns the embedding model based on environment configuration.

    Utilizes the Factory pattern to determine the appropriate embedding provider.
    Reads the 'PROVEEDOR_EMBEDDINGS' variable from the environment. Defaults to
    'local' if the variable is not set or is empty.

    Returns:
        Embeddings: An instance of the selected LangChain embedding class
        (HuggingFaceEmbeddings, GoogleGenerativeAIEmbeddings, or MinimaxEmbeddings).

    Raises:
        ValueError: If the specified provider is not recognized.
    """
    proveedor = os.getenv("PROVEEDOR_EMBEDDINGS", "local").lower().strip()

    if proveedor == "local":
        return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
    elif proveedor == "google":
        return GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        
    elif proveedor == "minimax":
        return MinimaxEmbeddings()
        
    else:
        raise ValueError(f"Proveedor '{proveedor}' no soportado o no configurado.")