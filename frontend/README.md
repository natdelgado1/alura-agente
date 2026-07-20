# BimBam Buy · Chat Frontend

Interfaz de chat para el agente RAG de BimBam Buy. Permite a usuarios finales
hacer preguntas en lenguaje natural sobre envíos, reembolsos, pagos y garantía.

> Este proyecto es **independiente** del backend (carpeta `../backend/` del repo).
> Solo consume el endpoint `POST /ask` del agente.

---

## Stack

- **React 18** + **TypeScript** (strict mode, sin `any`)
- **Vite 5** como bundler / dev server
- **Tailwind CSS 3** con clases utilitarias base (sin compilador custom)
- Sin librerías UI externas — los íconos son SVG inline

## Identidad visual

Inspirada en Platzi, ajustada a BimBam Buy:

- Fondo: azul marino casi negro (`#0a0f1e` → `#060912`)
- Acento: verde vibrante (`#22c55e`) para CTAs y estados activos
- Tipografía: Inter (sans-serif geométrica)
- Mucho contraste, microinteracciones sutiles (fade-up en burbujas, dots
  animados para el estado "escribiendo", hover/active en botones)

## Estructura

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # UI presentacional (MessageBubble, InputBar, …)
│   │   ├── ChatHeader.tsx
│   │   ├── ChatIcons.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── InputBar.tsx
│   │   ├── MessageBubble.tsx
│   │   └── TypingIndicator.tsx
│   ├── hooks/             # Lógica del chat y de red
│   │   ├── useApiRequest.ts
│   │   └── useChat.ts
│   ├── types/             # Tipos compartidos del request/response
│   │   └── chat.ts
│   ├── lib/               # Utilidades (env, etc.)
│   │   └── env.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── index.html
├── nginx.conf
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Separación UI ↔ lógica

| Capa            | Responsabilidad                                                                 |
| --------------- | ------------------------------------------------------------------------------- |
| `components/`   | Solo presentación. Reciben props, no manejan estado global ni hacen fetch.       |
| `hooks/`        | Toda la lógica: `useChat` orquesta mensajes; `useApiRequest` encapsula el HTTP. |
| `types/`        | Contrato del request/response del backend, compartido entre hooks y UI.         |
| `lib/`          | Helpers puros (acceso a variables de entorno).                                   |

## Variables de entorno

Copiá `.env.example` a `.env` y ajustá los valores:

```bash
cp .env.example .env
```

| Variable                 | Descripción                                  | Default                  |
| ------------------------ | -------------------------------------------- | ------------------------ |
| `VITE_API_BASE_URL`      | URL base del backend (sin slash final).      | `http://localhost:8000`  |
| `VITE_REQUEST_TIMEOUT_MS`| Timeout del request en milisegundos.         | `30000`                  |

> ⚠️ Vite solo expone al cliente las variables que arrancan con `VITE_`. No
> pongas secretos acá — todo lo que esté acá será visible en el bundle final.

## Instalación y desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# (editá .env si necesitás apuntar a otro backend)

# 3. Levantar el dev server
npm run dev
```

Por defecto corre en <http://localhost:5173>.

## Build de producción

```bash
npm run build      # genera /dist
npm run preview    # sirve el build localmente para verificar
```

## Deploy con Docker

El proyecto incluye un `Dockerfile` **multi-stage** (Node 20 para build,
Nginx 1.27 alpine para servir estáticos) listo para subir a Dokploy o
cualquier orquestador.

### ⚠️ Variables de entorno en BUILD time

Vite resuelve las variables `VITE_*` **al construir**, no al iniciar el
contenedor. Si cambia la URL del backend hay que rebuildear la imagen (no
alcanza con reiniciar).

Por eso se exponen como `ARG` en el `Dockerfile` y se inyectan con
`--build-arg`:

```bash
# Build local apuntando al backend desplegado
docker build \
  --build-arg VITE_API_BASE_URL=https://agente.nataliadelgado.dev \
  -t bimbambuy-chat-frontend .

# Correr el contenedor
docker run --rm -p 8080:4173 bimbambuy-chat-frontend
# → http://localhost:8080
```

### En Dokploy

1. Crear un nuevo servicio desde este repo (o un sub-path) apuntando al
   `Dockerfile` dentro de `frontend/`.
2. Configurar las **build args** en el panel (no en "env vars" runtime):
   - `VITE_API_BASE_URL` = URL pública del backend
   - `VITE_REQUEST_TIMEOUT_MS` (opcional) = `30000`
3. Exponer el container port **4173** (puerto interno del Nginx).
4. Configurar el dominio/subdominio (`chat.bimbambuy.com` o similar).

### Lo que hace el Dockerfile

| Stage   | Imagen base        | Trabajo                                                                 |
| ------- | ------------------ | ----------------------------------------------------------------------- |
| builder | `node:20-alpine`   | `npm ci` (o `npm install` si no hay lockfile) → `npm run build`        |
| runner  | `nginx:1.27-alpine`| Copia `dist/` + `nginx.conf` con SPA fallback, gzip y headers seguros   |

### Puerto interno del contenedor

El contenedor Nginx escucha en **`4173`** (puerto alto no estándar, default de
`vite preview`). Esto evita conflictos con otros proyectos que puedan estar
corriendo en la misma máquina (que suelen usar `80`, `3000`, `8080`, etc.).

Dokploy se ocupa del mapeo: el tráfico HTTPS público (`443`) → reverse proxy
interno → `4173` del contenedor. Vos solo tenés que poner **`4173`** como
container port al configurar el service.

### Lo que hace `nginx.conf`

- **SPA fallback**: cualquier ruta no encontrada cae a `index.html`
- **Cache agresivo** para `/assets/*` (Vite los hashea, son seguros 1 año)
- **`index.html` siempre `no-cache`** para que los deploys se vean sin hard reload
- **Headers de seguridad**: `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`
- **Gzip** para texto/JS/CSS/SVG
- **Bloqueo** de archivos ocultos (`.env`, `.git`, etc.)

## ⚠️ CORS: no te olvides del backend

Si el frontend y el backend quedan en **dominios distintos**
(lo más probable, ej. `chat.bimbambuy.com` → `agente.nataliadelgado.dev`),
el navegador va a bloquear las requests por CORS. Hay que habilitarlo en
el backend (`src/app.py`):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://chat.bimbambuy.com",
        "http://localhost:5173",  # dev local
    ],
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)
```

Alternativas si querés evitar CORS: proxy reverso de Dokploy para que ambos
compartan un dominio, o un `location /api/` en este nginx que haga
`proxy_pass` al backend (implica que estén en la misma red Docker).

## Contrato con el backend

**Endpoint:** `POST {VITE_API_BASE_URL}/ask`

**Request:**
```json
{ "query": "¿Cuál es la política de reembolsos?" }
```

**Response exitosa (200):**
```json
{ "respuesta": "La política de reembolsos…" }
```

> El backend puede devolver campos extra (`fuentes`, etc.); el frontend los
> ignora silenciosamente porque está tipado contra `AskResponse`.

## Seguridad

- **XSS**: el contenido del backend se renderiza como texto plano con
  `{message.content}`. React escapa automáticamente; nunca usamos
  `dangerouslySetInnerHTML`.
- **Validación de input**: el input se trimea, se valida que no esté vacío
  y se acota a 500 caracteres antes de enviarse (en `useChat` y en `InputBar`).
- **Errores**: el frontend muestra mensajes genéricos
  ("No pudimos conectar con el asistente…") y loguea el detalle técnico a la
  consola para devs, sin exponer status codes ni payloads.
- **Rate-limiting UX**: el botón de envío y el textarea quedan deshabilitados
  mientras hay un request en curso, evitando spam.
- **URL sensible**: la URL del backend vive en `VITE_API_BASE_URL`, nunca
  hardcodeada en componentes.

## Accesibilidad

- Cada burbuja tiene un `aria-label` descriptivo.
- El indicador "escribiendo" usa `role="status"` con `aria-label`.
- El botón de cerrar el banner de error también está etiquetado.
- El input tiene `<label>` sr-only y atajos documentados (`Enter` / `Shift+Enter`).
- `prefers-reduced-motion` puede desactivarse si lo necesitás: las
  animaciones usan duraciones cortas y opacas — no son invasivas.

## Roadmap (ideas para iterar)

- Soporte de markdown seguro en respuestas (`react-markdown` con `rehype-sanitize`).
- Streaming de respuestas con `ReadableStream` para perceived performance.
- Persistencia del historial en `localStorage`.
- Reintento automático del último mensaje ante error transitorio.
