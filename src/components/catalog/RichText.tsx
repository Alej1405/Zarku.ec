/**
 * Renderiza HTML editorial que viene del ERP (categoría `contenido`,
 * producto `descripcion`). La fuente es nuestro propio CMS, de confianza;
 * aun así limpiamos etiquetas de script/estilo por prudencia.
 */
export function RichText({ html, className }: { html?: string | null; className?: string }) {
  if (!html) return null;
  const clean = html.replace(/<\/?(script|style)[^>]*>/gi, '');
  return (
    <div
      className={`prose-zarku ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
