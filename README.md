# TenorCrest KYC

Simple identity verification page for [tenorcrest.com](https://tenorcrest.com).

Built with **Next.js (App Router)** and **Vercel KV** for storage.

## Features

- Warm blue design with subtle floral patterns
- Required fields: full name, date of birth, address, phone, country, city, next of kin
- Required photo upload (camera-friendly on mobile)
- Required signature pad (mouse + touch)
- Submissions stored in Vercel KV
- Password-protected `/admin` page to review all submissions

## Quick start

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set ADMIN_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Deploy on Vercel

1. Push this repo to GitHub (or import the folder).
2. Create a new project on [vercel.com](https://vercel.com) and import the repo.
3. Add a **KV** store:
   - Project → Storage → Create Database → KV
   - Connect it to the project (env vars are injected automatically).
4. Add environment variable:
   - `ADMIN_PASSWORD` = a strong secret
5. Deploy. Point `tenorcrest.com` to the Vercel project (Domains settings).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for `/admin` |
| `KV_REST_API_URL` | Auto | Set by Vercel when you link a KV store |
| `KV_REST_API_TOKEN` | Auto | Set by Vercel when you link a KV store |

## Project structure

```
app/
  page.tsx          → KYC form
  admin/page.tsx    → Admin review
  api/submit/       → Save submission
  api/admin/        → Auth + list submissions
components/
  SignaturePad.tsx  → Canvas signature
lib/
  kv.ts             → Vercel KV helpers
```

## Notes

- Photos and signatures are stored as base64 data URLs in KV. For production at scale, consider uploading images to Vercel Blob or S3 and storing only the URLs.
- The signature pad works with mouse and touch.
- Max recommended photo size is ~4 MB (client-side check).
