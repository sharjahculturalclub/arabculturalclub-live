"use client";

import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { PolicyPageData, PolicySectionsLayout, PolicyInquiriesSectionLayout } from "@/lib/actions/site/policyPageAction";

interface PrivacyPolicyClientProps {
    data: PolicyPageData;
}

export default function PrivacyPolicyClient({ data }: PrivacyPolicyClientProps) {
    const pageTitle = data.pageOptions?.pageTitle || "";
    const pageDescription = data.pageOptions?.pageDescription || "";

    // Helper to render dynamic icon
    const renderIcon = (iconName: string | null | undefined, defaultIconName: string = "Shield") => {
        if (!iconName) {
            const DefaultIcon = (LucideIcons as any)[defaultIconName] || LucideIcons.Shield;
            return <DefaultIcon size={24} />;
        }

        // Capitalize first letter and handle cases like file-text -> FileText
        let formattedName = iconName
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');

        // Sometimes people use actual text like 'المعلومات التي نجمعها' in the icon field which would fail
        const Icon = (LucideIcons as any)[formattedName];

        if (Icon) {
            return <Icon size={24} />;
        }

        const DefaultIcon = (LucideIcons as any)[defaultIconName] || LucideIcons.Shield;
        return <DefaultIcon size={24} />;
    };

    return (
        <div className="pt-25 pb-25">
            {/* Hero Banner */}
            <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
                <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-primary">{pageTitle}</h1>
                    {pageDescription && (
                        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary">
                            {pageDescription}
                        </p>
                    )}
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-4 md:px-6">
                {data.sections.map((section, index) => {
                    if (section.fieldGroupName === "PolicyPageBuilderPolicyPageBuilderPolicySectionsLayout") {
                        const policySections = section as PolicySectionsLayout;
                        return policySections.policyCards?.map((card, cardIndex) => (
                            <motion.section
                                key={`policy-card-${index}-${cardIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: cardIndex * 0.1 }}
                                className="mb-12"
                            >
                                <div className="bg-white p-8 md:p-12 rounded-4xl shadow-sm border border-border">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cardIndex % 2 === 0 ? "bg-club-purple/10 text-club-purple" : "bg-club-blue/10 text-club-blue"}`}>
                                            {renderIcon(card.icon, cardIndex % 2 === 0 ? "Shield" : "FileText")}
                                        </div>
                                        {card.title && <h2 className="text-2xl font-bold text-primary">{card.title}</h2>}
                                    </div>
                                    {card.content && (
                                        <>
                                            <style>{`
                                                .policy-html-content p { margin-bottom: 1rem; }
                                                .policy-html-content ul { list-style: none; padding-right: 1.5rem; margin-top: 1rem; margin-bottom: 1rem; }
                                                .policy-html-content li { position: relative; margin-bottom: 0.75rem; padding-right: 0.5rem; }
                                                .policy-html-content li::before {
                                                    content: "\\2022";
                                                    position: absolute;
                                                    right: -1rem;
                                                    top: -2px;
                                                    color: #522387;
                                                    font-size: 1.5rem;
                                                    line-height: 1;
                                                }
                                            `}</style>
                                            <div
                                                className="policy-html-content space-y-4 text-muted-foreground text-lg leading-relaxed [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-primary"
                                                dangerouslySetInnerHTML={{ __html: card.content }}
                                            />
                                        </>
                                    )}
                                </div>
                            </motion.section>
                        ));
                    }

                    if (section.fieldGroupName === "PolicyPageBuilderPolicyPageBuilderInquiriesSectionLayout") {
                        const inquiries = section as PolicyInquiriesSectionLayout;
                        return (
                            <motion.section
                                key={`inquiries-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="mb-12"
                            >
                                <div className="bg-linear-to-l from-club-purple/10 to-club-blue/10 p-8 md:p-12 rounded-4xl border border-club-purple/20">
                                    {inquiries.title && <h2 className="text-2xl font-bold mb-4 text-primary">{inquiries.title}</h2>}
                                    {inquiries.subtitle && (
                                        <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                                            {inquiries.subtitle}
                                        </p>
                                    )}
                                    <div className="space-y-2 text-muted-foreground text-lg">
                                        {inquiries.email && (
                                            <p>
                                                <strong className="text-primary">البريد الإلكتروني:</strong>{" "}
                                                <a href={`mailto:${inquiries.email}`} className="text-club-purple hover:underline">
                                                    {inquiries.email}
                                                </a>
                                            </p>
                                        )}
                                        {inquiries.phone && (
                                            <p>
                                                <strong className="text-primary">الهاتف:</strong>{" "}
                                                <span dir="ltr">{inquiries.phone}</span>
                                            </p>
                                        )}
                                        {inquiries.address && (
                                            <p>
                                                <strong className="text-primary">العنوان:</strong> {inquiries.address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.section>
                        );
                    }

                    return null;
                })}
            </div>
        </div >
    );
}
