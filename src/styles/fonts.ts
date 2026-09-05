/**
 * Carga de fuentes optimizada: declaramos @font-face SOLO con los subsets
 * `latin` + `latin-ext` (cubren el español). Así el bundle no incluye los
 * subsets cirílico/vietnamita que fontsource trae por defecto.
 * Los woff2 se importan por Vite (hash + fingerprint) vía `?url`.
 */
import archivoLatin from '@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2?url';
import archivoLatinExt from '@fontsource-variable/archivo/files/archivo-latin-ext-wght-normal.woff2?url';
import hankenLatin from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url';
import hankenLatinExt from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-ext-wght-normal.woff2?url';
import geist400 from '@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2?url';
import geist500 from '@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2?url';

const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const face = (
  family: string,
  url: string,
  range: string,
  weight: string,
) => `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:${weight};src:url(${url}) format('woff2');unicode-range:${range}}`;

const css = [
  face('Archivo Variable', archivoLatin, LATIN, '100 900'),
  face('Archivo Variable', archivoLatinExt, LATIN_EXT, '100 900'),
  face('Hanken Grotesk Variable', hankenLatin, LATIN, '100 900'),
  face('Hanken Grotesk Variable', hankenLatinExt, LATIN_EXT, '100 900'),
  face('Geist Mono', geist400, LATIN, '400'),
  face('Geist Mono', geist500, LATIN, '500'),
].join('');

const style = document.createElement('style');
style.setAttribute('data-fonts', 'zarku');
style.textContent = css;
document.head.appendChild(style);
