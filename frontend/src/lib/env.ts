/**
 * Acceso centralizado a variables de entorno de Vite.
 * Vite expone solo las variables que arrancan con `VITE_` al cliente.
 */

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Lee una variable `VITE_*` y devuelve `undefined` si está vacía o solo tiene espacios.
 * Tener esto en un único punto permite manejar faltantes en un solo lugar.
 */
function readEnv(name: string): string | undefined {
  const value = import.meta.env[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function readNumber(name: string, fallback: number): number {
  const raw = readEnv(name);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const apiBaseUrl: string =
  readEnv('VITE_API_BASE_URL') ?? 'http://localhost:8000';

export const requestTimeoutMs: number = readNumber(
  'VITE_REQUEST_TIMEOUT_MS',
  DEFAULT_TIMEOUT_MS,
);
