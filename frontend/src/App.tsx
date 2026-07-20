import { useChat } from './hooks/useChat';
import { ChatWindow } from './components/ChatWindow';

/**
 * Componente raíz: mantiene el hook de chat y delega la UI a `ChatWindow`.
 * Mantener el shell tan delgado como sea posible facilita pruebas de integración.
 */
export default function App() {
  const {
    messages,
    error,
    isAwaitingResponse,
    sendMessage,
    dismissError,
    resetConversation,
  } = useChat();

  return (
    <div className="h-full w-full bg-gradient-to-b from-ink-900 via-ink-900 to-ink-950">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
        <ChatWindow
          messages={messages}
          error={error}
          isAwaitingResponse={isAwaitingResponse}
          onSendMessage={sendMessage}
          onDismissError={dismissError}
          onResetConversation={resetConversation}
        />
      </div>
    </div>
  );
}
