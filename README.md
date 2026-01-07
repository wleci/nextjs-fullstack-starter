<div align="center">

# 🚀 Next.js Fullstack Starter

**Production-ready starter with authentication, email, dashboard, and everything you need to ship fast.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)


</div>

---

## ✨ Features

### 🔐 Authentication System

- **Complete Auth Flow** - Login, Register, 2FA, Email Verification
- **Password Recovery** - Forgot password & reset flow
- **Account Management** - Ban system, logout handling
- **Validation** - Zod schemas for all forms

### 📧 Email System

- **Nodemailer Integration** - SMTP email sending
- **React Email Templates** - Beautiful, responsive emails
- **Pre-built Templates** - Welcome, verification, 2FA, password reset
- **Type-safe** - Full TypeScript support

### 📊 Dashboard

- **Modern Sidebar** - Collapsible navigation with icons
- **Breadcrumbs** - Location tracking
- **User Menu** - Avatar dropdown with settings
- **Responsive** - Mobile-friendly design

### 🌍 Internationalization

- **Multi-language** - English & Polish (easily extensible)
- **Client & Server** - i18n on both sides
- **Cookie-based** - Persistent language selection
- **SEO-friendly** - Localized routes & metadata

### 🎨 UI & Design

- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS 4** - Modern styling
- **Dark Mode** - Theme switcher with system detection
- **Framer Motion** - Smooth animations
- **Responsive** - Mobile-first design

### 🗄️ Database

- **Drizzle ORM** - Type-safe database queries
- **SQLite** - Lightweight, embedded database
- **Migrations** - Version-controlled schema
- **Studio** - Visual database browser

### 🔒 Security & Compliance

- **Security Headers** - CSP, HSTS, X-Frame-Options, etc.
- **Cookie Consent** - GDPR-ready banner
- **Legal Pages** - Privacy, Terms, Cookies policies
- **Input Validation** - Zod schemas everywhere

### 🚀 Performance & SEO

- **App Router** - Next.js 16 with React 19
- **Standalone Build** - Optimized for production
- **Sitemap & Robots** - Auto-generated
- **PWA Ready** - Web app manifest
- **ISR Support** - Incremental Static Regeneration

---

## 🏗️ Tech Stack

| Category       | Technologies                             |
| -------------- | ---------------------------------------- |
| **Framework**  | Next.js 16, React 19, TypeScript 5       |
| **Styling**    | Tailwind CSS 4, shadcn/ui, Framer Motion |
| **Database**   | Drizzle ORM, SQLite                      |
| **Email**      | Nodemailer, React Email                  |
| **Validation** | Zod, t3-env                              |
| **i18n**       | Custom implementation with cookies       |
| **Auth**       | Custom (ready for integration)           |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/wleci/nextjs-fullstack-starter.git
cd nextjs-fullstack-starter

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run lint             # Lint code

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio

# Production
npm run build            # Build for production
npm run build:prod       # Standalone build (Docker-ready)
npm run start            # Start production server
npm run start:prod       # Start standalone server
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl

# Database
DATABASE_URL=sqlite.db

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

### Email Setup

Configure your SMTP provider settings:

**Popular SMTP Providers:**

- **Resend** - [resend.com](https://resend.com) - Modern email API
- **SendGrid** - [sendgrid.com](https://sendgrid.com) - Reliable email delivery
- **Mailgun** - [mailgun.com](https://mailgun.com) - Developer-friendly
- **Amazon SES** - [aws.amazon.com/ses](https://aws.amazon.com/ses) - Cost-effective
- **Postmark** - [postmarkapp.com](https://postmarkapp.com) - Transactional emails

**Example for Resend:**

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_your_api_key_here
SMTP_FROM=noreply@yourdomain.com
```

**Example for SendGrid:**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@yourdomain.com
```

---

## 📁 Project Structure

```
nextjs-fullstack-starter/
├── src/
│   ├── app/
│   │   ├── [lang]/              # Localized routes
│   │   │   ├── auth/            # Auth pages (login, register, etc.)
│   │   │   ├── dashboard/       # Dashboard pages
│   │   │   ├── privacy/         # Legal pages
│   │   │   └── ...
│   │   ├── api/                 # API routes (if needed)
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── layout/              # Layout components (Navbar, Footer, etc.)
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── cookies/             # Cookie consent logic
│   │   ├── database/            # Drizzle ORM setup
│   │   ├── email/               # Email client & templates
│   │   ├── env/                 # Environment validation (t3-env)
│   │   ├── i18n/                # Internationalization
│   │   └── theme/               # Theme provider
│   ├── middleware/              # Middleware logic
│   ├── validation/              # Zod schemas
│   │   └── auth/                # Auth validation schemas
│   └── proxy.ts                 # Next.js 16 proxy
├── drizzle/                     # Database migrations
├── public/                      # Static assets
├── .env.example                 # Environment template
├── drizzle.config.ts            # Drizzle configuration
└── package.json
```

---

## 📚 Documentation

### i18n Usage

**Client Components:**

```tsx
"use client";
import { useTranslation } from "@/lib/i18n";

export function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("common.welcome")}</h1>;
}
```

**Server Components:**

```tsx
import { getT } from "@/lib/i18n/server";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  return <h1>{t("common.welcome")}</h1>;
}
```

**Add Translations:**
Edit `src/lib/i18n/dictionaries/en.json` and `pl.json`

### Email Templates

**Send Email:**

```tsx
import { sendEmail } from "@/lib/email/client";
import { VerifyEmailTemplate } from "@/lib/email/templates/verify-email";

await sendEmail({
  to: "user@example.com",
  subject: "Verify your email",
  react: VerifyEmailTemplate({
    userName: "John",
    verificationUrl: "https://...",
  }),
});
```

**Available Templates:**

- `VerifyEmailTemplate` - Email verification
- `ResetPasswordTemplate` - Password reset
- `TwoFactorTemplate` - 2FA code
- `WelcomeTemplate` - Welcome email

### Database

**Define Schema:**

```typescript
// src/lib/database/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
});
```

**Query Database:**

```typescript
import { db } from "@/lib/database/client";
import { users } from "@/lib/database/schema";

const allUsers = await db.select().from(users);
```

**Push Schema:**

```bash
npm run db:push
```

**Open Studio:**

```bash
npm run db:studio
```

### Validation

**Create Schema:**

```typescript
// src/validation/auth/login.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

**Use in Form:**

```tsx
const result = loginSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy to Vercel with zero configuration.

### Docker

```bash
npm run build:prod
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Standalone

```bash
npm run build:prod
npm run start:prod
```

---

## 🎨 Customization

### Add New Language

1. Create `src/lib/i18n/dictionaries/de.json`
2. Update `NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl,de` in `.env`
3. Add flag emoji in language switcher

### Add New Auth Page

1. Create `src/app/[lang]/auth/my-page/page.tsx`
2. Use `AuthLayout` component
3. Add validation schema in `src/validation/auth/`

### Add Dashboard Page

1. Create `src/app/[lang]/dashboard/my-page/page.tsx`
2. Add route to sidebar in `dashboard-sidebar.tsx`
3. Add translations

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Email](https://react.email/)

---

<div align="center">

**Built with ❤️ using Next.js 16 & React 19**

[⬆ Back to Top](#-nextjs-fullstack-starter)

</div>
