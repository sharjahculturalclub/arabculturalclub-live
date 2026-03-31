import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Calendar, ChevronLeft, User } from "lucide-react";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ShareButtons } from "@/components/ShareButtons";
import { SEO } from "@/components/SEO";
import { SidebarNewsletter } from "@/components/SidebarNewsletter";
import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";
import { normalizeImageUrl } from "@/lib/utils/url";
import { fetchOpinionById, fetchOpinionPosts, fetchOpinionPageOptions } from "@/lib/actions/site/opinionsAction";
import { fetchFooterSettings } from "@/lib/actions/site/footerAction";

export const revalidate = 3600;

type PageProps = {
    params: Promise<{ id: string }>;
};

/* ─── Metadata ────────────────────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const opinion = await fetchOpinionById(id);

    if (!opinion) return { title: undefined };

    const seo = opinion.seoOptions;
    const featuredImageUrl = normalizeImageUrl(opinion.featuredImage?.node?.sourceUrl ?? "");
    const canonicalUrl = `${SITE_ORIGIN}/opinion/${id}`;
    const images = await getMetadataImages(undefined, featuredImageUrl);

    const title = seo?.seoTitle || opinion.title || undefined;
    const description = stripHtml(seo?.metaDescription) || undefined;

    return {
        title,
        description,
        keywords: seo?.focusKeyword || undefined,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            type: "article",
            url: canonicalUrl,
            siteName: "النادي الثقافي العربي",
            images,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: images.map((img) => img.url),
        },
    };
}

/* ─── Page ────────────────────────────────────────────────── */

export default async function OpinionDetailPage({ params }: PageProps) {
    const { id } = await params;

    const [opinion, footerData, latestData, pageData] = await Promise.all([
        fetchOpinionById(id),
        fetchFooterSettings(),
        fetchOpinionPosts(6),
        fetchOpinionPageOptions(),
    ]);

    if (!opinion) notFound();

    const relatedOpinions = latestData.posts
        .filter((p) => p.databaseId !== opinion.databaseId)
        .slice(0, 5);

    const seo = opinion.seoOptions;
    const opinionUrl = `${SITE_ORIGIN}/opinion/${id}`;
    const listingTitle = pageData?.title || "المقالات";

    const formattedDate = opinion.date
        ? new Date(opinion.date).toLocaleDateString("ar-AE", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    const rawImageUrl = normalizeImageUrl(opinion.featuredImage?.node?.sourceUrl || "");
    const absoluteImageUrl = rawImageUrl
        ? rawImageUrl.startsWith("/")
            ? `https://shjarabclub.ae${rawImageUrl}`
            : rawImageUrl
        : undefined;

    return (
        <div className="pb-30 pt-30 z-0 relative">
            <SEO
                title={seo?.seoTitle || opinion.title || undefined}
                description={seo?.metaDescription || undefined}
                url={opinionUrl}
                pageType="WebPage"
                breadcrumbs={[
                    { name: "الرئيسية", item: `${SITE_ORIGIN}/` },
                    { name: listingTitle, item: `${SITE_ORIGIN}/opinions` },
                    { name: opinion.title || undefined, item: opinionUrl },
                ]}
            />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-reverse space-x-2 text-sm text-primary/40 mb-10 font-tajawal">
                    <Link href="/" className="hover:text-accent-purple transition-colors">
                        الرئيسية
                    </Link>
                    <ChevronLeft size={14} />
                    <Link href="/opinions" className="hover:text-accent-purple transition-colors">
                        {listingTitle}
                    </Link>
                    <ChevronLeft size={14} />
                    <span className="text-primary/70 truncate max-w-[200px]">
                        {opinion.title}
                    </span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="bg-club-purple/10 text-club-purple px-4 py-1 rounded-full text-sm font-bold">
                                المقالات
                            </span>
                            {formattedDate && (
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Calendar size={14} className="text-club" />
                                    {formattedDate}
                                </span>
                            )}
                            {opinion.author?.node?.name && (
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <User size={14} className="text-club" />
                                    {opinion.author.node.name}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                            {opinion.title}
                        </h1>

                        {/* Featured Image */}
                        {opinion.featuredImage?.node?.sourceUrl && (
                            <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                                <ImageWithFallback
                                    src={normalizeImageUrl(opinion.featuredImage.node.sourceUrl)}
                                    alt={opinion.featuredImage.node.altText || opinion.title}
                                    className="w-full aspect-video object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
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
                            dangerouslySetInnerHTML={{ __html: opinion.content }}
                        />

                        {/* Share */}
                        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-sm text-muted-foreground">
                                    مشاركة:
                                </span>
                                <ShareButtons url={opinionUrl} title={opinion.title} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-32 space-y-12">
                            {footerData?.newsletter && (
                                <SidebarNewsletter
                                    title={footerData.newsletter.title}
                                    description={footerData.newsletter.description}
                                    formId={footerData.newsletter.formid}
                                />
                            )}

                            {/* Related Opinions */}
                            {relatedOpinions.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-club-blue rounded-full"></div>
                                        المقالات ذات صلة
                                    </h3>
                                    <div className="space-y-6">
                                        {relatedOpinions.map((related) => {
                                            const relatedDate = related.date
                                                ? new Date(related.date).toLocaleDateString("ar-AE", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })
                                                : "";
                                            return (
                                                <Link
                                                    key={related.databaseId}
                                                    href={`/opinion/${related.databaseId}`}
                                                    className="group flex gap-4"
                                                >
                                                    {related.featuredImage?.node?.sourceUrl && (
                                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                                            <ImageWithFallback
                                                                src={normalizeImageUrl(related.featuredImage.node.sourceUrl)}
                                                                alt={related.featuredImage.node.altText || related.title}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col justify-center">
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

                {/* Back Link */}
                <div className="mt-24 pt-12 border-t border-border flex justify-start items-center">
                    <Link
                        href="/opinions"
                        className="flex items-center gap-3 text-club-purple font-bold hover:gap-4 transition-all"
                    >
                        <ArrowRight size={20} />
                        <span>العودة لجميع الآراء</span>
                    </Link>
                </div>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "@id": `${opinionUrl}#article`,
                        url: opinionUrl,
                        headline: seo?.seoTitle || opinion.title,
                        datePublished: opinion.date,
                        dateModified: opinion.modified,
                        ...(opinion.author?.node && {
                            author: {
                                "@type": "Person",
                                name: opinion.author.node.name,
                            },
                        }),
                        publisher: {
                            "@id": "https://shjarabclub.ae/#organization",
                        },
                        ...(absoluteImageUrl && { image: absoluteImageUrl }),
                        ...(seo?.metaDescription && { description: seo.metaDescription }),
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `${opinionUrl}#webpage`,
                        },
                    }),
                }}
            />
        </div>
    );
}
