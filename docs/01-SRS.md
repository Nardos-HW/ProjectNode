# ProjectNode Blueprint — File 01: Software Requirements Specification (SRS)

*Version 1.1. Decisions D1 to D14 are final and defined in `00-decisions-and-preflight.md`.*

## 1.1 Product purpose and scope

ProjectNode is a web application where verified Addis Ababa University students publish project ideas, discover projects by filtering, request to join, and keep a record of projects they completed with others. It is **not** a social network: there are no feeds of people, follows, likes or posts.

**In scope:** landing page, email registration restricted to configured university domains, email verification, student profiles, project CRUD, discovery, join-request workflow, completion records, two email notifications, basic administration.

**Out of scope:** see 1.7.

## 1.2 User types and permissions

| Capability | Visitor | Unverified user | Verified student | Project owner (own project) | Admin |
|---|---|---|---|---|---|
| See landing page | Yes | Yes | Yes | Yes | Yes |
| Register and log in | Yes | n/a | n/a | n/a | n/a |
| Verify email, resend, log out | No | Yes | Yes | Yes | Yes |
| Browse feed and project details | No | No | Yes | Yes | Yes |
| View other students' profiles | No | No | Yes | Yes | Yes |
| Edit own profile | No | No | Yes | Yes | Yes |
| Create projects, apply to join | No | No | Yes (profile complete) | Yes | Yes |
| Edit, close, cancel, complete own project | No | No | No | Yes | No (admins do not edit content) |
| Review join requests for own project | No | No | No | Yes | No |
| See project Telegram contact | No | No | Only if accepted | Yes | Yes |
| Remove a project (moderation) | No | No | No | Own project: delete | Yes |
| Suspend or unsuspend a user | No | No | No | No | Yes |

A **suspended** user is treated as logged out: every request is redirected to an explanation page (FR-AUTH-08).

## 1.3 Functional requirements

Priority: **M** = Must, **S** = Should, **C** = Could.

### Landing page

| ID | Requirement | Pri |
|---|---|---|
| FR-LAND-01 | The public landing page shows a hero section, a "How it works" section (three steps: post or find, request to join, build your record), an About section, and Register and Log in links. It contains no testimonials or invented statistics. | M |

### Authentication and verification

| ID | Requirement | Pri |
|---|---|---|
| FR-AUTH-01 | A visitor can register with name, email, password and password confirmation. | M |
| FR-AUTH-02 | The system trims and lowercases the email before validating and storing it. | M |
| FR-AUTH-03 | The system rejects any email whose domain (the text after the last `@`) is not in the configured allow-list. The allow-list is read from configuration, initially containing only `aau.edu.et`. | M |
| FR-AUTH-04 | On successful registration the system sends a signed email verification link that expires (default 60 minutes). | M |
| FR-AUTH-05 | A user whose email is not verified cannot access any protected feature. They can only see the verification notice page, request a resend, and log out. | M |
| FR-AUTH-06 | Verification resend is rate limited (Breeze default: 6 per minute) and shows a neutral confirmation message. | M |
| FR-AUTH-07 | Registered users can log in, log out, and reset a forgotten password by email. Login attempts are rate limited. | M |
| FR-AUTH-08 | A suspended user cannot access any page except a suspension notice and logout. Suspension takes effect on their next request even if they already have a session. | M |
| FR-AUTH-09 | Passwords must be at least 8 characters and contain letters and numbers, and are stored hashed. | M |

### Student profiles

| ID | Requirement | Pri |
|---|---|---|
| FR-PROF-01 | After verification, a student is directed to complete a profile. Required fields: name, department, year of study, short bio, at least one skill, Telegram handle. | M |
| FR-PROF-02 | Until the profile is complete the student cannot create projects or apply to join, but may browse. | M |
| FR-PROF-03 | A student can edit their own profile at any time. | M |
| FR-PROF-04 | Verified students can view other students' profiles. Visible: name, department, year, bio, skills, interests, completed projects. **Never visible:** email, Telegram handle (except FR-JOIN-04 and FR-JOIN-09). | M |
| FR-PROF-05 | Skills are selected from the controlled list, maximum 15. Interests are free text, maximum 255 characters, not searchable. | M |
| FR-PROF-06 | Optional fields: interests. Everything else in FR-PROF-01 is required. Certificates and experience sections do not exist in the MVP. | M |

### Projects

| ID | Requirement | Pri |
|---|---|---|
| FR-PROJ-01 | A verified student with a complete profile can create a project with: title, description, category, required skills (1 to 10), department (optional), number of openings (1 to 20), expected commitment in hours per week (1 to 40), estimated duration in weeks (1 to 52), application deadline, Telegram contact. Status starts as **open**. | M |
| FR-PROJ-02 | The owner can edit their project while it is **not completed or cancelled**. The number of openings cannot be reduced below the number of members already accepted. | M |
| FR-PROJ-03 | The owner can change status: open to in_progress (stop recruiting, work begins) and open or in_progress to cancelled. Completion is handled by FR-COMP-01. | M |
| FR-PROJ-04 | The owner can delete their project only if it has no accepted members. Otherwise they must cancel it. Deletion is soft (the row is kept but hidden). | M |
| FR-PROJ-05 | Any verified student can view a project's detail page. The project Telegram contact is included in the data sent to the browser **only** for the owner, admins and accepted members. | M |
| FR-PROJ-06 | A completed project is read-only for its owner. Only an admin can remove it. | M |

### Discovery

| ID | Requirement | Pri |
|---|---|---|
| FR-DISC-01 | The default feed shows only **currently recruiting** projects, newest first. "Currently recruiting" means: status is open, deadline is today or later, and openings remain. | M |
| FR-DISC-02 | Filters: category, department, one or more skills, posted date range (last 7 days, last 30 days, any), deadline within the next N days, and an option to include non-recruiting (in progress, completed) projects. | M |
| FR-DISC-03 | Keyword search matches title and description, case-insensitively. | M |
| FR-DISC-04 | Results are paginated at 12 per page. Filters stay applied while paging. | M |
| FR-DISC-05 | Closed, expired, full, cancelled or completed projects are never labelled or shown as recruiting. Their cards show the true state (for example "Deadline passed", "Full", "Completed"). | M |

### Join requests

| ID | Requirement | Pri |
|---|---|---|
| FR-JOIN-01 | A verified student with a complete profile can request to join a project, with a message of 10 to 500 characters. | M |
| FR-JOIN-02 | A student can have at most one request per project, ever (D10). | M |
| FR-JOIN-03 | An owner cannot request to join their own project. A request can be created only while the project is currently recruiting. | M |
| FR-JOIN-04 | The owner sees all requests for their project, with applicant profile and Telegram handle. No one else can. | M |
| FR-JOIN-05 | The owner can accept or reject a **pending** request. Decisions are final in the MVP. | M |
| FR-JOIN-06 | An applicant can see their own requests and statuses on a "My applications" page. | M |
| FR-JOIN-07 | An applicant can withdraw a pending request. | S |
| FR-JOIN-08 | Acceptance is blocked if the project is completed or cancelled, or if all openings are filled. Two simultaneous accepts cannot exceed capacity. | M |
| FR-JOIN-09 | After acceptance the member sees the project's Telegram contact. | M |

### Completion and participation

| ID | Requirement | Pri |
|---|---|---|
| FR-COMP-01 | The owner can mark an open or in-progress project as completed, entering an outcome summary (20 to 1000 characters), an optional https link to evidence (repository or demo), and selecting which accepted members contributed. | S |
| FR-COMP-02 | Completing is a one-time, irreversible action. A second attempt does nothing and shows the existing record. | S |
| FR-COMP-03 | Only accepted members of that project can be selected as contributors. The owner is automatically recorded as a contributor. | S |
| FR-COMP-04 | Each credited member sees a pending credit and can **confirm** it. Only confirmed credits appear on that member's profile. | S |
| FR-COMP-05 | A profile's project history shows project title, category, owner-written outcome, role, and the label "Owner-reported, confirmed by participant". | S |

### Notifications

| ID | Requirement | Pri |
|---|---|---|
| FR-NOT-01 | Verification email (covered by FR-AUTH-04). | M |
| FR-NOT-02 | The owner receives an email when a new join request arrives. | M |
| FR-NOT-03 | The applicant receives an email when their request is accepted or rejected. | M |
| FR-NOT-04 | Failure to send an email never breaks the action that triggered it; the failure is logged. | M |

### Administration

| ID | Requirement | Pri |
|---|---|---|
| FR-ADM-01 | Admins can list and view users (searchable by name or email) and projects, including removed ones. | M |
| FR-ADM-02 | Admins can remove a project from public view, with a required reason. | M |
| FR-ADM-03 | Admins can suspend and unsuspend a user, with a required reason. Admins cannot suspend themselves or other admins. | M |
| FR-ADM-04 | Every admin moderation action is recorded with admin, action, target, reason and time. | S |
| FR-ADM-05 | Admin routes are protected on the server by authorization checks; the first admin is created by Artisan command. | M |
| FR-ADM-06 | Students can report a project with a reason; admins can review reports. | C |

## 1.4 Non-functional requirements

| ID | Requirement | How it is verified |
|---|---|---|
| NFR-SEC-01 | Authentication uses Laravel's session cookie guard (Breeze). All forms carry a CSRF token (Inertia handles this automatically). | Feature test: POST without session redirects to login |
| NFR-SEC-02 | Every route that changes or reveals protected data checks permission on the server through a Policy or Gate. Hiding buttons in React is never relied upon. | Feature tests: a second user receives HTTP 403 on every owner-only route |
| NFR-SEC-03 | Passwords are hashed with Laravel's default hasher (bcrypt) and never logged or returned. | Code review, `$hidden` on the User model |
| NFR-SEC-04 | Rate limits: login 5 per minute per email and IP (Breeze default), verification resend 6 per minute, join requests 10 per minute per user, registration 10 per minute per IP. | Manual and automated test |
| NFR-VAL-01 | All input is validated on the server using Form Request classes. Client-side validation is only a convenience. | Feature tests for invalid input per endpoint |
| NFR-PRIV-01 | Email addresses are never sent to other users' browsers. Telegram handles are sent only where FR-PROF-04, FR-JOIN-04, FR-JOIN-09 and FR-PROJ-05 permit. | Test: inspect Inertia props for a non-authorized user |
| NFR-DB-01 | Referential integrity is enforced by the database: foreign keys, unique constraints, and CHECK constraints on status values. | Migration review; attempt invalid inserts in a test |
| NFR-DB-02 | Capacity and status changes happen inside a transaction with a row lock. | Concurrency test (two sequential accepts at capacity 1) |
| NFR-ERR-01 | Users see friendly error pages for 403, 404, 419 (expired session) and 500. Production never shows stack traces (`APP_DEBUG=false`). | Manual check in production |
| NFR-PERF-01 | The feed responds in under 1 second at the 95th percentile with 5,000 projects, using pagination, indexes and eager loading (no N+1 queries). | Seed 5,000 rows, measure, inspect query count |
| NFR-MAINT-01 | Controllers stay thin, validation lives in Form Requests, permissions in Policies, and only two multi-step workflows get their own Action classes. | Code review |
| NFR-A11Y-01 | Semantic HTML, a label for every input, visible keyboard focus, sufficient colour contrast, usable at 360 px width, status never conveyed by colour alone. | Keyboard-only walkthrough and a Lighthouse accessibility score of 90 or more |
| NFR-CFG-01 | Secrets (APP_KEY, database and mail credentials) live in `.env`, are not committed, and differ between environments. | `.gitignore` check; secret scan before first push |
| NFR-DEP-01 | Production runs over HTTPS with `APP_ENV=production`, `APP_DEBUG=false`, cached config, and the web root pointing at `public/`. | Deployment checklist (Day 13) |
| NFR-TEST-01 | Automated tests cover registration rules, policies, join-request workflow, capacity and completion. | `php artisan test` passes before each deploy |

## 1.5 Business rules

| ID | Rule |
|---|---|
| BR-01 | Allowed email domains are configuration, not code. Matching is exact on the domain portion, case-insensitive. |
| BR-02 | An email's ownership is proven only by clicking a valid, unexpired, signed link sent to it. |
| BR-03 | A project has exactly one owner, who is the creator. Ownership cannot be transferred in the MVP. |
| BR-04 | `slots_total` counts additional contributors wanted, **not** including the owner. |
| BR-05 | A project is **currently recruiting** if and only if: status = open AND deadline >= today (Addis Ababa) AND accepted members < slots_total AND it is not removed. |
| BR-06 | Join request statuses: pending, accepted, rejected, withdrawn. Only pending requests change state. Accepted, rejected and withdrawn are terminal. |
| BR-07 | A student has at most one join request per project (database unique constraint). |
| BR-08 | Accepting a request atomically creates a participant record for that student. |
| BR-09 | Project statuses: open, in_progress, completed, cancelled. Completed and cancelled are terminal. |
| BR-10 | Four different facts are tracked separately: **accepted** (owner approved the application), **recorded participant** (a participant row exists), **credited contributor** (owner named them at completion), **confirmed** (the student agreed). Only confirmed credits appear on profiles. |
| BR-11 | A project can be completed once. After completion its content, participants and credits are frozen. |
| BR-12 | Admins may remove projects and suspend accounts but may not edit profile or project text. Each such action requires a reason and is logged. |
| BR-13 | Suspended accounts keep their data but lose access. Their projects are hidden from the feed while suspended. |
| BR-14 | The owner counts as a participant on their own project but does not occupy a slot and does not apply. |

## 1.6 Assumptions and constraints

**Assumptions**

- A1: One developer, roughly 6 productive hours per day, 14 days.
- A2: Initial user base is a few hundred to a few thousand AAU students; a single small server is sufficient.
- A3: The interface is in English; localisation is not required.
- A4: Students have Telegram accounts with public usernames.
- A5: The decisions D1 to D14 in file 00 hold.
- A6: AAU mailboxes can receive external email (to be verified on Day 2).

**Constraints**

- C1: Laravel, PostgreSQL, React with Inertia, Tailwind as chosen. No additional frameworks or infrastructure.
- C2: No paid services beyond hosting and (optionally) a free-tier email provider.
- C3: No background workers or schedulers in the MVP.

## 1.7 Explicit MVP exclusions

Google OAuth and any social login; project images and file uploads; in-app chat and messaging; lecturer, department and organization accounts; recommendations and machine-learning matching; email digests and opportunity alerts; notification preferences; peer endorsements and reputation scores; certificates and experience sections; role-specific openings; re-applying after rejection; reassigning project ownership; project edit history; analytics dashboards; queues, caching layers, search engines (Elasticsearch, Meilisearch), Redis, Docker orchestration, microservices.

## 1.8 Acceptance criteria for main workflows

**AC-1 Registration and verification**

- Given a visitor, when they register with `abebe@aau.edu.et` and a valid password, then an account exists with `email_verified_at` empty and a verification email is sent.
- Given a visitor, when they register with `abebe@gmail.com` or `abebe@evilaau.edu.et`, then registration fails with a message naming the allowed university domain, and no account is created.
- Given `Abebe@AAU.edu.et` is registered, when someone registers `abebe@aau.edu.et`, then it fails as already taken.
- Given an unverified user who is logged in, when they open `/projects`, then they are redirected to the verification notice page.
- Given a valid unexpired link, when the user opens it, then `email_verified_at` is set and they can reach the profile setup page. Given an expired or tampered link, then verification fails with a clear message.

**AC-2 Profile**

- Given a verified user with an incomplete profile, when they try to create a project or apply, then they are redirected to complete the profile.
- Given another student's profile page, then it never shows email or Telegram handle in the page or in the data sent to the browser.

**AC-3 Create and manage a project**

- Given a complete-profile student, when they submit valid project data, then the project is saved with status open and appears in the feed.
- Given invalid data (past deadline, 0 openings, no skills), then it fails with field-specific errors.
- Given student B, when they attempt to edit or delete student A's project by URL, then they receive 403.

**AC-4 Discovery**

- Given 30 recruiting projects, then page 1 shows 12 newest-first and page 2 keeps any chosen filters.
- Given a project whose deadline was yesterday, then it does not appear in the default feed. With "include non-recruiting" on, it appears labelled "Deadline passed".
- Given filters category=Hackathon and skill=Laravel, then only projects matching both appear.

**AC-5 Join request**

- Given a recruiting project, when a student submits a 10 to 500 character message, then a pending request exists and the owner receives an email.
- Given an existing request, when the student applies again, then no second request is created and they see their existing status.
- Given the owner, then they cannot apply to their own project.

**AC-6 Review and capacity**

- Given a project with 1 opening and two pending requests, when the owner accepts the first, then the second accept fails with "No openings left", exactly one participant row exists, and the project shows as full.
- Given the owner accepts, then the applicant receives an email and can see the project's Telegram contact.
- Given any other user, when they call the accept route, then they receive 403.

**AC-7 Completion**

- Given an open project with two accepted members, when the owner completes it crediting one, then the project is completed and read-only, the credited member sees a pending credit, and the other member has no credit.
- Given the credited member confirms, then the project appears on their profile. Before confirming, it does not.
- Given a second completion attempt, then no data changes.

**AC-8 Administration**

- Given an admin removes a project with a reason, then it disappears from the feed and a moderation log entry exists.
- Given an admin suspends a user, then that user's next request shows the suspension notice even if already logged in.
- Given a non-admin requests any `/admin` URL, then they receive 403.
