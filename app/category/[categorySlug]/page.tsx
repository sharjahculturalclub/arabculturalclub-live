import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

import { fetchCategoryWithPosts } from "@/lib/actions/site/categoryAction";
import { NewsCard } from "@/components/Cards";

interface PageProps {
    params: Promise<{
        categorySlug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { categorySlug } = await params;
    const categoryData = await fetchCategoryWithPosts(categorySlug, 1);

    if (!categoryData) {
        return {
            title: "القسم غير موجود | النادي الثقافي العربي",
        };
    }

    const seo = categoryData.sEOOptions;
    const canonicalUrl = seo?.canonicalUrl || `https://shjarabclub.ae/category/${categorySlug}`;

    return {
        title: seo?.seoTitle || `${categoryData.name} | النادي الثقافي العربي`,
        description: seo?.metaDescription || categoryData.description || "",
        keywords: seo?.focusKeyword || undefined,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: seo?.ogTitle || seo?.seoTitle || categoryData.name,
            description: seo?.ogDescription || seo?.metaDescription || categoryData.description || "",
            url: canonicalUrl,
            siteName: "النادي الثقافي العربي",
            type: "website",
            images: seo?.ogImage?.node?.sourceUrl ? [{ url: seo.ogImage.node.sourceUrl }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: seo?.twitterTitle || seo?.seoTitle || categoryData.name,
            description: seo?.twitterDescription || seo?.metaDescription || categoryData.description || "",
            images: seo?.twitterImage?.node?.sourceUrl ? [seo.twitterImage.node.sourceUrl] : undefined,
        },
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { categorySlug } = await params;

    // Fetch category data and recent posts associated with it
    const categoryData = await fetchCategoryWithPosts(categorySlug, 12);

    if (!categoryData) {
        notFound();
    }

    const articles = categoryData.posts.nodes;

    const canonicalUrl = `https://shjarabclub.ae/category/${categorySlug}`;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": "https://shjarabclub.ae/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": categoryData.name,
                "item": canonicalUrl
            }
        ]
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": categoryData.name,
        "description": categoryData.description || "",
        "url": canonicalUrl,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": articles.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://shjarabclub.ae/${item.categories?.nodes?.[0]?.slug || categorySlug}/${item.databaseId}`,
                "name": item.title,
            })),
        },
        "inLanguage": "ar",
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": categoryData.name,
        "description": categoryData.description || "",
        "url": canonicalUrl,
        "publisher": {
            "@id": "https://shjarabclub.ae/#organization"
        }
    };

    return (
        <div className="pb-30 pt-30 z-0 relative min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <div className="container max-w-7xl mx-auto px-4 md:px-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-reverse space-x-2 text-sm text-primary/40 mb-10 font-tajawal">
                    <Link href="/" className="hover:text-accent-purple transition-colors">
                        الرئيسية
                    </Link>
                    <ChevronLeft size={14} />
                    <span className="text-primary/70 truncate max-w-[200px]">
                        {categoryData.name}
                    </span>
                </nav>

                {/* Page Header */}
                <div className="mb-12">
                    <Link href="/" className="text-club-purple font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
                        <ArrowRight size={18} />
                        العودة للرئيسية
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            {categoryData.name}
                        </h1>
                    </div>
                    {categoryData.description && (
                        <p className="text-muted-foreground mt-2 max-w-2xl text-lg leading-relaxed">
                            {categoryData.description}
                        </p>
                    )}
                </div>

                {/* Articles Grid or Empty State */}
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((item) => {
                            // Map related post data format to what NewsCard expects
                            const mappedNews = {
                                id: item.databaseId,
                                title: item.title,
                                date: item.date ? new Date(item.date).toLocaleDateString("ar-AE", { year: "numeric", month: "long", day: "numeric" }) : "",
                                excerpt: item.excerpt ? item.excerpt.replace(/<[^>]+>/g, '').slice(0, 120) + '...' : '',
                                category: item.categories?.nodes?.[0]?.name || categoryData.name,
                                image: item.featuredImage?.node?.sourceUrl || '',
                                // Ensure slug is correctly fed so NewsCard constructs proper URL
                                categorySlug: item.categories?.nodes?.[0]?.slug || categorySlug,
                            };

                            return (
                                <div key={`category-post-${item.databaseId}`}>
                                    <NewsCard news={mappedNews as any} />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-secondary/20 rounded-4xl p-16 text-center border-2 border-dashed border-border">
                        <h2 className="text-2xl font-bold mb-4">لا توجد مقالات في هذا القسم</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            لم يتم نشر أي أخبار أو مقالات مسجلة تحت هذا التصنيف حتى الآن.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
