# nextjs-fullstack-starter

Production-ready Next.js 16 starter with React 19, TypeScript, and modern tooling.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Aceternity UI
- Framer Motion
- next-themes
- t3-env
- i18n (en, pl)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run build:prod  # standalone build
npm run start       # production server
npm run start:prod  # standalone server
npm run lint        # lint code
```

## Features

- **i18n** - Multi-language support with cookie-based detection
- **SEO** - Sitemap, robots.txt, metadata optimization
- **PWA** - Web app manifest ready
- **Dark Mode** - Theme switcher with system detection
- **Type-safe** - Full TypeScript with t3-env validation
- **Standalone** - Optimized Docker-ready builds

## Environment

Copy `.env.example` to `.env`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl
```

## Project Structure

```
src/
├── app/
│   ├── [lang]/          # Localized routes
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── env/             # Environment config
│   ├── i18n/            # Internationalization
│   └── theme/           # Theme provider
└── middleware/          # Proxy middleware
```

## i18n

Add translations in `src/lib/i18n/dictionaries/`:

```typescript
// Client
import { useTranslation } from "@/lib/i18n";
const { t } = useTranslation();

// Server
import { getT } from "@/lib/i18n/server";
const t = await getT(lang);
```

## Deploy

```bash
npm run build:prod
npm run start:prod
```

Compatible with Vercel, Netlify, Docker, and any Node.js host.

## License

MIT
