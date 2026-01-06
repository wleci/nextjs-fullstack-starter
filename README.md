# nextjs-fullstack-starter

Next.js 16 starter with React 19, TypeScript, and Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run build:prod  # build + prepare standalone
npm run start       # run production
npm run start:prod  # run standalone
npm run lint        # lint code
```

## Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Aceternity UI
- t3-env (type-safe env vars)
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

## Environment Variables

Type-safe environment variables with t3-env.

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your values in `.env`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Add new variables in `src/lib/env/env.ts`:

```typescript
export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

4. Import with `import { env } from "@/lib/env"` - validated on startup.

## Deploy

Push to GitHub and deploy on Vercel, Netlify, or any Node.js host.
