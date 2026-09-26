/// <reference types="vite-client" />
declare module "*.css";
declare module "*.svg";

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_MIDDLEWARE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
