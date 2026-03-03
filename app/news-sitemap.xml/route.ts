import { NextResponse } from 'next/server';
import { fetchLatestPostsForNews } from '@/lib/api/sitemap';

const SITE_URL = 'https://shjarabclub.ae';

// News sitemap should have shorter revalidation
export const revalidate = 1800; // 30 minutes

/**
 * Format date to ISO 8601 format
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
 * Generate Google News sitemap XML
 */
function generateNewsSitemapXml(posts: any[]): string {
    const newsEntries = posts
        .map((post) => {
            const categoryName = post.categories?.nodes?.[0]?.name || 'News';
            const categorySlug = post.categories?.nodes?.[0]?.slug || 'uncategorized';
            const publicationDate = formatDate(post.date);

            return `    <url>
      <loc>${escapeXml(`${SITE_URL}/${categorySlug}/${post.databaseId}`)}</loc>
      <news:news>
        <news:publication>
          <news:name>النادي الثقافي العربي</news:name>
          <news:language>ar</news:language>
        </news:publication>
        <news:publication_date>${publicationDate}</news:publication_date>
        <news:title>${escapeXml(post.title)}</news:title>
      </news:news>
    </url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries}
</urlset>`;
}

export async function GET() {
    try {
        const posts = await fetchLatestPostsForNews();

        if (!posts || posts.length === 0) {
            // Return empty news sitemap if no posts
            return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`, {
                status: 200,
                headers: {
                    'Content-Type': 'application/xml',
                },
            });
        }

        // Generate News XML
        const newsSitemapXml = generateNewsSitemapXml(posts);

        return new NextResponse(newsSitemapXml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        console.error('Error generating news sitemap:', error);

        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    }
}
