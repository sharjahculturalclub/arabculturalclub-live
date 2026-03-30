# Arab Cultural Club — Sharjah | Project Documentation

> **النادي الثقافي العربي — الشارقة**
> Next.js 16 headless frontend connected to a WordPress/WPGraphQL backend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Environment Variables](#3-environment-variables)
4. [Directory Structure](#4-directory-structure)
5. [App Routes](#5-app-routes)
6. [Data Flow: WordPress → Next.js](#6-data-flow-wordpress--nextjs)
7. [Apollo Client & GraphQL](#7-apollo-client--graphql)
8. [Server Actions](#8-server-actions)
9. [Caching Strategy](#9-caching-strategy)
10. [Forms & Contact Form 7](#10-forms--contact-form-7)
11. [SEO & Schema.org](#11-seo--schemaorg)
12. [CMS Media Proxy](#12-cms-media-proxy)
13. [API Routes](#13-api-routes)
14. [Components](#14-components)
15. [Security](#15-security)
16. [Performance Optimizations](#16-performance-optimizations)
17. [Analytics & Tracking](#17-analytics--tracking)
18. [ISR & On-Demand Revalidation](#18-isr--on-demand-revalidation)
19. [TypeScript Interfaces](#19-typescript-interfaces)
20. [Local Development](#20-local-development)

---

## 1. Project Overview

The Arab Cultural Club website is a **headless CMS** setup:

- **Frontend:** Next.js 16 App Router (this repo)
- **Backend/CMS:** WordPress with WPGraphQL, ACF (Advanced Custom Fields), and Contact Form 7
- **Language:** Arabic (RTL), `lang="ar"`, `dir="rtl"`
- **Site URL:** `https://shjarabclub.ae`
- **Backend URL:** Internal only — never exposed to the client

All content (pages, posts, events, menus, settings, images) is authored in WordPress and consumed via GraphQL. The backend URL is never sent to the browser — all media is proxied through `/cms-media/` and all internal links are rewritten.

---

## 2. Technology Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.1.6 |
| React | React + React DOM | 19.2.3 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| GraphQL Client | Apollo Client | 4.1.6 |
| UI Primitives | Radix UI | Various |
| Icons | Lucide React | Latest |
| Animation | Motion (Framer Motion alt) | Latest |
| Forms | react-hook-form | 7.71.2 |
| HTML Parsing | linkedom | Latest |
| Charts | Recharts | 3.7.0 |
| Date Utilities | date-fns | 4.1.0 |
| Analytics | @next/third-parties (GTM + GA4) | Latest |

### Key `next.config.ts` settings

```ts
reactCompiler: true          // Auto-memoization via React Compiler
reactStrictMode: true
experimental: {
  optimizePackageImports: ['@/components', '@/lib'],
  serverActions: { bodySizeLimit: '20mb' },  // supports file uploads
}
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000,   // 1 year
  dangerouslyAllowSVG: true,
}
```

---

## 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# WordPress GraphQL backend URL — server-only, NEVER prefix with NEXT_PUBLIC_
WP_BACKEND_URL=https://backend.shjarabclub.ae

# Public site URL — used for canonical URLs, OG tags, schema.org
NEXT_PUBLIC_SITE_URL=https://shjarabclub.ae

# Secret token shared between WordPress plugin and Next.js revalidation webhook
REVALIDATE_SECRET=your-secret-token-here

# Optional: HTTP Basic Auth for WordPress GraphQL endpoint
WP_GRAPHQL_AUTH=
```

> **Security:** `WP_BACKEND_URL` is server-only. It is validated at startup in `lib/env.ts` — the app throws if it's missing. The variable is never included in client bundles.

---

## 4. Directory Structure

```
arabculturalclub-live/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Header, Footer, GTM, schemas)
│   ├── page.tsx                  # Home page
│   ├── about/
│   ├── news/
│   ├── events/
│   │   └── [id]/
│   │       └── join/
│   ├── [category]/[id]/          # Catch-all for articles/news detail
│   ├── category/[categorySlug]/
│   ├── tag/[tagName]/
│   ├── author/[id]/
│   ├── authors/
│   ├── gallery/
│   ├── programs/
│   ├── membership/
│   │   └── registration/
│   ├── membership-benefits/
│   ├── contact/
│   ├── faq/
│   ├── share/
│   ├── sharjah-culture/
│   ├── privacy-policy/
│   ├── terms-of-use/
│   ├── swimming-subscription/
│   ├── condolence-hall-booking/
│   ├── lecture-hall-booking/
│   ├── facility-booking/
│   ├── search/
│   └── api/
│       ├── image/route.ts        # Image proxy with in-memory cache
│       ├── newsletter/route.ts   # Newsletter API route
│       ├── revalidate/route.ts   # ISR webhook from WordPress
│       └── cms-media/            # Media proxy
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SEO.tsx                   # JSON-LD schema injection
│   ├── Cards.tsx                 # EventCard, NewsCard
│   ├── SectionTitle.tsx
│   ├── AnimatedSection.tsx
│   ├── SidebarNewsletter.tsx
│   ├── ShareButtons.tsx
│   ├── HomeClient.tsx            # VideoModal (client component)
│   ├── figma/
│   │   └── ImageWithFallback.tsx
│   ├── ui/                       # Radix UI primitives (shadcn pattern)
│   └── icons/
│
├── lib/
│   ├── actions/site/             # Server actions — data fetch + CF7 submit
│   ├── queries/site/             # GraphQL gql queries
│   ├── client/
│   │   └── ApolloClient.ts       # Apollo singleton (server-only)
│   ├── cms/
│   │   ├── url-map.ts            # Backend → frontend URL mapping
│   │   ├── rewrite-html.ts       # HTML fragment URL rewriting
│   │   ├── sanitize-response.ts  # Recursive GraphQL response sanitizer
│   │   └── seo.ts                # SEO metadata sanitizer
│   ├── utils/
│   │   ├── seo.ts                # getMetadataImages, stripHtml, SITE_ORIGIN
│   │   ├── url.ts                # normalizeImageUrl
│   │   └── site-origin.ts        # SITE_ORIGIN constant
│   └── env.ts                    # Environment variable validation
│
├── public/                       # Static assets served at /
├── assets/                       # Local assets imported in components
└── types/                        # Global TypeScript type declarations
```

---

## 5. App Routes

### Public Pages

| URL | File | Revalidate | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | 3600s | Home — hero, events, news, mission |
| `/about` | `app/about/page.tsx` | 86400s | About the club |
| `/news` | `app/news/page.tsx` | 3600s | News listing with category filters + pagination |
| `/events` | `app/events/page.tsx` | 3600s | Events listing with search + filters |
| `/events/[id]` | `app/events/[id]/page.tsx` | 3600s | Event detail with gallery slider |
| `/events/[id]/join` | `app/events/[id]/join/page.tsx` | 3600s | Event registration form |
| `/[category]/[id]` | `app/[category]/[id]/page.tsx` | 3600s | Post/article detail (catch-all) |
| `/category/[categorySlug]` | `app/category/[categorySlug]/page.tsx` | 3600s | Category filtered posts |
| `/tag/[tagName]` | `app/tag/[tagName]/page.tsx` | 3600s | Tag filtered posts |
| `/authors` | `app/authors/page.tsx` | 86400s | All authors |
| `/author/[id]` | `app/author/[id]/page.tsx` | 3600s | Author profile + their posts |
| `/gallery` | `app/gallery/page.tsx` | 86400s | Photo gallery with category filter |
| `/programs` | `app/programs/page.tsx` | 86400s | Club programs |
| `/membership` | `app/membership/page.tsx` | 86400s | Membership info |
| `/membership-benefits` | `app/membership-benefits/page.tsx` | 86400s | Membership benefits |
| `/membership/registration` | `app/membership/registration/page.tsx` | 86400s | Membership registration form |
| `/contact` | `app/contact/page.tsx` | 86400s | Contact page with map |
| `/faq` | `app/faq/page.tsx` | 86400s | Frequently asked questions |
| `/share` | `app/share/page.tsx` | 86400s | Share your opinion form |
| `/sharjah-culture` | `app/sharjah-culture/page.tsx` | 86400s | Sharjah culture page |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | 86400s | Privacy policy |
| `/terms-of-use` | `app/terms-of-use/page.tsx` | 86400s | Terms of use |
| `/swimming-subscription` | `app/swimming-subscription/page.tsx` | 86400s | Swimming subscription form |
| `/condolence-hall-booking` | `app/condolence-hall-booking/page.tsx` | 86400s | Condolence hall booking |
| `/lecture-hall-booking` | `app/lecture-hall-booking/page.tsx` | 86400s | Lecture hall booking |
| `/facility-booking` | `app/facility-booking/page.tsx` | 86400s | Facility booking |
| `/search` | `app/search/page.tsx` | dynamic | Search results |

### API Routes

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/revalidate` | POST | `x-secret` header | ISR webhook from WordPress |
| `/api/revalidate` | GET | `?secret=` param | Manual revalidation trigger |
| `/api/newsletter` | POST | None | Newsletter CF7 subscription |
| `/api/image` | GET | None | Image proxy with rate limiting |
| `/cms-media/[...path]` | GET/HEAD | None | WordPress media proxy |
| `/sitemap.xml` | GET | None | XML sitemap (revalidate: 3600) |
| `/news-sitemap.xml` | GET | None | News sitemap (revalidate: 1800) |

---

## 6. Data Flow: WordPress → Next.js

```
WordPress CMS (ACF + WPGraphQL)
        │
        │  GraphQL over HTTPS (server-to-server)
        ▼
Apollo Client (lib/client/ApolloClient.ts)
  - RetryLink: exponential backoff, max 5 attempts
  - Wraps fetch() with Next.js Data Cache tags
  - All responses sanitized before returning
        │
        ▼
URL Sanitization (lib/cms/)
  - sanitize-response.ts: recursively walks response object
  - rewrite-html.ts: rewrites HTML fragment URLs via linkedom
  - url-map.ts: maps https://backend.shjarabclub.ae/* → /cms-media/*
        │
        ▼
Server Actions (lib/actions/site/*.ts)
  - Wrapped with React cache() for per-request deduplication
  - Called from both generateMetadata() and the page component
  - Returns typed TypeScript interfaces
        │
        ▼
Server Components (app/**/page.tsx)
  - generateMetadata() → SEO/OG tags
  - Page render → passes data to Client Components
        │
        ▼
Client Components (EventsPageClient, NewsPageClient, etc.)
  - Handle pagination, filters, search (client-side state)
  - Load more via server action calls
```

---

## 7. Apollo Client & GraphQL

**File:** `lib/client/ApolloClient.ts`

The Apollo Client is a **server-only singleton** (`import "server-only"`). It is never bundled into the client JavaScript.

### Configuration

```ts
// Retry transient errors (502, 503, 504)
const retryLink = new RetryLink({
  delay: { initial: 1000, max: 5000, jitter: true },
  attempts: { max: 5 }
});

// All GraphQL fetches are tagged for Next.js ISR
const httpLink = new HttpLink({
  uri: `${WP_BACKEND_URL}/graphql`,
  fetch: (uri, options) => fetch(uri, {
    ...options,
    next: {
      revalidate: false,    // cache indefinitely
      tags: ['wordpress'],  // bust via revalidateTag('wordpress')
    }
  })
});

// network-only: Apollo bypasses InMemoryCache, relies on Next.js Data Cache
defaultOptions: {
  query: { fetchPolicy: 'network-only', errorPolicy: 'all' }
}
```

### Why `network-only`?

Apollo's `InMemoryCache` is per-process and never cleared by `revalidateTag('wordpress')`. If set to `cache-first`, the webhook would clear Next.js Data Cache but **Apollo would still serve stale in-memory data**. Using `network-only` ensures Apollo always delegates to Next.js's fetch cache, which IS properly cleared by the webhook.

### Response Sanitization

Every `client.query()` call is intercepted to:
1. Recursively walk all string values in the response
2. Rewrite `https://backend.shjarabclub.ae/wp-content/uploads/*` → `/cms-media/wp-content/uploads/*`
3. Rewrite internal WP links to frontend equivalents
4. Strip any remaining backend domain references

### Query Files

All queries live in `lib/queries/site/` as `gql` tagged template literals:

| File | Queries |
|---|---|
| `homePageQueries.ts` | `GET_HOME_PAGE` |
| `newsQueries.ts` | `GET_NEWS_POSTS`, `GET_ALL_CATEGORIES`, `GET_SEARCH_RESULTS`, `GET_NEWS_PAGE_OPTIONS` |
| `eventsQueries.ts` | `GET_EVENTS`, `GET_EVENT_BY_ID`, `GET_EVENTS_PAGE_OPTIONS` |
| `postQueries.ts` | `GET_POST_BY_ID`, `GET_RELATED_POSTS` |
| `categoryQueries.ts` | `GET_CATEGORY_WITH_POSTS` |
| `tagQueries.ts` | `GET_TAG_WITH_POSTS` |
| `authorsPageQueries.ts` | `GET_AUTHORS_LIST`, `GET_AUTHOR_DETAIL` |
| `galleryQueries.ts` | `GET_GALLERIES`, `GET_GALLERY_PAGE_OPTIONS` |
| `headerMenuQueries.ts` | `GET_HEADER_MENU` |
| `footerQueries.ts` | `GET_FOOTER_SETTINGS` |
| `logoQueries.ts` | `GET_LOGO_DATA` |
| `sitemapQueries.ts` | `GET_ALL_POSTS_FOR_SITEMAP`, `GET_ALL_EVENTS_FOR_SITEMAP` |
| `contactPageQueries.ts` | `GET_CONTACT_PAGE` |
| `faqPageQueries.ts` | `GET_FAQ_PAGE` |
| `aboutPageQueries.ts` | `GET_ABOUT_PAGE` |
| `ourProgramsPageQueries.ts` | `GET_OUR_PROGRAMS_PAGE` |
| `membershipBenefitsPageQueries.ts` | `GET_MEMBERSHIP_BENEFITS_PAGE` |
| `membershipRegistrationPageQueries.ts` | `GET_MEMBERSHIP_REGISTRATION_PAGE` |
| `facilityBookingPageQueries.ts` | `GET_FACILITY_BOOKING_PAGE` |
| `lectureHallBookingPageQueries.ts` | `GET_LECTURE_HALL_BOOKING_PAGE` |
| `swimmingSubscriptionPageQueries.ts` | `GET_SWIMMING_SUBSCRIPTION_PAGE` |
| `condolenceHallBookingPageQueries.ts` | `GET_CONDOLENCE_HALL_BOOKING_PAGE` |
| `shareOpinionsPageQueries.ts` | `GET_SHARE_OPINIONS_PAGE` |
| `joinUsPageQueries.ts` | `GET_JOIN_US_PAGE` |
| `policyPageQueries.ts` | `GET_POLICY_PAGE` |

---

## 8. Server Actions

All files in `lib/actions/site/` use `'use server'` and are wrapped with React's `cache()` for per-request memoization.

### Data Fetch Actions

| File | Exported Functions |
|---|---|
| `homePageAction.ts` | `fetchHomePageData()` |
| `aboutPageAction.ts` | `fetchAboutPageData()` |
| `newsAction.ts` | `fetchNewsPosts()`, `fetchNewsCategories()`, `fetchNewsPageOptions()`, `fetchSearchResults()` |
| `eventsAction.ts` | `fetchEvents()`, `fetchEventById()`, `fetchEventsPageOptions()` |
| `postAction.ts` | `fetchPostById()`, `fetchRelatedPosts()` |
| `categoryAction.ts` | `fetchCategoryWithPosts()` |
| `tagAction.ts` | `fetchTagWithPosts()` |
| `authorsPageAction.ts` | `fetchAuthorsList()`, `fetchAuthorDetail()` |
| `galleryAction.ts` | `fetchGalleries()`, `fetchGalleryPageOptions()` |
| `headerMenuAction.ts` | `fetchHeaderMenu()` |
| `footerAction.ts` | `fetchFooterSettings()` |
| `logoAction.ts` | `fetchLogoData()` |
| `contactPageAction.ts` | `fetchContactPageData()` |
| `faqPageAction.ts` | `fetchFaqPageData()` |
| `ourProgramsPageAction.ts` | `fetchOurProgramsPageData()` |
| `membershipBenefitsPageAction.ts` | `fetchMembershipBenefitsPageData()` |
| `membershipRegistrationPageAction.ts` | `fetchMembershipRegistrationPageData()` |
| `facilityBookingPageAction.ts` | `fetchFacilityBookingPageData()` |
| `lectureHallBookingPageAction.ts` | `fetchLectureHallBookingPageData()` |
| `swimmingSubscriptionPageAction.ts` | `fetchSwimmingSubscriptionPageData()` |
| `condolenceHallBookingPageAction.ts` | `fetchCondolenceHallBookingPageData()` |
| `shareOpinionsPageAction.ts` | `fetchShareOpinionsPageData()` |
| `joinUsPageAction.ts` | `fetchJoinUsPageData()` |
| `policyPageAction.ts` | `fetchPolicyPageData()` |

### Form Submission Actions

These are **not** wrapped with `cache()` — they are POST mutations:

| File | Purpose |
|---|---|
| `submitContactFormAction.ts` | Contact form → CF7 |
| `submitMembershipFormAction.ts` | Membership registration with file upload |
| `submitFacilityBookingAction.ts` | Facility booking |
| `submitLectureHallBookingAction.ts` | Lecture hall booking with file attachment |
| `submitSwimmingSubscriptionAction.ts` | Swimming subscription |
| `submitCondolenceHallBookingAction.ts` | Condolence hall booking |
| `submitShareOpinionsAction.ts` | Share opinions |
| `submitNewsletterAction.ts` | Newsletter (also available via `/api/newsletter`) |
| `submitJoinEventAction.ts` | Event registration |

---

## 9. Caching Strategy

The project uses three layers of caching that work together:

### Layer 1 — React `cache()` (per-request)

All data fetch functions are wrapped with React's `cache()`. When `generateMetadata()` and the page component both call the same function, the second call returns the memoized result — **zero extra backend hit**.

```ts
import { cache } from 'react';
export const fetchHomePageData = cache(async () => { ... });
```

### Layer 2 — Next.js Data Cache (cross-request)

Apollo's `httpLink` wraps all `fetch()` calls with:
```ts
next: { revalidate: false, tags: ['wordpress'] }
```
This caches GraphQL responses indefinitely in Next.js's built-in Data Cache. The cache is only invalidated when the WordPress webhook fires `revalidateTag('wordpress')`.

### Layer 3 — ISR Page Cache (HTML)

Every `page.tsx` exports a revalidation time:
```ts
export const revalidate = 3600;   // content pages — 1 hour fallback
export const revalidate = 86400;  // static pages — 24 hour fallback
```
This is the **fallback only**. The WordPress webhook immediately busts the page cache via `revalidatePath()` when content changes.

### Cache Invalidation Flow

```
WordPress saves/publishes content
        │
        ▼ (WordPress plugin fires HTTP POST)
POST /api/revalidate  (x-secret header)
        │
        ▼
revalidateTag('wordpress')     → clears ALL GraphQL Data Cache instantly
revalidatePath('/events', 'page')  → clears events listing page
revalidatePath('/events/625', 'page') → clears specific event page
revalidatePath('/', 'page')    → clears home page
        │
        ▼
Next visitor to any of those pages gets fresh content immediately
```

### Static Assets

```
/_next/static/*     → Cache-Control: public, max-age=31536000, immutable
/_next/image/*      → Cache-Control: public, max-age=31536000, immutable
/cms-media/*        → Cache-Control: public, max-age=31536000, immutable
/api/image          → Cache-Control: public, max-age=31536000, immutable
/api/*              → Cache-Control: no-cache, no-store, must-revalidate
```

---

## 10. Forms & Contact Form 7

### How CF7 Integration Works

All forms submit to WordPress Contact Form 7 via its REST API:

```
POST {WP_BACKEND_URL}/wp-json/contact-form-7/v1/contact-forms/{formId}/feedback
Content-Type: multipart/form-data

Fields:
  _wpcf7          = {formId}
  _wpcf7_version  = "5.8"
  _wpcf7_locale   = "ar"
  _wpcf7_unit_tag = "wpcf7-f{formId}-p1-o1"
  [form fields]   = values
```

CF7 Response statuses:
- `mail_sent` → success
- `validation_failed` → field-level errors
- `mail_failed` → server-side email failure

### Forms Summary

| Form | Page | CF7 Form ID Source | Key Fields |
|---|---|---|---|
| Contact | `/contact` | ACF `contactFormId` | name, email, phone, subject, message |
| Membership Registration | `/membership/registration` | ACF `membershipFormId` | full name, DOB, nationality, Emirates ID, phone, email, photos |
| Facility Booking | `/facility-booking` | ACF `facilityFormId` | facility type, dates, purpose, applicant info |
| Lecture Hall Booking | `/lecture-hall-booking` | ACF `lectureHallFormId` | hall, dates, time from/to, purpose, ID attachment |
| Swimming Subscription | `/swimming-subscription` | ACF `swimmingFormId` | participant info, Emirates ID (784-xxxx-xxxxxxx-x), membership type |
| Condolence Hall Booking | `/condolence-hall-booking` | ACF `condolenceFormId` | deceased info, family contact, dates, attachment |
| Share Opinions | `/share` | ACF `shareFormId` | name, email, phone, opinion |
| Newsletter | `/api/newsletter` | ACF `newsletterFormId` | email |
| Event Join | `/events/[id]/join` | Hardcoded `434` | name, email, phone, attendees, notes |

### Field Validation Patterns

```ts
// UAE Phone Number
const uaePhoneRegex = /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/;

// Emirates ID
const emiratesIdRegex = /^784-\d{4}-\d{7}-\d$/;

// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### File Upload

Forms that accept file uploads (e.g. membership, condolence hall) use server actions with `bodySizeLimit: '20mb'`. Files are sent as `FormData` to CF7 which handles storage on the WordPress side.

---

## 11. SEO & Schema.org

### generateMetadata() Pattern

Every page implements `generateMetadata()` which pulls SEO data from WordPress ACF `seoOptions` fields:

```ts
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPageData();
  const seo = data?.seoOptions;
  return {
    title: seo?.seoTitle || undefined,
    description: stripHtml(seo?.metaDescription) || undefined,
    keywords: seo?.focusKeyword || undefined,
    alternates: { canonical: seo?.canonicalUrl || `${SITE_ORIGIN}/page-path` },
    openGraph: { ... },
    twitter: { ... },
  };
}
```

**No static fallback text** — if CMS has no value, the field is `undefined` (omitted from HTML).

### Schema.org JSON-LD

#### Global Schemas (every page — `app/layout.tsx`)

**Organization:**
```json
{
  "@type": "Organization",
  "@id": "https://shjarabclub.ae/#organization",
  "name": "النادي الثقافي العربي - الشارقة",
  "alternateName": "Arab Cultural Club - Sharjah",
  "logo": "[dynamic from CMS]",
  "email": "info@shjarabclub.ae",
  "telephone": "+97165560077",
  "faxNumber": "+97165570770",
  "sameAs": ["Facebook", "Instagram", "Threads", "X", "YouTube", "LinkedIn"]
}
```

**WebSite:**
```json
{
  "@type": "WebSite",
  "@id": "https://shjarabclub.ae/#website",
  "url": "https://shjarabclub.ae",
  "name": "النادي الثقافي العربي - الشارقة",
  "inLanguage": "ar"
}
```

#### Page-Level Schemas (`<SEO>` component)

**WebPage** (all pages via `<SEO>` component):
```json
{
  "@type": "WebPage",
  "@id": "https://shjarabclub.ae/page#webpage",
  "name": "[page title]",
  "url": "[canonical url]",
  "isPartOf": { "@id": "https://shjarabclub.ae/#website" },
  "breadcrumb": { "@id": "https://shjarabclub.ae/page#breadcrumb" }
}
```

**BreadcrumbList** (all pages via `<SEO>` component):
```json
{
  "@type": "BreadcrumbList",
  "@id": "https://shjarabclub.ae/page#breadcrumb",
  "itemListElement": [
    { "position": 1, "name": "الرئيسية", "item": "https://shjarabclub.ae/" },
    { "position": 2, "name": "[page name]", "item": "[page url]" }
  ]
}
```

#### Specialized Schemas

| Page | Schema Type |
|---|---|
| `/events/[id]` | `Event` — name, description, image, startDate, endDate, eventAttendanceMode, location |
| `/[category]/[id]` | `NewsArticle` — headline, author, datePublished, image |
| `/category/[categorySlug]` | `CollectionPage` |
| `/tag/[tagName]` | `CollectionPage` |
| `/news` | `CollectionPage` |
| `/contact` | `ContactPage` + `CulturalOrganization` + `Place` |

### SEO Component (`components/SEO.tsx`)

Client component that injects JSON-LD `<script>` tags and sets `document.title`. Used in every page that has dynamic SEO data from CMS:

```tsx
<SEO
  title={seo?.seoTitle || undefined}
  description={stripHtml(seo?.metaDescription) || undefined}
  url={canonicalUrl}
  pageType="WebPage"
  breadcrumbs={[
    { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
    { name: pageTitle, item: canonicalUrl },
  ]}
/>
```

---

## 12. CMS Media Proxy

All WordPress media is served through the Next.js server — never directly from the WordPress backend.

### URL Rewriting

| Original (backend) | Frontend (proxied) |
|---|---|
| `https://backend.shjarabclub.ae/wp-content/uploads/file.jpg` | `/cms-media/wp-content/uploads/file.jpg` |

This rewriting happens in `lib/cms/url-map.ts` and is applied recursively to every GraphQL response.

### `/cms-media/[...path]` Route

- Validates the path format and allowed extensions (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.svg`, `.pdf`, etc.)
- Fetches the file from `WP_BACKEND_URL`
- Blocks redirects (prevents backend domain exposure via 301/302)
- Forwards safe headers only
- Rate limited: 120 requests/IP/minute
- Supports `HEAD` requests and `Range` headers
- Sets `Cache-Control: public, max-age=31536000, immutable`

### `/api/image` Route

An additional image proxy with:
- In-memory LRU cache (200 entries, 24h TTL)
- Rate limiting: 60 requests/IP/minute
- Next.js fetch cache: `next: { revalidate: 86400 }`
- `X-Cache: HIT/MISS` header for debugging

---

## 13. API Routes

### POST `/api/revalidate`

WordPress fires this whenever content changes. Requires `x-secret` header.

**Payload:**
```json
{
  "action": "update",
  "post_type": "post",
  "slug": "my-article",
  "post_id": 123
}
```

**Actions handled:**

| action | What gets revalidated |
|---|---|
| `create` / `update` / `publish` | Homepage + type-specific pages + individual page by ID |
| `delete` / `unpublish` | Full site layout |
| `menu_update` | Full layout (header/footer) |
| `theme_settings_update` | Homepage + full layout |
| `taxonomy_update` | Homepage, news, events, tags |
| `media_update` | Full layout |
| *(default)* | Homepage + layout |

For `post` type: also revalidates `/news/{post_id}` and `/articles/{post_id}`
For `event` type: also revalidates `/events/{post_id}`

### POST `/api/newsletter`

```json
// Request
{ "email": "user@example.com", "formId": "123" }

// Response
{ "success": true, "message": "تم الاشتراك بنجاح" }
```

---

## 14. Components

### Layout Components

**`Header.tsx`**
Sticky header with transparent-to-solid scroll transition. Desktop: logo left, nav center, search right. Mobile (RTL): menu icon left (renders right), logo center, search icon right (renders left).

**`Footer.tsx`**
5-column grid: brand/social, quick links, join us, programs, contact info. Data from `fetchFooterSettings()`.

**`SEO.tsx`** *(client component)*
Injects WebPage + BreadcrumbList JSON-LD schemas. Sets `document.title`. Used on every dynamic page.

### Content Components

**`Cards.tsx`**
- `EventCard` — event thumbnail, date (formatted from ISO), location, category badge, "سجل الآن" CTA
- `NewsCard` — post thumbnail, category, date, excerpt, "اقرأ المزيد" CTA

**`SectionTitle.tsx`**
Heading with purple underline accent. Accepts `title` and optional `subtitle`.

**`AnimatedSection.tsx`**
Intersection Observer based scroll animation. Direction: `up | down | left | right | scale`.

**`ImageWithFallback.tsx`**
`<img>` wrapper that catches `onError` and shows a placeholder. Prevents broken image icons.

**`SidebarNewsletter.tsx`** *(client component)*
Email subscription form. Calls `/api/newsletter` via `fetch()` (not a server action — avoids HMR issues).

**`HomeClient.tsx`** *(client component)*
`VideoModal` — button that opens a full-screen video overlay using the URL from ACF `heroVideoLink`.

**`ShareButtons.tsx`**
Social sharing for post detail pages (Facebook, X/Twitter, WhatsApp, copy link).

---

## 15. Security

### Backend URL Protection

The WordPress backend URL (`WP_BACKEND_URL`) is:
- Server-only (`lib/client/ApolloClient.ts` imports `"server-only"`)
- Never included in client bundles
- Never sent to the browser in any response
- All responses recursively sanitized to remove backend domain references

### SSRF Protection

Both `/cms-media/` and `/api/image` routes:
- Validate path format with regex
- Whitelist allowed file extensions
- Block HTTP redirects from backend
- Never accept user-provided arbitrary URLs

### Rate Limiting

| Route | Limit |
|---|---|
| `/api/image` | 60 req/IP/min |
| `/cms-media/` | 120 req/IP/min |

### Security Headers (`next.config.ts`)

```
X-Frame-Options: SAMEORIGIN
X-DNS-Prefetch-Control: on
Content-Security-Policy: default-src 'self'; script-src 'none'; sandbox; (SVG only)
```

### Webhook Authentication

`/api/revalidate` validates the `x-secret` header against `REVALIDATE_SECRET` env variable. Returns `401` for invalid tokens.

---

## 16. Performance Optimizations

### Images
- Next.js `<Image>` component with AVIF + WebP auto-conversion
- `minimumCacheTTL: 31536000` (1 year)
- Responsive `deviceSizes` and `imageSizes` configured
- All media proxied and cached at edge

### JavaScript
- React 19 Compiler enabled — automatic memoization (no manual `useMemo`/`useCallback` needed)
- Server Components by default — most pages have zero client JS
- Package import optimization for `@/components` and `@/lib`

### Data Fetching
- React `cache()` — deduplicates `generateMetadata` + page render calls
- Next.js Data Cache — GraphQL responses cached indefinitely, busted by webhook
- ISR — HTML pages cached with fallback TTL (3600–86400s)

### Fonts
- Arabic font: **Tajawal** (Google Fonts, subset for Arabic)
- Preloaded in layout

---

## 17. Analytics & Tracking

GTM and GA4 IDs are fetched from WordPress footer settings (ACF), not hardcoded:

```ts
const { googleTagManagerId, googleAnalyticsId } = footerData;
```

Injected in `app/layout.tsx` via `@next/third-parties/google`:
```tsx
<GoogleTagManager gtmId={googleTagManagerId} />
<GoogleAnalytics gaId={googleAnalyticsId} />
```

Any additional scripts from WordPress (`footerScripts` ACF field) are injected via `CustomScripts.tsx` using `dangerouslySetInnerHTML`.

---

## 18. ISR & On-Demand Revalidation

### Summary

| Trigger | Mechanism | Effect |
|---|---|---|
| WordPress publishes/updates content | Webhook → `revalidateTag('wordpress')` | Clears GraphQL Data Cache immediately |
| WordPress publishes/updates content | Webhook → `revalidatePath('/events/625')` | Clears that page's HTML immediately |
| Time elapses (fallback) | `export const revalidate = 3600` | Page rebuilds on next request after 1h |

**Content changes are reflected immediately** — the revalidate timeout is only a safety net for if the webhook fails.

### WordPress Plugin

The WordPress side uses a custom plugin (`/wp-content/themes/*/inc/headless-revalidation.php`) that hooks into:
- `transition_post_status` — publish, update, unpublish
- `before_delete_post` — permanent delete
- `wp_update_nav_menu` / `wp_update_nav_menu_item` — menu changes
- `acf/save_post` — ACF field changes (options page + post fields)
- `created_term` / `edited_term` / `delete_term` — taxonomy changes
- `add_attachment` / `edit_attachment` / `delete_attachment` — media changes

All requests are sent as non-blocking (`'blocking' => false`) with `x-secret` header authentication.

---

## 19. TypeScript Interfaces

### SEO Options (shared across all pages)

```ts
interface SeoOptions {
  seoTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
}
```

### Event

```ts
interface EventNode {
  eventId: number;
  title: string;
  content: string;
  featuredImage: { node: { altText: string; sourceUrl: string } } | null;
  eventOptions: {
    eventStartDateAndTime: string | null;  // ISO 8601
    eventEndDateAndTime: string | null;    // ISO 8601
    eventLocation: string | null;
    eventAttendanceMode: string[] | null;  // ['Online'] | ['Offline'] | ['Online','Offline']
    eventRegistrationBlockDescription: string | null;
    eventRegistrationBlockHeading: string | null;
    registerButtonLink: string | null;
  };
  categories: { nodes: { name: string }[] } | null;
}
```

### News Post

```ts
interface NewsPost {
  databaseId: number;
  title: string;
  date: string;
  excerpt: string;
  categories: { nodes: { name: string; slug: string }[] } | null;
  featuredImage: { node: { altText: string; sourceUrl: string } } | null;
}
```

### Home Page

```ts
type HomePageSection =
  | HeroSection
  | MissionVisionSection
  | EventsSection
  | AboutSection
  | NewsSection;

interface HeroSection {
  fieldGroupName: 'HomePageBuilderHomePageBuilderHeroSectionLayout';
  heroImage: ACFImage | null;
  heroContentTitle: string | null;
  heroContentTag: string | null;
  heroContentDescription: string | null;
  heroContentButtoon: ACFLink | null;
  heroVideoLink: string | null;
  heroVideoButtonLabel: string | null;
  heroImageTag: string | null;
  heroImageTitle: string | null;
}
```

### ACF Common Types

```ts
interface ACFLink { title: string; url: string; target: string; }
interface ACFImage { node: { altText: string; sourceUrl: string } | null; }
```

---

## 20. Local Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/sharjahculturalclub/arabculturalclub-live.git
cd arabculturalclub-live

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start development server
npm run dev
```

### Development Server

The project uses **Turbopack** (Next.js default since v15). If you encounter HMR module factory errors:

```bash
# Clear Turbopack cache and restart
rm -rf .next
npm run dev
```

This is a known Turbopack issue with certain module patterns and is resolved by clearing the cache.

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `WP_BACKEND_URL` | ✅ Yes | WordPress GraphQL endpoint (e.g. `https://backend.shjarabclub.ae`) |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Frontend URL (e.g. `https://shjarabclub.ae`) |
| `REVALIDATE_SECRET` | ✅ Yes | Must match WordPress plugin `REVALIDATE_SECRET` define |
| `WP_GRAPHQL_AUTH` | ❌ Optional | HTTP Basic Auth for GraphQL (empty string if not needed) |

---

*Documentation last updated: March 2026*
