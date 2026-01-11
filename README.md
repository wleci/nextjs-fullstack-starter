<div align="center">

# 🚀 Next.js Fullstack Starter

**Production-ready starter with Better Auth, email, dashboard, and everything you need to ship fast.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.x-purple?style=flat)](https://better-auth.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

</div>

---

## ✨ Features

### 🔐 Authentication (Better Auth)

- **Email/Password** - Login, Register with validation
- **Social Login** - Google & Discord (configurable via env)
- **Two-Factor Auth** - TOTP with backup codes
- **Password Recovery** - Forgot password & reset flow
- **Email Verification** - Required before dashboard access
- **Session Management** - View & revoke sessions across devices
- **Account Lockout** - Auto-lock after 5 failed login attempts (15 min)
- **Login Notifications** - Email alerts on new sign-ins
- **Captcha Protection** - Cloudflare Turnstile with auto-reset
- **Rate Limiting** - Built-in protection against brute force
- **Localized Errors** - Error messages in user's language
- **Account Deletion** - Self-service account removal

### 📧 Email System

- **Nodemailer Integration** - SMTP email sending
- **React Email Templates** - Beautiful, responsive emails
- **Pre-built Templates** - Welcome, verification, 2FA, password reset, login notification
- **Type-safe** - Full TypeScript support

### 📊 Dashboard

- **Modern Sidebar** - Collapsible navigation with icons
- **User Menu** - Avatar dropdown with settings
- **Session Protection** - Auto-redirect for unauthenticated users
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

### 🗄️ Database

- **Drizzle ORM** - Type-safe database queries
- **SQLite** - Lightweight, embedded database
- **Auto-generated Schema** - Better Auth CLI generates tables

### 🔒 Security

- **Security Headers** - CSP, HSTS, X-Frame-Options
- **Cookie Consent** - GDPR-ready banner
- **Cloudflare Turnstile** - Bot protection
- **Input Validation** - Zod schemas everywhere

---

## 🏗️ Tech Stack

| Category       | Technologies                             |
| -------------- | ---------------------------------------- |
| **Framework**  | Next.js 16, React 19, TypeScript 5       |
| **Auth**       | Better Auth with plugins                 |
| **Styling**    | Tailwind CSS 4, shadcn/ui, Framer Motion |
| **Database**   | Drizzle ORM, SQLite                      |
| **Email**      | Nodemailer, React Email                  |
| **Validation** | Zod, t3-env                              |
| **Captcha**    | Cloudflare Turnstile                     |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextjs-fullstack-starter.git
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

## 🔧 Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE=false
NEXT_PUBLIC_ENABLE_DISCORD=false
NEXT_PUBLIC_ENABLE_CAPTCHA=false

# Database
DATABASE_URL=sqlite.db

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-characters-long
APP_NAME=My App

# OAuth - Google (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth - Discord (optional)
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Captcha - Cloudflare Turnstile (optional)
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@example.com
```

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
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [lang]/              # Localized routes
│   │   ├── auth/            # Login, Register, Forgot Password
│   │   ├── dashboard/       # Protected dashboard
│   │   └── ...
│   └── api/auth/            # Better Auth API handler
├── components/
│   ├── layout/              # Navbar, Footer, Sidebar
│   └── ui/                  # shadcn/ui + Turnstile, SocialLogin
├── lib/
│   ├── auth/                # Better Auth config & client
│   ├── database/            # Drizzle ORM setup
│   ├── email/               # Email client & templates
│   ├── env/                 # Environment validation
│   └── i18n/                # Internationalization
├── middleware/              # Auth, i18n, security middleware
└── validation/              # Zod schemas (frontend/backend)
```

---

## 🔐 Authentication Features

### Enable Social Login

Set in `.env`:

```env
NEXT_PUBLIC_ENABLE_GOOGLE=true
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

NEXT_PUBLIC_ENABLE_DISCORD=true
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
```

### Enable Captcha

Set in `.env`:

```env
NEXT_PUBLIC_ENABLE_CAPTCHA=true
TURNSTILE_SECRET_KEY=your-secret-key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
```

### Protected Routes

Routes are protected via proxy middleware:

- `/auth/*` - Only for unauthenticated users
- `/dashboard/*` - Only for authenticated users

---

## 🎨 Customization

### Add New Language

1. Create `src/lib/i18n/dictionaries/de.json`
2. Update `NEXT_PUBLIC_SUPPORTED_LOCALES=en,pl,de`
3. Add flag in language switcher

### Add Dashboard Page

1. Create `src/app/[lang]/dashboard/my-page/page.tsx`
2. Add route to `dashboard-sidebar.tsx`
3. Add translations

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

<div align="center">

**Built with ❤️ using Next.js 16, React 19 & Better Auth**

</div>
