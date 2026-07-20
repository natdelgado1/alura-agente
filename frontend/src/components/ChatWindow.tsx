import { useEffect, useRef } from 'react';
import type { ChatError, ChatMessage } from '../types/chat';
import { ChatHeader } from './ChatHeader';
import { EmptyState } from './EmptyState';
import { ErrorBanner } from './ErrorBanner';
import { InputBar } from './InputBar';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: ChatMessage[];
  error: ChatError | null;
  isAwaitingResponse: boolean;
  onSendMessage: (text: string) => void;
  onDismissError: () => void;
  onResetConversation: () => void;
}

/**
 * Composición principal del chat. Toda la lógica vive en `useChat`;
 * este componente solo decide cómo renderizar y maneja el auto-scroll.
 */
export function ChatWindow({
  messages,
  error,
  isAwaitingResponse,
  onSendMessage,
  onDismissError,
  onResetConversation,
}: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje cuando cambia la conversación o llega typing.
  useEffect(() => {
    const node = lastMessageRef.current;
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isAwaitingResponse]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-ink-900">
      <ChatHeader onReset={onResetConversation} hasMessages={hasMessages} />

      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-4 sm:py-6">
          {hasMessages ? (
            messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : undefined}
              >
                <MessageBubble message={message} />
              </div>
            ))
          ) : (
            <EmptyState onSuggestionClick={onSendMessage} isDisabled={isAwaitingResponse} />
          )}

          {/* Ancla invisible para forzar scroll al fondo cuando solo hay placeholder vacío. */}
          {hasMessages && <div ref={lastMessageRef} />}
        </div>
      </main>

      {error && <ErrorBanner message={error.message} onDismiss={onDismissError} />}

      <InputBar onSubmit={onSendMessage} isDisabled={isAwaitingResponse} />
    </div>
  );
}
