import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

import { fetchOpinionCategoryWithPosts } from "@/lib/actions/site/opinionsAction";
import { NewsCard } from "@/components/Cards";
import { SEO } from "@/components/SEO";
import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";
import { normalizeImageUrl } from "@/lib/utils/url";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { categorySlug } = await params;
    const categoryData = await fetchOpinionCategoryWithPosts(categorySlug, 1);

    if (!categoryData) return { title: undefined };

    const seo = categoryData.seoOptions;
    const images = await getMetadataImages();
    const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/opinion-category/${categorySlug}`;
    const title = seo?.seoTitle || categoryData.name || undefined;
    const description = stripHtml(seo?.metaDescription) || stripHtml(categoryData.description) || undefined;

    return {
        title,
        description,
        keywords: seo?.focusKeyword || undefined,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "النادي الثقافي العربي",
            type: "website",
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

export default async function OpinionCategoryPage({ params }: PageProps) {
    const { categorySlug } = await params;
    const categoryData = await fetchOpinionCategoryWithPosts(categorySlug, 12);

    if (!categoryData) notFound();

    const articles = categoryData.opinions.nodes;
    const canonicalUrl =
        categoryData.seoOptions?.canonicalUrl || `${SITE_ORIGIN}/opinion-category/${categorySlug}`;

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: categoryData.name,
        description: categoryData.description || "",
        url: canonicalUrl,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: articles.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_ORIGIN}/opinion/${item.databaseId}`,
                name: item.title,
            })),
        },
        inLanguage: "ar",
    };

    return (
        <div className="pb-30 pt-30 z-0 relative min-h-screen">
            <SEO
                title={categoryData.seoOptions?.seoTitle || categoryData.name || undefined}
                description={categoryData.seoOptions?.metaDescription || categoryData.description || undefined}
                url={canonicalUrl}
                breadcrumbs={[
                    { name: "الرئيسية", item: `${SITE_ORIGIN}/` },
                    { name: "المقالات", item: `${SITE_ORIGIN}/opinions` },
                    { name: categoryData.name || undefined, item: canonicalUrl },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-reverse space-x-2 text-sm text-primary/40 mb-10 font-tajawal">
                    <Link href="/" className="hover:text-accent-purple transition-colors">
                        الرئيسية
                    </Link>
                    <ChevronLeft size={14} />
                    <Link href="/opinions" className="hover:text-accent-purple transition-colors">
                        المقالات
                    </Link>
                    <ChevronLeft size={14} />
                    <span className="text-primary/70 truncate max-w-[200px]">
                        {categoryData.name}
                    </span>
                </nav>

                {/* Page Header */}
                <div className="mb-12">
                    <Link
                        href="/opinions"
                        className="text-club-purple font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all"
                    >
                        <ArrowRight size={18} />
                        العودة للمقالات
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{categoryData.name}</h1>
                    {categoryData.description && (
                        <p className="text-muted-foreground mt-2 max-w-2xl text-lg leading-relaxed">
                            {categoryData.description}
                        </p>
                    )}
                </div>

                {/* Articles Grid */}
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((item) => (
                            <div key={`opinion-cat-${item.databaseId}`}>
                                <NewsCard
                                    news={{
                                        id: item.databaseId,
                                        title: item.title,
                                        date: item.date
                                            ? new Date(item.date).toLocaleDateString("ar-AE", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "",
                                        excerpt: item.excerpt
                                            ? item.excerpt.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                                            : "",
                                        category:
                                            item.opinioncategories?.nodes?.[0]?.name || categoryData.name,
                                        image: normalizeImageUrl(
                                            item.featuredImage?.node?.sourceUrl || ""
                                        ),
                                        categorySlug: "opinion",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-secondary/20 rounded-4xl p-16 text-center border-2 border-dashed border-border">
                        <h2 className="text-2xl font-bold mb-4">لا توجد مقالات في هذا القسم</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            لم يتم نشر أي مقالات تحت هذا التصنيف حتى الآن.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
