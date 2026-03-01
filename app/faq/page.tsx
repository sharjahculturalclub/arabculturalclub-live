import { Metadata } from 'next';
import Link from 'next/link';
import { fetchFaqPageData } from '@/lib/actions/site/faqPageAction';
import { SEO } from '@/components/SEO';
import FaqCategoriesList from './FaqCategoriesList';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchFaqPageData();
  const seo = data?.sEOOptions;
  const pageTitle = data?.pageTitle || 'الأسئلة الشائعة';

  const title = seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`;
  const description = seo?.metaDescription || data?.pageDescription || 'إجابات على الأسئلة الأكثر شيوعاً حول النادي الثقافي العربي.';
  const canonicalUrl = seo?.canonicalUrl || 'https://shjarabclub.ae/faq';

  return {
    title,
    description,
    keywords: seo?.focusKeyword || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonicalUrl,
      siteName: 'النادي الثقافي العربي',
      type: 'website',
      images: seo?.ogImage?.node?.sourceUrl
        ? [{ url: seo.ogImage.node.sourceUrl }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: seo?.twitterImage?.node?.sourceUrl
        ? [seo.twitterImage.node.sourceUrl]
        : undefined,
    },
  };
}

// ── Page Component ────────────────────────────────────────────────
export default async function FaqPage() {
  const data = await fetchFaqPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">الأسئلة الشائعة</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          عذراً، لم نتمكن من تحميل بيانات الصفحة. يرجى المحاولة لاحقاً.
        </p>
      </div>
    );
  }

  const { pageTitle, pageDescription, faqCategories, ctaSection, sEOOptions } = data;

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={sEOOptions?.seoTitle || `${pageTitle || 'الأسئلة الشائعة'} | النادي الثقافي العربي`}
        description={sEOOptions?.metaDescription || pageDescription || 'إجابات على الأسئلة الأكثر شيوعاً حول النادي الثقافي العربي.'}
        url={sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/faq'}
        breadcrumbs={[
          { name: 'الرئيسية', item: 'https://shjarabclub.ae/' },
          { name: pageTitle || 'الأسئلة الشائعة', item: sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/faq' },
        ]}
      />

      {/* Hero Banner */}
      {(pageTitle || pageDescription) && (
        <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
          <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
            {pageTitle && (
              <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">{pageTitle}</h1>
            )}
            {pageDescription && (
              <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary">{pageDescription}</p>
            )}
          </div>
        </div>
      )}

      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        {/* FAQ Accordion Categories */}
        {faqCategories && faqCategories.length > 0 && (
          <FaqCategoriesList categories={faqCategories} />
        )}

        {/* CTA Section */}
        {ctaSection && (ctaSection.ctaTitle || ctaSection.ctaDescription) && (
          <section className="mb-12">
            <div className="bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-8 md:p-12 rounded-[2rem] border border-club-purple/20 text-center">
              {ctaSection.ctaTitle && (
                <h2 className="text-2xl font-bold mb-4 text-primary">{ctaSection.ctaTitle}</h2>
              )}
              {ctaSection.ctaDescription && (
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {ctaSection.ctaDescription}
                </p>
              )}
              {ctaSection.buttonText && ctaSection.buttonUrl && (
                <Link
                  href={ctaSection.buttonUrl}
                  className="inline-block bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg"
                >
                  {ctaSection.buttonText}
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
