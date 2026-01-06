# nextjs-fullstack-starter

Next.js 16 starter with React 19, TypeScript, and Tailwind CSS.

## Setup

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
bun run dev      # dev server
bun run build    # production build
bun run start    # run production
bun run lint     # lint code
```

## Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint

## Project Structure

```
src/app/
├── page.tsx      # home page
├── layout.tsx    # root layout
└── globals.css   # global styles
```

## Path Aliases

Use `@/` for imports:

```typescript
import { Button } from "@/components/Button";
```

## Deploy

Push to GitHub and deploy on Vercel, Netlify, or any Node.js host.
