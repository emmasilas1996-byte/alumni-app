# Alumni Association App

Next.js + SQL Server app for managing members, executives, contributions,
monthly dues, the constitution, and a photo gallery — built entirely on
free-tier tools.

## Modules (matches the flowchart/wireframe/schema we designed)

- **Dashboard** — logo, year selector, total members, total contributions,
  total monthly dues, highest contributor.
- **Members** — everyone (exec + regular), photo upload on add, remove.
- **Executive** — filtered view of Members (`isExecutive = true`), not a
  separate table. Removing someone here just clears their title; they stay
  a regular Member.
- **Contributions** — static list, no year/month filter. Click a
  contribution to see payers + amount, add a payer (login required), and
  export that one contribution as a PDF.
- **Monthly Dues** — the only module filtered by year and month. Add a
  payment (login required), export that month as a PDF.
- **Constitution** — table of contents → full section text.
- **Gallery** — pulls photo + thoughts straight from Member records.
- **Birthday emails** — daily check, fetches the celebrant's photo,
  generates a message, sends via Gmail SMTP.
- **Happy New Month emails** — sent to every member on the 1st of the
  month, also via Gmail SMTP.

All uploaded images (member photos, receipts, logo) are encrypted with
AES-256-GCM in `lib/crypto.ts` before being written to the database as
`VARBINARY(MAX)`, and decrypted only at the moment they're served back out.
Nothing is stored as an external URL.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up SQL Server (free)

Easiest free option: **SQL Server Express** (local install) or **Azure SQL
Database** free tier. Either works — you just need a connection string.

Copy the env template:

```bash
cp .env.example .env
```

Fill in `DATABASE_URL` with your SQL Server connection details.

## 3. Generate your encryption key and JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Paste the output into `ENCRYPTION_KEY` in `.env`. Run it again (or use any
long random string) for `JWT_SECRET`.

**Keep `ENCRYPTION_KEY` safe and back it up somewhere separate from the
database.** If you lose it, every photo and receipt already stored becomes
permanently unreadable — there's no way to recover encrypted data without
the key that encrypted it.

## 4. Set up Gmail SMTP (free)

1. Turn on 2-Step Verification on the Gmail account you want to send from.
2. Go to Google Account → Security → App Passwords, and generate one for
   "Mail".
3. Put the Gmail address in `GMAIL_USER` and the 16-character app password
   in `GMAIL_APP_PASSWORD`.

## 4b. Set up Paystack (free — pay-per-transaction only)

1. Sign up at [paystack.com](https://paystack.com) (free, no monthly fee).
2. Under **Settings → Preferences → Settlement Account**, add your UBA
   account. Paystack verifies it and shows the account name back to you —
   confirm and save. Every payment collected through the app settles here
   automatically (next business day, minus Paystack's fee). Your account
   number never touches this app's code or database.
3. Under **Settings → API Keys & Webhooks**, copy your **Secret Key** into
   `PAYSTACK_SECRET_KEY` in `.env` (and the Public Key into
   `PAYSTACK_PUBLIC_KEY`, though the current build only needs the secret
   key server-side).
4. Once deployed, add your webhook URL in the same **API Keys & Webhooks**
   page: `https://yourapp.com/api/webhooks/paystack`. This is what lets
   Paystack notify your app the instant a payment succeeds, so it can
   auto-record it against the right contribution or month.

**How it fits in:** on the Contribution detail page and the Monthly Dues
page, there are now two ways to add a payment — "💳 Pay via Paystack"
(no login needed; the member pays directly and it's recorded
automatically) or "+ Manual / Cash" (the original login-gated flow with
receipt upload, still there as a fallback for cash/transfer payments).



```bash
npm run prisma:generate
npm run prisma:migrate
```

This runs the Prisma schema (`prisma/schema.prisma`) against your SQL
Server database — it's the same structure as `alumni-app-schema.sql`, just
applied through Prisma's migration tool instead of running the raw SQL by
hand. You don't need to run the `.sql` file separately.

## 6. Seed an admin login + starter constitution sections

```bash
npm run seed
```

This creates:
- An admin login (`username: admin`, `password: ChangeMe123!`) — **change
  this password immediately** by updating the hash in the database or
  adding a "change password" flow before going live.
- Placeholder constitution sections you'll want to replace with the real
  text.

## 7. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` — it redirects to the Dashboard.

## 8. Upload a logo

There's no dedicated Settings page in this build yet — for now, `POST` a
logo to `/api/settings` with a `logo` file field and `groupName` while
signed in (e.g. via a quick Postman/Thunder Client request, or I can add a
small Settings page next if you want one).

## 9. Set up the free scheduled emails

Since we're avoiding paid "always-on" hosting, the birthday and new-month
emails are plain API routes that need something external to call them once
a day:

- `GET /api/cron/birthday?secret=YOUR_CRON_SECRET`
- `GET /api/cron/new-month?secret=YOUR_CRON_SECRET`

Free options to trigger these daily:
- **cron-job.org** — free, no card required, just paste the URL and set it
  to run daily.
- **GitHub Actions scheduled workflow** — free on public repos, using a
  `schedule:` cron trigger that calls the URL with `curl`.

Either way, deploy the app somewhere reachable first (e.g. **Vercel free
tier** or **Render free tier**) so the URL is public, then point your
scheduler at it.

## 10. Deploy (free)

**Vercel** is the simplest fit for Next.js:

```bash
npm install -g vercel
vercel
```

Add all the same environment variables from `.env` in the Vercel project
settings. Make sure your SQL Server instance is reachable from Vercel's
servers (Azure SQL is straightforward for this; a local SQL Server Express
instance is not, unless you tunnel it).

## What's built vs. what's left

**Built:** all API routes, Dashboard (NEMSS navy/gold design, top-3
contributors, total released), Members, Executive, Contributions (list +
detail + PDF export + Release module with receipt), Released Funds
Overview (grouped by category), Monthly Dues (year/month filter + PDF
export), Constitution, Gallery, login, image encryption, Gmail SMTP
birthday/new-month emails, PDF generation with logo, Paystack payments
(checkout initialization + signature-verified webhook, alongside the
manual/cash fallback).

**Not built yet, happy to add on request:**
- A Settings page in the UI for uploading the logo (currently API-only)
- Editing constitution sections through the UI (currently seeded directly)
- Multi-page PDF support for contributions/months with very long payer
  lists (current version caps at what fits one page)
- Full Members/Constitution PDF export buttons (only Contribution/Dues
  detail exports were specifically requested)
