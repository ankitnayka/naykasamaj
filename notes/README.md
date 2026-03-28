# Project Notes Index

Documentation for **naykasamaj** (Project Setu — Nayka Community Portal).

Generated: 2026-03-25

---

## Files

| File | Description |
|------|-------------|
| [project_overview.md](./project_overview.md) | Project purpose, mission, sections, and design decisions |
| [tech_stack.md](./tech_stack.md) | All technologies, frameworks, libraries with versions |
| [folder_structure.md](./folder_structure.md) | Annotated full directory tree |
| [database_schema.md](./database_schema.md) | All Mongoose models with fields, types, and relations |
| [api_routes.md](./api_routes.md) | All public and admin REST API endpoints |
| [features.md](./features.md) | Complete list of all application features |
| [setup_notes.md](./setup_notes.md) | Local development setup, env variables, deployment |
| [dependencies.yaml](./dependencies.yaml) | All npm dependencies and required env variables |

---

## Quick Summary

**naykasamaj** is a **Next.js 16 + TypeScript** full-stack web app for the Nayka indigenous community.

- **Database:** MongoDB via Mongoose (17 models)
- **Auth:** NextAuth.js with JWT + 8 RBAC roles
- **Storage:** Cloudinary for all media uploads
- **AI:** Google Gemini API (admin-only)
- **Styling:** TailwindCSS v4
- **38 API routes** spanning public and admin-only endpoints
- **14 frontend sections** (7 public, 3 members-only, admin panel)
