"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { NewsCard } from "@/components/Cards";
import { fetchOpinionPosts, type OpinionPost } from "@/lib/actions/site/opinionsAction";
import { normalizeImageUrl } from "@/lib/utils/url";
import { SITE_ORIGIN } from "@/lib/utils/site-origin";

/* ─── Props ───────────────────────────────────────────────── */

interface OpinionsPageClientProps {
    initialPosts: OpinionPost[];
    initialHasNextPage: boolean;
    initialEndCursor: string | null;
    pageTitle: string | null;
    pageDescription: string | null;
    canonicalUrl?: string | null;
}

/* ─── Helper ──────────────────────────────────────────────── */

function mapPost(post: OpinionPost) {
    return {
        id: post.databaseId,
        title: post.title,
        image: normalizeImageUrl(post.featuredImage?.node?.sourceUrl || ""),
        category: "",
        categorySlug: "opinion",
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

export function OpinionsPageClient({
    initialPosts,
    initialHasNextPage,
    initialEndCursor,
    pageTitle,
    pageDescription,
    canonicalUrl,
}: OpinionsPageClientProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMore = useCallback(async () => {
        if (!hasNextPage || !endCursor) return;
        setIsLoadingMore(true);
        try {
            const result = await fetchOpinionPosts(9, endCursor);
            setPosts((prev) => [...prev, ...result.posts]);
            setHasNextPage(result.hasNextPage);
            setEndCursor(result.endCursor);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasNextPage, endCursor]);

    const pageUrl = canonicalUrl || `${SITE_ORIGIN}/opinions`;

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        ...(pageTitle && { name: pageTitle }),
        ...(pageDescription && { description: pageDescription }),
        url: pageUrl,
        inLanguage: "ar",
        mainEntity: {
            "@type": "ItemList",
            itemListElement: posts.map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_ORIGIN}/opinion/${post.databaseId}`,
                name: post.title,
            })),
        },
    };

    return (
        <div className="pt-25 pb-25">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            {/* Hero Header */}
            <div className="bg-secondary py-10 mb-10 relative overflow-hidden text-center">
                <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <nav className="flex items-center justify-center space-x-reverse space-x-2 text-sm text-primary/40 mb-6 font-tajawal">
                        <Link href="/" className="hover:text-accent-purple transition-colors">
                            الرئيسية
                        </Link>
                        <ChevronLeft size={14} />
                        <span className="text-primary/70">{pageTitle || "المقالات"}</span>
                    </nav>

                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-black">
                        {pageTitle}
                    </h1>
                    {pageDescription && (
                        <p className="text-lg max-w-2xl mx-auto leading-relaxed text-black/70">
                            {pageDescription}
                        </p>
                    )}
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {posts.map((post, idx) => (
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
                        <Filter size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                        <p className="text-xl text-muted-foreground">لا توجد المقالات متاحة حالياً.</p>
                    </div>
                )}

                {/* Load More */}
                {hasNextPage && (
                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="bg-club-purple text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-60 flex items-center gap-3"
                        >
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>جاري التحميل...</span>
                                </>
                            ) : (
                                <span>عرض المزيد</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
