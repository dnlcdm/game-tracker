/// <reference types="vite-client" />
declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_RAWG_API_URL: string;
  readonly VITE_RAWG_API_KEY: string;
  readonly VITE_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
