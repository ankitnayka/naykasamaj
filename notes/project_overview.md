# Project Setu — Nayaka Community Portal

## Overview

**Project Name:** Nayaka Samaj (`naykasamaj`)  
**Internal Codename:** Project Setu  
**Type:** Full-stack web application — Community Portal  
**Purpose:** A digital platform built for the **Nayka indigenous community** to preserve culture, connect members, enable economic opportunities, and provide access to government welfare resources.

---

## Mission

To serve as a single unified digital home for the Nayka community, bridging the gap between tradition and technology by offering:
- Cultural preservation (heritage, oral histories, multimedia archives)
- Social connectivity (member directory, matrimony, forums)
- Economic upliftment (artisan marketplace — Adi Haat)
- Civic empowerment (government schemes, job board, news)

---

## Project Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Active | Core portal — Heritage, News, Schemes, Jobs, Adi Haat, Forum, Matrimony, Members, Admin Panel |
| Phase 2 | 🔜 Planned | Mobile Apps, E-Learning Hub, Telemedicine, Digital Payment Integrations |

---

## Key Sections

### Public Portal (No Login Required)
| Section | Route | Purpose |
|---------|-------|---------|
| Heritage Hub | `/heritage` | Preserve Nayka culture, folklore, oral histories with TK labels |
| News & Updates | `/news` | Official announcements, fact-check corner, breaking news |
| Schemes Finder | `/schemes` | Government/NGO welfare schemes, scholarships, downloadable forms |
| Jobs Board | `/jobs` | Job listings and skill development programs |
| Adi Haat Marketplace | `/adi-haat` | Artisan products, profiles, and success stories |
| Gallery | `/gallery` | Community photo and video gallery |
| Events | `/events` | Public community event calendar |
| About | `/about` | Community background and mission |
| Contact | `/contact` | Public inquiry form |
| Donate | `/donate` | Donation page |

### Private Member Hub (Login Required)
| Section | Route | Purpose |
|---------|-------|---------|
| Members Directory | `/members` | Searchable verified community members |
| Community Forum | `/forum` | Categorized discussion board (Education, Farming, Health, etc.) |
| Matrimony Corner | `/matrimony` | Moderated matchmaking for verified members |

### Admin Panel (Admin/Moderator Only)
| Section | Route |
|---------|-------|
| Dashboard | `/admin` |
| User Management | `/admin/users` |
| News CMS | `/admin/news` |
| Events CMS | `/admin/events` |
| Heritage CMS | `/admin/heritage` |
| Schemes Manager | `/admin/schemes` |
| Jobs Manager | `/admin/jobs` |
| Adi Haat Manager | `/admin/adi-haat` |
| Matrimony Moderation | `/admin/matrimony` |
| Media Archive | `/admin/media` |
| Contact Inbox | `/admin/contact` |
| Gemini AI Assistant | `/admin/gemini` |

---

## Notable Design Decisions

- **Role-Based Access Control (RBAC):** 8 roles — `GUEST`, `MEMBER`, `VERIFIED_MEMBER`, `MODERATOR`, `ADMIN`, `CURATOR`, `EDITOR`, `VIEWER`
- **Traditional Knowledge (TK) Labels:** Content sensitivity labels for cultural content (`SACRED`, `ELDERS_ONLY`, etc.)
- **CMS Plugin Pattern:** Shared `cmsPlugin` applied to Mongoose models (Article, Event, Job, HeritageItem) for consistent publish/draft/archive workflow
- **Hardcoded Super Admin:** Global admin bypasses DB check and is sourced from `.env` variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- **AI Integration:** Google Gemini API integrated via `src/lib/gemini.ts` and exposed via `/api/admin/gemini`
