# API Routes

All routes are under `src/app/api/`. Route handlers use Next.js App Router `route.ts` files.

---

## 🔓 Public API Routes

These routes are accessible without authentication (or with minimal auth).

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `*` | `/api/auth/[...nextauth]` | NextAuth handlers (login, logout, session) |
| `GET` | `/api/news` | Get published news articles |
| `GET` | `/api/events` | Get upcoming events |
| `GET` | `/api/schemes` | Get active welfare schemes |
| `GET` | `/api/jobs` | Get job listings |
| `GET` | `/api/artisans` | Get artisan profiles |
| `GET` | `/api/artisans/[id]` | Get single artisan |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/[id]` | Get single product |
| `GET` | `/api/success-stories` | Get artisan success stories |
| `GET` | `/api/forum` | Get forum posts |
| `GET` | `/api/matrimony` | Get approved matrimony profiles (members only) |
| `GET` | `/api/media` | Get media items |
| `POST` | `/api/contact` | Submit contact/inquiry form |
| `GET` | `/api/adi-haat/filters` | Get Adi Haat filter options |

---

## 🔐 Admin API Routes

These routes are protected — accessible only to `ADMIN` or `MODERATOR` roles.

### 👥 Users
| Method | Route | Description |
|--------|-------|-------------|
| `GET / PATCH` | `/api/admin/users` | List users, update roles/status |

### 📰 News
| Method | Route | Description |
|--------|-------|-------------|
| `GET / POST` | `/api/admin/news` | List all articles, create new |
| `PATCH / DELETE` | `/api/admin/news/[id]` | Update or delete article |
| `GET / POST` | `/api/admin/news/categories` | Manage news categories |

### 📅 Events
| Method | Route | Description |
|--------|-------|-------------|
| `GET / POST` | `/api/admin/events` | List all events, create new |
| `PATCH / DELETE` | `/api/admin/events/[id]` | Update or delete event |
| `GET / POST` | `/api/admin/events/categories` | Manage event categories |

### 💼 Jobs
| Method | Route | Description |
|--------|-------|-------------|
| `GET / POST` | `/api/admin/jobs` | List all jobs, create new |
| `PATCH / DELETE` | `/api/admin/jobs/[id]` | Update or delete job |

### 📋 Schemes
| Method | Route | Description |
|--------|-------|-------------|
| `GET / POST` | `/api/admin/schemes` | List all schemes, create new |
| `PATCH / DELETE` | `/api/admin/schemes/[id]` | Update or delete scheme |
| `GET / POST` | `/api/admin/schemes/categories` | Manage scheme categories |
| `GET / POST` | `/api/admin/schemes/targetgroups` | Manage target groups |

### 🛍️ Adi Haat
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/admin/adi-haat` | Admin adi-haat overview |
| `GET / POST` | `/api/admin/adi-haat/artisans` | List / create artisans |
| `PATCH / DELETE` | `/api/admin/adi-haat/artisans/[id]` | Update / delete artisan |
| `GET / POST` | `/api/admin/adi-haat/products` | List / create products |
| `PATCH / DELETE` | `/api/admin/adi-haat/products/[id]` | Update / delete product |
| `GET / POST` | `/api/admin/adi-haat/success-stories` | List / create success stories |
| `PATCH / DELETE` | `/api/admin/adi-haat/success-stories/[id]` | Update / delete success story |

### 💍 Matrimony
| Method | Route | Description |
|--------|-------|-------------|
| `GET / PATCH` | `/api/admin/matrimony` | List profiles, approve/reject |

### 🖼️ Media
| Method | Route | Description |
|--------|-------|-------------|
| `GET / POST / DELETE` | `/api/admin/media` | Manage media uploads (Cloudinary) |

### 📬 Contact Inbox
| Method | Route | Description |
|--------|-------|-------------|
| `GET / PATCH` | `/api/admin/contact` | Read and resolve contact messages |

### 🤖 Gemini AI
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/admin/gemini` | Send prompt to Google Gemini AI |

---

## Notes

- All admin routes should validate the session role server-side using `getServerSession(authOptions)`
- Authentication via **NextAuth Credentials Provider** with JWT sessions
- Public routes may have pagination support (not verified)
