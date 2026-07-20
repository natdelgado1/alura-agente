/**
 * Tipos compartidos entre la UI, los hooks y el cliente HTTP.
 * Mantenerlos sincronizados con el contrato del backend (`POST /ask`).
 */

/** Quién escribió un mensaje del chat. */
export type MessageRole = 'user' | 'assistant';

/** Estado de ciclo de vida de un mensaje local. */
export type MessageStatus = 'sending' | 'sent' | 'error';

/** Mensaje renderizado en la UI. */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: number;
}

/** Cuerpo del request hacia `POST /ask`. */
export interface AskRequest {
  query: string;
}

/** Cuerpo de la respuesta exitosa de `POST /ask`. */
export interface AskResponse {
  respuesta: string;
  fuentes?: unknown;
}

/** Estado expuesto por `useChat` para los componentes. */
export type ChatStatus = 'idle' | 'loading' | 'error';

/** Error funcional expuesto por `useChat`. No incluye detalles internos. */
export interface ChatError {
  message: string;
}
