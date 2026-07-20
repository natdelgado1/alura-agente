import type { ChatMessage } from '../types/chat';
import { BotAvatarIcon, UserAvatarIcon } from './ChatIcons';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Burbuja individual del chat.
 * Renderiza el contenido como texto plano (React escapa automáticamente) — nunca
 * `dangerouslySetInnerHTML` — para prevenir XSS si el backend devolviera HTML.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <article
      className={`flex w-full animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}
      aria-label={isUser ? 'Tu mensaje' : 'Respuesta del asistente'}
    >
      <div className={`flex max-w-[85%] items-end gap-2 sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
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
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-bubble ${
            isUser
              ? 'rounded-br-md bg-accent-600 text-white'
              : 'rounded-bl-md bg-ink-800 text-ink-200 ring-1 ring-ink-700'
          }`}
        >
          {message.status === 'sending' && message.content.length === 0 ? (
            <TypingIndicator />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>
      </div>
    </article>
  );
}
