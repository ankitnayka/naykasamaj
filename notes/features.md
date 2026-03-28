# Features

A comprehensive list of all features available in Project Setu (naykasamaj).

---

## 🏛️ 1. Digital Heritage & Culture Hub (`/heritage`)

A dedicated space to preserve and celebrate the Nayka community's rich history.

- **Interactive Storytelling Timelines** — Documenting Nayaka origins from antiquity to present
- **Multimedia Archives:**
  - Photo Gallery — Curated community photos sorted by events and festivals
  - Video Gallery — Archival and recent footage of ceremonies and celebrations
  - Audio & Oral History — Recordings of traditional songs and elder narratives
- **Traditional Knowledge (TK) Labels** — Cultural sensitivity warnings before accessing sensitive content (e.g., `SACRED`, `ELDERS_ONLY`, `SEASONAL`)

---

## 📰 2. Official Information & News (`/news`)

Central source of truth for community updates and announcements.

- **Announcement Ticker** — Real-time scrolling updates visible across the portal
- **News Categories:**
  - Breaking News Alerts
  - Fact Check Corner (debunking misinformation)
  - Official Statements (from community leaders)
  - Achievements Blog
- **Admin CMS** — Full CRUD for news articles, categories, and publishing workflow

---

## 📋 3. Public Resources & Opportunities (`/schemes` & `/jobs`)

- **Interactive Scheme Finder** — Filterable directory of Central, State, and NGO welfare schemes
- **Scholarship Alerts** — Deadline banners for application cut-offs
- **Downloadable Forms** — Links to official application PDFs
- **Job & Skill Board** — Job listings and skill development programs
- **Admin Tools** — Full CRUD for schemes (with categories, target groups) and jobs

---

## 🛍️ 4. Adi Haat — Community Marketplace (`/adi-haat`)

Digital marketplace to support local Nayka artisans.

- **Product Showcase** — Visual gallery by category (Handicrafts, Textiles, Food, Art)
- **Artisan Directory** — Profiles with craft type, bio, location, contact
- **Success Stories** — Featured spotlights on artisan achievements
- **Direct Inquiry** — Buttons to contact sellers
- **Admin Moderation** — Approve artisan profiles, feature products

---

## 👥 5. Member Directory & Networking (`/members`)

Secure space to find and connect with verified community members.

- **Secure Registration & Approval** — New registrations queued for admin verification
- **Search & Filter** — By Name, Village/City, and Profession
- **Detailed Profiles** — Avatar, community role badge, location, profession, bio

---

## 💬 6. Community Forum & Help Board (`/forum`)

Safe internal discussion board.

- **Categorized Discussions:**
  - Education
  - Farming
  - Health
  - Business
  - Emergency Assistance (urgent help coordination)
  - General
- **Post Interactions** — Like and comment on posts
- **Anonymous Posting** — Privacy option for sensitive topics
- **Admin Moderation** — Delete inappropriate posts/comments, pin announcements

---

## 💍 7. Matrimony Corner (`/matrimony`)

Secure matchmaking strictly for verified members.

- **Profile Browsing** — Age, education, occupation, location, partner preferences
- **Privacy Controls** — `isPrivacyEnabled` flag per profile
- **Interest Expression** — Secure action buttons
- **Admin Approval Gate** — Profiles must be explicitly approved before going live

---

## 📅 8. Events Calendar (`/events`)

- **Dynamic Event Calendar** — Tracks community meetings, cultural festivals, health drives, educational seminars
- **Virtual Events** — Online meeting links supported
- **Admin CMS** — Create, categorize, and manage events

---

## 🖼️ 9. Gallery (`/gallery`)

- Photo and video gallery for community-shared content
- Managed via Admin Media Archive

---

## 📬 10. Contact & Support (`/contact`)

- **Public Inquiry Form** — Submissions stored as `Message` documents
- **Admin Contact Inbox** — Review and resolve all contact messages

---

## 🤖 11. AI Assistant (Admin Only — `/admin/gemini`)

- Integrated with **Google Gemini API**
- Admin tool for AI-powered content assistance

---

## 🔐 12. Authentication & Authorization

- **JWT-based sessions** via NextAuth
- **8 Roles:** `GUEST`, `MEMBER`, `VERIFIED_MEMBER`, `MODERATOR`, `ADMIN`, `CURATOR`, `EDITOR`, `VIEWER`
- **Super Admin** — Hardcoded via `.env` — bypasses DB for direct access
- **Password hashing** via `bcryptjs`

---

## ⚙️ 13. Admin Panel (`/admin`)

Full Content Management System (CMS) for the entire portal.

- **Dashboard** — Key metrics (total members, pending verifications, active announcements)
- **User Management** — Approve/suspend/block users, change roles
- **News CMS** — Full CRUD articles + categories + ticker management
- **Events CMS** — Full CRUD events + categories
- **Heritage CMS** — Rich text, TK label management, moderation queue
- **Schemes Manager** — Full CRUD schemes + categories + target groups
- **Jobs Manager** — Full CRUD job listings
- **Adi Haat Manager** — Artisan/product/success-story CRUD + approvals
- **Matrimony Moderation** — Profile approval tools
- **Media Archive** — Cloudinary media management
- **Contact Inbox** — Centralized message inbox

---

## 🌐 14. Internationalisation & Theming

- **Language Switching** — `LanguageContext.tsx` with locale files in `src/locales/`
- **Light/Dark Mode** — `ThemeContext.tsx`

---

## 🔜 Phase 2 (Planned)

- Mobile Apps
- E-Learning Hub
- Telemedicine
- Digital Payment Integrations
