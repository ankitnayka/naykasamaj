# Database Schema

All models use **Mongoose** with **MongoDB**. Several models use a shared `cmsPlugin` that provides draft/publish/archive workflow fields.

---

## 👤 User
**Collection:** `users`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Optional (hashed via bcryptjs) |
| `phone` | String | Optional |
| `role` | Enum | `GUEST \| MEMBER \| VERIFIED_MEMBER \| MODERATOR \| ADMIN \| CURATOR \| EDITOR \| VIEWER` — default: `MEMBER` |
| `avatar` | String | Cloudinary URL |
| `isVerified` | Boolean | Default: `false` |
| `village` | String | Optional |
| `profession` | String | Optional |
| `ageGroup` | String | Optional |
| `bio` | String | Optional |
| `status` | Enum | `ACTIVE \| SUSPENDED \| BLOCKED` — default: `ACTIVE` |
| `createdAt / updatedAt` | Date | Auto (timestamps) |

---

## 💍 MatrimonyProfile
**Collection:** `matrimonyprofiles`

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → User | Required, Unique (one profile per user) |
| `gender` | Enum | `MALE \| FEMALE` |
| `dateOfBirth` | Date | Required |
| `height` | String | e.g. `"5'9"` |
| `maritalStatus` | Enum | `NEVER_MARRIED \| DIVORCED \| WIDOWED` |
| `education` | String | Required |
| `occupation` | String | Required |
| `income` | String | Optional |
| `location` | String | Required |
| `aboutMe` | String | Required |
| `partnerPreferences` | Object | `{ ageRange, education, maritalStatus }` |
| `photos` | String[] | Cloudinary URLs |
| `isPrivacyEnabled` | Boolean | Default: `false` |
| `isApproved` | Boolean | Moderation flag — default: `false` |

---

## 📰 Article (News)
**Collection:** `articles`  
**Uses:** `cmsPlugin`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `content` | String | Required |
| `excerpt` | String | Optional |
| `category` | String | Default: `"News"` |
| `tags` | String[] | |
| `imageUrl` | String | |
| `images` | String[] | |
| `gallery` | String[] | |
| `authorId` | ObjectId → User | |
| `isPublished` | Boolean | Default: `false` |
| `publishedAt` | Date | |

---

## 📅 Event
**Collection:** `events`  
**Uses:** `cmsPlugin`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `description` | String | Required |
| `date` | Date | Required |
| `location` | String | Required |
| `category` | String | Required |
| `isVirtual` | Boolean | Default: `false` |
| `meetingLink` | String | Optional (for virtual events) |
| `images` | String[] | |
| `gallery` | String[] | |
| `organizer` | ObjectId → User | |

---

## 💬 Forum
**Collection:** `posts` + `comments`

### Post
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `content` | String | Required |
| `category` | Enum | `EDUCATION \| FARMING \| HEALTH \| EMERGENCY \| GENERAL` |
| `author` | ObjectId → User | Required |
| `isAnonymous` | Boolean | Default: `false` |
| `likes` | ObjectId[] → User | Array of users who liked |

### Comment
| Field | Type | Notes |
|-------|------|-------|
| `content` | String | Required |
| `post` | ObjectId → Post | Required |
| `author` | ObjectId → User | Required |

---

## 💼 Job
**Collection:** `jobs`  
**Uses:** `cmsPlugin`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `company` | String | Required |
| `location` | String | Required |
| `type` | Enum | `FULL_TIME \| PART_TIME \| INTERNSHIP \| FREELANCE` |
| `description` | String | Required |
| `requirements` | String[] | |
| `applyLink` | String | |
| `contactEmail` | String | |
| `contactPhone` | String | |
| `isSkillDevelopment` | Boolean | Default: `false` |
| `postedBy` | ObjectId → User | |

---

## 📋 Scheme
**Collection:** `schemes`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `provider` | String | Required (Govt. dept / NGO) |
| `description` | String | Required |
| `shortDescription` | String | Required |
| `fullDescription` | String | Required |
| `category` | String | Required |
| `ageLimit` | String | Optional |
| `incomeCriteria` | String | Optional |
| `targetGroup` | String | Required |
| `financialBenefit` | String | Optional |
| `otherBenefits` | String | Optional |
| `startDate / lastDate` | Date | |
| `status` | Enum | `Active \| Expired` |
| `officialWebsite` | String | |
| `applyLink` | String | |
| `image` | String | Cloudinary URL |

---

## 🏺 HeritageItem
**Collection:** `heritageitems`  
**Uses:** `cmsPlugin`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `description` | String | |
| `content` | String | Required (rich text) |
| `category` | ObjectId → HeritageCategory | |
| `mediaUrls` | String[] | Cloudinary URLs (photo/video/audio) |
| `tkLabels` | String[] | Traditional Knowledge labels: `SACRED`, `ELDERS_ONLY`, etc. |
| `authorId` | ObjectId → User | |

---

## 🧵 Artisan
**Collection:** `artisans`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `bio` | String | Required |
| `craftType` | String | Required |
| `location` | String | Required |
| `contactEmail` | String | Required |
| `contactPhone` | String | Optional |
| `imageUrl` | String | Cloudinary URL |
| `ownerId` | ObjectId → User | Required |
| `isVerified` | Boolean | Default: `false` |

---

## 🛍️ Product
**Collection:** `products`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `description` | String | Required |
| `price` | Number | Required |
| `category` | String | Required |
| `artisanId` | ObjectId → Artisan | Required |
| `images` | String[] | Cloudinary URLs |
| `inStock` | Boolean | Default: `true` |

---

## 🌟 SuccessStory
**Collection:** `successstories`

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `artisanName` | String | Required |
| `artisanId` | ObjectId → Artisan | Optional |
| `story` | String | Required |
| `images` | String[] | |
| `craftType` | String | Required |
| `location` | String | Required |

---

## 📩 Message (Contact)
**Collection:** `messages`

Stores public contact form submissions. Managed via admin Contact Inbox.

---

## Category Models

| Model | Collection | Purpose |
|-------|-----------|---------|
| `NewsCategory` | `newscategories` | News article categories |
| `EventCategory` | `eventcategories` | Event type categories |
| `SchemeCategory` | `schemecategories` | Scheme type categories |
| `TargetGroup` | `targetgroups` | Scheme demographic targets |

---

## CMS Plugin (`cmsFeatures.ts`)

Applied via `ArticleSchema.plugin(cmsPlugin)` on:  
`Article`, `Event`, `Job`, `HeritageItem`

Provides a shared set of CMS workflow fields (likely includes `status: DRAFT | PUBLISHED | ARCHIVED`, `publishedAt`, `editorId`, revision history).
