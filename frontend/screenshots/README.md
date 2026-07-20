# Screenshots · Frontend

Capturas de pantalla de la UI del chat en producción, usadas para documentar
el `README.md` principal del frontend.

---

## Lista de capturas esperadas

| #  | Archivo                            | Qué muestra                                                                 |
| -- | ---------------------------------- | --------------------------------------------------------------------------- |
| 01 | `01-chat-empty-state.png`          | Pantalla inicial con el saludo del bot y las 4 preguntas sugeridas          |
| 02 | `02-chat-conversation.png`         | Una pregunta del usuario + respuesta del asistente (burbujas estilizadas)   |
| 03 | `03-mobile-view.png`               | El chat en mobile (≈ 390 × 844 px, viewport iPhone 14)                      |
| 04 | `04-error-state.png`               | El banner de error visible (ej. backend caído o timeout)                     |
| 05 | `05-header-and-input.png`          | Detalle del header (logo + dot "en línea") y la barra de input con contador |

---

## Cómo capturar

### Desktop (1280 × 800)

1. Abrí el dominio del frontend (ej. `https://chat.bimbambuy.com`).
2. DevTools → **Toggle device toolbar** (`Ctrl + Shift + M` / `Cmd + Shift + M`).
3. Arriba a la izquierda, en el dropdown de dimensiones, elegí **Responsive** con `1280 × 800`.
4. Captura con una de estas opciones:
   - **Chrome DevTools**: menú `…` arriba a la derecha → **Capture screenshot**.
   - **Windows**: `Win + Shift + S` → arrastrar y guardar.
   - **macOS**: `Cmd + Shift + 4` → arrastrar y guardar.

### Mobile (390 × 844, iPhone 14)

1. DevTools → **Toggle device toolbar** (`Ctrl + Shift + M`).
2. En el dropdown de devices elegí **iPhone 14 Pro**.
3. Captura con **Capture screenshot** de DevTools.

### Estado de error

Para forzar el banner de error en producción:

- Opción rápida: pausar el backend en Dokploy unos segundos y enviar una pregunta → aparece el mensaje "No pudimos conectar con el asistente…".
- Captura **antes** de cerrar el banner para que se vea el rojo.

---

## Convención de nombres

- Numeración con prefijo `NN-` (01, 02, …) para mantener el orden lógico.
- Nombres en **kebab-case** descriptivo.
- Extensión `.png` (sin pérdida, mejor para capturas con texto).

## Formato y tamaño

- **Resolución nativa del viewport** (no hace falta retina).
- Tamaño objetivo por captura: **< 500 KB**.
- Si una captura queda pesada, optimizala con [Squoosh](https://squoosh.app).
- Dimensiones máximas sugeridas: 1920 × 1080 (desktop), 430 × 950 (mobile).

---

## Una vez que tengas las capturas

Confirmá que se vean bien en GitHub entrando al repo → carpeta `frontend/screenshots/` → click en cada imagen. Si alguna aparece rota, revisá que el nombre del archivo coincida **exactamente** con el referenciado en el `README.md` del frontend (case-sensitive).
