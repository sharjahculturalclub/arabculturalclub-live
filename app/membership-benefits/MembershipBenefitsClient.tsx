"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, BookOpen, Users, Calendar, Gift, Star, Video, Mail, Phone, ArrowLeft, Target } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { MembershipPageData, BenefitsSection, CtaSection } from '@/lib/actions/site/membershipBenefitsPageAction';

export default function MembershipBenefitsClient({ data }: { data: MembershipPageData }) {
    const sections = data.sections || [];

    // Helper to find a section
    const findSection = <T extends MembershipPageData['sections'][number]>(type: T['fieldGroupName']) => {
        return sections.find(s => s.fieldGroupName === type) as T | undefined;
    };

    const benefitsSection = findSection<BenefitsSection>('MembershipPageBuilderMembershipPageBuilderBenefitsSectionLayout');
    const ctaSection = findSection<CtaSection>('MembershipPageBuilderMembershipPageBuilderCtaSectionLayout');

    return (
        <div className="pt-25 pb-25">
            {/* Hero Banner */}
            <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
                <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">
                        {data.pageOptions?.pageTitle || 'فوائد العضوية'}
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black">
                        {data.pageOptions?.pageDescription || 'انضم إلى مجتمع المثقفين واستمتع بمجموعة واسعة من المزايا والخدمات الحصرية'}
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Benefits Grid */}
                {benefitsSection && benefitsSection.benefits && benefitsSection.benefits.length > 0 && (
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            {benefitsSection.sectionTitle && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center text-primary">
                                    {benefitsSection.sectionTitle}
                                    <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full" />
                                </h2>
                            )}
                            {benefitsSection.sectionSubtitle && (
                                <p className="text-muted-foreground text-lg whitespace-pre-line mt-4">
                                    {benefitsSection.sectionSubtitle}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {benefitsSection.benefits.map((benefit, index) => {
                                let IconComponent: any = Target; // Default fallback icon

                                // Fallback icon map mimicking dev server implementation
                                const fallbackMap: Record<string, any> = {
                                    'ticket': Ticket,
                                    'book-open': BookOpen,
                                    'users': Users,
                                    'calendar': Calendar,
                                    'gift': Gift,
                                    'star': Star,
                                    'video': Video,
                                    'mail': Mail,
                                };

                                if (benefit.icon && fallbackMap[benefit.icon.toLowerCase()]) {
                                    IconComponent = fallbackMap[benefit.icon.toLowerCase()];
                                } else if (benefit.icon && typeof benefit.icon === 'string') {
                                    // Attempt Lucide specific lookup
                                    if (benefit.icon in LucideIcons) {
                                        IconComponent = (LucideIcons as any)[benefit.icon];
                                    } else {
                                        const formattedIconName = benefit.icon
                                            .split('-')
                                            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                                            .join('');

                                        if (formattedIconName in LucideIcons) {
                                            IconComponent = (LucideIcons as any)[formattedIconName];
                                        }
                                    }
                                }

                                // Alternate colors to mimic dev design
                                const isPurple = index % 2 === 0;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isPurple ? 'bg-club-purple/10 text-club-purple' : 'bg-club-blue/10 text-club-blue'}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        {benefit.title && <h3 className="text-lg font-bold mb-2 text-primary">{benefit.title}</h3>}
                                        {benefit.description && <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                {ctaSection && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-club-purple/5 bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-12 rounded-[2rem] border border-club-purple/20 text-center"
                    >
                        {ctaSection.ctaTitle && <h2 className="text-2xl font-bold mb-4 text-primary">{ctaSection.ctaTitle}</h2>}

                        {ctaSection.ctaDescription && (
                            <div
                                className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto [&>p]:mb-4"
                                dangerouslySetInnerHTML={{ __html: ctaSection.ctaDescription }}
                            />
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {ctaSection.primaryButtonText && (
                                <Link
                                    href={ctaSection.primaryButtonLink || "#"}
                                    className="inline-flex items-center justify-center gap-2 bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold px-8 py-4 rounded-xl shadow-lg"
                                >
                                    <Phone size={20} />
                                    <span>{ctaSection.primaryButtonText}</span>
                                </Link>
                            )}
                            {ctaSection.secondaryButtonText && (
                                <Link
                                    href={ctaSection.secondaryButtonLink || "#"}
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-secondary/50 transition-all text-primary font-bold px-8 py-4 rounded-xl border border-border"
                                >
                                    <span>{ctaSection.secondaryButtonText}</span>
                                    <ArrowLeft size={20} />
                                </Link>
                            )}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
