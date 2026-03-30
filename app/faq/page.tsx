import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400;
import { fetchFaqPageData } from '@/lib/actions/site/faqPageAction';
import { SEO } from '@/components/SEO';
import FaqCategoriesList from './FaqCategoriesList';
import { getMetadataImages, stripHtml, SITE_ORIGIN} from '@/lib/utils/seo';
import { normalizeImageUrl } from '@/lib/utils/url';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchFaqPageData();
  const seo = data?.seoOptions;
  const pageTitle = data?.pageTitle;

  const title = seo?.seoTitle || pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || data?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/faq`;
  const featuredImageUrl = normalizeImageUrl(data?.featuredImage?.node?.sourceUrl ?? "");
  const images = await getMetadataImages(undefined, featuredImageUrl);

  return {
    title,
    description,
    keywords: seo?.focusKeyword || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'النادي الثقافي العربي',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.url),
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

  const { pageTitle, pageDescription, faqCategories, ctaSection, seoOptions } = data;

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={seoOptions?.seoTitle || pageTitle || undefined}
        description={seoOptions?.metaDescription || pageDescription || undefined}
        url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/faq`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: pageTitle || 'الأسئلة الشائعة', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/faq` },
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
            <div className="bg-linear-to-l from-club-purple/10 to-club-blue/10 p-8 md:p-12 rounded-4xl border border-club-purple/20 text-center">
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
