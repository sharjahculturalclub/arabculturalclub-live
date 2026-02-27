import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
    Calendar,
    Tag,
    User,
    ArrowRight,
    ArrowLeft,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Bookmark,
    ChevronLeft,
    Clock,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ShareButtons } from "@/components/ShareButtons";
import {
    fetchPostById,
    fetchRelatedPosts,
} from "@/lib/actions/site/postAction";

/* ─── Types ───────────────────────────────────────────────── */

type PageProps = {
    params: Promise<{ category: string; id: string }>;
};

/* ─── Dynamic Metadata (SEO from Yoast) ──────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category, id } = await params;
    const post = await fetchPostById(id);

    if (!post) {
        return { title: "الخبر غير موجود | النادي الثقافي العربي" };
    }

    const seo = post.seo;
    const ogImage = seo?.opengraphImage?.sourceUrl || post.featuredImage?.node?.sourceUrl;

    // Construct the canonical URL for this post
    const canonicalUrl = `https://shjarabclub.ae/${category}/${id}`;

    return {
        title: seo?.title || `${post.title} | النادي الثقافي العربي`,
        description: seo?.metaDesc || "",
        keywords: seo?.metaKeywords || undefined,
        openGraph: {
            title: seo?.opengraphTitle || post.title,
            description: seo?.opengraphDescription || seo?.metaDesc || "",
            type: (seo?.opengraphType as "article") || "article",
            url: canonicalUrl,
            siteName: seo?.opengraphSiteName || "النادي الثقافي العربي",
            publishedTime: seo?.opengraphPublishedTime || undefined,
            modifiedTime: seo?.opengraphModifiedTime || undefined,
            authors: seo?.opengraphAuthor ? [seo.opengraphAuthor] : undefined,
            images: ogImage ? [{ url: ogImage }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: seo?.twitterTitle || post.title,
            description: seo?.twitterDescription || seo?.metaDesc || "",
            images: seo?.twitterImage?.sourceUrl || ogImage || undefined,
        },
        robots: {
            index: seo?.metaRobotsNoindex !== "noindex",
            follow: seo?.metaRobotsNofollow !== "nofollow",
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

/* ─── Page Component ──────────────────────────────────────── */

export default async function PostDetail({ params }: PageProps) {
    const { category, id } = await params;
    const post = await fetchPostById(id);

    if (!post) {
        notFound();
    }

    // Validate that the post belongs to this category
    const postCategorySlug = post.categories?.nodes?.[0]?.slug;
    if (postCategorySlug && postCategorySlug !== category) {
        notFound();
    }

    // Fetch related posts from same categories
    const categoryIds =
        post.categories?.nodes?.map((c) => c.databaseId) ?? [];
    const relatedPosts = await fetchRelatedPosts(categoryIds, post.databaseId);

    const formattedDate = post.date
        ? new Date(post.date).toLocaleDateString("ar-AE", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    const readingTime = post.seo?.readingTime;

    return (
        <div className="pb-30 pt-30 z-0 relative">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-reverse space-x-2 text-sm text-primary/40 mb-10 font-tajawal">
                    <Link
                        href="/"
                        className="hover:text-accent-purple transition-colors"
                    >
                        الرئيسية
                    </Link>
                    <ChevronLeft size={14} />
                    <Link
                        href="/news"
                        className="hover:text-accent-purple transition-colors"
                    >
                        أخبار النادي
                    </Link>
                    {post.categories?.nodes?.[0] && (
                        <>
                            <ChevronLeft size={14} />
                            <Link
                                href={`/category/${post.categories.nodes[0].slug}`}
                                className="hover:text-accent-purple transition-colors"
                            >
                                {post.categories.nodes[0].name}
                            </Link>
                        </>
                    )}
                    <ChevronLeft size={14} />
                    <span className="text-primary/70 truncate max-w-[200px]">
                        {post.title}
                    </span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div>
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                {post.categories?.nodes?.[0]?.name && (
                                    <span className="bg-club-purple/10 text-club-purple px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                        <Tag size={14} />
                                        {post.categories.nodes[0].name}
                                    </span>
                                )}
                                {formattedDate && (
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <Calendar size={14} className="text-club" />
                                        {formattedDate}
                                    </span>
                                )}
                                {post.author?.node?.name && (
                                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                                        <User size={14} className="text-club" />
                                        {post.author.node.name}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                                {post.title}
                            </h1>

                            {/* Featured Image */}
                            {post.featuredImage?.node?.sourceUrl && (
                                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                                    <ImageWithFallback
                                        src={post.featuredImage.node.sourceUrl}
                                        alt={post.featuredImage.node.altText || post.title}
                                        className="w-full aspect-video object-cover"
                                    />
                                </div>
                            )}

                            {/* Post Content */}
                            <div
                                className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-8 text-justify
                  prose-headings:font-bold prose-headings:text-primary
                  prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                  prose-p:text-lg prose-p:leading-relaxed
                  prose-a:text-club-purple prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-primary
                  prose-ul:space-y-2 prose-ol:space-y-2
                  prose-li:text-lg
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-blockquote:border-club-purple prose-blockquote:bg-secondary/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-xl prose-blockquote:not-italic"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Author Section */}
                            {post.author?.node && (
                                <div className="mt-16 p-8 bg-white rounded-[2rem] border border-border flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md">
                                        <img
                                            src={post.author.node.userProfileImage?.profileImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400"}
                                            className="w-full h-full object-cover"
                                            alt={post.author.node.userProfileImage?.profileImage?.node?.altText || post.author.node.name}
                                        />
                                    </div>
                                    <div className="flex-grow text-center md:text-right">
                                        <div className="text-xs font-bold text-club-purple mb-1 uppercase tracking-wider">
                                            كاتب المقال
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">
                                            {post.author.node.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                            {post.author.node.userProfileImage?.authorInfo || "باحث متخصص في الشأن الثقافي العربي ومهتم بتوثيق المشهد الأدبي في الشارقة. يساهم بانتظام في مجلة الكلمة."}
                                        </p>
                                        <Link
                                            href={`/authors/${post.author.node.databaseId}`}
                                            className="text-club-blue text-sm font-bold flex items-center justify-center md:justify-start gap-2 hover:gap-3 transition-all"
                                        >
                                            <span>عرض المزيد من مقالات الكاتب</span>
                                            <ArrowLeft size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Tags and Share */}
                            <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                {post.tags?.nodes && post.tags.nodes.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.nodes.slice(0, 3).map((tag) => (
                                            <Link
                                                key={tag.databaseId}
                                                href={`/tag/${tag.slug}`}
                                                className="bg-secondary px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-club-purple/10 hover:text-club-purple transition-colors"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-sm text-muted-foreground">
                                        مشاركة:
                                    </span>
                                    <ShareButtons
                                        url={`https://shjarabclub.ae/${category}/${id}`}
                                        title={post.title}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-32 space-y-12">
                            {/* Newsletter / Action Card */}
                            <div className="bg-club-purple rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4">كن أول من يعلم</h3>
                                    <p className="text-white/80 mb-6 text-sm">
                                        اشترك في نشرتنا البريدية لتصلك آخر أخبار وفعاليات النادي
                                        مباشرة على بريدك.
                                    </p>
                                    <form className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="بريدك الإلكتروني"
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-club-blue"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-white text-club-purple font-bold py-3 rounded-xl hover:bg-club-blue hover:text-white transition-all"
                                        >
                                            اشترك الآن
                                        </button>
                                    </form>
                                </div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-club-blue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            </div>

                            {/* Related Articles */}
                            {relatedPosts.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-club-blue rounded-full"></div>
                                        أخبار ذات صلة
                                    </h3>
                                    <div className="space-y-6">
                                        {relatedPosts.map((related) => {
                                            const relatedDate = related.date
                                                ? new Date(related.date).toLocaleDateString("ar-AE", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })
                                                : "";

                                            const relatedCatSlug = related.categories?.nodes?.[0]?.slug || "uncategorized";

                                            return (
                                                <Link
                                                    key={related.databaseId}
                                                    href={`/${relatedCatSlug}/${related.databaseId}`}
                                                    className="group flex gap-4"
                                                >
                                                    {related.featuredImage?.node?.sourceUrl && (
                                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                                            <ImageWithFallback
                                                                src={related.featuredImage.node.sourceUrl}
                                                                alt={
                                                                    related.featuredImage.node.altText ||
                                                                    related.title
                                                                }
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col justify-center">
                                                        {related.categories?.nodes?.[0]?.name && (
                                                            <span className="text-[10px] font-bold text-club-purple mb-1">
                                                                {related.categories.nodes[0].name}
                                                            </span>
                                                        )}
                                                        <h4 className="font-bold text-sm line-clamp-2 group-hover:text-club-purple transition-colors">
                                                            {related.title}
                                                        </h4>
                                                        {relatedDate && (
                                                            <span className="text-[10px] text-muted-foreground mt-2">
                                                                {relatedDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Cultural Quote */}
                            <div className="bg-secondary/50 p-8 rounded-3xl border border-border italic text-center">
                                <p className="text-lg text-primary/80 mb-4 font-medium">
                                    &quot;الثقافة هي وعاء الحضارة، والشارقة هي حارس هذا الوعاء
                                    وأمينه.&quot;
                                </p>
                                <span className="text-club-purple font-bold text-sm">
                                    — مأثورة ثقافية
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-24 pt-12 border-t border-border flex justify-start items-center">
                    <Link
                        href="/news"
                        className="flex items-center gap-3 text-club-purple font-bold hover:gap-4 transition-all"
                    >
                        <ArrowRight size={20} />
                        <span>العودة لجميع الأخبار</span>
                    </Link>
                </div>
            </div>

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        headline: post.title,
                        datePublished: post.date,
                        dateModified: post.modified,
                        author: post.author?.node
                            ? {
                                "@type": "Person",
                                name: post.author.node.name,
                            }
                            : undefined,
                        publisher: {
                            "@type": "Organization",
                            name: "النادي الثقافي العربي",
                            url: "https://shjarabclub.ae",
                        },
                        image: post.featuredImage?.node?.sourceUrl || undefined,
                        description: post.seo?.metaDesc || "",
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://shjarabclub.ae/${category}/${id}`,
                        },
                    }),
                }}
            />
        </div>
    );
}
