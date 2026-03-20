Complete CMS Admin Transition Plan
Goal Description
The objective is to expand the Nayaka Admin Panel so that it operates as a full Content Management System (CMS) for every single section of the website (About, Heritage, Members, Forum, Matrimony, Events, Jobs, Schemes, Adi Haat, Gallery, Contact).

Currently, we have robust handlers for Users, News, Events, and Media. This plan outlines the architecture to bring the remaining 7 sections under full Admin control.

User Review Required
IMPORTANT

Creating dedicated backend management for every single section is a significant amount of work. I propose breaking this down into 3 manageable milestones.

Are you okay with proceeding with Milestone 1 first?

Proposed Architecture & Routes
Milestone 1: The Opportunity & Help Desks
Bring the core resource sections online first.

1. Schemes Manager (/admin/schemes)
Model: 
Scheme.ts
Features: Full CRUD to add Central/State schemes, specify eligibility criteria, and link application forms.
2. Jobs Board Manager (/admin/jobs)
Model: 
Job.ts
Features: Post new job opportunities, skill development programs, and manage closing dates.
3. Contact & Inquiries (/admin/contact)
Model: [NEW] Message.ts
Features: A centralized inbox to read and resolve messages sent from the public Contact page.
Milestone 2: Market, Matrimony & Community Forums
Expand the read-only Directory into full moderation hubs.

1. Adi Haat Manager (/admin/adi-haat)
Models: 
Artisan.ts
, 
Product.ts
Features: Upgrade the current Directory view. Approve new artisan profiles, feature specific products on the homepage, and delete fraudulent listings.
2. Matrimony Moderation (/admin/matrimony)
Model: 
MatrimonyProfile.ts
Features: Hard-gate matrimony profiles. Admins must explicitly approve profiles before they appear to members. Includes features to suspect or remove fake profiles.
3. Forum Moderator (/admin/forum)
Model: 
Forum.ts
Features: Dashboard to view heavily reported threads, delete inappropriate comments, and pin important announcements to the top of categories.
Milestone 3: Advanced Heritage CMS & Archiving
The Heritage Hub requires museum-grade content management, enforcing Traditional Knowledge (TK) ethics and rigorous content workflows.

1. Heritage Archive Manager (/admin/heritage)
Models: [NEW] HeritageItem.ts, [NEW] HeritageCategory.ts
Content Creation: Rich text integration embedding historical stories.
Cultural Labeling (TK): Assign metadata tags like "Sacred", "Elders Only", or "Seasonal" to respectfully manage viewing restrictions.
Workflow & Access: Track items from DRAFT -> IN_REVIEW -> PUBLISHED. Isolate access horizontally (PUBLIC vs MEMBER_ONLY).
Audit Trail: Every document mutation saves the editorId and timestamp into a revision history array.
Category Hierarchy: Recursive category models to nest assets (e.g., Music -> Wedding Songs -> Region A).
2. Media Upgrades & Reporting (/admin/heritage/settings)
Watermarking: Configure Cloudinary integration to dynamically apply permanent text/image watermarks to newly uploaded heritage media.
Reporting Dashboard: Aggregate database metrics detailing views, top contributors, and workflow bottlenecks.
Role Scoping: Map NextAuth permissions to "Curator" (Admin), "Editor", and "Viewer".
Backups: Triggerable manual JSON/BSON snapshot dumps of the Heritage database.
Verification Plan
Automated & Manual Verification
Compile the TypeScript models securely.
Ensure only Super Admins and Moderators can access these new /admin/ routes via the updated 
layout.tsx
 protection.
E2E testing: Submitting a job on the admin panel and verifying it instantly appears on /jobs.