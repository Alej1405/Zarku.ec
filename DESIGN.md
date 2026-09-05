# Design

## Theme

Dark-first, drenched carbon. La escena: un montañista revisa la web desde el móvil al amanecer, luz baja, expectativa antes de una ruta. Eso fuerza fondo carbón profundo (no negro puro plano) con el verde volt de la marca como única fuente de energía —como la marca del isotipo sobre negro. Estrategia de color: **Committed/Drenched** — el carbón ES la superficie, el volt corta como señal. Sin neutros cálidos, sin cream, sin degradados de relleno.

## Color

Todo en OKLCH. Definidos como tokens de tema (Tailwind v4 `@theme`).

| Rol | Token | Valor | Uso |
|---|---|---|---|
| Fondo base | `--color-bg` | `oklch(0.16 0.006 150)` | Carbón profundo, superficie dominante |
| Superficie | `--color-surface` | `oklch(0.205 0.008 150)` | Paneles, cards cuando aplican |
| Superficie 2 | `--color-surface-2` | `oklch(0.255 0.009 150)` | Hover / elevación |
| Borde | `--color-line` | `oklch(0.30 0.008 150)` | Divisores, hairlines 1px |
| Tinta | `--color-ink` | `oklch(0.97 0.006 120)` | Texto principal, títulos |
| Tinta suave | `--color-muted` | `oklch(0.70 0.015 150)` | Texto secundario (≥4.5:1 sobre bg) |
| Acento | `--color-volt` | `oklch(0.84 0.17 122)` | Verde volt de marca (#B5D334) |
| Acento brillo | `--color-volt-bright` | `oklch(0.90 0.19 122)` | Glow, hover del acento |

Reglas: el volt es señal, no relleno — CTAs, líneas activas, datos clave, el isotipo. Nunca texto largo en volt. Texto sobre volt = carbón (`--color-bg`), nunca blanco. Contraste verificado en navegador.

## Typography

Voz física: **rudo · técnico · de altura**. Reflex rechazados (Inter, Space Grotesk, etc.) descartados.

- **Display / titulares: `Archivo` (variable)** — grotesca industrial, robusta, con pesos altos y ancho expandido para impacto tipo señalética de montaña. Titulares en pesos 700–900, `letter-spacing` -0.03/-0.04em, `text-wrap: balance`.
- **Cuerpo / UI: `Hanken Grotesk` (variable)** — grotesca humanista, cálida y muy legible. Pareja por eje de contraste (humanista vs. industrial), no dos sans gemelas. Cuerpo 400–500, line-height 1.6 (dark → +0.05).
- **Datos técnicos: `Geist Mono`** — SOLO para specs, coordenadas, altitudes, números tabulares (ej. `0°13′S 78°30′O`, `UPF 50+`). Uso mínimo y deliberado: refuerza "técnico" auténtico, no como disfraz.

Escala modular fluida `clamp()`, ratio ≥1.25. Hero display máx ~6rem. Sin all-caps en cuerpo; caps solo en labels cortos.

## Layout

- Composiciones asimétricas, se rompe la grilla para énfasis. Espaciado fluido `clamp()` con ritmo (separaciones generosas entre secciones, agrupaciones tensas dentro).
- Un fold = una idea dominante. Scroll largo, pacing deliberado.
- Grids sin breakpoints: `repeat(auto-fit, minmax(280px, 1fr))` cuando cards son la respuesta correcta (servicios). Evitar grids de tarjetas idénticas como default.
- Escala z-index semántica (dropdown → sticky → modal → toast → tooltip). Sin 9999.

## Motion — Alto impacto (regla del cliente)

Librerías: **Framer Motion** + **Lenis** (smooth scroll). Ease-out exponencial (quart/expo), sin bounce/elastic.
- **Page-load orquestado** en el hero: entrada escalonada de titular (kinetic type por líneas/palabras), isotipo, y CTA.
- **Marquee cinético** con la voz de marca / diferenciadores.
- **Scroll reveals** por sección, cada uno ajustado a lo que revela (no el mismo fade uniforme).
- **Parallax sutil** en isotipo/números.
- **Hover magnético** en CTAs; contadores animados en números (500+, 5+).
- Materiales premium permitidos: blur, glow del volt, clip-path para reveals.
- `prefers-reduced-motion`: crossfade/instantáneo en todo. Reveals siempre realzan un default ya visible (nunca ocultan contenido tras una clase).

## Components / Sections (fase 1 — home)
Navbar (sticky, transparente→sólida al scroll, isotipo) · Hero (drench carbón, kinetic type, isotipo, CTA) · Nosotros (historia Kichwa + imagen + números animados) · Servicios (6 diferenciadores técnicos, no card-grid genérico) · FAQ (acordeón accesible) · Footer/Contacto (datos + redes reales, dirección, wsp).

## Assets
`/logos`: `isotipo.png` (figura volt sobre negro), `logo_letras_negras.png` (logotipo negro), `logo_blanco.png` (logotipo blanco → default sobre carbón). Copiar a `public/brand/`.
