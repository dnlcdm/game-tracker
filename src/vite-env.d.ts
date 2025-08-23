/// <reference types="vite-client" />
declare module "*.css";

interface ImportMetaEnv {
  readonly RAWG_API_URL: string;
  readonly RAWG_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
