import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  /** Texto markdown a renderizar (viene del backend, ya validado). */
  content: string;
}

/**
 * Renderiza markdown seguro a partir del contenido del backend.
 *
 * Seguridad:
 * - `remark-gfm` agrega soporte para tablas, listas de tareas, tachado, etc.
 * - `rehype-sanitize` neutraliza cualquier HTML malicioso que pudiera colarse
 *   en el markdown (XSS). No usamos `dangerouslySetInnerHTML`.
 *
 * Estilos: aplica las clases `prose prose-invert prose-sm` de
 * `@tailwindcss/typography`, con colores customizados en `tailwind.config.js`
 * para mantener la paleta oscura + acento verde de BimBam Buy.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-body prose prose-invert prose-sm max-w-none leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
