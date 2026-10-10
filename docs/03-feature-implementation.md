# ProjectNode Blueprint — File 03: Feature Implementation Specification

*Version 1.1. Code snippets are deliberately short and omit `use` import lines to stay readable; your editor will add imports. They show the **shape** of the solution, not a complete codebase.*

## 3.0 Foundations used by every feature

**Authentication versus authorization.** *Authentication* answers "who are you?" and is proven by a password and a session cookie. *Authorization* answers "what are you allowed to do?" and is decided per action and per record. Think of a hotel: the front desk checks your ID and gives you a keycard (authentication); the card then opens only your own room (authorization). A very common beginner bug is to build excellent login and then let any logged-in user open `/projects/7/edit` for someone else's project. In ProjectNode, Breeze gives you authentication; **Policies and Gates** give you authorization, and every owner-only route must call them.

**The template for every feature below:** Components, Sequence, Validation, Authorization, Database operations, Edge cases, Errors.

### Configuration: allowed domains and page size

`config/projectnode.php`:

```php
return [
    'allowed_email_domains' => array_values(array_filter(array_map(
        'trim',
        explode(',', strtolower(env('ALLOWED_EMAIL_DOMAINS', 'aau.edu.et')))
    ))),
    'feed_page_size' => 12,
];
```

`.env`: `ALLOWED_EMAIL_DOMAINS=aau.edu.et`. Add a second domain later by comma. **Gotcha:** after `php artisan config:cache` (which you run in production), `env()` returns `null` anywhere outside the `config/` folder. That is why application code must always call `config('projectnode.allowed_email_domains')`, never `env()`.

### Middleware aliases (Laravel 11 and 12 style)

In `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'not.suspended'    => EnsureUserIsNotSuspended::class,
        'profile.complete' => EnsureProfileIsComplete::class,
    ]);
})
```

`auth` and `verified` already exist. Two custom classes are created with `php artisan make:middleware`.

### Route structure

```php
Route::get('/', fn () => Inertia::render('Landing'))->name('home');

Route::middleware(['auth', 'verified', 'not.suspended'])->group(function () {
    Route::get('/profile/setup', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/students/{user}', [StudentController::class, 'show']);

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

    Route::middleware('profile.complete')->group(function () {
        // /projects/create MUST be declared before /projects/{project}
        Route::get('/projects/create', [ProjectController::class, 'create']);
        Route::post('/projects', [ProjectController::class, 'store']);
        // ...edit, update, destroy, join requests, completion, etc.
    });

    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
});

Route::prefix('admin')->middleware(['auth', 'verified', 'not.suspended', 'can:moderate'])->group(/* ... */);
```

Two gotchas: (1) `/projects/create` must come before `/projects/{project}`, otherwise Laravel treats the word "create" as a project id and returns 404. (2) The suspended notice route (`/suspended`) and `logout` live in a group with only `auth`, otherwise a suspended user would be redirected in an endless loop.

### Enums

Use PHP backed enums so that status strings are never typed by hand:

```php
enum ProjectStatus: string {
    case Open = 'open';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
// likewise: ProjectCategory, JoinRequestStatus, ParticipantRole
```

---

## 3.1 Registration, domain validation and email verification (FR-AUTH-01 to FR-AUTH-09)

**Three different checks (do not confuse them).**

| Check | Question it answers | Tool | What it does **not** prove |
|---|---|---|---|
| Email **format** validation | Does this text look like an email address? | Laravel `email` rule | Anything about the owner or whether the mailbox exists |
| Domain **eligibility** | Is this address in a domain we accept? | Our `AllowedUniversityEmail` rule | That the registrant owns the address. Anyone can *type* `someone@aau.edu.et`. |
| Email **ownership** verification | Can this person read mail sent to this address? | `MustVerifyEmail` + signed link | That they are a current student (only that they control the mailbox) |

Only the third check establishes trust, and even it is bounded by what AAU's mail system guarantees. The first two are filters.

**How `MustVerifyEmail` works, step by step**

1. Add `implements MustVerifyEmail` to the `User` model.
2. When registration finishes, `event(new Registered($user))` fires. Laravel's built-in listener `SendEmailVerificationNotification` sees that the user implements `MustVerifyEmail` and sends the `VerifyEmail` notification.
3. That email contains a **temporary signed URL**: the route `verification.verify` with the user id, a hash of the email address, an expiry time (default 60 minutes) and a signature. The signature is an HMAC computed with your `APP_KEY`, so if anyone changes the id, hash or expiry, the signature check fails.
4. Clicking the link hits a route guarded by the `signed` middleware, handled by Laravel's `EmailVerificationRequest`. It confirms that the logged-in user matches the id and hash, then calls `fulfill()`, which sets `email_verified_at` and fires the `Verified` event.
5. The **`verified` middleware** (`EnsureEmailIsVerified`) is attached to protected routes. On each request it calls `$user->hasVerifiedEmail()`. If false, it redirects to the `verification.notice` page (or returns 403 for JSON requests). That is the mechanism that keeps unverified users out; there is no other check to remember.

**Components:** `RegisteredUserController` (from Breeze), `AllowedUniversityEmail` rule, `User` model, `Register.jsx`, `VerifyEmail.jsx`, `config/projectnode.php`.

**The custom rule** (`php artisan make:rule AllowedUniversityEmail`):

```php
class AllowedUniversityEmail implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $at = strrchr((string) $value, '@');          // '@aau.edu.et' or false
        $domain = $at === false ? '' : strtolower(substr($at, 1));

        if (! in_array($domain, config('projectnode.allowed_email_domains'), true)) {
            $fail('Please register with your university email ('
                . implode(', ', config('projectnode.allowed_email_domains')) . ').');
        }
    }
}
```

Why it compares the **whole domain** with `in_array` and not `str_ends_with($email, 'aau.edu.et')`: the suffix version accepts `x@evilaau.edu.et`. If AAU later has sub-domains such as `students.aau.edu.et`, add them explicitly to the allow-list instead of loosening the check.

**Registration changes to Breeze's controller:**

```php
public function store(Request $request)
{
    $request->merge(['email' => strtolower(trim((string) $request->email))]);

    $request->validate([
        'name'     => ['required', 'string', 'max:100'],
        'email'    => ['required', 'string', 'email', 'max:255',
                       new AllowedUniversityEmail, 'unique:users,email'],
        'password' => ['required', 'confirmed',
                       Rules\Password::min(8)->letters()->numbers()],
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    try {
        event(new Registered($user));      // sends the verification email
    } catch (Throwable $e) {
        report($e);                        // log it; do not lose the new account
    }

    Auth::login($user);
    return redirect()->route('projects.index');   // 'verified' middleware bounces to the notice page
}
```

The lowercasing step matters on PostgreSQL, where `A@x.com` and `a@x.com` are different strings and `unique` is case-sensitive.

**Validation:** name required, max 100; email required, valid, max 255, allowed domain, unique; password confirmed, minimum 8, letters and numbers.

**Authorization:** none (public route), but add `throttle:10,1` to the POST route. Authenticated users are redirected away from the register page by Breeze's `guest` middleware.

**Database operations:** one INSERT into `users`; `email_verified_at` stays NULL.

**Edge cases**

- *Mail server down during registration:* handled by the try/catch above; the user lands on the notice page and can use Resend.
- *Expired link:* Laravel returns 403 for an invalid signature. Add a friendly 403 error page that says "This link has expired. Log in and request a new one."
- *Link opened while logged out:* the `auth` middleware sends them to login first, then returns them to the link. Mention this in the notice text.
- *Email change:* Breeze's profile page allows changing the email, which would let users bypass the domain rule. **Remove the email field from the profile form and from `ProfileUpdateRequest`** (the email is read-only in the MVP).
- *Squatting:* someone can register `victim@aau.edu.et` without owning it; the account stays unverified and unusable, but it occupies the address. Risk is low at campus scale; the support workaround is to delete the unverified row. A hardening step for later: let a new registration overwrite an unverified account.
- *Plus addressing:* if AAU mail supports `name+tag@aau.edu.et`, one mailbox can create several accounts. Ownership is still proven, so it is an accepted limitation.
- *Suspended user logs in:* the `not.suspended` middleware redirects them to a notice page.

**Error handling:** validation errors return the user to the form with messages (Inertia passes them as `errors` props); the form shows each next to its field.

**Tests (feature tests):** valid AAU email registers; `gmail.com`, `evilaau.edu.et`, `aau.edu.et.attacker.com` all fail; case-variant duplicate fails; unverified user redirected from `/projects`; a signed verification URL generated with `URL::temporarySignedRoute(...)` verifies; a tampered one returns 403.

---

## 3.2 Google OAuth (not built in the MVP; explained for Phase 2)

The brief asks for these explanations *if* OAuth is included. The decision (ADR-4) is to exclude it, and here is the reasoning in concrete terms.

**The flow with Laravel Socialite**

1. The student clicks "Continue with Google". Your route calls `Socialite::driver('google')->redirect()`, sending the browser to Google with your client id, requested scopes (`openid email profile`) and a random `state` value that protects against forged callbacks.
2. The student signs in at Google and consents.
3. Google redirects back to your **callback route** with a one-time `code`.
4. In the callback, `Socialite::driver('google')->user()` exchanges the code for tokens (server to server) and returns the profile: Google's user id, name and email, plus raw claims including `email_verified` and, for Google Workspace accounts, `hd` (hosted domain).
5. Your code decides what to do with that identity (below).

**What the callback must do:** reject unless `email_verified` is true; reject unless the email domain is allow-listed using the *same* `AllowedUniversityEmail` logic (never trust the client or the `hd` request parameter, which is only a UI hint); then find or create the local user.

**Why checking an email suffix alone is not enough.** A suffix or domain string tells you what the address *says*, not who is *behind* it. You also need proof of control (`email_verified` from a trusted identity provider, or your own verification link), and you must remember that addresses can be reassigned, aliased or belong to staff and alumni. Domain checks answer "is this the right kind of address?", never "is this a current student?".

**Duplicate accounts and linking.** Add a `social_accounts` table (user_id, provider, provider_user_id UNIQUE). In the callback: (1) look up by `provider_user_id`; if found, log that user in. (2) Otherwise, if a local user already has that verified email, link the Google identity to it only because the provider verified the same email; a safer variant requires the user to be logged in or to confirm via password. (3) Otherwise create a new user with `email_verified_at` set (the provider already verified it) and no usable password. Never create two users for one email: the unique index on `users.email` is your final safety net.

**Risk specific to this project:** if AAU mailboxes are not Google accounts, none of this works. Ask AAU IT before spending time on it.

---

## 3.3 Student profiles (FR-PROF-01 to FR-PROF-06)

**What is required, optional, public, private**

| Field | Required | Visible to other verified students | Notes |
|---|---|---|---|
| Name | Yes | Yes | |
| University email | Yes (account) | **No** | Used only for login and notifications |
| Department | Yes | Yes | From controlled list |
| Year of study | Yes | Yes | 1 to 7 |
| Bio | Yes | Yes | 20 to 500 characters |
| Skills | Yes (at least 1) | Yes | From controlled list, up to 15 |
| Interests | Optional | Yes | Free text, not searchable |
| Telegram handle | Yes | **No** (only to a project owner you apply to, FR-JOIN-04) | Cannot be verified by the platform |
| Completed projects | Automatic | Yes (confirmed credits only) | |

Nobody outside the university can see any profile: all profile routes sit behind `auth` and `verified`.

**Components:** `ProfileController` (`edit`, `update`), `StudentController@show`, `UpdateProfileRequest`, `EnsureProfileIsComplete` middleware, `StudentResource`, pages `Profile/Edit.jsx` and `Students/Show.jsx`.

**Sequence:** verified user is redirected to `/profile/setup` (by `profile.complete` when they try to act, and by a link on first login) → submits the form → request validated → controller saves fields, syncs skills, recomputes completion → redirect to feed.

**Validation (`UpdateProfileRequest`):**

```php
public function rules(): array
{
    return [
        'name'            => ['required', 'string', 'max:100'],
        'department_id'   => ['required', 'exists:departments,id'],
        'year_of_study'   => ['required', 'integer', 'between:1,7'],
        'bio'             => ['required', 'string', 'min:20', 'max:500'],
        'interests'       => ['nullable', 'string', 'max:255'],
        'telegram_handle' => ['required', 'regex:/^[A-Za-z][A-Za-z0-9_]{4,31}$/'],
        'skill_ids'       => ['required', 'array', 'min:1', 'max:15'],
        'skill_ids.*'     => ['integer', 'distinct', 'exists:skills,id'],
    ];
}

protected function prepareForValidation(): void
{
    $this->merge(['telegram_handle' => ltrim(trim((string) $this->telegram_handle), '@')]);
}
```

The Telegram pattern reflects Telegram's username rules: 5 to 32 characters, letters, digits and underscore, starting with a letter. `prepareForValidation` strips a pasted leading `@` so the stored value is consistent.

**Controller update:**

```php
public function update(UpdateProfileRequest $request)
{
    $user = $request->user();               // never read a user id from the request
    $user->fill($request->safe()->except('skill_ids'));
    $user->profile_completed_at = $user->profile_completed_at ?? now();
    $user->save();
    $user->skills()->sync($request->validated('skill_ids'));

    return redirect()->route('projects.index')->with('success', 'Profile saved.');
}
```

Because every required field is validated as required on save, a successful save always means a complete profile, so setting `profile_completed_at` is safe here.

**The middleware:**

```php
public function handle(Request $request, Closure $next)
{
    if (! $request->user()->profile_completed_at) {
        return redirect()->route('profile.edit')
            ->with('info', 'Please complete your profile first.');
    }
    return $next($request);
}
```

**Authorization:** you can only edit yourself, because the controller uses `$request->user()` and the URL has no user id (this removes a whole class of bugs called IDOR, insecure direct object reference). Viewing `/students/{user}` is allowed to any verified student; the controller returns a `StudentResource` that lists safe fields explicitly, never `$user` itself.

**Database operations:** UPDATE `users`; sync (delete and insert) rows in `skill_user`. For the profile history, a query on `project_participants` joined to `projects` where `user_id` equals the student and `confirmed_at` is not null and the project is not soft-deleted.

**Edge cases:** the skill list is changed after projects exist (no effect on old projects); a department is deleted (FK set null, profile becomes incomplete in the UI, show a prompt); user pastes a Telegram link instead of a handle (the validation message explains the expected format).

**Errors:** field errors inline; if the skill or department list is empty because seeding was forgotten, the page should show a clear message instead of an empty dropdown (add a check in `Profile/Edit.jsx`).

---

## 3.4 Project creation and editing (FR-PROJ-01 to FR-PROJ-06)

**Listing model decision (D11).** One project listing has **one** `slots_total` number of openings. The consequence: you cannot say "1 designer and 2 developers" as separate openings; owners describe roles in the description and in the required-skills list. This single integer keeps capacity logic to one comparison. Role-specific openings would require a `project_roles` table, per-role capacity counts, and a role choice on every application; that is Phase 2.

**Components:** `ProjectController` (`create`, `store`, `edit`, `update`, `destroy`, `updateStatus`), `StoreProjectRequest`, `UpdateProjectRequest`, `ProjectPolicy`, `Project` model, `ProjectResource`, pages `Projects/Create.jsx`, `Edit.jsx`, `Show.jsx`.

**Implementation sequence (store):** validate → authorize → open a transaction → create the project with `owner_id` taken from the logged-in user → attach skills → create the owner's participant row → commit → redirect to the project page.

**Validation rules (`StoreProjectRequest`):**

```php
public function rules(): array
{
    return [
        'title'                => ['required', 'string', 'min:5', 'max:120'],
        'description'          => ['required', 'string', 'min:30', 'max:5000'],
        'category'             => ['required', Rule::enum(ProjectCategory::class)],
        'department_id'        => ['nullable', 'exists:departments,id'],
        'skill_ids'            => ['required', 'array', 'min:1', 'max:10'],
        'skill_ids.*'          => ['integer', 'distinct', 'exists:skills,id'],
        'slots_total'          => ['required', 'integer', 'between:1,20'],
        'hours_per_week'       => ['required', 'integer', 'between:1,40'],
        'duration_weeks'       => ['required', 'integer', 'between:1,52'],
        'application_deadline' => ['required', 'date', 'after_or_equal:today',
                                   'before_or_equal:+180 days'],
        'telegram_contact'     => ['required', 'regex:/^[A-Za-z][A-Za-z0-9_]{4,31}$/'],
    ];
}
```

`UpdateProjectRequest` reuses the same rules with two changes: `slots_total` gets a dynamic minimum equal to the number of members already accepted (`'min:' . $project->members()->count()`, so an owner cannot shrink a project below its current team), and the deadline may stay unchanged even if it is already in the past (only a *changed* deadline must be today or later). The `telegram_contact` field is pre-filled from the owner's profile handle in the form.

**Store action:**

```php
public function store(StoreProjectRequest $request)
{
    $this->authorize('create', Project::class);

    $project = DB::transaction(function () use ($request) {
        $project = Project::create([
            ...$request->safe()->except('skill_ids'),
            'owner_id' => $request->user()->id,     // never from the form
        ]);
        $project->skills()->sync($request->validated('skill_ids'));
        $project->participants()->create([
            'user_id' => $request->user()->id,
            'role' => ParticipantRole::Owner,
        ]);
        return $project;
    });

    return redirect()->route('projects.show', $project)->with('success', 'Project published.');
}
```

**Mass assignment protection.** `Project::$fillable` lists only the user-editable columns. `owner_id`, `status`, `completed_at`, `outcome_summary` and `outcome_url` are **not** fillable and are set only by dedicated code paths. Never pass `$request->all()` to `create` or `update`; use `validated()` or `safe()`. Otherwise a user could add `owner_id=5` to the form and hijack ownership. (Because `owner_id` is not fillable, the `create` call above needs `forceFill`, or you can build the model with `new Project($data)`, set `$project->owner_id = ...`, and `save()`.)

**Authorization (`ProjectPolicy`):**

```php
class ProjectPolicy
{
    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail() && $user->profile_completed_at !== null
            && $user->suspended_at === null;      // belt and braces on top of middleware
    }

    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id
            && in_array($project->status, [ProjectStatus::Open, ProjectStatus::InProgress]);
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id
            && $project->status !== ProjectStatus::Completed
            && ! $project->members()->exists();
    }

    public function viewContact(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id
            || $user->role === 'admin'
            || $project->members()->where('user_id', $user->id)->exists();
    }

    public function remove(User $user, Project $project): bool   // moderation
    {
        return $user->role === 'admin';
    }
}
```

Laravel discovers `ProjectPolicy` automatically from the `Project` model name. In a controller call `$this->authorize('update', $project)`; in Form Requests you may do it inside `authorize()`. The policy intentionally contains **no** "admin can edit anything" shortcut (BR-12).

**Status changes:** `PATCH /projects/{project}/status` with `status` validated by `Rule::in(['in_progress','cancelled'])`, authorized by `update`. Completion has its own endpoint (3.7). Reopening is not allowed (BR-09); the consequence is that an owner who closes recruiting by mistake must publish a new listing. This keeps the status machine tiny.

**Database operations:** INSERT into `projects`, `project_skill`, `project_participants`; UPDATE on edit; soft delete sets `deleted_at`.

**Edge cases:** deadline set in the past on edit; owner cancels with pending requests (they remain pending but display "Project cancelled"); owner tries to delete after accepting people (policy denies, message suggests cancelling); duplicate submission by double-click (accepted as low harm; disable the submit button while processing with Inertia's `processing` flag); project text containing HTML or scripts (React escapes output by default; **never** use `dangerouslySetInnerHTML` for user text); long descriptions rendered with `whitespace-pre-line` in Tailwind so line breaks survive without allowing markup.

**Errors:** field errors inline; unauthorized access shows the 403 page; deleted or non-existent project shows 404 (soft-deleted projects return 404 through route-model binding automatically).

---

## 3.5 Project discovery: feed, filters, search, pagination (FR-DISC-01 to FR-DISC-05)

**Components:** `ProjectController@index`, `ProjectIndexRequest` (validates query-string parameters), model scopes `recruiting()` and `filter()`, `ProjectCardResource`, page `Projects/Index.jsx`.

**Filter semantics (a choice made for you):** when several skills are selected, a project matches if it requires **any** of them (OR), because students searching by skill are asking "where can I use what I know?". All *different* filters combine with AND.

**Validation (query string):** `category` nullable enum; `department_id` nullable exists; `skills` nullable array max 5 of existing ids; `posted` nullable in 7 or 30; `deadline_within` nullable in 7, 14 or 30; `include_closed` boolean; `q` nullable string max 100.

**Model scopes:**

```php
public function scopeRecruiting(Builder $query): Builder
{
    return $query
        ->where('status', ProjectStatus::Open->value)
        ->where('application_deadline', '>=', today()->toDateString())
        ->whereRaw(
            '(select count(*) from project_participants pp
              where pp.project_id = projects.id and pp.role = ?) < projects.slots_total',
            ['member']
        );
}

public function scopeFilter(Builder $query, array $f): Builder
{
    return $query
        ->when($f['category'] ?? null, fn ($q, $v) => $q->where('category', $v))
        ->when($f['department_id'] ?? null, fn ($q, $v) => $q->where('department_id', $v))
        ->when($f['skills'] ?? null, fn ($q, $ids) =>
            $q->whereHas('skills', fn ($s) => $s->whereIn('skills.id', $ids)))
        ->when($f['posted'] ?? null, fn ($q, $d) => $q->where('created_at', '>=', now()->subDays($d)))
        ->when($f['deadline_within'] ?? null, fn ($q, $d) =>
            $q->whereBetween('application_deadline', [today(), today()->addDays($d)]))
        ->when($f['q'] ?? null, function ($q, $term) {
            $like = '%' . addcslashes($term, '%_') . '%';   // escape LIKE wildcards typed by users
            $q->where(fn ($w) => $w->where('title', 'ILIKE', $like)
                                   ->orWhere('description', 'ILIKE', $like));
        });
}
```

`ILIKE` is PostgreSQL's case-insensitive match (on MySQL use `LIKE`). Escaping `%` and `_` means a user typing `100%` searches for that text instead of a wildcard. Laravel already uses bound parameters, so this is **not** about SQL injection; it is about correct behaviour.

**Controller:**

```php
public function index(ProjectIndexRequest $request)
{
    $filters = $request->validated();

    $projects = Project::query()
        ->with(['owner:id,name', 'skills:id,name', 'department:id,name'])   // avoids N+1 queries
        ->withCount(['participants as members_count' => fn ($q) => $q->where('role', 'member')])
        ->whereHas('owner', fn ($q) => $q->whereNull('suspended_at'))     // BR-13
        ->when($request->boolean('include_closed'),
            fn ($q) => $q->where('status', '!=', ProjectStatus::Cancelled->value),
            fn ($q) => $q->recruiting())
        ->filter($filters)
        ->latest()->latest('id')            // newest first, with a tie-breaker
        ->paginate(config('projectnode.feed_page_size'))
        ->withQueryString();

    return Inertia::render('Projects/Index', [
        'projects' => ProjectCardResource::collection($projects),
        'filters'  => $filters,
        'departments' => Department::orderBy('name')->get(['id', 'name']),
        'skills'   => Skill::orderBy('name')->get(['id', 'name']),
    ]);
}
```

**How pagination works.** `paginate(12)` runs two queries: a `COUNT(*)` and a `SELECT ... LIMIT 12 OFFSET (page-1)*12`. `withQueryString()` makes every page link carry the active filters. Inertia renders the links and swaps the results without a full reload when you use its `<Link>` component. This is *offset* pagination; its known flaw is that if new projects are posted while someone is paging, a card can appear twice. That is acceptable for the MVP; `cursorPaginate()` is the upgrade.

**How expired or closed projects are kept out of "recruiting".** The default feed uses `recruiting()` (BR-05), so expired, full, in-progress, completed and cancelled projects never appear in it, with no scheduled job. With "include closed" on, a `displayLabel()` model method (same rules, written in PHP) produces the true label for each card. Keep the SQL scope and the PHP method next to each other in the model and cover both with one test table, so they cannot drift apart.

**Performance:** composite index `(status, application_deadline)`, index on `created_at`, pivot index on `project_skill.skill_id`. `ILIKE '%term%'` cannot use a normal index and scans the table, which is fine for thousands of rows; at larger scale add a `pg_trgm` index or PostgreSQL full-text search (Phase 2).

**Edge cases:** no results (show an empty-state message with a "clear filters" link); a page number beyond the last (Laravel returns an empty page; redirect to page 1); unknown filter values (rejected by validation); filter by a department with no projects.

---

## 3.6 Join-request workflow (FR-JOIN-01 to FR-JOIN-09)

**Status lifecycle:** see the state diagram in 2.6 (file 02). `pending` is the only non-terminal state. Terminal states never change, which is what makes the workflow easy to reason about and to test.

**Components:** `JoinRequestController` (`store`, `withdraw`, `accept`, `reject`, owner `index`, applicant `mine`), `StoreJoinRequestRequest` (validates `message`: required, string, min 10, max 500), `JoinRequestPolicy`, action `AcceptJoinRequest`, notifications, pages `Projects/Requests.jsx` (owner inbox) and `Applications/Index.jsx`.

**Two kinds of "no".** A *403* means you are not allowed to do this at all (a stranger trying to accept a request). A *validation-style error* means you are allowed, but the current state forbids it (project is full). Policies produce the first; the controller or action produces the second with a friendly message. Mixing them up gives users confusing "Forbidden" pages for ordinary situations.

**Applying (store):**

```php
public function store(StoreJoinRequestRequest $request, Project $project)
{
    abort_if($project->owner_id === $request->user()->id, 403);   // owners do not apply to themselves

    if (! $project->isRecruiting()) {
        return back()->withErrors(['message' => 'This project is not accepting applications.']);
    }

    try {
        $joinRequest = $project->joinRequests()->create([
            'applicant_id' => $request->user()->id,
            'message' => $request->validated('message'),
        ]);
    } catch (UniqueConstraintViolationException $e) {
        return back()->withErrors(['message' => 'You have already applied to this project.']);
    }

    $this->notifyOwner($joinRequest);        // wrapped in try/catch, see 3.8
    return back()->with('success', 'Application sent.');
}
```

The **database unique constraint** `(project_id, applicant_id)` is the real duplicate guard. A friendly pre-check query is fine for nicer messages, but only the constraint survives a double-click or two browser tabs. (As with projects, `applicant_id` is set by code, so either list it in `$fillable` for `JoinRequest` or assign it explicitly; it never comes from the form.)

**Owner inbox:** `GET /projects/{project}/requests`, guarded by a `viewRequests` rule (owner only; a student requesting another's inbox gets 403). It lists requests with the applicant's name, department, year, skills, message and Telegram handle through an explicit `ApplicantResource`. Requests from suspended applicants are hidden.

**Deciding a request.** Policy:

```php
public function decide(User $user, JoinRequest $joinRequest): bool
{
    return $user->id === $joinRequest->project->owner_id;
}
```

**Accepting, capacity and simultaneous requests.** Suppose a project has 1 opening and the owner double-clicks "Accept" on two different applicants, or has two tabs open. If both requests run the check "is there room?" at the same moment, both see 0 of 1 filled, both insert a member, and the project is overbooked. This is a **race condition**. The fix is a transaction with a row lock:

```php
class AcceptJoinRequest
{
    public function execute(JoinRequest $joinRequest): void
    {
        DB::transaction(function () use ($joinRequest) {
            // SELECT ... FOR UPDATE: other accepts for this project wait here until we commit.
            $project = Project::whereKey($joinRequest->project_id)->lockForUpdate()->firstOrFail();
            // Re-read the request inside the lock; its status may have changed meanwhile.
            $request = JoinRequest::whereKey($joinRequest->id)->lockForUpdate()->firstOrFail();

            if ($request->status !== JoinRequestStatus::Pending) {
                throw new WorkflowException('This request was already decided.');
            }
            if (! in_array($project->status, [ProjectStatus::Open, ProjectStatus::InProgress])) {
                throw new WorkflowException('This project is no longer active.');
            }
            if ($project->members()->count() >= $project->slots_total) {
                throw new WorkflowException('No openings left.');
            }

            $request->update(['status' => JoinRequestStatus::Accepted, 'decided_at' => now()]);
            $project->participants()->create([
                'user_id' => $request->applicant_id,
                'role' => ParticipantRole::Member,
                'join_request_id' => $request->id,
            ]);
        });
    }
}
```

With the lock, the second transaction pauses at the first `SELECT ... FOR UPDATE`, resumes after the first commits, counts 1 of 1, and fails with "No openings left". `WorkflowException` is a tiny custom class so the controller can catch **only** expected business failures and let real bugs surface as 500 errors. The controller catches it, returns `back()->withErrors(...)`, and sends the acceptance email **after** the transaction finishes, so a slow mail server never holds a database lock and no email is sent for a rolled-back change.

**Rejecting and withdrawing** do not need a lock; use an atomic compare-and-set:

```php
$changed = JoinRequest::whereKey($id)->where('status', 'pending')
    ->update(['status' => 'rejected', 'decided_at' => now()]);
if ($changed === 0) { /* already decided: show a friendly message */ }
```

`UPDATE ... WHERE status = 'pending'` can only succeed once, so a simultaneous withdraw and accept cannot both win. Withdrawal additionally requires `applicant_id` to equal the current user.

**Telegram reveal (FR-JOIN-09):** `ProjectResource` includes `telegram_contact` only when `Gate::allows('viewContact', $project)` is true, so non-members never receive the value in their page data. The "My applications" page shows the contact next to accepted requests only.

**Edge cases:** owner accepts after the deadline (allowed, D9); project completed or cancelled while pending (acceptance blocked); applicant suspended after applying (hidden from inbox); applicant withdraws while owner is deciding (compare-and-set decides); project soft-deleted (routes return 404).

---

## 3.7 Project completion and participation records (FR-COMP-01 to FR-COMP-05)

The design principle: **the owner asserts, the participant agrees, the system freezes.**

**Components:** `ProjectCompletionController` (`create`, `store`), `CompleteProjectRequest`, action `CompleteProject`, `ParticipationConfirmationController@update`, `ProjectPolicy::complete`, pages `Projects/Complete.jsx`, `Dashboard/MyProjects.jsx` (pending credits).

**Sequence:** owner opens the completion form (lists accepted members with **unchecked** boxes) → submits summary, optional link, chosen contributors → validation → policy → action in a transaction → project becomes read-only → credited members see a pending credit → each confirms → credit appears on their profile.

**Validation:**

```php
'outcome_summary'     => ['required', 'string', 'min:20', 'max:1000'],
'outcome_url'         => ['nullable', 'url', 'starts_with:https://', 'max:255'],
'credited_user_ids'   => ['present', 'array'],          // empty array is allowed
'credited_user_ids.*' => ['integer', 'distinct',
    Rule::exists('project_participants', 'user_id')->where(fn ($q) => $q
        ->where('project_id', $this->route('project')->id)
        ->where('role', 'member'))],
```

The scoped `exists` rule is what blocks **false claims**: a user id that is not an accepted member of *this* project is rejected, so an owner cannot credit arbitrary students.

**The action:**

```php
class CompleteProject
{
    public function execute(Project $project, array $data, array $creditedUserIds): void
    {
        DB::transaction(function () use ($project, $data, $creditedUserIds) {
            $p = Project::whereKey($project->id)->lockForUpdate()->firstOrFail();

            if ($p->status === ProjectStatus::Completed) { return; }   // second click: no change
            if ($p->status === ProjectStatus::Cancelled) {
                throw new WorkflowException('A cancelled project cannot be completed.');
            }

            $p->forceFill([
                'status' => ProjectStatus::Completed,
                'completed_at' => now(),
                'outcome_summary' => $data['outcome_summary'],
                'outcome_url' => $data['outcome_url'] ?? null,
            ])->save();
            // The owner is recorded and counted as confirmed automatically.
            $p->participants()->where('role', 'owner')
                ->update(['credited_at' => now(), 'confirmed_at' => now()]);
            // Only members the owner explicitly selected are credited.
            $p->participants()->where('role', 'member')
                ->whereIn('user_id', $creditedUserIds)->update(['credited_at' => now()]);
        });
    }
}
```

**Participant confirmation (compare-and-set again):**

```php
$changed = ProjectParticipant::whereKey($participant->id)
    ->where('user_id', $request->user()->id)     // only your own row
    ->whereNotNull('credited_at')
    ->whereNull('confirmed_at')
    ->update(['confirmed_at' => now()]);
```

**Profile history query:** participants where `user_id` = the student and `credited_at` and `confirmed_at` are both not null, joined to projects that are `completed` and not soft-deleted, newest first. The profile card shows title, category, the owner-written outcome, the person's role and the label "Owner-reported, confirmed by participant".

**Authorization:** `complete` policy: owner and status open or in_progress. Confirmation: the participant themselves only (enforced inside the query). After completion `ProjectPolicy::update` returns false, freezing content.

**Edge cases:** owner credits nobody (valid; only the owner's record exists); owner completes without any accepted members (valid); a participant never confirms (their credit simply never shows; there is no decline button in the MVP); admin removes a completed project (it disappears from everyone's profile because soft-deleted projects are excluded); participant account suspended (their profile is unreachable; records are kept).

**Errors:** a failed validation returns to the form with the list preserved; an attempt to complete a cancelled project shows a clear message; concurrent double submission is harmless because of the lock and the early return.

---

## 3.8 Notifications (FR-NOT-01 to FR-NOT-04)

**What exists:** three emails. Verification (built into Laravel through `MustVerifyEmail`, no code needed), "new join request" to the owner, and "request decided" to the applicant. The password reset email is also built in. Nothing else is sent.

**Components:** two Notification classes created with `php artisan make:notification`, the `mail` channel, and your SMTP settings in `.env`.

```php
class JoinRequestReceived extends Notification
{
    public function __construct(public JoinRequest $joinRequest) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $project = $this->joinRequest->project;

        return (new MailMessage)
            ->subject('New request to join: ' . $project->title)
            ->line($this->joinRequest->applicant->name . ' has asked to join your project.')
            ->action('Review the request', route('projects.requests', $project));
    }
}
```

`JoinRequestDecided` is the same shape with a subject and line that depend on accepted or rejected, and a link to "My applications".

**Deliberate content choices:** emails contain **links, not data**. The applicant's free-text message and the Telegram contact are never put in an email; the recipient must log in to see them. Reasons: email travels through systems you do not control, and the Telegram reveal must stay behind the permission check (FR-JOIN-09).

**Sending safely (FR-NOT-04):**

```php
try {
    $project->owner->notify(new JoinRequestReceived($joinRequest));
} catch (Throwable $e) {
    report($e);    // writes to the log; the request itself already succeeded
}
```

Without the try/catch, an SMTP outage would turn a successful application into a 500 error page even though the row was saved.

**Synchronous versus queued (D4).** By default `notify()` sends immediately inside the web request, which adds around a second of waiting. Queuing (`implements ShouldQueue` on the notification, `QUEUE_CONNECTION=database`, plus a running `queue:work` process) removes the wait but adds a background process to deploy, restart and monitor. For two low-volume emails, synchronous is the right MVP choice; moving to queues later is a one-line interface change per notification.

**Mail configuration:** set `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`. Use a transactional provider and complete its sender-domain setup (SPF and DKIM DNS records), otherwise mail to university inboxes is likely to land in spam. Locally use Mailpit or `MAIL_MAILER=log`.

**Edge cases:** user never receives the verification email (resend button, spam hint, throttle); double-click creating two requests (the unique constraint blocks the second, so one email); deleted project between request and click (404 page).

**Out of scope:** opportunity or digest emails and notification preferences (no recommendation mechanism exists to base them on).

---

## 3.9 Administration and moderation (FR-ADM-01 to FR-ADM-06)

**How admin power is authorized.** There are two layers, both on the server. A **Gate** decides whether you may enter the admin area at all; **Policies** decide whether you may act on a specific record.

```php
// AppServiceProvider::boot()
Gate::define('moderate', fn (User $user) => $user->role === 'admin');
```

The route group uses `can:moderate` (shown in 3.0). A non-admin who types `/admin/users` receives 403 even if the page was never linked anywhere. Hiding the Admin menu item in React is a convenience only.

**How the first admin is created.** Admins are never created through the public form. They register normally (and verify their email like everyone else) and are promoted with an Artisan command:

```php
// php artisan projectnode:make-admin someone@aau.edu.et
public function handle(): int
{
    $user = User::where('email', strtolower($this->argument('email')))->first();

    if (! $user || ! $user->hasVerifiedEmail()) {
        $this->error('User not found or email not verified.');
        return self::FAILURE;
    }

    $user->forceFill(['role' => 'admin'])->save();   // role is not mass-assignable
    $this->info('Done.');
    return self::SUCCESS;
}
```

**Components:** `Admin\UserController` (`index`, `suspend`, `unsuspend`), `Admin\ProjectController` (`index`, `destroy`), `UserPolicy`, `ProjectPolicy::remove`, `ModerationAction` model, `SuspendUserRequest`, pages `Admin/Users.jsx`, `Admin/Projects.jsx`.

**What admins can do and cannot do:** list and search users and projects (including removed projects through `withTrashed()`), remove a project, suspend or unsuspend a user. There is deliberately **no** route that edits a user's profile or a project's text (BR-12).

**Suspension:**

```php
public function suspend(SuspendUserRequest $request, User $user)     // reason: required, min 10, max 500
{
    $this->authorize('suspend', $user);   // UserPolicy: admin only, never self, never another admin

    DB::transaction(function () use ($request, $user) {
        $user->forceFill([
            'suspended_at' => now(),
            'suspension_reason' => $request->validated('reason'),
        ])->save();

        DB::table('sessions')->where('user_id', $user->id)->delete();   // end active logins now

        ModerationAction::create([
            'admin_id' => $request->user()->id,
            'action' => 'user_suspended',
            'target_type' => 'user',
            'target_id' => $user->id,
            'reason' => $request->validated('reason'),
        ]);
    });

    return back()->with('success', 'User suspended.');
}
```

Deleting rows from `sessions` works because the session driver is `database`; this also covers the case where the suspended user is mid-session. The `not.suspended` middleware is the second safety net, checking `suspended_at` on every request.

**Project removal:** `$this->authorize('remove', $project)`, then `$project->delete()` (soft delete) and a `ModerationAction` row with action `project_removed` and the reason. A removed project vanishes from feeds, profiles and its participants' histories. Restoring is not part of the MVP; an admin with database access can clear `deleted_at`.

**Edge cases:** an admin tries to suspend themselves or another admin (policy denies); suspending a user who owns projects (their projects are hidden from the feed through BR-13, nothing is deleted); unsuspending restores everything; the same project removed twice (the second call is a no-op because soft-deleted models are not found by route binding).

**Recording moderation actions:** the `moderation_actions` table is append-only (no edit or delete routes) and stores who, what, which record, why and when. Add a read-only "Moderation log" list to the admin area if time permits.

**Reports (FR-ADM-06, Could):** if added, the minimum is a `project_reports` table (project_id, reporter_id, reason, created_at, handled_at) with a unique pair `(project_id, reporter_id)`, a "Report" button on project pages, and a list in admin. Not required for the core flow.

---

## 3.10 Non-functional requirements: how each is implemented in practice

| Requirement | Concrete implementation in this project |
|---|---|
| **Authentication security** | Breeze session auth. The session ID is regenerated at login (Breeze does this). In production set `SESSION_SECURE_COOKIE=true` so the cookie travels only over HTTPS; cookies are `HttpOnly` and `SameSite=lax` by default. Login is throttled (Breeze `LoginRequest`). CSRF tokens are handled automatically by Inertia. |
| **Authorization security** | Policies per model plus the `moderate` Gate; coarse checks in route middleware (`auth`, `verified`, `not.suspended`, `profile.complete`, `can:moderate`); fine checks with `$this->authorize()` in controllers. A test per owner-only route asserts HTTP 403 for a stranger. |
| **Input validation** | One Form Request class per write endpoint; `validated()` or `safe()` is the only input used for saving; enums validated with `Rule::enum`; foreign ids validated with `exists`. React escapes output by default; never use `dangerouslySetInnerHTML` for user text. All queries use Eloquent or bound parameters; the one `whereRaw` uses a placeholder. |
| **Password security** | `Hash::make` (bcrypt, never stored in plain text); `Password::min(8)->letters()->numbers()`; password in `$hidden` on the model; reset links expire (default 60 minutes) and are throttled. Optionally add `->uncompromised()`, which checks the password against a breach database through a privacy-preserving API call. |
| **Protection against unauthorized record access** | Policies; never accept a user id for "my own" actions (use `$request->user()`); prefer scoped queries such as `$request->user()->joinRequests()->findOrFail($id)` which can only find the caller's own rows; explicit API Resources decide which fields leave the server. |
| **Email verification** | `MustVerifyEmail` plus `verified` middleware on every protected group; allow-listed domain rule; email not editable after registration. |
| **Database integrity** | Foreign keys, unique constraints `(project_id, applicant_id)` and `(project_id, user_id)`, CHECK constraints on statuses and ranges, transactions for multi-step writes, `lockForUpdate()` for capacity, soft deletes for projects. |
| **Error handling** | Friendly Inertia error page for 403, 404, 419, 500 (below); `APP_DEBUG=false` in production; expected business failures use `WorkflowException` and friendly messages; unexpected exceptions are logged with `report()`; log channel `daily`, level `warning` in production. |
| **Performance and pagination** | `paginate(12)`; indexes listed in 2.4; eager loading with `with()` and `withCount()`; production caches via `config:cache`, `route:cache`, `view:cache`; built frontend assets (`npm run build`), never the dev server. |
| **Maintainability** | Thin controllers, Form Requests, Policies, two Action classes, enums for statuses, `./vendor/bin/pint` for formatting, `.env.example` kept current, a README with setup steps, small commits per feature, a clear folder convention (`app/Actions`, `app/Policies`, `app/Http/Requests`, `app/Http/Resources`, `app/Enums`). |
| **Privacy** | Collect only what the features need; email never leaves the server except in your own notification emails; Telegram handles revealed by rule; profiles visible only to verified students; suspension keeps data but blocks access; logs avoid personal data; a short privacy page explains what is stored and who sees it; a manual process for deletion requests (an admin removes the account through the database). Ethiopia has a recent personal-data protection law; ask your university or a legal adviser what obligations apply to you. I am not a lawyer. |
| **Accessibility and usability** | Every input has a `<label>`; errors are announced next to the field with text (not only colour); buttons are real `<button>` elements; focus rings are never removed; colour contrast meets WCAG AA; layouts work at 360 px (Tailwind mobile-first classes); status badges include text ("Full", "Deadline passed"); empty states and loading states exist; forms disable the submit button while `processing`. |
| **Secure handling of config and secrets** | Secrets only in `.env` (listed in `.gitignore`); `.env.example` has placeholders; `php artisan key:generate` per environment; different database and mail credentials for local and production; the database user has only the privileges the app needs; if a secret ever reaches Git, rotate it, do not just delete the commit. |
| **Deployment configuration** | See the checklist below. |
| **Basic testing** | See below. |

**Friendly error pages (in `bootstrap/app.php`):**

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
        $status = $response->getStatusCode();

        if (! app()->environment(['local', 'testing']) && in_array($status, [403, 404, 419, 500, 503])) {
            return Inertia::render('Error', ['status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        }
        return $response;
    });
})
```

`Error.jsx` maps each status to a plain-language message and a link home. For 419 say "Your session expired. Please refresh and try again."

**Production configuration and deployment checklist**

| Item | Value or command |
|---|---|
| `.env` | `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://your-domain`, `APP_TIMEZONE=Africa/Addis_Ababa`, `DB_CONNECTION=pgsql` plus host, port, database, user, password, `SESSION_DRIVER=database`, `SESSION_SECURE_COOKIE=true`, `LOG_LEVEL=warning`, `ALLOWED_EMAIL_DOMAINS=aau.edu.et`, all `MAIL_*` values |
| Install | `composer install --no-dev --optimize-autoloader` |
| Frontend | `npm ci && npm run build` on your machine or CI; deploy the built `public/build` folder |
| Database | `php artisan migrate --force`, then run department and skill seeders (written with `updateOrCreate` so they are safe to repeat) |
| Caches | `php artisan config:cache && php artisan route:cache && php artisan view:cache` |
| Web server | Document root is `public/` (never the project root, or `.env` could be downloaded); HTTPS enabled; if behind a proxy or load balancer configure trusted proxies so Laravel knows the request was HTTPS |
| Permissions | `storage/` and `bootstrap/cache/` writable by the web user |
| Backups | Nightly `pg_dump`, stored off the server; **test a restore once** |
| Not needed | Cron scheduler and queue workers (nothing in the MVP uses them) |
| Admin | `php artisan projectnode:make-admin <email>` after you register |

**Testing strategy.** Write feature tests with PHPUnit against a PostgreSQL test database using `RefreshDatabase`. Create model factories early, with a `completeStudent()` state (verified email, completed profile). About 25 well-chosen tests beat 100 trivial ones. Priority list:

1. Registration accepts `aau.edu.et`, rejects `gmail.com`, `evilaau.edu.et` and case-duplicates (AC-1).
2. Unverified users cannot reach protected routes.
3. A stranger gets 403 on edit, delete, view-requests, accept and complete (AC-3, AC-6).
4. Duplicate join request is blocked; owner cannot apply to own project (AC-5).
5. Capacity: with 1 opening, accepting a second request fails and exactly one participant row exists (AC-6).
6. Feed excludes expired, full, closed and removed projects; filters combine (AC-4).
7. Completion is idempotent, rejects non-member ids, and credits appear on profiles only after confirmation (AC-7).
8. Suspended users are blocked; non-admins get 403 on `/admin` (AC-8).
9. Another student's profile data contains no email and no Telegram handle.

```php
public function test_a_stranger_cannot_accept_a_request(): void
{
    $joinRequest = JoinRequest::factory()->create();
    $stranger = User::factory()->completeStudent()->create();

    $this->actingAs($stranger)
        ->patch(route('join-requests.accept', $joinRequest))
        ->assertForbidden();

    $this->assertSame(JoinRequestStatus::Pending, $joinRequest->fresh()->status);
}
```

Finish with one manual end-to-end walkthrough on Day 14 using two real browsers (owner and applicant) and one real `aau.edu.et` inbox.
