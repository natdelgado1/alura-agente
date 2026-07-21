# BimBam Buy · Chat de Soporte con IA

Asistente virtual de soporte para **BimBam Buy**, un e-commerce ficticio de LATAM.
Responde preguntas en lenguaje natural sobre políticas internas (reembolsos, envíos,
pagos, garantía, afiliados) usando un pipeline **RAG** sobre documentos propios.

> 🧪 **Proyecto experimental / educativo**: este monorepo se construyó para poner
> en práctica un stack moderno de **IA aplicada** (LangChain + FastAPI) combinado
> con un frontend tipado (React + Vite + Tailwind). No es un producto de
> producción: los datos son ficticios y la API key gratuita de Gemini tiene
> límites diarios.

---

## ✨ Qué hace

- Carga PDFs de políticas internas, los *chunkifica*, los embebe con
  `gemini-embedding-001` y persiste un índice FAISS local.
- Expone un endpoint `POST /ask` que recibe una pregunta y devuelve una
  respuesta generada por `gemini-3.1-flash-lite`, condicionada por el contexto
  recuperado.
- UI de chat con sugerencias, estados de carga, manejo de errores, markdown
  seguro y vista responsive.

## 🔗 Demo

| Servicio | URL |
| --- | --- |
| 💬 Frontend (chat) | <https://chat.nataliadelgado.dev/> |
| 🤖 Backend (Swagger) | <https://agente.nataliadelgado.dev/docs> |

## 🧱 Stack

- **Backend:** Python · FastAPI · LangChain (`langchain-classic`) · FAISS · Google Gemini
- **Frontend:** React 18 · TypeScript (strict) · Vite 5 · Tailwind CSS 3 · Nginx
- **Deploy:** Docker multi-stage · Dokploy (servidor propio)

## 📸 Screenshots

| Frontend | Backend |
| :---: | :---: |
| ![Chat vacío](./frontend/screenshots/01-chat-empty-state.png) | ![Swagger UI](./backend/screenshots/01-swagger-ui.png) |
| ![Conversación](./frontend/screenshots/02-chat-conversation.png) | ![Endpoint /ask](./backend/screenshots/03-ask-endpoint.png) |

Capturas adicionales: [`frontend/screenshots/`](./frontend/screenshots/) y
[`backend/screenshots/`](./backend/screenshots/).

## 🗂 Estructura del monorepo

```
.
├── backend/                  # 🤖 Agente RAG (Python + FastAPI)
│   ├── Dockerfile
│   ├── README.md             # arquitectura, API contract, decisiones técnicas
│   ├── data/                 # PDFs + índice FAISS
│   ├── requirements.txt
│   └── src/
│       ├── agent.py          # cadena RAG
│       ├── app.py            # FastAPI + endpoints
│       ├── config.py
│       ├── loader.py         # carga + chunking de PDFs
│       └── vectorstore.py    # embeddings + FAISS
└── frontend/                 # 💬 Chat UI (React + Vite)
    ├── Dockerfile
    ├── nginx.conf
    ├── README.md             # arquitectura de componentes, hooks, styling
    └── src/
        ├── components/       # UI presentacional
        ├── hooks/            # useChat, useApiRequest
        ├── types/            # contrato con el backend
        └── lib/              # env helpers
```

Cada proyecto es **independiente**: vive en su propia carpeta, tiene su propio
`Dockerfile`, su propio `README.md` (con detalle de arquitectura) y se deploya
por separado.

## 🚀 Desarrollo local

Necesitás **dos terminales**:

```bash
# === Terminal 1 · Backend (puerto 8000) ===
cd backend
pip install -r requirements.txt
cp .env.example .env             # completar GOOGLE_API_KEY
python src/vectorstore.py        # genera el índice FAISS (solo la primera vez)
uvicorn src.app:app --reload --port 8000

# === Terminal 2 · Frontend (puerto 5173) ===
cd frontend
npm install
cp .env.example .env             # apuntar VITE_API_BASE_URL=http://localhost:8000
npm run dev                      # → http://localhost:5173
```

> 🔑 La `GOOGLE_API_KEY` se obtiene gratis en
> [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
> Sin PDFs propios, el agente responde con el set de ejemplo que vive en
> `backend/data/`.

## 📡 Despliegue (Dokploy)

Cada servicio se construye desde el `Dockerfile` de su carpeta:

| Servicio | Dockerfile (build context) | Container port | URL pública |
| --- | --- | --- | --- |
| Backend  | `backend/Dockerfile`  | `8347` | `https://agente.nataliadelgado.dev`  |
| Frontend | `frontend/Dockerfile` | `4173` | `https://chat.nataliadelgado.dev/`   |

> ⚠️ El frontend resuelve las `VITE_*` **al construir**, por lo que en Dokploy
> hay que pasar la URL del backend como `--build-arg`, no como env var de
> runtime. Detalle en [`frontend/README.md`](./frontend/README.md#deploy-con-docker).

## 📚 Documentación por proyecto

- **[`backend/README.md`](./backend/README.md)** — arquitectura del RAG,
  componentes (`loader`, `vectorstore`, `agent`, `app`), contrato de la API,
  variables de entorno, ejemplos de respuestas.
- **[`frontend/README.md`](./frontend/README.md)** — arquitectura de
  componentes, separación UI ↔ hooks ↔ tipos, sistema de diseño, contrato con
  el backend, accesibilidad, seguridad.

## 🔌 CORS

Si el frontend y el backend quedan en dominios distintos (lo normal en este
proyecto), hay que habilitar CORS en el backend. Ver
[`frontend/README.md` → CORS](./frontend/README.md#-cors-no-te-olvides-del-backend).

## 🛣 Roadmap (ideas para iterar)

- Streaming de respuestas con `ReadableStream` (perceived performance).
- Persistencia del historial en `localStorage` (ya hay fallback de UX).
- Reintento automático del último mensaje ante error transitorio.
- Soporte de markdown seguro en respuestas (parcialmente integrado con
  `MarkdownContent`).
- Re-rank del retriever (por ejemplo `bge-reranker`) antes de pasar el contexto
  al LLM.
- Métricas (latencia, número de tokens, feedback 👍 / 👎).