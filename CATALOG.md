# Catálogo (fase 2) — bosquejo

> Extiende `DESIGN.md`. No lo reemplaza. Todo token, fuente y regla de motion se hereda.
> Modo: **añadir**, no rediseñar. La Home de fase 1 no cambia de aspecto.

## Design read

Catálogo de marca para público de montaña, trail y gimnasio, sobre un sitio dark-first ya construido,
con lenguaje industrial-técnico, apoyado en los tokens y componentes que ya existen.

**Dials:** `DESIGN_VARIANCE: 7` · `MOTION_INTENSITY: 5` · `VISUAL_DENSITY: 5`

La Home corre en ~`8/8/4` ("alto impacto", regla del cliente). El catálogo baja motion y sube densidad
a propósito: la Home es un manifiesto y se lee una vez; el catálogo se escanea. Animar cada celda de
una grilla que el ojo recorre estorba en vez de ayudar. El motion aquí se gasta en tres momentos
concretos (entrada de la cabecera, arrastre del carrusel, cambio de imagen al hover) y en ningún otro.

## Qué NO va a ser (los tells de Shopify)

Estos patrones están vetados porque son exactamente lo que hace que una tienda parezca cualquier tienda:

- Grilla de tarjetas con sombra, esquinas redondeadas y fondo propio, imagen cuadrada, título y precio
  centrados, botón "Añadir al carrito" que aparece al hover.
- Sidebar de filtros a la izquierda con checkboxes.
- Banner de categoría con degradado y "COMPRAR AHORA" centrado encima.
- Badges circulares "Nuevo" / "Oferta" pegados a la esquina de la foto.
- Carrusel con autoplay, flechas circulares y bolitas de paginación.
- Breadcrumb `Inicio / Colecciones / Gorros de lana` en gris a 12px.

## La idea: el catálogo es una carta topográfica

`DESIGN.md` ya reserva Geist Mono para "specs, coordenadas, altitudes" y el repo ya tiene un componente
`TopoLines` (curvas de nivel). Eso da la metáfora sin inventar nada: **las categorías no son colecciones,
son zonas de un mapa**, y los productos se anotan con datos técnicos, no con marketing.

En la práctica esto se traduce en tres reglas:

1. **Las categorías se apilan como estratos**, no como tarjetas. Franjas horizontales a sangre completa.
2. **Los datos van en Geist Mono** (precio, número de productos, materiales). El texto va en Hanken.
3. **El volt solo marca el estado activo y el precio**. Nunca rellena una tarjeta.

---

## Vista 1 · `/catalogo` — categorías padre

```
┌──────────────────────────────────────────────────────────────┐
│  [nav existente, sin cambios visuales]                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ELIGE TU RUTA.                    ← Archivo 800, text-display
│   Accesorios técnicos fabricados                             │
│   en Ecuador. Para el páramo                                 │
│   y para la ciudad.                 ← Hanken, max-w-[42ch]   │
│                                                              │
│   ·· TopoLines en parallax, opacidad 60%, mask radial ··     │
├──────────────────────────────────────────────────────────────┤
│  08 destacados                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌─────         │
│  │        │ │        │ │        │ │        │ │              │
│  │  4:5   │ │  4:5   │ │  4:5   │ │  4:5   │ │      →  se sale
│  │        │ │        │ │        │ │        │ │         del borde
│  └────────┘ └────────┘ └────────┘ └────────┘ └─────         │
│  Cóndor      Puma       Gorro negro  Llama                   │
│  $12.99      $12.99     $14.99       $12.99   ← Geist Mono   │
│  ▬▬▬▬▬▬▬▬▬░░░░░░░░░░░░░░░░░░░░░░░░░░  ← hairline de progreso │
├──────────────────────────────────────────────────────────────┤
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃ BUFFS                            3 zonas · 6 productos  ┃ │
│ ┃ [banner de la categoría al 25%, va a 100% en hover]      ┃ │
│ ┃ Animales   Colores   Texturas                        →   ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃ CINTILLOS                                   Muy pronto  ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃ GORROS DE LANA                            2 productos   ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└──────────────────────────────────────────────────────────────┘
```

### Por qué franjas y no grilla

El requisito es "responsive porque puede haber más o menos categorías". Una grilla de tarjetas obliga a
resolver el hueco: 4 categorías en una grilla de 3 dejan una celda vacía y fea. **Una pila vertical de
franjas escala a cualquier N sin decidir nada**: 2 categorías o 9, siempre se ve deliberada. En móvil no
hay que reflowear nada, ya es una columna.

Además la franja resuelve el problema de las categorías desiguales. Buffs tiene 3 hijos y 6 productos;
Cintillos tiene 0 y 0. En una grilla, dos tarjetas idénticas mienten sobre eso. La franja tiene sitio
para decir la verdad en la línea de datos de la derecha.

**Anatomía de la franja:**
- Alto `clamp(180px, 26vh, 260px)` en desktop, `160px` en móvil. Toda la franja es el enlace.
- Fondo: `banner` de la categoría al 25% de opacidad, con máscara lineal hacia la izquierda para que el
  nombre siempre tenga contraste. Al hover sube a 55% y escala a 1.04. La imagen es la protagonista,
  como pediste, pero nunca a costa de la legibilidad del nombre.
- Hairline volt de 1px en el borde superior, que crece de 0 a 100% del ancho al hover (mismo gesto que
  el subrayado del Navbar actual, para que se sienta del mismo sitio).
- Nombre en Archivo 800, `text-display`. Hijos como texto plano separados por espacio, no como pills.
- Datos a la derecha en Geist Mono: `3 zonas · 6 productos`.
- Sin `border-radius`. Las franjas van a sangre y se tocan entre sí, separadas por `border-line`. Es la
  única excepción al radio del sistema y es deliberada: son estratos, no objetos.

### Carrusel de destacados

- **Sin autoplay.** Un producto que se mueve solo no se puede mirar ni comprar. El movimiento lo pone
  el usuario: arrastre (`drag` de Framer Motion) + `scroll-snap-type: x mandatory` nativo + teclado.
- El track **se sale del contenedor por la derecha** hasta el borde del viewport. Rompe la caja de
  `.container-x` a propósito (VARIANCE 7) y comunica "hay más" sin escribir "hay más".
- Tarjetas 4:5 verticales, sin contenedor: imagen, nombre, precio. Fondo de página, no de tarjeta.
- Progreso: hairline volt que se llena, ligada al scroll del track. Reutiliza la idea de `ScrollProgress`
  que ya existe. Sin bolitas, sin flechas circulares.
- En móvil el mismo track, arrastre nativo, tarjetas al 72% del ancho para que asome la siguiente.

---

## Vista 2 · `/catalogo/:slug` — categoría

Sirve tanto para padre como para hijo: los slugs son únicos en todo el árbol, así que una sola ruta y
un solo componente cubren los dos casos. La diferencia la marca si tiene `children` o no.

```
┌──────────────────────────────────────────────────────────────┐
│  ·· banner a sangre, oscurecido, mask hacia abajo ··         │
│                                                              │
│   BUFFS                             ← Archivo 800            │
│   Imagínate un accesorio tan versátil que se convierte       │
│   en lo que tú quieras.             ← descripcion, 42ch      │
│   6 productos · 3 zonas             ← Geist Mono             │
├──────────────────────────────────────────────────────────────┤
│  [ Animales 6 ]  [ Colores 0 ]  [ Texturas 0 ]   ← si hay hijos
│      ▔▔▔▔▔▔▔▔ activo = hairline volt                         │
├──────────────────────────────────────────────────────────────┤
│  Destacados de la zona                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐                           │
│  │  4:5   │ │  4:5   │ │  4:5   │        ← mismo track       │
│  └────────┘ └────────┘ └────────┘                           │
├──────────────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │ 4:5  │ │ 4:5  │ │ 4:5  │ │ 4:5  │   ← auto-fit, sin card │
│  └──────┘ └──────┘ └──────┘ └──────┘                        │
│  Cóndor    Puma     Llama    Jambato                         │
│  $12.99    $12.99   $12.99   $12.99                          │
├──────────────────────────────────────────────────────────────┤
│  ·· contenido editorial del ERP, prose, max-w-[62ch] ··      │
│  El equilibrio perfecto entre abrigo térmico y estilo urbano │
└──────────────────────────────────────────────────────────────┘
```

**Orden**, según lo que pediste: info principal y destacados arriba, el resto debajo. El campo
`contenido` (HTML del ERP) va al cierre, que es donde funciona: es texto de marca y SEO, no es lo que
la persona vino a buscar. Subirlo empujaría los productos fuera del primer scroll.

**Sub-navegación de hijos, no filtros.** Los hijos van como una fila de chips con scroll horizontal,
cada uno con su `products_count` en mono. Un chip con `0` se ve deshabilitado, no se esconde: dice que
la línea existe y viene en camino. Esto reemplaza al sidebar de filtros, que además aquí no tiene qué
filtrar: la API no expone talla, color ni stock.

**Grilla de productos:** `repeat(auto-fit, minmax(260px, 1fr))`, sin breakpoints, como manda `DESIGN.md`.
Sin tarjeta: imagen 4:5, nombre y precio debajo sobre el fondo de página, agrupados por espacio en vez
de por caja. Al hover, la imagen cambia a la segunda foto de `imagenes` (los gorros tienen 3 y 4), que
es artesanía real de ecommerce y no cuesta nada porque el dato ya viene.

### Estados vacíos: no son hipotéticos

Con los datos de hoy, **Cintillos, Buffs Colores y Buffs Texturas tienen 0 productos**. Si la grilla
vacía se deja al aire, medio catálogo se ve roto. Diseño explícito:

- Categoría sin productos: no se dibuja la grilla. Se muestra su `contenido` editorial completo (que sí
  existe y está bien escrito) y una fila de enlaces a las categorías hermanas que sí tienen stock.
- Categoría padre con `products_count: 0` pero con hijos que sí tienen (el caso de Buffs): la grilla
  **agrega los productos de todos los hijos**. Ojo, esto es obligatorio: la API filtra por categoría
  exacta, `?category=buffs` devuelve 0. Sin agregación, la página de Buffs sale vacía teniendo 6
  productos dentro.
- Carga: skeletons con la forma final (bloque 4:5 + dos líneas), nunca un spinner.

---

## Vista 3 · `/producto/:slug`

No la pediste explícitamente, pero `products/{slug}` y `products/{id}/related` solo tienen sentido aquí,
y es donde vive el CTA de compra. La incluyo en el bosquejo para que la apruebes o la dejemos fuera.

- Galería vertical de `imagenes` a la izquierda, ficha sticky a la derecha (asimétrico, `1.4fr 1fr`).
- Precio en Geist Mono, grande. `descripcion` es HTML del ERP, va con prose.
- `caracteristicas[]` (el gorro negro tiene 4): como lista de specs en dos columnas, agrupada. **No**
  como tabla de 10 filas con hairline en cada una.
- CTA único: **"Pedir por WhatsApp"**, con el nombre del producto precargado en el mensaje.
- `related` al cierre, en el mismo track del carrusel.

---

## Sistema, bloqueado

| Regla | Valor |
|---|---|
| Tema | Dark, en todo. Ninguna sección invierte. Igual que la Home. |
| Acento | Volt, y solo volt. Estado activo, precio, hairlines. Nunca fondo de tarjeta. |
| Radio | Botones `rounded-full`, chips `rounded-full`, imágenes `rounded-xl`, franjas `0`. |
| Tipos | Archivo 700-800 display · Hanken 400-500 cuerpo · Geist Mono **solo** datos |
| Iconos | `lucide-react`, ya es dependencia. `strokeWidth` 2. |
| Motion | `framer-motion` (ya instalado). Ease `--ease-out-expo`. Sin bounce. |
| Reduced motion | El bloque global de `index.css` ya cubre CSS. Los reveals y el drag se degradan aparte. |
| Imágenes | `https://erp.mashaec.net/storage/` + `path`. Helper `mediaUrl()` en `lib/`. |

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Home actual, intacta |
| `/catalogo` | Categorías padre + destacados |
| `/catalogo/:slug` | Categoría (padre o hijo) |
| `/producto/:slug` | Ficha |

## Deuda que esto abre

- El Navbar navega con anclas. Desde `/catalogo`, `href="#nosotros"` no lleva a ningún lado: pasan a
  `/#nosotros`. Es el único cambio funcional obligatorio sobre código existente.
- `createResourceSlice` no toma argumentos, así que no sirve para "categoría por slug". Va una fábrica
  paramétrica hermana, sin tocar la actual.
- La barra inferior móvil ya tiene 5 tabs. Un sexto la aprieta por debajo del área táctil cómoda.
- La API no expone talla, color ni stock. Sin eso no hay filtros ni carrito reales, solo catálogo.
</content>
