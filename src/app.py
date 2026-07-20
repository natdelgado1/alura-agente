"""
Fase 3: API que expone el agente (esto es lo que se sube a OCI).
"""
from fastapi import FastAPI
from pydantic import BaseModel

from vectorstore import cargar_vectorstore
from agent import construir_agente

app = FastAPI(title="Alura Agente - BimBam Buy")

vectorstore = cargar_vectorstore()
agente = construir_agente(vectorstore)


class Pregunta(BaseModel):
    query: str


@app.get("/")
def health():
    return {"status": "ok", "mensaje": "Alura Agente corriendo"}


@app.post("/ask")
def responder(payload: Pregunta):
    resultado = agente.invoke({"input": payload.query})
    return {
        "respuesta": resultado["answer"],
        "fuentes": [doc.metadata for doc in resultado["context"]],
    }
