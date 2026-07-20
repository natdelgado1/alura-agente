/**
 * Tres puntos animados que indican que el asistente está pensando.
 * Accesibilidad: aria-label describe el estado a lectores de pantalla.
 */
export function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="El asistente está escribiendo"
      className="flex items-center gap-1.5"
    >
      <span
        className="h-2 w-2 rounded-full bg-ink-400 animate-typing-dot"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-ink-400 animate-typing-dot"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-ink-400 animate-typing-dot"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
