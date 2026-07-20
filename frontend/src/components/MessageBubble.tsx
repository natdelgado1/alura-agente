import type { ChatMessage } from '../types/chat';
import { BotAvatarIcon, UserAvatarIcon } from './ChatIcons';
import { MarkdownContent } from './MarkdownContent';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Burbuja individual del chat.
 *
 * - Mensajes del **asistente** se renderizan como Markdown (lo que devuelve el
 *   backend puede tener `**negrita**`, listas, títulos, etc.). El sanitizador
 *   evita XSS si el backend devolviera HTML malicioso.
 * - Mensajes del **usuario** se renderizan como texto plano (lo que escribe
 *   nunca debería tener markdown ni HTML).
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isTyping = message.status === 'sending' && message.content.length === 0;

  return (
    <article
      className={`flex w-full animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}
      aria-label={isUser ? 'Tu mensaje' : 'Respuesta del asistente'}
    >
      <div
        className={`flex max-w-[85%] items-end gap-2 sm:max-w-[75%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ring-1 ${
            isUser
              ? 'bg-ink-700 text-ink-300 ring-ink-600'
              : 'bg-accent-600 text-white ring-accent-500/60'
          }`}
          aria-hidden="true"
        >
          {isUser ? <UserAvatarIcon className="h-4 w-4" /> : <BotAvatarIcon className="h-4 w-4" />}
        </div>

        <div
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-bubble ${
            isUser
              ? 'rounded-br-md bg-accent-600 text-white'
              : 'rounded-bl-md bg-ink-800 text-ink-200 ring-1 ring-ink-700'
          }`}
        >
          {isTyping ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownContent content={message.content} />
          )}
        </div>
      </div>
    </article>
  );
}
