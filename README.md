# Zarku · Web

Sitio de marca de **Zarku** (accesorios técnicos para aventura y deporte extremo, Ecuador).
_"El espíritu de tu pasión."_

Stack: **Vite + React 18 + TypeScript**, **Tailwind CSS v4**, **Redux Toolkit** (múltiples slices),
**Zod** (validación de las respuestas del ERP), **Framer Motion** + **Lenis** (motion alto impacto),
**three.js + @react-three/fiber + drei** (terreno WebGL del hero, lazy-loaded).
Contexto de diseño en [`PRODUCT.md`](./PRODUCT.md) y [`DESIGN.md`](./DESIGN.md).

## Requisitos

- Node ≥ 20
- Un archivo `.env` (ver `.env.example`) con el token del ERP:

```
VITE_CMS_BASE_URL=https://erp.mashaec.net/api/cms/zarku-ecuador
VITE_CMS_TOKEN=tu-token
```

> El token queda embebido en el bundle (API de CMS de solo lectura). Antes de producción se
> recomienda migrar a un proxy que lo oculte.

## Scripts

```bash
npm install
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # build de producción a /dist
npm run preview   # previsualiza el build
```

## Estructura

```
src/
  lib/        cliente API (fetch + token) y utilidades de formato
  schemas/    esquemas Zod por recurso del CMS (tipos inferidos con z.infer)
  store/      configureStore + createResourceSlice (fábrica) + slices por dominio
  hooks/      hooks tipados de Redux, smooth scroll (Lenis), scrollspy
  components/ motion (Reveal, MagneticButton, Marquee, Counter, Parallax, ScrollProgress, TopoLines)
              · three (HeroTerrain, TerrainScene) · layout (Navbar, Footer, LoadingScreen, SectionError)
  sections/   Hero · About · Manifesto · Services · Faq
```

### Flujo de datos

`App` despacha los thunks al montar → cada thunk llama al ERP → **Zod valida** la respuesta dentro de
`fetchResource` → si es válida entra al slice; si falla, el slice guarda `error` y la UI usa fallbacks.
Cada slice expone `status` (`idle/loading/succeeded/failed`).

## Fases

- **Fase 1 (hecha):** Home — Navbar, Hero, Nosotros, Servicios/Tecnología, FAQ, Footer/Contacto.
  Conectado a `hero`, `about`, `services`, `faq`, `contact`.
- **Fase 2 (siguiente):** Catálogo y productos (`products`) + carrito/filtros (`productsSlice`,
  `cartSlice`, `filtersSlice`). Router ya preparado.
- Pendientes del ERP (aún vacíos): `team`, `clients`, `testimonials`, `posts`.
