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
- shadcn/ui
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
