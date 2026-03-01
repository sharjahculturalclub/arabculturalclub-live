'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FaqCategory } from '@/lib/actions/site/faqPageAction';

interface FaqCategoriesListProps {
    categories: FaqCategory[];
}

export default function FaqCategoriesList({ categories }: FaqCategoriesListProps) {
    return (
        <>
            {categories.map((category, categoryIndex) => (
                category.categoryTitle && category.faqItems && category.faqItems.length > 0 && (
                    <section key={categoryIndex} className="mb-12">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary border-r-4 border-club-purple pr-4">
                                {category.categoryTitle}
                            </h2>

                            <Accordion type="single" collapsible className="w-full">
                                {category.faqItems.map((faq, index) => (
                                    faq.question && (
                                        <AccordionItem
                                            key={index}
                                            value={`item-${categoryIndex}-${index}`}
                                            className="border-b border-border last:border-b-0"
                                        >
                                            <AccordionTrigger className="text-right text-lg font-bold text-primary hover:text-club-purple py-4">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground text-lg leading-relaxed pr-6">
                                                <div dangerouslySetInnerHTML={{ __html: faq.answer || '' }} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                ))}
                            </Accordion>
                        </div>
                    </section>
                )
            ))}
        </>
    );
}
