import { useCallback, useMemo, useRef, useState } from 'react';
import { useApiRequest } from './useApiRequest';
import type { ChatError, ChatMessage, ChatStatus } from '../types/chat';

/** Largo máximo permitido para una pregunta del usuario. Evita payloads abusivos. */
const MAX_QUERY_LENGTH = 500;

/**
 * Valida el input del usuario antes de enviarlo al backend.
 * Devuelve un mensaje de error específico o `null` si está OK.
 */
function validateQuery(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (trimmed.length === 0) return 'Escribí una pregunta antes de enviar.';
  if (trimmed.length > MAX_QUERY_LENGTH) {
    return `La pregunta no puede superar los ${MAX_QUERY_LENGTH} caracteres.`;
  }
  return null;
}

interface UseChatResult {
  messages: ChatMessage[];
  status: ChatStatus;
  error: ChatError | null;
  isAwaitingResponse: boolean;
  sendMessage: (rawInput: string) => Promise<void>;
  dismissError: () => void;
  resetConversation: () => void;
}

/**
 * Hook orquestador del chat: mantiene historial, valida input y delega el fetch a `useApiRequest`.
 * Separar esto del componente permite testearlo sin renderizar UI.
 */
export function useChat(): UseChatResult {
  const { ask, error: apiError, clearError } = useApiRequest();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [localError, setLocalError] = useState<ChatError | null>(null);

  // `counterRef` para generar IDs únicos sin librería externa.
  const idCounterRef = useRef(0);
  const nextMessageId = (): string => {
    idCounterRef.current += 1;
    return `msg_${Date.now()}_${idCounterRef.current}`;
  };

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateLastAssistantMessage = useCallback((updater: (current: ChatMessage) => ChatMessage) => {
    setMessages((prev) => {
      const lastAssistantIndex = [...prev].reverse().findIndex((m) => m.role === 'assistant');
      if (lastAssistantIndex === -1) return prev;
      const realIndex = prev.length - 1 - lastAssistantIndex;
      const next = prev.slice();
      next[realIndex] = updater(next[realIndex]);
      return next;
    });
  }, []);

  const dismissError = useCallback(() => {
    setLocalError(null);
    clearError();
  }, [clearError]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setIsAwaitingResponse(false);
    setLocalError(null);
    clearError();
  }, [clearError]);

  const sendMessage = useCallback(
    async (rawInput: string) => {
      const validationError = validateQuery(rawInput);
      if (validationError) {
        setLocalError({ message: validationError });
        return;
      }

      // Si ya hay una request en curso, la descartamos visualmente (rate-limit UX).
      if (isAwaitingResponse) return;

      setLocalError(null);
      clearError();
      setIsAwaitingResponse(true);

      const userMessage: ChatMessage = {
        id: nextMessageId(),
        role: 'user',
        content: rawInput.trim(),
        status: 'sent',
        createdAt: Date.now(),
      };
      appendMessage(userMessage);

      // Marcador optimista de "asistente escribiendo" para mostrar animación.
      const placeholderId = nextMessageId();
      appendMessage({
        id: placeholderId,
        role: 'assistant',
        content: '',
        status: 'sending',
        createdAt: Date.now(),
      });

      try {
        const { respuesta } = await ask(rawInput.trim());
        updateLastAssistantMessage((current) => ({
          ...current,
          content: respuesta,
          status: 'sent',
        }));
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'Algo salió mal. Probá de nuevo.';
        setLocalError({ message });

        updateLastAssistantMessage((current) => ({
          ...current,
          status: 'error',
          content: '⚠ No pude responder esa pregunta.',
        }));
      } finally {
        setIsAwaitingResponse(false);
      }
    },
    [ask, appendMessage, clearError, isAwaitingResponse, updateLastAssistantMessage],
  );

  const status: ChatStatus = useMemo(() => {
    if (isAwaitingResponse) return 'loading';
    if (localError || apiError) return 'error';
    return 'idle';
  }, [apiError, isAwaitingResponse, localError]);

  const error: ChatError | null = localError ?? (apiError ? { message: apiError } : null);

  return {
    messages,
    status,
    error,
    isAwaitingResponse,
    sendMessage,
    dismissError,
    resetConversation,
  };
}
