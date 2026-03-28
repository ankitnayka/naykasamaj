# Setup & Local Development Notes

## Prerequisites

- **Node.js** v18+
- **npm** / yarn / pnpm / bun
- **MongoDB** (local or MongoDB Atlas cloud instance)
- **Cloudinary** account (for media/image storage)
- **Google AI Studio** API key (for Gemini AI feature)

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd naykasamaj

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<a-long-random-secret>
JWT_SECRET=<another-long-random-secret>

# Super Admin (bypasses DB — direct access to admin panel)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

---

## Running Locally

```bash
# Start development server
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## Admin Access

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env.local`
2. Go to the login page and sign in with those credentials
3. You will be granted `ADMIN` role automatically (no DB record needed)

---

## Database Connection Test

A helper script is included to verify DB connectivity:

```bash
node test-db.mjs
```

---

## Build for Production

```bash
npm run build
npm run start
```

---

## Linting

```bash
npm run lint
```

---

## Key Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Whitelists `res.cloudinary.com` for Next.js Image |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.mjs` | ESLint rules |
| `postcss.config.mjs` | TailwindCSS PostCSS pipeline |
| `.env.local` | Environment variables (not committed to git) |

---

## Path Aliases

TypeScript is configured with `@/` aliasing `src/`, so imports look like:

```ts
import connectDB from "@/lib/db";
import User from "@/models/User";
```

---

## Deployment

Recommended: **Vercel** (Next.js native platform)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set all `.env.local` variables as Vercel Environment Variables in the Vercel dashboard.
