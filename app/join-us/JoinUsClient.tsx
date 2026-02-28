"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, Gift, Building, MessageSquare, Target } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { JoinUsPageData, JoinUsCardsSection } from '@/lib/actions/site/joinUsPageAction';

export default function JoinUsClient({ data }: { data: JoinUsPageData }) {
    const sections = data.sections || [];

    // Helper to find a section
    const findSection = <T extends JoinUsPageData['sections'][number]>(type: T['fieldGroupName']) => {
        return sections.find(s => s.fieldGroupName === type) as T | undefined;
    };

    const cardsSection = findSection<JoinUsCardsSection>('JoinUsPageBuilderJoinUsPageBuilderCardsSectionLayout');

    return (
        <div className="pt-25 pb-25">
            {/* Hero */}
            <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
                <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">
                        {data.pageOptions?.pageTitle || 'انضم إلى عائلة النادي'}
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black">
                        {data.pageOptions?.pageDescription || 'اختر الطريقة التي تناسبك للمشاركة في أنشطة النادي والاستفادة من خدماته المتنوعة.'}
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {cardsSection && cardsSection.cards && cardsSection.cards.length > 0 && (
                    <section className="mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {cardsSection.cards.map((card, index) => {
                                let IconComponent: any = Target; // Default fallback icon

                                // Custom fallback icon map based on the original dev design
                                const fallbackMap: Record<string, any> = {
                                    'user-plus': UserPlus,
                                    'gift': Gift,
                                    'building': Building,
                                    'message-square': MessageSquare,
                                };

                                if (card.icon && fallbackMap[card.icon.toLowerCase()]) {
                                    IconComponent = fallbackMap[card.icon.toLowerCase()];
                                } else if (card.icon && typeof card.icon === 'string') {
                                    // Attempt Lucide specific lookup
                                    if (card.icon in LucideIcons) {
                                        IconComponent = (LucideIcons as any)[card.icon];
                                    } else {
                                        const formattedIconName = card.icon
                                            .split('-')
                                            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                                            .join('');

                                        if (formattedIconName in LucideIcons) {
                                            IconComponent = (LucideIcons as any)[formattedIconName];
                                        }
                                    }
                                }

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -6 }}
                                        className="bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden h-full flex flex-col"
                                    >
                                        <Link href={card.linkUrl || "#"} className="flex flex-col h-full grow">
                                            <div className="p-7 flex-1 flex flex-col gap-4 text-right">
                                                <div className="flex items-center justify-between gap-3 mb-2">
                                                    <div className="w-11 h-11 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                                                        <IconComponent size={24} />
                                                    </div>
                                                </div>
                                                {card.title && <h2 className="text-xl font-bold text-primary">{card.title}</h2>}
                                                {card.description && (
                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                        {card.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="px-7 pb-6 pt-2 flex items-center justify-between text-sm font-bold text-club-purple mt-auto">
                                                <span>{card.linkLabel || 'انتقل إلى الصفحة'}</span>
                                                <span className="text-xs text-muted-foreground uppercase">{card.bottomLabel || 'Join Us'}</span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
