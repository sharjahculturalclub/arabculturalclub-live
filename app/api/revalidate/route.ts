import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Revalidation webhook handler for WordPress
 * 
 * Receives POST requests from WordPress when content changes,
 * and surgically invalidates the Next.js cache.
 * 
 * Follows PROJECT_CHECKLIST:
 * - §1: Secret validated via x-secret header (not URL params)
 * - §7: Surgical revalidation by action type
 * - §8: Graceful error handling
 */
export async function POST(req: NextRequest) {
    const startTime = Date.now();
    console.log('🔔 Revalidation webhook received at:', new Date().toISOString());

    try {
        const secret = process.env.REVALIDATE_SECRET;
        const token = req.headers.get('x-secret');

        if (!secret) {
            console.error('❌ REVALIDATE_SECRET not configured in .env.local');
            return NextResponse.json(
                { message: 'REVALIDATE_SECRET not configured' },
                { status: 500 }
            );
        }

        if (token !== secret) {
            console.error('❌ Invalid secret token');
            return NextResponse.json(
                { message: 'Invalid secret' },
                { status: 401 }
            );
        }

        const body = await req.json();
        console.log('📦 Webhook payload:', JSON.stringify(body, null, 2));

        const { action, post_type, slug, post_id } = body;

        console.log('🔄 Starting revalidation process...');

        // CRITICAL: Always bust the 'wordpress' tag to clear the Next.js Data Cache
        // Apollo Client tags all GraphQL fetches with { tags: ['wordpress'] }
        // Next.js 16: revalidateTag requires (tag, profile) — expire: 0 = immediate
        revalidateTag('wordpress', { expire: 0 });
        console.log('✅ Revalidated wordpress data cache tag');

        // Revalidate based on action type (checklist §7: surgical revalidation)
        if (action === 'menu_update') {
            // Menu changes affect the entire layout (header/footer)
            revalidatePath('/', 'layout');
            console.log('✅ Revalidated entire layout (menu update)');
        }
        else if (action === 'create' || action === 'update' || action === 'publish') {
            // Revalidate homepage
            revalidatePath('/');
            console.log('✅ Revalidated homepage');

            if (post_type === 'post') {
                // Revalidate news/article pages
                revalidatePath('/news', 'page');
                console.log('✅ Revalidated news pages');

                // Revalidate search
                revalidatePath('/search', 'page');
                console.log('✅ Revalidated search page');

                // Revalidate tags
                revalidatePath('/tags', 'page');
                console.log('✅ Revalidated tags page');
            }

            if (post_type === 'page') {
                if (slug) {
                    revalidatePath(`/${slug}`, 'page');
                    console.log(`✅ Revalidated page: /${slug}`);
                }
                // Pages might affect layout
                revalidatePath('/', 'layout');
                console.log('✅ Revalidated layout');
            }

            if (post_type === 'event') {
                revalidatePath('/events', 'page');
                console.log('✅ Revalidated events pages');
            }
        }
        else if (action === 'delete' || action === 'unpublish') {
            revalidatePath('/', 'layout');
            console.log('✅ Full site revalidation (delete/unpublish)');
        }
        else if (action === 'media_update') {
            revalidatePath('/', 'layout');
            console.log('✅ Revalidated layout (media update)');
        }
        else if (action === 'theme_settings_update') {
            revalidatePath('/', 'layout');
            revalidatePath('/');
            console.log('✅ Revalidated entire site (theme settings update)');
        }
        else if (action === 'taxonomy_update') {
            // Taxonomy changes affect listing pages and navigation
            revalidatePath('/');
            revalidatePath('/news', 'page');
            revalidatePath('/events', 'page');
            revalidatePath('/tags', 'page');
            console.log('✅ Revalidated listing pages (taxonomy update)');
        }
        else {
            // Default: revalidate homepage and layout
            revalidatePath('/');
            revalidatePath('/', 'layout');
            console.log('✅ Default revalidation');
        }

        const duration = Date.now() - startTime;
        console.log(`⏱️  Revalidation completed in ${duration}ms`);

        return NextResponse.json({
            success: true,
            revalidated: true,
            action,
            post_type,
            slug,
            post_id,
            duration_ms: duration,
            now: Date.now()
        });
    } catch (error) {
        console.error('❌ Revalidation error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            success: false,
            error: message
        }, { status: 500 });
    }
}

// GET method for manual testing
export async function GET(req: NextRequest) {
    const secret = process.env.REVALIDATE_SECRET;
    const token = req.nextUrl.searchParams.get('secret');

    if (!secret || token !== secret) {
        return NextResponse.json(
            { message: 'Invalid secret' },
            { status: 401 }
        );
    }

    try {
        revalidatePath('/', 'layout');
        console.log('✅ Manual revalidation via GET');

        return NextResponse.json({
            success: true,
            revalidated: true,
            now: Date.now()
        });
    } catch (error) {
        console.error('❌ Revalidation error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            success: false,
            error: message
        }, { status: 500 });
    }
}
