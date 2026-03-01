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

interface AuthorDetailPageProps {
    params: Promise<{ id: string }>;
}

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: AuthorDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const author = await fetchAuthorDetail(id);

    if (!author) {
        return { title: 'الكاتب غير موجود | النادي الثقافي العربي' };
    }

    return {
        title: `${author.name} | النادي الثقافي العربي`,
        description: author.description || `مساهمات ${author.name} في النادي الثقافي العربي`,
        alternates: {
            canonical: `https://shjarabclub.ae/author/${id}`,
        },
        openGraph: {
            title: `${author.name} | النادي الثقافي العربي`,
            description: author.description || `مساهمات ${author.name} في النادي الثقافي العربي`,
            url: `https://shjarabclub.ae/author/${id}`,
            siteName: 'النادي الثقافي العربي',
            type: 'profile',
            images: author.avatar?.url ? [{ url: author.avatar.url }] : undefined,
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
            image: post.featuredImage?.node?.sourceUrl || '',
            excerpt: stripHtml(post.excerpt),
        };
    });

    return (
        <div className="pt-25 pb-25 min-h-screen">
            <SEO
                title={author.name || 'الكاتب'}
                description={author.description || `مساهمات ${author.name}`}
                url={`https://shjarabclub.ae/author/${id}`}
                breadcrumbs={[
                    { name: "الرئيسية", item: "https://shjarabclub.ae/" },
                    { name: "كتابنا ومبدعونا", item: "https://shjarabclub.ae/authors" },
                    { name: author.name || 'الكاتب', item: `https://shjarabclub.ae/author/${id}` }
                ]}
            />

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Profile Header */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-border mb-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-club-purple/5 -z-10"></div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative">
                        <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 relative">
                            <div className="absolute inset-0 bg-club-blue rounded-[3rem] rotate-6"></div>
                            <ImageWithFallback
                                src={avatarUrl}
                                className="w-full h-full object-cover rounded-[3rem] relative z-10 border-8 border-white shadow-2xl"
                            />
                        </div>

                        <div className="grow text-center md:text-right">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{author.name}</h1>
                                    {designation && (
                                        <p className="text-xl text-club-purple font-medium mb-4">{designation}</p>
                                    )}
                                </div>
                                {socialProfiles.length > 0 && (
                                    <div className="flex gap-4">
                                        {socialProfiles.map((social, idx) => {
                                            const IconComponent = socialIconMap[social.iconName?.toLowerCase() || ''] || Link2;
                                            return (
                                                <a
                                                    key={idx}
                                                    href={social.link!}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary hover:bg-club-purple hover:text-white transition-all"
                                                    title={social.iconName || ''}
                                                >
                                                    <IconComponent size={20} />
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {authorBio && (
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mb-8">
                                    {authorBio}
                                </p>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-muted-foreground">
                                {address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-club" />
                                        <span>{address}</span>
                                    </div>
                                )}
                                {memberOf && (
                                    <div className="flex items-center gap-2">
                                        <Globe size={18} className="text-club" />
                                        <span>{memberOf}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <BookOpen size={18} className="text-club" />
                                    <span>{articlesCount} مساهمة منشورة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                        <div className="bg-secondary/20 rounded-[2rem] p-16 text-center border-2 border-dashed border-border">
                            <p className="text-xl text-muted-foreground">لا توجد مقالات منشورة حالياً لهذا الكاتب.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
