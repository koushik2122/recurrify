# Recurrify

**Know what repeats. Know what it costs. Know what to keep.**

Recurrify is a recurring expense and subscription financial-management workspace for businesses. It imports historical transactions, identifies likely recurring commitments, forecasts upcoming expenses, surfaces potential duplicate commitments and supports renewal decisions.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- React + responsive CSS
- Recharts/Lucide available for visualization and UI

## Core workflows
1. Register → organization is created by the Supabase auth/database workflow.
2. Sign in → protected application routes are available.
3. Transactions → upload CSV and import validated historical spend.
4. Recurring → imported transactions are grouped and scored for likely recurring patterns.
5. Subscriptions → create and manage active commitments and utilization fields.
6. Forecast → upcoming recurring and renewal costs are calculated for 30/90/365-day windows.
7. Duplicates → similar active subscriptions can be surfaced for human review.
8. Renewals → upcoming renewals support persisted decisions: Renew, Do Not Renew, Renegotiate, Review Later.
9. Analytics → portfolio metrics are calculated from organization data.
10. Demo data → authenticated users can load generated NovaTech-style data from Transactions.

## CSV format
Recommended headers:
```text
Date,Description,Vendor,Amount,Currency,Payment_Method,Category,Department
```
The importer also accepts common aliases such as `transaction_date`, `merchant`, `payee`, `memo`, `details`, and `value`.

## Environment
Create `.env.local`:
```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
Do not put a Supabase service-role/secret key in client code or any `NEXT_PUBLIC_` variable.

## Run locally
```bash
npm install
npm run dev
```

## Production check
```bash
npm run build
npm run start
```

## Deployment
Push the project to GitHub, import it into Vercel, configure the Supabase environment variables, deploy, then verify the complete authenticated workflow in a browser.
