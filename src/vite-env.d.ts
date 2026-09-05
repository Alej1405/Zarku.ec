/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CMS_BASE_URL: string;
  readonly VITE_CMS_TOKEN: string;
  /** API pública de ecommerce del ERP (sin token). */
  readonly VITE_ECOMMERCE_BASE_URL: string;
  /** Base de archivos del ERP para armar URLs de imagen. */
  readonly VITE_ERP_STORAGE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
