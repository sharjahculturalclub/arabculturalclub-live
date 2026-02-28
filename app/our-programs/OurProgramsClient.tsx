"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Users, Baby, Dumbbell, GraduationCap, Target } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { OurProgramsPageData, OurProgramsPageMainAreasSection } from '@/lib/actions/site/ourProgramsPageAction';

export default function OurProgramsClient({ data }: { data: OurProgramsPageData }) {
    const sections = data.sections || [];

    // Helper to find a section
    const findSection = <T extends OurProgramsPageData['sections'][number]>(type: T['fieldGroupName']) => {
        return sections.find(s => s.fieldGroupName === type) as T | undefined;
    };

    const mainAreasSection = findSection<OurProgramsPageMainAreasSection>('OurProgramsPageBuilderOurProgramsPageBuilderMainAreasSectionLayout');

    return (
        <div className="pt-25 pb-25">
            {/* Hero */}
            <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
                <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">
                        {data.pageOptions?.pageTitle || 'برامج النادي'}
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black">
                        {data.pageOptions?.pageDescription || ''}
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {mainAreasSection && mainAreasSection.programs && mainAreasSection.programs.length > 0 && (
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            {mainAreasSection.sectionTitle && (
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center">
                                    {mainAreasSection.sectionTitle}
                                    <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full" />
                                </h2>
                            )}
                            {mainAreasSection.sectionSubtitle && (
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4 whitespace-pre-line">
                                    {mainAreasSection.sectionSubtitle}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mainAreasSection.programs.map((program, index) => {
                                let IconComponent: any = Target; // Default

                                // Custom specific fallbacks based on original design
                                const fallbackMap: Record<string, any> = {
                                    'palette': Palette,
                                    'users': Users,
                                    'baby': Baby,
                                    'dumbbell': Dumbbell,
                                    'graduation-cap': GraduationCap,
                                };

                                if (program.icon && fallbackMap[program.icon.toLowerCase()]) {
                                    IconComponent = fallbackMap[program.icon.toLowerCase()];
                                } else if (program.icon && typeof program.icon === 'string') {
                                    // Try exact match then pascal case
                                    if (program.icon in LucideIcons) {
                                        IconComponent = (LucideIcons as any)[program.icon];
                                    } else {
                                        const formattedIconName = program.icon
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
                                        transition={{ delay: index * 0.08 }}
                                        whileHover={{ y: -6 }}
                                        className="bg-white p-7 rounded-[1.75rem] border border-border shadow-sm hover:shadow-lg transition-all flex flex-col gap-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                                                    <IconComponent size={22} />
                                                </div>
                                                <div className="text-right">
                                                    {program.title && <h3 className="text-xl font-bold text-primary">{program.title}</h3>}
                                                    {program.subtitle && (
                                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">
                                                            {program.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {program.description && (
                                            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                                                {program.description}
                                            </p>
                                        )}

                                        {program.features && program.features.length > 0 && (
                                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground pr-2">
                                                {program.features.map((feature, idx) => feature.featureText ? (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-club-purple" />
                                                        <span>{feature.featureText}</span>
                                                    </li>
                                                ) : null)}
                                            </ul>
                                        )}
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
