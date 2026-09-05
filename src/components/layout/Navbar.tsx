import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mountain, ShoppingBag, Layers, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setScrolled } from '@/store/slices/uiSlice';

/** Enlace de sección de la Home (ancla) o ruta propia. */
type NavItem =
  | { kind: 'section'; id: string; label: string }
  | { kind: 'route'; to: string; match: string; label: string };

const LINKS: NavItem[] = [
  { kind: 'section', id: 'nosotros', label: 'Nosotros' },
  { kind: 'section', id: 'servicios', label: 'Tecnología' },
  { kind: 'route', to: '/noticias', match: '/noticias', label: 'Noticias' },
  { kind: 'section', id: 'faq', label: 'FAQ' },
  { kind: 'section', id: 'contacto', label: 'Contacto' },
];

type MobileTab =
  | { kind: 'section'; id: string; label: string; icon: LucideIcon }
  | { kind: 'route'; to: string; match: string; label: string; icon: LucideIcon };

const MOBILE_TABS: MobileTab[] = [
  { kind: 'section', id: 'inicio', label: 'Inicio', icon: Home },
  { kind: 'section', id: 'nosotros', label: 'Nosotros', icon: Mountain },
  { kind: 'route', to: '/catalogo', match: '/catalogo', label: 'Catálogo', icon: ShoppingBag },
  { kind: 'section', id: 'servicios', label: 'Tecnología', icon: Layers },
  { kind: 'section', id: 'contacto', label: 'Contacto', icon: MessageCircle },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const scrolled = useAppSelector((s) => s.ui.scrolled);
  const active = useAppSelector((s) => s.ui.activeSection);

  const onHome = pathname === '/';
  // Fuera de la Home el navbar es sólido desde el inicio (no hay hero detrás).
  const solid = scrolled || !onHome;

  useEffect(() => {
    const onScroll = () => dispatch(setScrolled(window.scrollY > 24));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  /** Href de una sección: ancla si estamos en Home, ruta con hash si no. */
  const sectionHref = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const isRouteActive = (match: string) => pathname.startsWith(match);

  return (
    <>
      {/* ---------- Desktop: header superior ---------- */}
      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-nav)] hidden transition-colors duration-500 md:block ${
          solid
            ? 'border-b border-line/60 bg-bg/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="container-x flex h-[68px] items-center justify-between md:h-[92px]">
          <Link to="/" className="group flex items-center gap-2.5" aria-label="Zarku — inicio">
            <img
              src="/brand/isotipo.png"
              alt=""
              className="h-9 w-9 rounded-md transition-transform duration-500 group-hover:rotate-[-8deg]"
            />
            <span className="font-display text-xl font-extrabold uppercase leading-none tracking-tight text-ink">
              Zarku
            </span>
          </Link>

          <ul className="flex items-center gap-6 lg:gap-9">
            {LINKS.map((l) => {
              const isActive =
                l.kind === 'section'
                  ? onHome && active === l.id
                  : isRouteActive(l.match);
              const underline = (
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-volt transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              );
              const cls = `group relative text-sm font-medium transition-colors ${
                isActive ? 'text-ink' : 'text-muted hover:text-ink'
              }`;
              return (
                <li key={l.label}>
                  {l.kind === 'section' ? (
                    <a href={sectionHref(l.id)} aria-current={isActive ? 'true' : undefined} className={cls}>
                      {l.label}
                      {underline}
                    </a>
                  ) : (
                    <Link to={l.to} aria-current={isActive ? 'page' : undefined} className={cls}>
                      {l.label}
                      {underline}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            to="/catalogo"
            aria-current={isRouteActive('/catalogo') || isRouteActive('/producto') ? 'page' : undefined}
            className="rounded-full bg-volt px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-volt-bright"
          >
            Catálogo
          </Link>
        </nav>
      </header>

      {/* ---------- Mobile: barra inferior flotante ---------- */}
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-[var(--z-nav)] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="mx-3 mb-3 flex items-stretch justify-between gap-1 rounded-2xl border border-line/70 bg-bg/85 p-1.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          {MOBILE_TABS.map((t) => {
            const isActive =
              t.kind === 'section' ? onHome && active === t.id : isRouteActive(t.match);
            const Icon = t.icon;
            const cls = `flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
              isActive ? 'bg-volt/10 text-volt' : 'text-muted'
            }`;
            const inner = (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[0.62rem] font-medium leading-none">{t.label}</span>
              </>
            );
            return (
              <li key={t.label} className="flex-1">
                {t.kind === 'section' ? (
                  <a href={sectionHref(t.id)} aria-current={isActive ? 'true' : undefined} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link to={t.to} aria-current={isActive ? 'page' : undefined} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
