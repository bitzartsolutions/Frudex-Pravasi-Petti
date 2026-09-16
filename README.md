# Frudex Pravasi Petti

Single Next.js application for the Frudex Pravasi Petti storefront and admin panel,
built on the approved Stitch design. Customer site, admin panel, database schema
and Cloudinary image pipeline all live in this one repo — no separate backend.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth) for products, categories, variants, orders, settings
- Cloudinary for product/category images
- Zustand for the Pravasi Petti cart, Zod + React Hook Form for validation
- Deploys to Vercel

## Getting started (local development)

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run every file in `supabase/migrations/` **in order**:
   `0001_init.sql`, `0002_settings.sql`, `0003_product_images.sql`. Then run
   `supabase/seed.sql` for sample categories/products (optional but
   recommended for local development).
3. Create your first admin user under **Authentication → Users → Add user**
   (email + password). Only users that exist in Supabase Auth can sign in
   to `/admin` — there is no public admin signup.

### 3. Create a Cloudinary account

Grab your Cloud Name, API Key and API Secret from the Cloudinary dashboard.
**The API key must have upload ("create") permission** — a restricted/scoped
key will fail uploads with a 403. Images upload into `frudex/products`,
`frudex/categories` and `frudex/branding` folders automatically.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` — from Supabase project settings → API.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` —
  from the Cloudinary dashboard.

The WhatsApp business number is **not** an env var — set it from
`/admin/settings` after logging in. It's stored in the `settings` table
(`supabase/migrations/0002_settings.sql`) so it can be changed anytime
without a redeploy.

### 5. Run the dev server

```bash
npm run dev
```

- Customer site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deploying to Vercel

1. **Push this repo to GitHub** (or GitLab/Bitbucket).
2. On [vercel.com](https://vercel.com), **New Project → Import** the repo.
   Vercel auto-detects Next.js — no build settings need changing.
3. Before the first deploy, add these **Environment Variables** in the
   Vercel project settings (same six values as `.env.local` — see step 4
   above): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. Deploy. Once it's live, log in to `/admin/settings` and set the real
   WhatsApp number (it's per-database, not per-deployment, so this is a
   one-time step regardless of how many times you redeploy).
5. Any push to the connected branch redeploys automatically. Database
   changes (new migrations) still need to be run manually in the Supabase
   SQL editor — they are not part of the Vercel build.

## Scripts

```bash
npm run dev        # start the dev server
npm run build       # production build
npm run start        # run the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Architecture notes

- **Pricing is always server-derived.** The client cart (`store/pettiStore.ts`)
  only ever sends `productId` / `variantId` / `quantity` to
  `POST /api/orders`; the route handler re-reads prices from Supabase before
  creating the order, per the project's security requirements.
- **RLS**: public (anon) reads are limited to active categories/products and
  available variants. Orders and order_items have no public policies at
  all — the only way to write an order is through the service-role client
  inside `POST /api/orders`, so anonymous customers can never read or
  tamper with order data directly.
- **Auth**: `middleware.ts` protects the whole `/admin/*` tree except
  `/admin/login`. Any user that exists in Supabase Auth is treated as an
  admin — there's no separate roles table, since there is no public admin
  signup flow.
- **Design fidelity**: `tailwind.config.ts` and `app/globals.css` are ported
  verbatim from the approved Stitch export (`code.html`, kept at the repo
  root for reference) — same Material Symbols icon font, same
  Epilogue/Plus Jakarta Sans type scale, same `primary-container` etc.
  color tokens. Don't rename or "clean up" those tokens without checking
  every screen against `code.html`.
- **Product images**: each product has one cover image
  (`products.image_url`, used on the grid card and cart) plus optional
  extra gallery photos (`product_images` table) shown in a lightbox when a
  customer clicks the product photo.
- **Delivery/packaging charge is currently ₹0** (`app/api/orders/route.ts`)
  — not because it's complimentary, just not priced yet. Update
  `additionalCharge` there once real delivery pricing is decided.

## Known placeholders

- Product/category images are a mix of real Cloudinary uploads and
  placeholder Unsplash URLs from the original Stitch mock. Replace the
  remaining placeholders by re-uploading through the admin panel.
- The hero image caption ("Bespoke Crate No. 842 / The Royale Grand Box")
  still implies premium box packaging — confirm this matches actual
  packaging before launch.
