# Tech Stack

## Framework & Runtime

| Technology | Version | Role |
|------------|---------|------|
| **Next.js** | 16.2.0 | Full-stack React framework (App Router) |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety across the entire codebase |
| **Node.js** | (inferred) | Server runtime for API routes |

---

## Database & ORM

| Technology | Version | Role |
|------------|---------|------|
| **MongoDB** | (cloud/Atlas) | Primary NoSQL database |
| **Mongoose** | ^9.3.1 | ODM for MongoDB schema definition and querying |

Connection: Singleton cached connection via `src/lib/db.ts` using `MONGODB_URI` env variable.

---

## Authentication

| Technology | Version | Role |
|------------|---------|------|
| **NextAuth.js** | ^4.24.13 | Session management |
| **bcryptjs** | ^3.0.3 | Password hashing |

- Auth strategy: **JWT sessions**
- Provider: **Credentials** (email + password)
- Super Admin: hardcoded via `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- Roles embedded in JWT token: `id`, `role`, `isVerified`

---

## Media & Storage

| Technology | Version | Role |
|------------|---------|------|
| **Cloudinary** | ^2.9.0 | Cloud image/video storage and CDN |
| **next/image** | (built-in) | Optimised image delivery from Cloudinary |

- Configured domain: `res.cloudinary.com` (whitelisted in `next.config.ts`)

---

## AI Integration

| Technology | Version | Role |
|------------|---------|------|
| **@google/generative-ai** | ^0.24.1 | Google Gemini AI SDK |

- Exposed via `/api/admin/gemini` (admin-only route)
- Configured in `src/lib/gemini.ts`

---

## Styling

| Technology | Version | Role |
|------------|---------|------|
| **TailwindCSS** | ^4 | Utility-first CSS framework |
| **PostCSS** | (via @tailwindcss/postcss ^4) | CSS processing pipeline |

---

## Developer Tooling

| Technology | Version | Role |
|------------|---------|------|
| **ESLint** | ^9 | Code linting |
| **eslint-config-next** | 16.2.0 | Next.js specific lint rules |
| **@types/react** | ^19 | TypeScript types |
| **@types/bcryptjs** | ^2.4.6 | TypeScript types |

---

## Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | NextAuth session encryption |
| `JWT_SECRET` | JWT signing secret |
| `ADMIN_EMAIL` | Global super-admin email |
| `ADMIN_PASSWORD` | Global super-admin password |
| `CLOUDINARY_*` | Cloudinary API keys |
| `GEMINI_API_KEY` | Google Gemini AI API key |

---

## Scripts

```json
{
  "dev":   "next dev",
  "build": "next build",
  "start": "next start",
  "lint":  "eslint"
}
```
