# ProjectNode Blueprint — File 04: Architectural Decision Records (ADRs)

*Version 1.1. Each record states the problem, the decision, what else was considered, and what the decision costs you. Status of all records: **Accepted**.*

## ADR-1: Use Laravel Breeze (React stack) for authentication scaffolding

**Context.** ProjectNode needs registration, login, logout, password reset, email verification and login rate limiting. You are a junior developer with 14 days. Hand-rolled authentication is where beginners most often introduce security holes (weak hashing, missing rate limits, session fixation).

**Decision.** Install Breeze with the React and Inertia stack on Laravel 12. Breeze generates readable controllers, requests, routes and React pages **inside your repository**, so you can see and change every line.

**Alternatives considered.**

- *Jetstream:* adds teams, two-factor authentication and API tokens that the MVP does not need; more code to understand.
- *Laravel's newer official React starter kit:* actively maintained and a reasonable choice, but more opinionated (extra UI library and conventions), which is more to learn in a short sprint.
- *Fortify only:* provides the backend logic without UI; you would write every page yourself.
- *Custom authentication:* highest risk, no benefit.

**Consequences.** Breeze is simple and well documented, and you own the generated code. Trade-offs: Laravel has announced Breeze no longer receives new features, so you must pin versions and not expect upgrades; you must modify two generated parts (the register controller for the domain rule, and the profile update to lock the email); and Breeze's default dashboard and profile pages need adapting. Revisit after the MVP when moving to Laravel 13.

## ADR-2: React with Inertia.js is appropriate, on one condition

**Context.** The product is a set of forms, lists, filters and detail pages. There is no real-time collaboration and no mobile app. You prefer React.

**Decision.** Use React with Inertia.js. The condition: do a **one-hour spike on Day 1** (landing page plus one form that shows a server validation error). If that feels painful, switch immediately to Breeze with Blade, which costs about two hours. Do not discover this on Day 6.

**Why Inertia suits this project.** Inertia lets Laravel controllers return React pages directly. You get a React interface without building and securing a separate API, without token authentication, and without CORS configuration. Login stays an ordinary session cookie, validation errors arrive as props, and redirects behave like a normal server-rendered site.

**Alternatives considered.**

- *Blade (optionally with Alpine.js):* the least complex option: one language, no JavaScript build for page logic. Best choice if React is new to you.
- *Livewire:* server-driven components; pleasant for forms, but another framework model to learn.
- *React single-page app with a Laravel JSON API:* doubles the surface area (API design, token or cookie auth, CORS, duplicated validation) for no benefit here.
- *Next.js frontend:* a second deployment and language stack; unjustified.

**Consequences.** You need Node and a build step on deploy. Everything you pass as props is visible to the user (see 2.3 in file 02), so data exposure needs deliberate care. Server-side rendering (for search engines) is not set up and is not needed for a login-gated campus tool; the landing page will not be optimised for search traffic. You maintain two languages.

## ADR-3: PostgreSQL rather than MySQL (a mild preference, driven by hosting)

**Context.** The data is relational (users, projects, requests, participants) with integrity rules that matter (uniqueness, capacity, statuses). At campus scale both databases perform adequately.

| Aspect | PostgreSQL | MySQL 8 |
|---|---|---|
| Relational integrity, transactions, row locks | Yes | Yes |
| CHECK constraints enforced | Yes | Yes (8.0.16 and later) |
| DDL inside transactions (a failed migration rolls back completely) | **Yes** | No, DDL commits implicitly, so a half-applied migration is possible |
| Case-insensitive search | `ILIKE` | `LIKE` is case-insensitive by default collation |
| Future text search | Built-in full-text, `pg_trgm` trigram indexes | FULLTEXT indexes |
| Case sensitivity of unique emails | Case-sensitive (you must lowercase) | Case-insensitive by default |
| Availability on cheap shared hosting | Often missing | Almost universal |
| Managed free or low-cost tiers | Common | Common |

**Decision.** PostgreSQL, because atomic migrations are valuable for a junior developer who will run migrations on production, the constraint and indexing features give headroom for Phase 2, and the case-sensitivity trap is easy to handle (lowercase emails).

**Alternatives considered.** MySQL: equally valid if your hosting only offers it (D3). Switching costs little: change `ILIKE` to `LIKE` and drop the lowercase-email precaution.

**Consequences.** Hosting choices narrow slightly. Case-sensitive comparisons require discipline. Tests must run against PostgreSQL, not SQLite.

## ADR-4: Session-based email and password authentication with email verification; no OAuth in the MVP

**Context.** Eligibility must be restricted to `aau.edu.et` addresses. Whether Google sign-in would even work depends on whether AAU mailboxes are Google accounts, which is unconfirmed. Registration must prove mailbox ownership.

**Decision.** Use Breeze's cookie-session authentication, an allow-listed domain rule, and `MustVerifyEmail`. Do not install Socialite. OAuth is documented as Phase 2 (section 3.2 in file 03).

**Alternatives considered.**

- *Google OAuth as the only login:* excellent user experience and delegates verification, but fails entirely if AAU mail is not Google-based, and removes your ability to support users without Google accounts.
- *Google OAuth plus passwords:* two code paths, account linking, and duplicate-account edge cases during a 14-day build.
- *API tokens (Sanctum):* designed for mobile apps and third-party API clients; unnecessary for a same-origin web app.
- *Magic-link login:* attractive (each login proves mailbox access) but not built in; custom code on the most security-sensitive path.

**Consequences.** Users manage a password (the reset flow is included). The product depends on reliable email delivery, which is the main operational risk (test on Day 2). Identity assurance is limited to "controls an aau.edu.et mailbox" (0.2 #3 in file 00). Adding OAuth later needs a `social_accounts` table and a linking policy but no redesign of sessions or authorization.

## ADR-5: Defer chat to Telegram

**Context.** Students already coordinate on Telegram. In-app chat requires real-time infrastructure (WebSockets or polling), message storage, notification handling, abuse reporting, moderation, and a retention policy. It is a product in itself.

**Decision.** After a request is accepted, reveal the project's Telegram contact to the accepted member. ProjectNode handles discovery, selection and record-keeping; conversation happens on Telegram.

**Alternatives considered.** In-app chat with Laravel Reverb or a hosted real-time service (days of work plus a long-running process); email relay between users (spam and deliverability risk); a Telegram bot that creates group chats (extra service and API credentials).

**Consequences.** Conversations cannot be moderated by admins and leave no record on the platform. Telegram handles are personal contact data, so reveal is gated (FR-JOIN-09) and handles are not verified (a user can type someone else's handle). A user may change their handle; project contacts can go stale. If misuse appears, the first remedy is admin suspension plus a reporting feature (Phase 2).

## ADR-6: Simple filtering and search instead of recommendations

**Context.** At launch there will be few users and few projects. Recommendation quality depends on behavioural data, and unmeasured recommendations can silently hide relevant projects. The brief explicitly excludes machine learning.

**Decision.** Provide a chronological feed with SQL filters (category, department, skills, dates, availability) and keyword search through `ILIKE`.

**Alternatives considered.** Skill-overlap scoring (ranking by how many of a student's skills match; deferrable, uses the existing tables); Meilisearch or Elasticsearch (a second service to host); PostgreSQL full-text search (more powerful, more complex to explain and tune); collaborative filtering (needs data that does not exist yet).

**Consequences.** Users must look for what they want, so filters must be fast and obvious. Keyword search is basic (no typo tolerance, no relevance ranking). The path to a "projects matching your skills" section is a single additional query on existing columns, so nothing is lost by waiting. Notification of recommended projects stays out of scope until preferences exist.

## ADR-7: Participation records through a `project_participants` table with two-step credit

**Context.** The platform's differentiator is a trustworthy record of projects people took part in. The owner's word alone is weak evidence, but a heavyweight peer-review system would never ship in 14 days. The owner is also a participant who never applies, and Phase 2 wants supervisors as participants.

**Decision.** Separate four facts (accepted, recorded participant, credited, confirmed) as described in 2.7 (file 02). Store membership in `project_participants`, created in the same transaction as acceptance. At completion the owner credits specific members (no pre-checked boxes); a credit shows on a profile only after the participant confirms it. Related decision (D11): a listing is one project with an integer number of openings, not separate role listings.

**Alternatives considered.**

- *Two extra columns on `join_requests`:* simpler, but cannot represent the owner or a supervisor and blurs application and membership.
- *A separate `endorsements` table:* justified only for third-party skill endorsements; not needed for two-party credit.
- *Automatic credit for every accepted applicant:* the exact failure the brief warns about.
- *Peer review or reputation score:* explicitly out of scope, and easy to game.

**Consequences.** The record is honest about its limits (owner-reported, participant-confirmed), resists casual false claims, and is frozen after completion. It cannot prove that work happened or that skills are real, and two colluding students could still fabricate a project; admin removal is the remedy. A participant who never confirms leaves a credit invisible. The invariant "accepted request equals member participant row" must be preserved by writing both in one transaction.

## ADR-8: Represent future faculty and organizations with a role column and participant roles

**Context.** Lecturers, departments and other organizations will eventually publish opportunities. Building these accounts now would require verification workflows and UI that have not been designed.

**Decision.** Keep every account in `users` with a `role` column (student and admin now), give `project_participants` a `role` column (owner and member now), and keep `projects.owner_id` always pointing to a user. Later: add `lecturer` as a role with an admin-set `staff_verified_at`, add `supervisor` as a participant role, and add `organizations` with a pivot table and a nullable `projects.organization_id` (2.10 in file 02).

**Alternatives considered.** Separate tables per account type; polymorphic `owner_type/owner_id` on projects; a full role and permission package such as spatie/laravel-permission; building an organizations module now.

**Consequences.** Today's schema pays almost nothing for tomorrow's flexibility: two string columns. The cost is deferred, not removed: lecturer verification must be designed later because the email domain cannot tell staff from students (D5). Centralize role checks in model helpers such as `User::isAdmin()` so they are easy to extend and do not spread across the code.

## ADR-9: Features excluded to protect the 14-day deadline

**Context.** The original brief, taken as a whole, is larger than 14 days for a single junior developer. The time estimates below are for you, not for an expert.

**Decision.** Exclude the following from the MVP:

| Excluded | Estimated cost avoided | Reason | Where it returns |
|---|---|---|---|
| Google OAuth | 1 to 2 days, plus AAU IT dependency | Unconfirmed that AAU mail is Google-based; duplicate-account risk | Phase 2 |
| Project images | About 1 day | Uploads, storage persistence, moderation | Phase 2 |
| Queues and workers | 0.5 day plus operations | Two emails do not need them | When email volume grows |
| Student reports | 0.5 day | Admins can browse at campus scale | Stretch or Phase 2 |
| Recommendations and digest emails | 3 or more days | No data yet; needs preferences | Phase 2 |
| In-app chat | 5 or more days | Telegram already used | Probably never |
| Organization and lecturer accounts | 3 or more days | Verification process undefined | Phase 2 |
| Endorsements table | 1 day | Two-party credit suffices | Phase 2 |
| Role-specific openings | 1.5 days | Adds a table and capacity per role | Phase 2 |
| Reapply after rejection | 0.5 day | Needs a partial unique index and more states | Phase 2 |
| Project edit history, analytics dashboards, certificates, experience sections | Days | Not part of the core loop | Later |

**Cut order if you fall behind** (stop at the first that restores your schedule): (1) withdraw request, (2) moderation log page (keep writing the rows), (3) completion credits and confirmation, falling back to completed-with-summary only, (4) extra date filters (keep category, department, skills, search), (5) landing page polish.

**Never cut:** domain rule, email verification, policies, capacity transaction, suspension, deployment, tests for the authorization and capacity rules.

**Consequences.** The MVP is less impressive on a feature list but is secure, complete in its core loop (post, discover, apply, accept, contact, complete), and extensible.
