"""
Fase 3: API que expone el agente de soporte de BimBam Buy.
"""
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from vectorstore import cargar_vectorstore
from agent import construir_agente

app = FastAPI(
    title="Alura Agente - BimBam Buy API",
    version="1.0.0",
    description=(
        "API del asistente virtual de soporte de **BimBam Buy**.\n\n"
        "El agente responde preguntas sobre políticas internas de la tienda "
        "(reembolsos, envíos, pagos, garantía y afiliados) utilizando un "
        "pipeline RAG sobre los documentos internos.\n\n"
        "## Endpoints\n"
        "* `GET /health` — estado del servicio.\n"
        "* `POST /ask` — envía una pregunta y recibe la respuesta del agente.\n"
    ),
    contact={
        "name": "BimBam Buy - Soporte",
        "url": "https://chat.nataliadelgado.dev",
    },
    openapi_tags=[
        {
            "name": "health",
            "description": "Operaciones de estado y disponibilidad del servicio.",
        },
        {
            "name": "agente",
            "description": "Operaciones de consulta al agente RAG de soporte.",
        },
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://chat.nataliadelgado.dev",
        "http://localhost:5173",        # dev local del frontend
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


vectorstore = cargar_vectorstore()
agente = construir_agente(vectorstore)


class Pregunta(BaseModel):
    """Cuerpo de la petición para consultar al agente."""

    query: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        title="Pregunta del usuario",
        description=(
            "Pregunta en lenguaje natural que se enviará al agente. "
            "Por ejemplo: *¿Cuál es la política de reembolsos?*"
        ),
        examples=[
            "¿Cuál es la política de reembolsos?",
            "¿Hacen envíos a todo el país?",
            "¿Qué métodos de pago aceptan?",
        ],
    )


class Respuesta(BaseModel):
    """Respuesta devuelta por el agente."""

    respuesta: str = Field(
        ...,
        title="Respuesta generada",
        description="Texto generado por el agente a partir del contexto recuperado.",
        examples=[
            "Podés solicitar un reembolso dentro de los 30 días posteriores a la compra..."
        ],
    )


class HealthResponse(BaseModel):
    """Estado del servicio."""

    status: str = Field(..., examples=["ok"])
    mensaje: str = Field(..., examples=["Alura Agente corriendo"])


@app.get(
    "/",
    response_model=HealthResponse,
    tags=["health"],
    summary="Health check",
    description=(
        "Devuelve `200 OK` si el servicio está activo. "
        "Útil para monitoreo y como verificación rápida del despliegue."
    ),
    operation_id="health_check",
)
def health():
    """Endpoint raíz de verificación de estado."""
    return {"status": "ok", "mensaje": "Alura Agente corriendo"}


@app.post(
    "/ask",
    response_model=Respuesta,
    tags=["agente"],
    summary="Consultar al agente de soporte",
    description=(
        "Envía una pregunta al agente RAG y devuelve la respuesta generada "
        "en base a los documentos internos de BimBam Buy.\n\n"
        "El agente:\n"
        "1. Recupera los fragmentos más relevantes del vectorstore.\n"
        "2. Los inyecta en el prompt del sistema.\n"
        "3. Genera una respuesta concisa con Gemini.\n\n"
        "Si la pregunta no puede responderse con el contexto disponible, "
        "el agente indicará explícitamente que no tiene esa información."
    ),
    operation_id="ask_agent",
    status_code=status.HTTP_200_OK,
    responses={
        200: {
            "description": "Respuesta generada por el agente.",
            "content": {
                "application/json": {
                    "example": {
                        "respuesta": (
                            "Podés solicitar un reembolso dentro de los 30 días "
                            "posteriores a la compra enviando un correo a "
                            "soporte@bimbambuy.com con el número de pedido."
                        )
                    }
                }
            },
        },
        422: {
            "description": "Error de validación: el campo `query` es obligatorio.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {
                                "loc": ["body", "query"],
                                "msg": "Field required",
                                "type": "missing",
                            }
                        ]
                    }
                }
            },
        },
    },
)
def responder(payload: Pregunta):
    """Procesa una pregunta del usuario a través del agente RAG."""
    resultado = agente.invoke({"input": payload.query})
    return {
        "respuesta": resultado["answer"],
    }