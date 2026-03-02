"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { NewsCard } from '@/components/Cards';
import type { NewsPost } from '@/lib/actions/site/newsAction';

interface SearchResultsClientProps {
    query: string;
    results: NewsPost[];
}

function mapPost(post: NewsPost) {
    return {
        id: post.databaseId,
        title: post.title,
        image: post.featuredImage?.node?.sourceUrl || "",
        category: post.categories?.nodes?.[0]?.name || "أخبار النادي",
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

export function SearchResultsClient({ query, results }: SearchResultsClientProps) {
    return (
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="mb-12">
                <Link href="/" className="text-club-purple font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
                    <ArrowRight size={18} />
                    العودة للرئيسية
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    نتائج البحث عن: <span className="text-club-purple">"{query}"</span>
                </h1>
                <p className="text-muted-foreground mt-4 text-lg">
                    {query ? `تم العثور على ${results.length} نتيجة` : 'الرجاء إدخال كلمة بحث صحيحة'}
                </p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {results.map((item, idx) => (
                            <motion.div
                                key={item.databaseId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                            >
                                <NewsCard news={mapPost(item)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-secondary/20 rounded-[2rem] p-16 text-center border-2 border-dashed border-border">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Search size={40} className="text-muted-foreground/30" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                        {query ? `لم نجد أي نتائج لـ "${query}"` : 'ابدأ البحث الآن'}
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        {query ? 'حاول استخدام كلمات مفتاحية أخرى أو تصفح الأقسام الرئيسية للموقع.' : 'الرجاء كتابة كلمة بحث في الأعلى.'}
                    </p>
                    <Link href="/news" className="bg-club-purple text-white px-8 py-3 rounded-xl font-bold inline-block">
                        تصفح المركز الإعلامي
                    </Link>
                </div>
            )}
        </div>
    );
}
