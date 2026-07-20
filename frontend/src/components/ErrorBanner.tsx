import { AlertIcon, CloseIcon } from './ChatIcons';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="mx-3 mb-2 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 animate-fade-up sm:mx-6"
    >
      <AlertIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
      <p className="flex-1 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar mensaje de error"
        className="rounded-md p-1 text-red-300 transition hover:bg-red-500/20 hover:text-red-100"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
