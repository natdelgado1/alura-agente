import { BrandLogo } from './ChatIcons';

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
  isDisabled: boolean;
}

const SUGGESTED_QUESTIONS = [
  '¿Cuál es la política de reembolsos?',
  '¿Cuánto tarda un envío?',
  '¿Qué métodos de pago aceptan?',
  '¿Cómo hago válida la garantía?',
];

export function EmptyState({ onSuggestionClick, isDisabled }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center animate-fade-up">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-800 ring-1 ring-ink-700 shadow-bubble">
        <BrandLogo className="h-8 w-8" />
      </div>

      <h2 className="text-xl font-semibold text-white sm:text-2xl">
        Hola, soy el asistente de BimBam Buy
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-300 sm:text-base">
        Preguntame sobre envíos, reembolsos, pagos o garantía. Estoy para ayudarte.
      </p>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSuggestionClick(question)}
            disabled={isDisabled}
            className="group rounded-xl border border-ink-700 bg-ink-800/60 px-4 py-3 text-left text-sm text-ink-300 transition hover:border-accent-500/60 hover:bg-ink-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-ink-700 disabled:hover:bg-ink-800/60 disabled:hover:text-ink-300"
          >
            <span className="block">{question}</span>
            <span className="mt-1 block text-xs text-ink-400 transition group-hover:text-accent-400">
              Probar esta pregunta →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
