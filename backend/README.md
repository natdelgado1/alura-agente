# Alura Agente — BimBam Buy

Agente de IA que responde preguntas en lenguaje natural sobre los documentos internos de BimBam Buy (políticas de reembolsos, envíos, pagos y garantía), usando RAG (Retrieval-Augmented Generation).

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
- **Deploy:** Docker + Dokploy (servidor propio)

## Cómo correrlo localmente

1. Instalá dependencias:
```bash
   pip install -r requirements.txt
```
2. Copiá `.env.example` a `.env` y poné tu `GOOGLE_API_KEY` (gratis en [aistudio.google.com](https://aistudio.google.com/apikey)).
3. Poné tus PDFs en `data/` (políticas de BimBam Buy: reembolsos, envíos, pagos, garantía).
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

## Ejemplos de preguntas y respuestas

**P: ¿Cuál es la política de reembolsos?**

> La política de reembolsos y devoluciones de BimBam Buy está diseñada para ofrecer una experiencia clara y ágil en compras realizadas a través de nuestros canales oficiales en LATAM. Aplica a compras en tienda online o atención al cliente, cubriendo retracto, producto incorrecto, daño en tránsito, falla de fábrica o faltante parcial. No aplica a compras por canales no oficiales, productos personalizados, empaques alterados con restricción sanitaria/seguridad, o casos fuera de plazo o vinculados a fraude.

**P: ¿Cuánto tarda el envío?**

> El tiempo de entrega depende de la zona de cobertura: preparación (validación de pago 0-1 día hábil, alistamiento 1-2 días, despacho 1 día adicional) más entrega estimada de 2-5 días hábiles en zonas urbanas principales, 4-8 en zonas secundarias, y 6-12 en zonas de cobertura extendida. Puede variar según tamaño/peso del producto, inventario o factores externos.

**P: ¿Qué métodos de pago aceptan?**

> BimBam Buy acepta tarjeta de crédito, tarjeta de débito, transferencia bancaria, pago en efectivo en puntos habilitados, billeteras digitales según país, y cuotas o financiamiento cuando aplique. La disponibilidad varía según el país y se confirma en el checkout.

**P: ¿Cómo hago válida la garantía de un producto?**

> Hay que reportar la falla en tiempo razonable (48hs si es daño de transporte), proporcionar evidencia fotográfica o en video, conservar el comprobante de compra y no manipular el producto antes de la revisión. BimBam Buy evalúa si es una falla cubierta (fabricación, materiales o ensamblaje) y define reparación, cambio o reembolso. Si no hay falla, el caso se tramita como devolución, no como garantía.

## Deploy

Deployado con **Docker + Dokploy** en servidor propio.

**Demo en línea:** [https://agente.nataliadelgado.dev](https://agente.nataliadelgado.dev)

Documentación interactiva (Swagger): [https://agente.nataliadelgado.dev/docs](https://agente.nataliadelgado.dev/docs)

```bash
curl -X POST https://agente.nataliadelgado.dev/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "¿Cuál es la política de reembolsos?"}'
```

![Deploy funcionando](ruta/a/tu/captura.png)