import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchAuthorDetail, getAuthorImageUrl, getAuthorBio } from '@/lib/actions/site/authorsPageAction';
import { SEO } from '@/components/SEO';
import { NewsCard } from '@/components/Cards';
import { BookOpen, Globe, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, Link2, type LucideIcon } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

// Map icon names from WordPress ACF to Lucide components
const socialIconMap: Record<string, LucideIcon> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
};

import { getMetadataImages, SITE_ORIGIN } from '@/lib/utils/seo';
import { normalizeImageUrl } from '@/lib/utils/url';

interface AuthorDetailPageProps {
    params: Promise<{ id: string }>;
}

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: AuthorDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const author = await fetchAuthorDetail(id);

    if (!author) {
        return { title: undefined };
    }

    const images = await getMetadataImages(author.avatar?.url || normalizeImageUrl(author.userProfileImage?.profileImage?.node?.sourceUrl ?? ""));
    const canonicalUrl = `${SITE_ORIGIN}/author/${id}`;
    const title = author.name || undefined;
    const description = author.description || undefined;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'النادي الثقافي العربي',
            type: 'profile',
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images.map(img => img.url),
        },
    };
}


// ── Helper: format date ───────────────────────────────────────────
function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

// ── Helper: strip HTML tags from excerpt ──────────────────────────
function stripHtml(html: string | null): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
}

// ── Page Component ────────────────────────────────────────────────
export default async function AuthorDetailPage({ params }: AuthorDetailPageProps) {
    const { id } = await params;
    const author = await fetchAuthorDetail(id);

    if (!author) {
        notFound();
    }

    const avatarUrl = getAuthorImageUrl(author);
    const authorBio = getAuthorBio(author);
    const articles = author.posts?.nodes || [];
    const articlesCount = articles.length;
    const address = author.userProfileImage?.address;
    const memberOf = author.userProfileImage?.memberOf;
    const designation = author.userProfileImage?.designation;
    const socialProfiles = author.userProfileImage?.socialProfiles?.filter(s => s.iconName && s.link) || [];

    // Map posts to NewsCard format
    const mappedArticles = articles.map((post) => {
        const firstCategory = post.categories?.nodes?.[0];
        return {
            id: post.databaseId,
            title: post.title || '',
            date: formatDate(post.date),
            category: firstCategory?.name || 'عام',
            categorySlug: firstCategory?.slug || 'uncategorized',
            image: normalizeImageUrl(post.featuredImage?.node?.sourceUrl || ''),
            excerpt: stripHtml(post.excerpt),
        };
    });

    return (
        <div className="pt-30 pb-25 min-h-screen ">
            <SEO
                title={author.name || undefined}
                description={author.description || undefined}
                url={`${SITE_ORIGIN}/author/${id}`}
                breadcrumbs={[
                    { name: "الرئيسية", item: `${SITE_ORIGIN}/` },
                    { name: "كتابنا ومبدعونا", item: `${SITE_ORIGIN}/authors` },
                    { name: author.name || undefined, item: `${SITE_ORIGIN}/author/${id}` }
                ]}
            />

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Profile Header */}
                 

                {/* Author's Content */}
                <div>
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <div className="w-2 h-10 bg-club-blue rounded-full"></div>
                        مساهمات {author.name}
                    </h2>

                    {mappedArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mappedArticles.map((article) => (
                                <NewsCard key={article.id} news={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-secondary/20 rounded-4xl p-16 text-center border-2 border-dashed border-border">
                            <p className="text-xl text-muted-foreground">لا توجد مقالات منشورة حالياً لهذا الكاتب.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
