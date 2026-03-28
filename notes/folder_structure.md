# Folder Structure

```
naykasamaj/
│
├── public/                         # Static assets (images, fonts, etc.)
├── notes/                          # Project documentation (this directory)
│
├── src/
│   ├── app/                        # Next.js App Router (pages + API routes)
│   │   │
│   │   ├── layout.tsx              # Root layout (wraps all pages)
│   │   ├── page.tsx                # Homepage
│   │   ├── globals.css             # Global styles
│   │   ├── not-found.tsx           # 404 page
│   │   │
│   │   ├── about/                  # /about page
│   │   ├── adi-haat/               # /adi-haat — Artisan marketplace
│   │   ├── contact/                # /contact page
│   │   ├── donate/                 # /donate page
│   │   ├── events/                 # /events — Community events calendar
│   │   ├── forum/                  # /forum — Community discussions
│   │   ├── gallery/                # /gallery — Photo/Video gallery
│   │   ├── heritage/               # /heritage — Cultural archive
│   │   ├── jobs/                   # /jobs — Job board
│   │   ├── legal/                  # /legal — Terms, privacy policy
│   │   ├── matrimony/              # /matrimony — Matchmaking
│   │   ├── members/                # /members — Member directory
│   │   ├── news/                   # /news — Articles and announcements
│   │   ├── products/               # /products — Product listings
│   │   ├── register/               # /register — User registration
│   │   ├── schemes/                # /schemes — Government welfare schemes
│   │   ├── success-stories/        # /success-stories — Artisan spotlights
│   │   │
│   │   └── admin/                  # /admin — Admin panel (protected)
│   │       ├── adi-haat/           # Artisan & product management
│   │       ├── contact/            # Contact inbox
│   │       ├── events/             # Events CMS
│   │       ├── gemini/             # AI assistant
│   │       ├── heritage/           # Heritage CMS
│   │       ├── jobs/               # Jobs management
│   │       ├── matrimony/          # Matrimony moderation
│   │       ├── media/              # Media archive
│   │       ├── news/               # News CMS
│   │       ├── schemes/            # Schemes management
│   │       └── users/              # User management
│   │
│   │   └── api/                    # REST API routes (Next.js Route Handlers)
│   │       ├── auth/               # NextAuth + register
│   │       ├── artisans/           # Artisan CRUD
│   │       ├── contact/            # Contact form submission
│   │       ├── events/             # Events API
│   │       ├── forum/              # Forum posts API
│   │       ├── jobs/               # Jobs API
│   │       ├── matrimony/          # Matrimony profiles API
│   │       ├── media/              # Media upload API
│   │       ├── news/               # News articles API
│   │       ├── products/           # Products API
│   │       ├── schemes/            # Schemes API
│   │       ├── success-stories/    # Success stories API
│   │       └── admin/              # Admin-only API endpoints
│   │           ├── adi-haat/       # Admin artisan/product/success-story CRUD
│   │           ├── contact/        # Admin inbox
│   │           ├── events/         # Admin events CRUD + categories
│   │           ├── gemini/         # Gemini AI endpoint
│   │           ├── jobs/           # Admin jobs CRUD
│   │           ├── matrimony/      # Admin matrimony moderation
│   │           ├── media/          # Admin media management
│   │           ├── news/           # Admin news CRUD + categories
│   │           ├── schemes/        # Admin schemes CRUD + categories + target groups
│   │           └── users/          # Admin user management
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── Carousel/               # Image/content carousel
│   │   ├── Footer/                 # Site footer
│   │   ├── Navbar/                 # Navigation bar
│   │   ├── NewsTicker/             # Scrolling announcement ticker
│   │   ├── ProgressReport/         # Progress/metrics display
│   │   └── TopBar/                 # Top utility bar
│   │
│   ├── context/                    # React Context providers
│   │   ├── AuthProvider.tsx        # NextAuth session provider
│   │   ├── LanguageContext.tsx     # i18n language switching
│   │   └── ThemeContext.tsx        # Light/Dark theme toggle
│   │
│   ├── lib/                        # Utility / service modules
│   │   ├── auth.ts                 # NextAuth config (JWT, credentials, roles)
│   │   ├── cloudinary.ts           # Cloudinary SDK config
│   │   ├── db.ts                   # MongoDB cached connection
│   │   └── gemini.ts               # Google Gemini AI config
│   │
│   ├── models/                     # Mongoose schemas (MongoDB)
│   │   ├── plugins/                # Shared Mongoose plugins
│   │   │   └── cmsFeatures.ts      # cmsPlugin for DRAFT/PUBLISHED/ARCHIVED workflow
│   │   ├── Article.ts
│   │   ├── Artisan.ts
│   │   ├── Event.ts
│   │   ├── EventCategory.ts
│   │   ├── Forum.ts                # (Post + Comment models)
│   │   ├── HeritageItem.ts
│   │   ├── Job.ts
│   │   ├── MatrimonyProfile.ts
│   │   ├── Media.ts
│   │   ├── Message.ts
│   │   ├── NewsCategory.ts
│   │   ├── Product.ts
│   │   ├── Scheme.ts
│   │   ├── SchemeCategory.ts
│   │   ├── SuccessStory.ts
│   │   ├── TargetGroup.ts
│   │   └── User.ts
│   │
│   ├── types/                      # TypeScript type definitions
│   └── locales/                    # i18n translation files
│
├── next.config.ts                  # Next.js config (Cloudinary domain whitelist)
├── tsconfig.json                   # TypeScript config
├── eslint.config.mjs               # ESLint config
├── postcss.config.mjs              # PostCSS/Tailwind config
├── package.json                    # Dependencies and scripts
├── test-db.mjs                     # Database connection test script
├── report.md                       # Features & services report
├── admin_panel_report.md           # Admin panel capabilities report
└── AGENTS.md / CLAUDE.md           # AI agent instruction files
```
