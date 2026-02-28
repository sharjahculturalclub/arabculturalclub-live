"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { EventCard } from '@/components/Cards';
import { Search, Filter } from 'lucide-react';
import { fetchEvents, EventNode } from '@/lib/actions/site/eventsAction';

interface EventsPageClientProps {
    initialNodes: EventNode[];
    initialHasNextPage: boolean;
    initialEndCursor: string | null;
    pageTitle: string | null;
    pageDescription: string | null;
}

export function EventsPageClient({
    initialNodes,
    initialHasNextPage,
    initialEndCursor,
    pageTitle,
    pageDescription
}: EventsPageClientProps) {
    const [events, setEvents] = useState<EventNode[]>(initialNodes);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract categories dynamically from *all* loaded events
    const categories = ['الكل', ...Array.from(new Set(events.flatMap(event =>
        event.categories?.nodes.map(cat => cat.name) || []
    )))];

    const mappedEvents = events.map(event => ({
        id: event.eventId,
        title: event.title,
        date: event.eventOptions.eventDate,
        time: event.eventOptions.eventTime,
        location: event.eventOptions.eventLocation,
        category: event.categories?.nodes[0]?.name || 'عام',
        image: event.featuredImage?.node.sourceUrl || '',
        description: event.content,
    }));

    const filteredEvents = mappedEvents.filter(event => {
        const matchesCategory = activeCategory === 'الكل' || event.category === activeCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleLoadMore = async () => {
        if (!hasNextPage || !endCursor || loadingMore) return;

        setLoadingMore(true);
        try {
            const data = await fetchEvents(9, endCursor);
            setEvents(prev => [...prev, ...data.nodes]);
            setHasNextPage(data.hasNextPage);
            setEndCursor(data.endCursor);
        } catch (error) {
            console.error("Error loading more events:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="pt-25 pb-25">
            <SEO
                title={pageTitle || "الفعاليات وورش العمل"}
                description={pageDescription || "استكشف الفعاليات والأنشطة الثقافية القادمة في النادي الثقافي العربي."}
            />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border py-10 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">{pageTitle || "الفعاليات والورش"}</h1>
                        <p className="text-muted-foreground text-lg space-y-4">{pageDescription || "شاركنا شغف المعرفة في رحاب النادي."}</p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-club-purple" size={18} />
                            <input
                                type="text"
                                placeholder="ابحث عن فعالية..."
                                className="pr-10 pl-4 py-2 bg-white border border-border rounded-xl focus:outline-none focus:border-club-purple w-full sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-6 mb-10 no-scrollbar gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all ${activeCategory === cat
                                ? 'bg-club-purple text-white shadow-lg'
                                : 'bg-white text-muted-foreground border border-border hover:border-club-purple'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {filteredEvents.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {hasNextPage && (
                            <div className="mt-16 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="inline-flex items-center gap-2 bg-white border-2 border-club-purple text-club-purple hover:bg-club-purple hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold px-10 py-4 rounded-xl shadow-lg"
                                >
                                    {loadingMore ? 'جاري التحميل...' : 'تحميل المزيد من الفعاليات'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                        <Filter size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                        <p className="text-xl text-muted-foreground">عذراً، لم نجد نتائج تطابق بحثك.</p>
                        <button
                            onClick={() => { setActiveCategory('الكل'); setSearchQuery(''); }}
                            className="mt-4 text-club-purple font-bold hover:underline"
                        >
                            إعادة تعيين المرشحات
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
