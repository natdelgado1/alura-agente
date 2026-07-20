# Screenshots · Backend

Capturas de pantalla del agente RAG y su API en producción, usadas para
documentar el `README.md` principal del backend.

---

## Lista de capturas esperadas

| #  | Archivo                              | Qué muestra                                                                |
| -- | ------------------------------------ | -------------------------------------------------------------------------- |
| 01 | `01-swagger-ui.png`                  | Documentación interactiva de FastAPI en `/docs`                             |
| 02 | `02-health-check.png`                | Response del endpoint `/` (`{"status":"ok",...}`) en el navegador o curl   |
| 03 | `03-ask-endpoint.png`                | Ejemplo de request/response exitoso en `/ask` (formateado con `jq`)        |
| 04 | `04-dokploy-container-running.png`   | Logs del contenedor en Dokploy con "Application startup complete"          |
| 05 | `05-dokploy-deploy-success.png`      | Pantalla de deploy exitoso en Dokploy                                      |

---

## Cómo capturar

### Swagger UI

1. Abrí `https://agente.nataliadelgado.dev/docs` en el navegador.
2. Esperá a que cargue la documentación.
3. Captura toda la página (idealmente con la sección "Schemas" colapsada para que entre en pantalla).

### Request / Response con curl

```bash
# Respuesta formateada con jq (necesitás tener jq instalado)
curl -X POST https://agente.nataliadelgado.dev/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"¿Cuál es la política de reembolsos?"}' \
  | jq
```

Pegá el output en un editor de código con tema oscuro, agregá un header
comentado arriba (ej. `# curl -X POST .../ask`) y capturá la pantalla.

Si no tenés `jq`, el comando crudo también sirve, pero queda menos prolijo:

```bash
curl -X POST https://agente.nataliadelgado.dev/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"¿Cuál es la política de reembolsos?"}'
```

### Health check

Simplemente abrí `https://agente.nataliadelgado.dev/` en el navegador y capturá el JSON formateado por el navegador.

### Logs del contenedor en Dokploy

1. Abrí Dokploy → service del backend.
2. Pestaña **Logs** (no "Build Logs" — son distintos).
3. Esperá a ver el mensaje `Application startup complete`.
4. Captura la ventana de logs.

### Deploy exitoso

En la pestaña **Deployments** del service, capturá la fila del último deploy
con estado ✅ verde.

---

## Convención de nombres

- Numeración con prefijo `NN-` (01, 02, …) para mantener el orden lógico.
- Nombres en **kebab-case** descriptivo.
- Extensión `.png`.

## Formato y tamaño

- Tamaño objetivo por captura: **< 500 KB**.
- Optimizá con [Squoosh](https://squoosh.app) si hace falta.

---

## Una vez que tengas las capturas

Confirmá que se vean bien en GitHub entrando al repo → carpeta `backend/screenshots/` → click en cada imagen. Si alguna aparece rota, revisá que el nombre del archivo coincida **exactamente** con el referenciado en el `README.md` del backend (case-sensitive).
