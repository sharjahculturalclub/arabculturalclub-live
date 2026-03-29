"use client";

import React, { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, ChevronLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { NewsCard } from "@/components/Cards";
import {
    fetchNewsPosts,
    type NewsPost,
    type NewsCategory,
} from "@/lib/actions/site/newsAction";
import { normalizeImageUrl } from "@/lib/utils/url";
import { SITE_ORIGIN } from "@/lib/utils/site-origin";

/* ─── Props ───────────────────────────────────────────────── */

interface NewsPageClientProps {
    initialPosts: NewsPost[];
    initialHasNextPage: boolean;
    initialEndCursor: string | null;
    categories: NewsCategory[];
    pageTitle: string | null;
    pageDescription: string | null;
    canonicalUrl?: string | null;
}

/* ─── Helper: map a NewsPost to the shape NewsCard expects ── */

function mapPost(post: NewsPost) {
    return {
        id: post.databaseId,
        title: post.title,
        image: normalizeImageUrl(post.featuredImage?.node?.sourceUrl || ""),
        category: post.categories?.nodes?.[0]?.name || "",
        categorySlug: post.categories?.nodes?.[0]?.slug || "uncategorized",
        date: post.date
            ? new Date(post.date).toLocaleDateString("ar-AE", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "",
        excerpt: post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 140) || "",
    };
}

/* ─── Component ───────────────────────────────────────────── */

export function NewsPageClient({
    initialPosts,
    initialHasNextPage,
    initialEndCursor,
    categories,
    pageTitle,
    pageDescription,
    canonicalUrl,
}: NewsPageClientProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    /* ── Filter by category (server fetch) ─── */
    const handleCategoryChange = useCallback(
        (slug: string, _name: string) => {
            setActiveCategory(slug);
            setSearchTerm("");
            startTransition(async () => {
                const catToFetch = slug === "all" ? undefined : slug;
                const result = await fetchNewsPosts(6, undefined, catToFetch);
                setPosts(result.posts);
                setHasNextPage(result.hasNextPage);
                setEndCursor(result.endCursor);
            });
        },
        []
    );

    /* ── Load more posts ─── */
    const handleLoadMore = useCallback(async () => {
        if (!hasNextPage || !endCursor) return;
        setIsLoadingMore(true);
        try {
            const catToFetch = activeCategory === "all" ? undefined : activeCategory;
            const result = await fetchNewsPosts(6, endCursor, catToFetch);
            setPosts((prev) => [...prev, ...result.posts]);
            setHasNextPage(result.hasNextPage);
            setEndCursor(result.endCursor);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasNextPage, endCursor, activeCategory]);

    /* ── Client-side search filtering ─── */
    const displayedPosts = searchTerm
        ? posts.filter(
            (p) =>
                p.title.includes(searchTerm) ||
                p.excerpt?.replace(/<[^>]*>/g, "").includes(searchTerm)
        )
        : posts;

    /* ── Schema.org structured data ─── */
    const pageUrl = canonicalUrl || `${SITE_ORIGIN}/news`;

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        ...(pageTitle && { name: pageTitle }),
        ...(pageDescription && { description: pageDescription }),
        url: pageUrl,
        inLanguage: "ar",
        mainEntity: {
            "@type": "ItemList",
            itemListElement: displayedPosts.map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_ORIGIN}/${post.categories?.nodes?.[0]?.slug || "uncategorized"}/${post.databaseId}`,
                name: post.title,
            })),
        },
    };

    return (
        <div className="pt-25 pb-25">
            {/* CollectionPage JSON-LD — WebPage + BreadcrumbList rendered by <SEO> in parent */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(collectionSchema),
                }}
            />

            {/* Hero Header */}
            <div className="bg-secondary py-10 mb-10 relative overflow-hidden text-center">
                <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center justify-center space-x-reverse space-x-2 text-sm text-primary/40 mb-6 font-tajawal">
                        <Link
                            href="/"
                            className="hover:text-accent-purple transition-colors"
                        >
                            الرئيسية
                        </Link>
                        <ChevronLeft size={14} />
                        <span className="text-primary/70">الأخبار</span>
                    </nav>

                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-black">
                        {pageTitle}
                    </h1>
                    {(pageDescription || !pageTitle) && (
                        <p className="text-lg max-w-2xl mx-auto leading-relaxed text-black/70">
                            {pageDescription}
                        </p>
                    )}
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange("all", "الكل")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === "all"
                                ? "bg-club-purple text-white shadow-lg"
                                : "bg-white border border-border text-muted-foreground hover:border-club-purple hover:text-club-purple"
                                }`}
                        >
                            الكل
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.databaseId}
                                onClick={() => handleCategoryChange(cat.slug, cat.name)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.slug
                                    ? "bg-club-purple text-white shadow-lg"
                                    : "bg-white border border-border text-muted-foreground hover:border-club-purple hover:text-club-purple"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-96">
                        <Search
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="ابحث في الأخبار والتقارير..."
                            className="pr-12 pl-4 py-3.5 bg-white border border-border rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-club-purple focus:border-transparent shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isPending && (
                    <div className="flex justify-center py-20">
                        <Loader2
                            className="animate-spin text-club-purple"
                            size={40}
                        />
                    </div>
                )}

                {/* News Grid */}
                {!isPending && (
                    <>
                        {displayedPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {displayedPosts.map((post, idx) => (
                                        <motion.div
                                            key={post.databaseId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <NewsCard news={mapPost(post)} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                                <Filter
                                    size={48}
                                    className="mx-auto mb-4 text-muted-foreground/30"
                                />
                                <p className="text-xl text-muted-foreground mb-4">
                                    عذراً، لم نجد نتائج تطابق بحثك.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        handleCategoryChange("all", "الكل");
                                    }}
                                    className="text-club-purple font-bold hover:underline"
                                >
                                    إعادة ضبط البحث
                                </button>
                            </div>
                        )}

                        {/* Load More */}
                        {hasNextPage && !searchTerm && (
                            <div className="mt-16 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="bg-club-purple text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-60 flex items-center gap-3"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2
                                                className="animate-spin"
                                                size={18}
                                            />
                                            <span>جاري التحميل...</span>
                                        </>
                                    ) : (
                                        <span>عرض المزيد</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
