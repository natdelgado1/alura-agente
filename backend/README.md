# Alura Agente — BimBam Buy

Agente de IA que responde preguntas en lenguaje natural sobre los documentos internos de BimBam Buy (políticas de reembolsos, envíos, pagos, garantía y programa de afiliados), usando RAG (Retrieval-Augmented Generation).

## Arquitectura

```
PDFs (data/) -> loader.py (carga + split en chunks)
              -> vectorstore.py (embeddings Gemini + FAISS, con batching)
              -> agent.py (retriever + prompt + LLM -> cadena RAG)
              -> app.py (FastAPI, endpoint /ask)
```

- **Embeddings:** `gemini-embedding-001` (Google)
- **LLM:** `gemini-3.1-flash-lite` (Google)
- **Vectorstore:** FAISS (local, persistido en `data/faiss_index`)
- **Framework del agente:** LangChain + `langchain-classic`
- **API:** FastAPI

## Cómo correrlo localmente

1. Instalá dependencias:
   ```bash
   pip install -r requirements.txt
   ```
2. Copiá `.env.example` a `.env` y poné tu `GOOGLE_API_KEY` (gratis en [aistudio.google.com](https://aistudio.google.com/apikey)).
3. Poné tus PDFs en `data/` (políticas de BimBam Buy: reembolsos, afiliados, envíos, pagos, garantía).
4. Generá el índice vectorial (puede tardar por el batching que evita el rate limit del free tier):
   ```bash
   cd src
   python vectorstore.py
   ```
5. Probá el agente por consola:
   ```bash
   python agent.py
   ```
6. O levantá la API:
   ```bash
   uvicorn app:app --reload
   ```
   ```bash
   curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"query": "¿Cuál es la política de reembolsos?"}'
   ```

## Ejemplos de preguntas

- "¿Cuál es la política de reembolsos?"
- "¿Cómo funciona el programa de afiliados?"
- "¿Cuánto tarda el envío?"
- "¿Qué métodos de pago aceptan?"
- "¿Cómo hago válida la garantía de un producto?"

## Deploy (Render)

1. Generá el índice localmente antes de subir (`cd src && python vectorstore.py`) — el índice de `data/faiss_index/` se sube al repo para que Render no tenga que regenerarlo en cada build.
2. Subí el repo a GitHub.
3. En [render.com](https://render.com): **New → Web Service** → conectá el repo.
4. Build command: `pip install -r requirements.txt`
5. Start command: `cd src && uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Agregá la variable de entorno `GOOGLE_API_KEY` en la sección Environment.
7. Deploy. Render te da una URL pública tipo `https://alura-agente.onrender.com`.

**Demo en línea:** [Pendiente: pegar URL de Render acá]