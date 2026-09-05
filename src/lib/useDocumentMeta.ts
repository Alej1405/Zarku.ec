import { useEffect } from 'react';

export interface DocumentMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

type Selector = { attr: 'name' | 'property'; key: string };

const TARGETS: Record<keyof Omit<DocumentMeta, 'title'>, Selector[]> = {
  description: [{ attr: 'name', key: 'description' }],
  image: [
    { attr: 'property', key: 'og:image' },
    { attr: 'name', key: 'twitter:image' },
  ],
  url: [{ attr: 'property', key: 'og:url' }],
  type: [{ attr: 'property', key: 'og:type' }],
};

const TITLE_TARGETS: Selector[] = [
  { attr: 'property', key: 'og:title' },
  { attr: 'name', key: 'twitter:title' },
];
const DESC_MIRROR: Selector[] = [
  { attr: 'property', key: 'og:description' },
  { attr: 'name', key: 'twitter:description' },
];

function upsert({ attr, key }: Selector, value: string): string | null {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const prev = el?.getAttribute('content') ?? null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
  return prev;
}

/**
 * Ajusta `<title>` y las metaetiquetas OG/Twitter para la página actual y
 * restaura los valores previos al desmontar. En un SPA sin SSR esto sirve al
 * navegador y a los scrapers que ejecutan JS; para el resto de crawlers
 * sociales hace falta prerender/SSR que hornee estas etiquetas en el HTML.
 */
export function useDocumentMeta(meta: DocumentMeta) {
  const { title, description, image, url, type } = meta;

  useEffect(() => {
    const prevTitle = document.title;
    const restores: Array<() => void> = [];

    const apply = (sel: Selector, value?: string) => {
      if (value == null) return;
      const prev = upsert(sel, value);
      restores.push(() => {
        const el = document.head.querySelector<HTMLMetaElement>(`meta[${sel.attr}="${sel.key}"]`);
        if (el && prev != null) el.setAttribute('content', prev);
      });
    };

    if (title) {
      document.title = title;
      TITLE_TARGETS.forEach((s) => apply(s, title));
    }
    if (description) {
      TARGETS.description.forEach((s) => apply(s, description));
      DESC_MIRROR.forEach((s) => apply(s, description));
    }
    if (image) TARGETS.image.forEach((s) => apply(s, image));
    if (url) TARGETS.url.forEach((s) => apply(s, url));
    if (type) TARGETS.type.forEach((s) => apply(s, type));

    return () => {
      document.title = prevTitle;
      restores.forEach((fn) => fn());
    };
  }, [title, description, image, url, type]);
}
