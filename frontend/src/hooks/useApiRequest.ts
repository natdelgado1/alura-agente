import { useCallback, useRef, useState } from 'react';
import { apiBaseUrl, requestTimeoutMs } from '../lib/env';
import type { AskRequest, AskResponse } from '../types/chat';

/** Mensaje genérico que la UI puede mostrar sin filtrar detalles internos. */
const GENERIC_ERROR_MESSAGE =
  'No pudimos conectar con el asistente. Intentá de nuevo en unos segundos.';

interface UseApiRequestState {
  isLoading: boolean;
  error: string | null;
}

interface UseApiRequestResult extends UseApiRequestState {
  /** Envía un `query` al endpoint `/ask` y devuelve la respuesta parseada. */
  ask: (query: string, signal?: AbortSignal) => Promise<AskResponse>;
  /** Limpia el último error. */
  clearError: () => void;
}

/**
 * Hook de bajo nivel: encapsula el POST al backend del agente RAG.
 * Se encarga de timeout, parseo, validación de shape y mensajes de error neutros.
 *
 * Nota: no guarda historial de conversación; eso es responsabilidad de `useChat`.
 */
export function useApiRequest(): UseApiRequestResult {
  const [state, setState] = useState<UseApiRequestState>({
    isLoading: false,
    error: null,
  });

  // `useRef` para evitar recrear el AbortController en cada render y poder
  // cancelar requests obsoletos si fuera necesario en el futuro.
  const controllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setState((prev) => (prev.error === null ? prev : { ...prev, error: null }));
  }, []);

  const ask = useCallback(async (query: string, signal?: AbortSignal) => {
    setState({ isLoading: true, error: null });

    // Combina el timeout interno con cualquier signal externo.
    const internalController = new AbortController();
    controllerRef.current = internalController;
    const timeoutId = setTimeout(() => internalController.abort(), requestTimeoutMs);

    if (signal) {
      if (signal.aborted) internalController.abort();
      else signal.addEventListener('abort', () => internalController.abort(), { once: true });
    }

    const requestBody: AskRequest = { query };

    try {
      const response = await fetch(`${apiBaseUrl}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: internalController.signal,
      });

      if (!response.ok) {
        // Mensaje genérico: no exponer status codes ni payloads internos al usuario.
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as Partial<AskResponse>;
      if (typeof data.respuesta !== 'string') {
        throw new Error('Respuesta con formato inesperado');
      }

      setState({ isLoading: false, error: null });
      return { respuesta: data.respuesta, fuentes: data.fuentes };
    } catch (caughtError) {
      const isAbort =
        caughtError instanceof DOMException && caughtError.name === 'AbortError';
      const message = isAbort ? 'La consulta tardó demasiado. Probá de nuevo.' : GENERIC_ERROR_MESSAGE;

      setState({ isLoading: false, error: message });

      if (isAbort) {
        // No loguear aborts esperados como errores.
        throw new ApiRequestError(message, 'timeout');
      }
      // Mantener el detalle en consola para devs sin exponerlo al usuario.
      // eslint-disable-next-line no-console
      console.error('[useApiRequest] Falló la consulta al agente:', caughtError);
      throw new ApiRequestError(message, 'network');
    } finally {
      clearTimeout(timeoutId);
      controllerRef.current = null;
    }
  }, []);

  return { isLoading: state.isLoading, error: state.error, ask, clearError };
}

/** Error tipado para que el caller pueda distinguir la causa si lo necesita. */
export class ApiRequestError extends Error {
  readonly cause: 'network' | 'timeout';

  constructor(message: string, cause: 'network' | 'timeout') {
    super(message);
    this.name = 'ApiRequestError';
    this.cause = cause;
  }
}
