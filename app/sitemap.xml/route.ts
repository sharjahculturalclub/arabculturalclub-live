import { NextResponse } from 'next/server';
import {
    fetchAllPostsForSitemap,
    fetchAllPagesForSitemap,
    fetchAllEventsForSitemap,
    fetchAllCategoriesForSitemap,
    fetchAllTagsForSitemap,
    fetchAllAuthorsForSitemap,
} from '@/lib/api/sitemap';

const SITE_URL = 'https://shjarabclub.ae';

// Revalidate sitemap every hour
export const revalidate = 3600;

interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
}

/**
 * Format date to ISO 8601 format for sitemap
 */
function formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return new Date().toISOString();
    }
    try {
        return new Date(dateString).toISOString();
    } catch {
        return new Date().toISOString();
    }
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Generate sitemap XML
 */
function generateSitemapXml(urls: SitemapUrl[]): string {
    const urlEntries = urls
        .map(
            (url) => `    <url>
      <loc>${escapeXml(url.loc)}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export async function GET() {
    try {
        const urls: SitemapUrl[] = [];

        // Add homepage
        urls.push({
            loc: SITE_URL,
            lastmod: formatDate(new Date().toISOString()),
            changefreq: 'daily',
            priority: '1.0',
        });

        // Fetch all data in parallel
        const [posts, pages, events, categories, tags, authors] = await Promise.all([
            fetchAllPostsForSitemap(),
            fetchAllPagesForSitemap(),
            fetchAllEventsForSitemap(),
            fetchAllCategoriesForSitemap(),
            fetchAllTagsForSitemap(),
            fetchAllAuthorsForSitemap(),
        ]);

        // Add static pages defined in the Next.js app
        const staticAppRoutes = [
            { path: '/about', priority: '0.8', changefreq: 'monthly' },
            { path: '/news', priority: '0.9', changefreq: 'daily' },
            { path: '/events', priority: '0.9', changefreq: 'daily' },
            { path: '/gallery', priority: '0.7', changefreq: 'weekly' },
            { path: '/our-programs', priority: '0.8', changefreq: 'monthly' },
            { path: '/contact', priority: '0.8', changefreq: 'monthly' },
            { path: '/authors', priority: '0.7', changefreq: 'weekly' },
            { path: '/faq', priority: '0.6', changefreq: 'monthly' },
            { path: '/membership', priority: '0.8', changefreq: 'monthly' },
            { path: '/membership-benefits', priority: '0.7', changefreq: 'monthly' },
            { path: '/membership/registration', priority: '0.8', changefreq: 'monthly' },
            { path: '/facility-booking', priority: '0.8', changefreq: 'monthly' },
            { path: '/sharjah-culture', priority: '0.7', changefreq: 'monthly' },
            { path: '/terms-of-use', priority: '0.5', changefreq: 'yearly' },
            { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
            { path: '/share', priority: '0.7', changefreq: 'monthly' },
            { path: '/search', priority: '0.4', changefreq: 'daily' },
        ];

        staticAppRoutes.forEach(route => {
            urls.push({
                loc: `${SITE_URL}${route.path}`,
                lastmod: formatDate(new Date().toISOString()),
                changefreq: route.changefreq,
                priority: route.priority,
            });
        });

        // Add pages (CMS pages)
        pages.forEach((page) => {
            // Avoid duplicating pages that are already handled by staticAppRoutes
            const staticSlugs = staticAppRoutes.map(r => r.path.substring(1));
            if (!staticSlugs.includes(page.slug) && page.slug !== 'home') {
                urls.push({
                    loc: `${SITE_URL}/${page.slug}`,
                    lastmod: formatDate(page.modified || page.date),
                    changefreq: 'monthly',
                    priority: '0.7',
                });
            }
        });

        // Add posts (articles) - URL structure: /[category]/[id]
        posts.forEach((post) => {
            const categorySlug = post.categories?.nodes?.[0]?.slug || 'uncategorized';
            urls.push({
                loc: `${SITE_URL}/${categorySlug}/${post.databaseId}`,
                lastmod: formatDate(post.modified || post.date),
                changefreq: 'weekly',
                priority: '0.8',
            });
        });

        // Add events - URL structure: /events/[id]
        events.forEach((event) => {
            urls.push({
                loc: `${SITE_URL}/events/${event.databaseId}`,
                lastmod: formatDate(event.modified || event.date),
                changefreq: 'weekly',
                priority: '0.8',
            });
        });

        // Add category pages
        categories.forEach((category) => {
            if (category.count > 0) {
                urls.push({
                    loc: `${SITE_URL}/category/${category.slug}`,
                    lastmod: formatDate(new Date().toISOString()),
                    changefreq: 'daily',
                    priority: '0.7',
                });
            }
        });

        // Add tag pages
        tags.forEach((tag) => {
            if (tag.count > 0) {
                urls.push({
                    loc: `${SITE_URL}/tag/${encodeURIComponent(tag.slug)}`,
                    lastmod: formatDate(new Date().toISOString()),
                    changefreq: 'weekly',
                    priority: '0.6',
                });
            }
        });

        // Add author pages
        authors.forEach((author) => {
            urls.push({
                loc: `${SITE_URL}/author/${author.databaseId}`,
                lastmod: formatDate(new Date().toISOString()),
                changefreq: 'weekly',
                priority: '0.6',
            });
        });

        // Generate XML
        const sitemapXml = generateSitemapXml(urls);

        return new NextResponse(sitemapXml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Error generating sitemap:', error);

        // Return minimal sitemap on error
        const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

        return new NextResponse(minimalSitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    }
}
