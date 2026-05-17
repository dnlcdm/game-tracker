# CLAUDE.md

## Stack
- React 19 + TypeScript + Vite 7
- Tailwind CSS v4
- Supabase (auth)
- React Query + React Router 7
- MUI (icons + Joy UI)
- Framer Motion (animacoes)

## Scripts
- `npm run dev` — dev server
- `npm run build` — type-check + build
- `npm run preview` — preview build

## Rules
- **Nunca** faca merge para `master` — o usuario decide quando mergear
- **Sempre** pecar autorizacao antes de acao destrutiva (git reset --hard, force push, etc)
- Usar `@/` alias **NÃO** configurado — usar imports relativos
- **Nunca** usar `localStorage.clear()` — usar `localStorage.removeItem()` seletivo
- Commits devem ser pequenos e descritivos

## Architecture
- Features em `src/features/<nome-da-feature>/`
  - hooks: `hooks/use<Feature>.ts`
  - utils: `utils/<util-name>.ts`
  - types: `types/<feature>.types.ts` ou `types.ts`
- Componentes reutilizaveis em `src/components/<componente>/`
- Hooks globais em `src/hooks/`
- Servicos (Supabase, auth) em `src/services/`
- API client em `src/api/`
- Rotas em `src/router/`

## Conventions
- Hooks: camelCase com prefixo `use` — `useFetchBacklogGame.ts`
- Components: PascalCase, nome descritivo — `game-grid-card.tsx`
- Utils: kebab-case — `game-status.utils.ts`
- Types: PascalCase com prefixo `I` ou `T` — `IUser`, `GameStats`
- Interfaces: PascalCase — `interface GameStatsProps { ... }`
- Classes Tailwind para cores: fundo `#030712`, sidebar `#111827`, bordas `gray-800`
- Font custom: `BHHBogle` (font-face definido em `index.css`)
