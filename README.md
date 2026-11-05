<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# ProjectNode

ProjectNode is a student project discovery and collaborator network engineered for Addis Ababa University (AAU).

---

## Email setup

ProjectNode delivers real email verification messages using standard SMTP. Follow the instructions below to configure email delivery for local development or production.

### 1. Local Testing with Gmail SMTP

For testing email delivery locally using a Gmail account:
1. Ensure **2-Step Verification** is enabled on your Google Account.
2. Generate a dedicated **Google App Password** (under *Security > 2-Step Verification > App passwords*). Your normal Gmail account password will **not** work.
3. Configure the following keys in your local `.env`:

```env
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="ProjectNode"
```

> **Note on Port & Encryption:** Port `587` negotiates STARTTLS with `MAIL_SCHEME=null`. If using port `465`, set `MAIL_SCHEME=smtps`.

### 2. Production Email Setup

For production deployments, use a dedicated transactional email provider on a free or standard tier (e.g., Brevo, Resend, Mailgun, Postmark, or SendGrid):
- Configure generic SMTP credentials provided by your transactional mail service:
  ```env
  MAIL_MAILER=smtp
  MAIL_SCHEME=null
  MAIL_HOST=smtp.provider.com
  MAIL_PORT=587
  MAIL_USERNAME=your-smtp-username
  MAIL_PASSWORD=your-smtp-api-key
  MAIL_FROM_ADDRESS="no-reply@yourdomain.edu.et"
  MAIL_FROM_NAME="ProjectNode"
  ```
- **SPF and DKIM DNS Records:** You **must** configure SPF and DKIM DNS records on your sending domain. Institutional university mail filters (like AAU) will reject or spam unsigned external mail.

---

### Critical Operational Warnings

> [!WARNING]
> **APP_URL Signature Matching:**
> `APP_URL` in your `.env` must **strictly match** the exact host and port accessed in the browser (e.g. `http://127.0.0.1:8000` vs `http://localhost:8000`). Verification emails contain cryptographically signed URLs derived from `APP_URL`. A host or port mismatch will result in an immediate `403 Invalid Signature` error upon clicking the link.
>
> Furthermore, changing `APP_KEY` after verification links have been dispatched permanently invalidates all outstanding signed links.

> [!IMPORTANT]
> **Testing with Non-University Addresses (Local Only):**
> ProjectNode enforces strict university email domain allow-listing via `ALLOWED_EMAIL_DOMAINS` (default: `aau.edu.et`). For local testing with personal addresses, set in your local `.env` only:
> ```env
> ALLOWED_EMAIL_DOMAINS=aau.edu.et,gmail.com
> ```
> In production environments, `ALLOWED_EMAIL_DOMAINS` **must contain only authorized university domains** (e.g. `aau.edu.et`).
> Note: The application reads domains via `config('projectnode.allowed_email_domains')`, ensuring complete compatibility with `php artisan config:cache`.

---

### Diagnostic Mail Command

Test your SMTP connectivity and credentials before registering test accounts:

```bash
php artisan projectnode:mail-test your-email@example.com
```

This sends a lightweight test email and reports either delivery confirmation or the exact transport error. This command is safety-gated and refuses to execute in `production` environments (`APP_ENV=production`).

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
