# Next.js + React Project Checklist

> **Purpose**: Use this checklist when starting or building projects with Next.js, React, Apollo/GraphQL, and similar stacks. Prevents common issues identified in technical audits.

---

## 1. Security

### GraphQL
- [ ] **Never interpolate user input into GraphQL strings** — Use variables instead:
  ```ts
  // ❌ BAD: GraphQL injection risk
  gql`query { posts(where: { search: "${userInput}" }) }`
  
  // ✅ GOOD: Parameterized
  gql`query SearchPosts($search: String!) { posts(where: { search: $search }) }`
  apolloClient.query({ query: SEARCH_POSTS, variables: { search: userInput } })
  ```

### XSS
- [ ] **Sanitize HTML before `dangerouslySetInnerHTML`** — Use DOMPurify for user/CMS content:
  ```ts
  import DOMPurify from 'dompurify';
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```
- [ ] **Trust model** — Only use raw HTML if content is fully trusted (e.g. your own CMS with strict roles).

### API & Webhooks
- [ ] **No secrets in URLs** — Use `Authorization` or custom headers (e.g. `x-secret`), not query params.
- [ ] **Rate limiting** — Add rate limiting to webhooks and public APIs (e.g. 10 req/min per IP).
- [ ] **Validate input length** — Limit form fields (e.g. message ≤ 5000 chars) to prevent DoS.

### Environment Variables
- [ ] **No hardcoded secrets** — Use `process.env` for all secrets.
- [ ] **`NEXT_PUBLIC_` prefix** — Only for values that must be exposed to the client.
- [ ] **`.env.example`** — Include all required variables (without real values) in the repo.

---

## 2. Performance

### Caching
- [ ] **Cache-Control** — Don’t apply `max-age=31536000` to HTML pages. Use it only for:
  - Static assets (`/_next/static/*`, images)
  - Truly immutable resources
- [ ] **GraphQL/Apollo** — Prefer `cache-first` where data is stable; use `network-only` only when needed.
- [ ] **Response caching** — Use Next.js Data Cache (`fetch` with `next: { revalidate, tags }`); no external cache (no Redis/Vercel KV).

### Bundling
- [ ] **Dynamic imports** — Use `next/dynamic` for heavy components (carousels, charts, modals).
- [ ] **`optimizePackageImports`** — Add large component libraries in `next.config`:
  ```ts
  experimental: { optimizePackageImports: ['@/components', '@/lib'] }
  ```
- [ ] **Bundle analysis** — Run `ANALYZE=true next build` periodically and trim large deps.

### Data Fetching
- [ ] **Parallelize** — Use `Promise.all()` instead of sequential awaits where possible.
- [ ] **Loading states** — Add `loading.tsx` for route-level skeletons.

### Images
- [ ] **`next/image`** — Use for all images; configure `remotePatterns` for external domains.
- [ ] **Formats** — Enable AVIF/WebP where supported.
- [ ] **`dangerouslyAllowSVG`** — Only if needed; ensure SVG content is trusted.

---

## 3. Code Quality

### Naming
- [ ] **Consistent naming** — e.g. `articleQueries.ts` (not `articleQuires`).
- [ ] **Plural for collections** — `logoActions.ts`, `articleQueries.ts`.

### Duplication
- [ ] **Extract repeated JSX** — If a pattern repeats 3+ times, create a reusable component.
- [ ] **Map over configs** — Replace repeated blocks with `sections.map((section, i) => <Section ... />)`.

### Dead Code
- [ ] **Remove commented code** — Prefer git history instead of commented blocks.
- [ ] **Unused imports** — Run `eslint` with `no-unused-vars` and fix before commits.
- [ ] **Unused dependencies** — Run `npx depcheck` and remove unused packages.

### Component Size
- [ ] **Split large components** — Aim for components under ~150 lines; extract subcomponents.
- [ ] **Extract logic** — Move complex logic into hooks or utils.

---

## 4. Architecture & Structure

### Folder Layout
```
src/ or /
├── app/              # Routes, layouts, API
├── components/
│   ├── ui/           # Primitives
│   ├── features/     # Feature modules (article, video, contact)
│   └── layout/       # Header, Footer, etc.
├── lib/
│   ├── api/          # HTTP/GraphQL clients
│   ├── graphql/      # Queries, mutations
│   ├── services/     # Business logic
│   └── utils/        # Pure utilities
├── hooks/
├── types/
└── config/           # Env, constants
```

### Separation of Concerns
- [ ] **API layer** — Separate fetch logic from business logic.
- [ ] **Server Actions** — Keep thin; delegate to services or API helpers.
- [ ] **Components** — Prefer presentational components; keep data fetching in server components or hooks.

### Tight Coupling
- [ ] **Backend assumptions** — Avoid spreading CMS-specific fields (e.g. `categorySlug`, `id`) everywhere; use adapters/transforms.
- [ ] **Single data source** — Centralize Apollo/client setup; avoid creating multiple instances.

---

## 5. DevOps & Deployment

### Before First Deploy
- [ ] **`.env.example`** — Document all required env vars.
- [ ] **README** — Include setup steps and deployment notes.
- [ ] **Environment separation** — Use different configs for dev / staging / prod.

### CI/CD
- [ ] **Lint & typecheck** — Run on every PR.
- [ ] **Build** — Ensure `next build` succeeds in CI.
- [ ] **Tests** — Add unit/integration tests where feasible.

### Docker (Optional)
- [ ] **Dockerfile** — Use multi-stage build for smaller images.
- [ ] **`.dockerignore`** — Exclude `node_modules`, `.next`, `.git`.

### Monitoring
- [ ] **Error tracking** — e.g. Sentry, Vercel Analytics.
- [ ] **Health check** — Add `/api/health` for load balancers.

---

## 6. Scalability

### At Launch
- [ ] **Caching strategy** — Use Next.js Data Cache + CDN (edge); no external cache (no Redis/Vercel KV).
- [ ] **Rate limiting** — Protect APIs and forms.
- [ ] **CDN** — Use edge/CDN for static assets and, where possible, API routes.

### As You Grow
- [ ] **Database** — Add indexes for search and list queries.
- [ ] **GraphQL** — Set query limits, pagination, and caching on the backend.
- [ ] **Monitoring** — Track latency, error rates, and traffic.

---

## 7. Next.js + WordPress: Granular Revalidation

> **Context**: Frontend = Next.js, CMS = WordPress. Cache on initial load; revalidate only affected routes when content changes—never rebuild or invalidate the entire app cache.

### Strategy Overview
- [ ] **Cache on first load** — Data is cached at build time or on first request (ISR / static + on-demand revalidation).
- [ ] **Surgical revalidation** — When WordPress content changes, revalidate only the affected route(s).
- [ ] **No full cache flush** — Avoid `revalidatePath('/')` with `layout` unless the whole site truly changed (e.g. menu, theme).

### Implementation Checklist

#### Fetch Layer
- [ ] **Use cache tags** — Tag fetch requests by content type:
  ```ts
  fetch(url, { next: { tags: ['posts', `post-${slug}`] } })
  // or with Apollo: ensure fetch options include Next.js cache tags
  ```
- [ ] **Map WordPress types to tags** — `post` → `['posts', 'post-{slug}']`, `page` → `['pages', 'page-{slug}']`, `category` → `['category-{slug}']`, `menu` → `['layout']`.

#### Webhook Handler (e.g. `/api/revalidate`)
- [ ] **Validate webhook** — Verify secret via header (e.g. `x-secret`), not URL params.
- [ ] **Route by content type** — Use payload (`post_type`, `slug`, `action`) to decide what to revalidate:

  | WordPress Event   | Revalidate                                                                 |
  |-------------------|----------------------------------------------------------------------------|
  | Post created/updated | `/[category]/[id]` (that post), `/`, `/category/[category]`, `/tag/[tag]`, `/search` |
  | Page updated      | `/[slug]` (that page only), layout if homepage config changed              |
  | Menu updated      | `revalidatePath('/', 'layout')` (header/footer)                            |
  | Category updated  | `/category/[category]`, `/` if homepage uses that category                 |
  | Media updated     | Only if media appears on dedicated pages; otherwise layout                 |
  | Post/page deleted | Same as update, plus any listing pages that included it                    |

- [ ] **Use `revalidatePath` with correct scope** — Use `'page'` for a single page, `'layout'` only when layout data (menu, site config) changed.
- [ ] **Use `revalidateTag` when possible** — Prefer tag-based revalidation over path-based when your fetch layer supports it.

#### Example Webhook Logic
```ts
// POST /api/revalidate — receive { action, post_type, slug, post_id, category_slug } from WordPress
const { action, post_type, slug, post_id, category_slug } = await req.json();

if (post_type === 'post') {
  // Revalidate specific article path (e.g. /politics/123)
  if (category_slug && post_id) revalidatePath(`/${category_slug}/${post_id}`, 'page');
  revalidatePath('/');
  revalidatePath('/category/[category]', 'page'); // all category listing pages
  revalidatePath('/tag/[tag]', 'page');
  revalidatePath('/search', 'page');
}
if (post_type === 'page' && slug) {
  revalidatePath(`/${slug}`, 'page');
}
if (action === 'menu_update') {
  revalidatePath('/', 'layout'); // header/footer menus
}
```

### Avoid
- [ ] **No `revalidatePath('/', 'layout')` on every update** — Only for layout-level changes (menus, theme).
- [ ] **No full rebuilds** — Don’t trigger full `next build` on content updates; use on-demand revalidation.
- [ ] **No secret in URL** — Use POST + header for webhook auth, not GET with `?secret=`.

### Data Control: Add / Update / Delete Flow

> How revalidation is triggered when content changes in WordPress.

#### Flow overview

```
WordPress (CMS)                    Next.js (frontend)
─────────────────                 ──────────────────
Content changes                   Cached pages/data
       │                                 │
       │ 1. WP hook fires                │
       │    (save_post, delete, etc.)    │
       │                                 │
       │ 2. POST /api/revalidate         │
       │    { action, post_type, slug,   │
       │      post_id }                  │
       │ ─────────────────────────────>  │
       │                                 │
       │                         3. revalidatePath()
       │                            clears Next.js cache
       │                                 │
       │                         4. Next request = fresh fetch
       │                            from WordPress
```

#### ADD (create)

| Step | Where | What happens |
|------|-------|--------------|
| 1 | WordPress | User publishes new post/page → `save_post` (create) |
| 2 | Webhook | Sends `action: 'create'` with `post_type`, `slug`, `post_id` |
| 3 | Next.js | Revalidates homepage, category/tag/search, affected pages |
| 4 | Result | New content appears on next visit |

#### UPDATE (edit)

| Step | Where | What happens |
|------|-------|--------------|
| 1 | WordPress | User edits and saves → `save_post` (update) or `transition_post_status` |
| 2 | Webhook | Sends `action: 'update'` or `'publish'` |
| 3 | Next.js | Revalidates homepage, specific page (if page), listings, search |
| 4 | Result | Updated content appears on next visit |

#### DELETE (unpublish / remove)

| Step | Where | What happens |
|------|-------|--------------|
| 1 | WordPress | User deletes post or unpublishes → `before_delete_post` or `transition_post_status` |
| 2 | Webhook | Sends `action: 'delete'` or `'unpublish'` |
| 3 | Next.js | Revalidates layout (or use surgical revalidation for better performance) |
| 4 | Result | Content removed; listings refreshed on next visit |

#### Action → routes mapping

| Action | Routes revalidated | Notes |
|--------|--------------------|-------|
| `create` / `update` / `publish` | `/`, `/[category]/[id]`, category/tag/search, specific page | Granular |
| `delete` / `unpublish` | Full layout or surgical (preferred) | Avoid full layout if possible |
| `menu_update` | `revalidatePath('/', 'layout')` | Menus are site-wide |
| `media_update` | Layout or affected pages | Depends on usage |

#### WordPress hooks → webhook payload

| WordPress hook | Trigger | Payload `action` |
|----------------|---------|------------------|
| `save_post` (new) | Post/page created | `create` |
| `save_post` (edit) | Post/page edited | `update` |
| `transition_post_status` | Published | `publish` |
| `transition_post_status` | Unpublished | `unpublish` |
| `before_delete_post` | Post deleted | `delete` |
| `wp_update_nav_menu` | Menu changed | `menu_update` |
| `add_attachment` / `edit_attachment` / `delete_attachment` | Media changed | `media_update` |

#### End-to-end example (edit a post)

1. Editor edits post in WordPress, clicks **Update**.
2. WordPress fires `save_post`.
3. `wordpress-webhook.php` POSTs to `/api/revalidate` with `{ action: 'update', post_type: 'post', slug: '...', post_id: 123 }`.
4. Next.js verifies `x-secret` header.
5. Next.js calls `revalidatePath('/')`, `revalidatePath('/[category]/[id]', 'page')`, etc.
6. Cache is cleared for those paths.
7. Next visitor hits that article → Next.js fetches fresh data from WordPress → user sees updated content.

---

## 8. High-Traffic Architecture (100k+ Users)

> **Goal**: Minimize API calls, reduce server load, and handle traffic spikes. Support ~100k users with smart caching, selective revalidation, and efficient data fetching.
> **Constraint**: No external cache (no Redis, no Vercel KV). Use Next.js Data Cache + edge/CDN only.

### Multi-Tier Caching (Next.js Native Only)

- [ ] **Edge cache (CDN)** — Serve static assets and pre-rendered HTML at the edge:
  - `/_next/static/*` — immutable, max-age 1 year
  - `/images/*` — immutable or long TTL
  - Static pages — `stale-while-revalidate` (serve stale, revalidate in background)

- [ ] **Next.js Data Cache** — Use `fetch` with `next: { revalidate, tags }` for GraphQL/REST:
  ```ts
  fetch(url, { next: { revalidate: 60, tags: ['posts'] } })  // ISR: 60s
  fetch(url, { next: { revalidate: 3600, tags: ['post-123'] } })  // 1 hour
  ```

- [ ] **Next.js Data Cache only** — No Redis/Vercel KV. Rely on `fetch` with `next: { revalidate, tags }` and `revalidatePath`/`revalidateTag` for invalidation. Use webhook to invalidate on CMS changes.

- [ ] **Apollo/GraphQL client** — Use `cache-first` where possible; `network-only` only for real-time or user-specific data.

### Minimize API Calls

- [ ] **Request deduplication** — Next.js deduplicates `fetch` in the same render; avoid duplicate queries in parallel components.

- [ ] **Batch GraphQL** — Combine related queries where the backend supports it:
  ```ts
  // Prefer: single query for homepage
  query HomePage { posts(...) categories(...) menu(...) }
  // Avoid: 3 separate round-trips
  ```

- [ ] **Parallel fetching** — Use `Promise.all()` for independent requests (config + articles + videos) instead of sequential.

- [ ] **Data colocation** — Fetch only what a route needs; avoid over-fetching in layouts.

- [ ] **Pagination** — Use cursor-based pagination; limit `first`/`limit` (e.g. 12–24 per page).

### Selective Revalidation (Surgical Invalidation)

- [ ] **Tag-based invalidation** — Map content to tags; on CMS update, invalidate only affected tags:
  | Content | Tags | Revalidate |
  |---------|------|------------|
  | Post 123 | `post-123`, `posts` | Only that post + listing pages that show it |
  | Category "politics" | `category-politics` | Only `/category/politics` and pages using it |
  | Menu | `layout` | Layout only |
  | Homepage config | `homepage` | `/` only |

- [ ] **Avoid cascading invalidation** — Don’t invalidate everything when one post changes; use granular tags.

- [ ] **Stale-while-revalidate** — Serve cached response immediately; revalidate in background; avoid blocking on cold cache.

### Data-Fetching Strategy

- [ ] **Server Components by default** — Fetch in Server Components; no client-side fetch for initial data.

- [ ] **Streaming** — Use `loading.tsx` and Suspense so the shell renders fast; stream heavy sections.

- [ ] **Static generation where possible** — Pre-render at build time; use ISR for content that changes.

- [ ] **Avoid client fetch for initial load** — Don’t fetch in `useEffect` what could be fetched on the server.

### Traffic Spike Handling

- [ ] **Rate limiting** — Protect APIs (e.g. 100 req/min per IP); use Vercel Edge Config or middleware-based limits (no Redis).

- [ ] **Backpressure** — Queue or throttle non-critical work (e.g. analytics) during spikes.

- [ ] **Circuit breaker** — If upstream (WordPress/GraphQL) is down, serve stale cache and retry with backoff.

- [ ] **Graceful degradation** — If a section fails to fetch, render rest of page; show partial content or fallback.

### Stateless & Horizontal Scaling

- [ ] **No server-side session storage** — Use JWT/cookies only (no Redis); keep requests stateless so any edge/server can serve.

- [ ] **Idempotent APIs** — Design so retries are safe; use idempotency keys for mutations.

### Capacity Checklist (100k users)

| Layer | Target | Notes |
|-------|--------|------|
| Edge/CDN | Cache hit rate >80% | Static + ISR pages |
| Next.js Data Cache | Hit before hitting backend | `revalidate` + tags; no external cache |
| Backend (WordPress/GraphQL) | <10% of total requests | Most served from Next.js cache |
| Database | Indexed queries, connection pooling | On WordPress side |

### Quick Reference

```
User Request → CDN (static) → Edge (ISR) → Next.js Data Cache → Backend API
                ↑ miss         ↑ miss        ↑ miss
                cache here     cache here    cache here (no Redis/KV)
```

---

## 9. Dependencies

### Before Adding
- [ ] **Need check** — Is this already covered by an existing dependency?
- [ ] **Bundle size** — Check impact (e.g. Bundlephobia).
- [ ] **Maintenance** — Prefer maintained, widely used packages.

### Ongoing
- [ ] **Audit** — Run `npm audit` regularly.
- [ ] **Updates** — Use Dependabot/Renovate for automated updates.
- [ ] **Cleanup** — Remove unused deps (e.g. via `depcheck`).

---

## 10. Quick Pre-Commit Checklist

- [ ] No `process.env` secrets in client bundles
- [ ] No raw user input in GraphQL strings
- [ ] HTML from external sources sanitized before rendering
- [ ] No secrets in URLs or query params
- [ ] Cache headers appropriate for each route type
- [ ] No large commented blocks or dead code
- [ ] Lint and typecheck pass

---

*Last updated: Feb 2025 | Based on audit of today-media-website*
