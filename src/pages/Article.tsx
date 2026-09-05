import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CatalogShell } from '@/components/catalog/CatalogShell';
import { RichText } from '@/components/catalog/RichText';
import { Reveal } from '@/components/motion/Reveal';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { usePost } from '@/lib/usePost';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';

/** Texto plano de un HTML, recortado, para la descripción social. */
function toDescription(html?: string | null, fallback = ''): string {
  if (!html) return fallback;
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return fallback;
  return text.length > 200 ? `${text.slice(0, 197)}…` : text;
}

export default function Article() {
  const { slug = '' } = useParams();
  const { status, post, error } = usePost(slug);

  const img = mediaUrl(post?.imagen);
  const date = formatDate(post?.publicado_en);

  // Meta por noticia: se comparte como nota, con su imagen y descripción.
  useDocumentMeta({
    title: post ? `${post.titulo} — Zarku` : 'Noticia — Zarku',
    description: post ? toDescription(post.contenido, post.titulo) : undefined,
    image: img,
    url: `https://zarku.ec/noticias/${slug}`,
    type: 'article',
  });

  return (
    <CatalogShell>
      {status === 'loading' ? (
        <ArticleLoading />
      ) : status === 'failed' || !post ? (
        <NotFoundArticle message={error} />
      ) : (
        <article className="container-x max-w-[70ch] py-10 sm:py-16">
          <Link
            to="/noticias"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-volt"
          >
            <ArrowLeft size={16} /> Noticias
          </Link>

          <Reveal>
            {date && (
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">{date}</p>
            )}
            <h1 className="text-display font-extrabold uppercase leading-[0.98] tracking-tight">
              {post.titulo}
            </h1>
          </Reveal>

          {img && (
            <Reveal delay={0.05}>
              <img
                src={img}
                alt={post.titulo}
                className="mt-9 aspect-[16/9] w-full rounded-2xl border border-line object-cover"
              />
            </Reveal>
          )}

          <div className="mt-10">
            <RichText html={post.contenido} />
          </div>

          <div className="mt-14 border-t border-line pt-10">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
            >
              Ver el catálogo Zarku
            </Link>
          </div>
        </article>
      )}
    </CatalogShell>
  );
}

function ArticleLoading() {
  return (
    <div className="container-x max-w-[70ch] py-10 sm:py-16">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
      <div className="mt-8 h-10 w-3/4 animate-pulse rounded bg-surface" />
      <div className="mt-9 aspect-[16/9] w-full animate-pulse rounded-2xl border border-line bg-surface" />
      <div className="mt-10 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}

function NotFoundArticle({ message }: { message?: string | null }) {
  return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-volt">Sin nota</p>
      <h1 className="mt-4 text-display font-extrabold uppercase">Noticia no encontrada</h1>
      <p className="mt-4 max-w-md text-muted">
        {message || 'Esta nota no existe o fue movida.'}
      </p>
      <Link
        to="/noticias"
        className="mt-8 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
      >
        Ver todas las noticias
      </Link>
    </div>
  );
}
