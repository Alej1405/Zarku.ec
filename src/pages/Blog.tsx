import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts } from '@/store/slices/postsSlice';
import { CatalogShell } from '@/components/catalog/CatalogShell';
import { SectionError } from '@/components/layout/SectionError';
import { Reveal } from '@/components/motion/Reveal';
import { TopoLines } from '@/components/motion/TopoLines';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import type { Post } from '@/schemas/cms';

function ArticleRow({ post }: { post: Post }) {
  const img = mediaUrl(post.imagen);
  const date = formatDate(post.publicado_en);
  return (
    <Link
      to={`/noticias/${post.slug}`}
      className="group grid gap-5 border-b border-line py-8 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8 sm:py-10"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line/60 bg-surface">
        {img ? (
          <img
            src={img}
            alt={post.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-line">
            <Newspaper size={36} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        {date && (
          <span className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {date}
          </span>
        )}
        <h2 className="text-title font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-volt">
          {post.titulo}
        </h2>
        {post.extracto && (
          <p className="mt-3 max-w-[62ch] text-muted">{post.extracto}</p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-volt">
          Leer nota
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

function BlogSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="grid gap-5 border-b border-line py-8 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8 sm:py-10"
          aria-hidden
        >
          <div className="aspect-[16/10] animate-pulse rounded-xl border border-line/60 bg-surface" />
          <div className="flex flex-col justify-center gap-3">
            <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-surface" />
            <div className="h-4 w-full max-w-lg animate-pulse rounded bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Blog() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((s) => s.posts);

  useDocumentMeta({
    title: 'Noticias — Zarku',
    description:
      'Historias, novedades y notas técnicas de Zarku: producto, montaña y la marca ecuatoriana de accesorios de aventura.',
    type: 'website',
    url: 'https://zarku.ec/noticias',
  });

  useEffect(() => {
    if (posts.status === 'idle') void dispatch(fetchPosts());
  }, [dispatch, posts.status]);

  const loading = posts.status === 'idle' || posts.status === 'loading';
  const list = posts.data ?? [];

  return (
    <CatalogShell>
      {/* Cabecera */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 hidden w-[560px] -translate-y-1/2 opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] md:block"
        >
          <TopoLines className="h-[560px] w-[560px]" rings={10} />
        </div>
        <div className="container-x relative py-16 sm:py-24">
          <Reveal>
            <p className="label-mono mb-5">Bitácora</p>
            <h1 className="max-w-[16ch] text-hero font-extrabold uppercase leading-[0.92] tracking-tight">
              Noticias
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg text-muted">
              Novedades de producto, historias de montaña y notas técnicas desde Ecuador.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-10 sm:py-14">
        {loading ? (
          <BlogSkeleton />
        ) : posts.status === 'failed' ? (
          <SectionError message={posts.error} onRetry={() => void dispatch(fetchPosts())} />
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface/40 px-6 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-volt">Pronto</p>
            <h2 className="mt-4 text-title font-bold">Aún no hay notas publicadas</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Estamos preparando las primeras historias. Vuelve pronto o explora el catálogo.
            </p>
            <Link
              to="/catalogo"
              className="mt-7 inline-block rounded-full bg-volt px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div>
            {list.map((post) => (
              <ArticleRow key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </CatalogShell>
  );
}
