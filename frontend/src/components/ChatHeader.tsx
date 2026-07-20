import { BrandLogo, RefreshIcon } from './ChatIcons';

interface ChatHeaderProps {
  onReset: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ onReset, hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-700 bg-ink-900/85 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800 ring-1 ring-ink-700">
          <BrandLogo className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white sm:text-base">BimBam Buy · Asistente</h1>
          <div className="flex items-center gap-1.5 text-xs text-ink-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span>
            <span>En línea · responde en segundos</span>
          </div>
        </div>
      </div>

      {hasMessages && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-800 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-600 hover:bg-ink-700 hover:text-white"
          aria-label="Reiniciar conversación"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nueva conversación</span>
        </button>
      )}
    </header>
  );
}
