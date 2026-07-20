import { useEffect, useRef, useState } from 'react';
import { SendIcon } from './ChatIcons';

/** Largo máximo sincronizado con `useChat` (se valida también ahí). */
const MAX_QUERY_LENGTH = 500;

interface InputBarProps {
  onSubmit: (text: string) => void;
  isDisabled: boolean;
}

export function InputBar({ onSubmit, isDisabled }: InputBarProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow del textarea hasta un tope razonable.
  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = 'auto';
    node.style.height = `${Math.min(node.scrollHeight, 160)}px`;
  }, [value]);

  const trimmedLength = value.trim().length;
  const canSend = trimmedLength > 0 && trimmedLength <= MAX_QUERY_LENGTH && !isDisabled;

  const handleSubmit = () => {
    if (!canSend) return;
    onSubmit(value);
    setValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter envía; Shift+Enter inserta salto de línea.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="border-t border-ink-700 bg-ink-900/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur sm:px-6 sm:pb-5"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-ink-700 bg-ink-800 p-2 shadow-bubble transition focus-within:border-accent-500/60 focus-within:shadow-glow">
        <label htmlFor="chat-input" className="sr-only">
          Escribí tu pregunta
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, MAX_QUERY_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Preguntame sobre envíos, pagos, reembolsos o garantía…"
          rows={1}
          disabled={isDisabled}
          className="block w-full resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-ink-400 focus:outline-none disabled:opacity-60 sm:text-base"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Enviar mensaje"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white transition hover:bg-accent-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-ink-400"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-3xl items-center justify-between px-1 text-[11px] text-ink-400">
        <span>
          <kbd className="rounded border border-ink-700 bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-ink-300">
            Enter
          </kbd>{' '}
          para enviar ·{' '}
          <kbd className="rounded border border-ink-700 bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-ink-300">
            Shift + Enter
          </kbd>{' '}
          nueva línea
        </span>
        <span className={trimmedLength > MAX_QUERY_LENGTH - 50 ? 'text-accent-400' : ''}>
          {trimmedLength}/{MAX_QUERY_LENGTH}
        </span>
      </div>
    </form>
  );
}
