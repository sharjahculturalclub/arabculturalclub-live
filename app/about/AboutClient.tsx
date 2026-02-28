"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Target, Eye, Clock } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import {
    AboutPageData,
    AboutPageHeroSection,
    AboutPageVisionMessageSection,
    AboutPageCoreValuesSection,
    AboutPageBoardOfDirectorsSection,
    AboutPageClubHistorySection
} from '@/lib/actions/site/aboutPageAction';
import * as LucideIcons from 'lucide-react';

export default function AboutClient({ data }: { data: AboutPageData }) {
    const sections = data.sections || [];

    // Helper to find a section
    const findSection = <T extends AboutPageData['sections'][number]>(type: T['fieldGroupName']) => {
        return sections.find(s => s.fieldGroupName === type) as T | undefined;
    };

    const heroSection = findSection<AboutPageHeroSection>('AboutPageBuilderAboutPageBuilderHeroSectionLayout');
    const visionSection = findSection<AboutPageVisionMessageSection>('AboutPageBuilderAboutPageBuilderVisionMessageSectionLayout');
    const coreValuesSection = findSection<AboutPageCoreValuesSection>('AboutPageBuilderAboutPageBuilderCoreValuesSectionLayout');
    const boardSection = findSection<AboutPageBoardOfDirectorsSection>('AboutPageBuilderAboutPageBuilderBoardOfDirectorsSectionLayout');
    const historySection = findSection<AboutPageClubHistorySection>('AboutPageBuilderAboutPageBuilderClubHistorySectionLayout');

    return (
        <div className="pt-25 pb-25">
            {/* Hero Banner Header */}
            <div className="py-10 mb-10 relative overflow-hidden text-center">
                <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">
                        {data.pageOptions?.pageTitle || 'من نحن'}
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black/70">
                        {data.pageOptions?.pageDescription || ''}
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">

                {/* CEO Message / Hero Section */}
                {heroSection && (
                    <section className="mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] border border-border shadow-lg overflow-hidden flex flex-col md:flex-row-reverse"
                        >
                            <div className="md:w-1/2 relative min-h-[260px] md:min-h-full">
                                {heroSection.image?.node?.sourceUrl && (
                                    <ImageWithFallback
                                        src={heroSection.image.node.sourceUrl}
                                        alt={heroSection.image.node.altText || "رئيس النادي"}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent md:bg-gradient-to-l" />
                            </div>

                            <div className="md:w-1/2 p-8 md:p-12 text-right flex flex-col justify-center gap-4 bg-white">
                                {heroSection.preTitle && (
                                    <div className="inline-flex items-center gap-3 justify-end mb-2">
                                        <span className="w-10 h-10 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                                            <Quote size={20} />
                                        </span>
                                        <span className="text-sm font-bold text-club-purple">{heroSection.preTitle}</span>
                                    </div>
                                )}

                                {heroSection.title && (
                                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                                        {heroSection.title}
                                    </h2>
                                )}

                                {heroSection.description && (
                                    <div
                                        className="text-muted-foreground leading-relaxed text-lg prose prose-p:mb-4 max-w-none prose-p:last-of-type:mb-0"
                                        dangerouslySetInnerHTML={{ __html: heroSection.description }}
                                    />
                                )}

                                {(heroSection.signatureTitle || heroSection.signatureSubtitle) && (
                                    <div className="mt-4">
                                        {heroSection.signatureTitle && (
                                            <p className="font-bold text-primary">{heroSection.signatureTitle}</p>
                                        )}
                                        {heroSection.signatureSubtitle && (
                                            <p className="text-muted-foreground text-sm">{heroSection.signatureSubtitle}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* Mission & Vision Section */}
                {visionSection && visionSection.cards && visionSection.cards.length > 0 && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                        {visionSection.cards.map((card, index) => {
                            // Basic icon parsing, default to Target/Eye for index 0 and 1
                            let IconComponent = index === 0 ? Eye : Target;
                            if (card.icon && card.icon in LucideIcons) {
                                // @ts-ignore
                                IconComponent = LucideIcons[card.icon];
                            }

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-white p-12 rounded-[2rem] shadow-sm border border-border"
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${index === 0 ? 'bg-club-blue/10 text-club-blue' : 'bg-club-purple/10 text-club-purple'}`}>
                                        <IconComponent size={32} />
                                    </div>
                                    {card.title && <h2 className="text-3xl font-bold mb-6 text-primary">{card.title}</h2>}
                                    {card.description && <p className="text-muted-foreground text-lg leading-relaxed">{card.description}</p>}
                                </motion.div>
                            );
                        })}
                    </section>
                )}

                {/* Core Values */}
                {coreValuesSection && coreValuesSection.values && coreValuesSection.values.length > 0 && (
                    <section className="mb-24">
                        {coreValuesSection.sectionTitle && (
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center">
                                    {coreValuesSection.sectionTitle}
                                    <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
                                </h2>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                            {coreValuesSection.values.map((value, i) => {
                                let IconComponent = Target; // Default fallback

                                // Helper mapping based on the provided JSON data
                                const fallbackMap: Record<string, any> = {
                                    'book': LucideIcons.Book,
                                    'users': LucideIcons.Users,
                                    'award': LucideIcons.Award,
                                    'shield': LucideIcons.Shield
                                };

                                if (value.icon && fallbackMap[value.icon.toLowerCase()]) {
                                    IconComponent = fallbackMap[value.icon.toLowerCase()];
                                } else if (value.icon && typeof value.icon === 'string') {
                                    // Capitalize the first letter and try to find it in LucideIcons dynamically
                                    const formattedIconName = value.icon.charAt(0).toUpperCase() + value.icon.slice(1);
                                    if (formattedIconName in LucideIcons) {
                                        // @ts-ignore
                                        IconComponent = LucideIcons[formattedIconName];
                                    }
                                }

                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10 }}
                                        className="bg-secondary/20 p-8 rounded-2xl text-center flex flex-col items-center"
                                    >
                                        <div className="text-club-purple mb-6"><IconComponent size={40} strokeWidth={1.5} /></div>
                                        {value.title && <h3 className="text-xl font-bold mb-3">{value.title}</h3>}
                                        {value.description && <p className="text-muted-foreground text-sm">{value.description}</p>}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Board Members */}
                {boardSection && boardSection.directors && boardSection.directors.length > 0 && (
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            {boardSection.sectionTitle && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center">
                                    {boardSection.sectionTitle}
                                    <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
                                </h2>
                            )}
                            {boardSection.sectionSubtitle && (
                                <p className="text-muted-foreground text-lg leading-relaxed mt-4">{boardSection.sectionSubtitle}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
                            {boardSection.directors.map((member, i) => (
                                <div key={i} className="text-center group">
                                    <div className="relative mb-6 mx-auto w-48 h-48">
                                        <div className="absolute inset-0 bg-club-purple rounded-full rotate-6 transition-transform group-hover:rotate-12"></div>
                                        <ImageWithFallback
                                            src={member.image?.node?.sourceUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400"}
                                            alt={member.image?.node?.altText || member.name || "عضو مجلس الإدارة"}
                                            className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
                                        />
                                    </div>
                                    {member.name && <h3 className="text-xl font-bold mb-1">{member.name}</h3>}
                                    {member.role && <p className="text-club-purple font-medium text-sm">{member.role}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Club History (slider) */}
                {historySection && historySection.historyItems && historySection.historyItems.length > 0 && (
                    <section className="mb-24">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center gap-3 mb-4">
                                <span className="w-10 h-10 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                                    <Clock size={22} />
                                </span>
                                {historySection.sectionTitle && (
                                    <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
                                        {historySection.sectionTitle}
                                        <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
                                    </h2>
                                )}
                            </div>
                            {historySection.sectionSubtitle && (
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    {historySection.sectionSubtitle}
                                </p>
                            )}
                        </div>

                        {/* Smooth slider with white card background */}
                        <div className="bg-white rounded-[2rem] shadow-lg border border-border p-6 md:p-8">
                            <HistorySlider historyItems={historySection.historyItems} footerText={historySection.footerText} />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

// Inner Component for Slider
const HistorySlider = ({ historyItems, footerText }: { historyItems: any[], footerText: string | null }) => {
    const [index, setIndex] = React.useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1) % historyItems.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + historyItems.length) % historyItems.length);
    };

    // Ensure we don't request more than available
    const itemsToShow = Math.min(4, historyItems.length);
    const visibleMilestones = React.useMemo(
        () =>
            Array.from({ length: itemsToShow }, (_, k) => historyItems[(index + k) % historyItems.length]),
        [index, historyItems, itemsToShow]
    );

    return (
        <div className="relative max-w-6xl mx-auto">
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
            >
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${itemsToShow} gap-6`}>
                    {visibleMilestones.map((milestone, i) => (
                        <div
                            key={`${milestone.year}-${i}`}
                            className="rounded-2xl border border-border/70 overflow-hidden bg-secondary/10 flex flex-col h-full"
                        >
                            <div className="relative h-40">
                                <ImageWithFallback
                                    src={milestone.image?.node?.sourceUrl || ""}
                                    alt={milestone.image?.node?.altText || milestone.title || ""}
                                    className="w-full h-full object-cover"
                                />
                                {milestone.year && (
                                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{milestone.year}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col gap-2 text-right">
                                {milestone.title && (
                                    <h3 className="text-base font-bold text-primary line-clamp-2">
                                        {milestone.title}
                                    </h3>
                                )}
                                {milestone.description && (
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                                        {milestone.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Controls */}
            {historyItems.length > itemsToShow && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        type="button"
                        onClick={next}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-club-purple text-white text-sm font-bold hover:bg-club-purple/90 transition-colors shadow-md"
                    >
                        <span>التالي</span>
                    </button>
                    <div className="flex items-center gap-2">
                        {historyItems.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-club-purple w-6' : 'bg-club-purple/20'
                                    }`}
                                aria-label={`الشريحة ${i + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={prev}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-primary text-sm font-bold hover:bg-secondary/80 transition-colors border border-border"
                    >
                        <span>السابق</span>
                    </button>
                </div>
            )}

            {footerText && (
                <p className="mt-8 text-center text-muted-foreground max-w-3xl mx-auto whitespace-pre-line">
                    {footerText}
                </p>
            )}
        </div>
    );
};
