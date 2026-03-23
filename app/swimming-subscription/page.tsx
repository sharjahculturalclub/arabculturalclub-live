import { Metadata } from 'next';
import { fetchSwimmingSubscriptionPageData } from '@/lib/actions/site/swimmingSubscriptionPageAction';
import { SEO } from '@/components/SEO';
import SwimmingSubscriptionForm from './SwimmingSubscriptionForm';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchSwimmingSubscriptionPageData();
  const seo = data?.seoOptions;
  const pageTitle = data?.pageTitle || 'اشتراك لنشاط السباحة';

  const title = seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`;
  const description = seo?.metaDescription || data?.pageDescription || 'سجل الآن في نشاط السباحة لدى النادي الثقافي العربي.';
  const canonicalUrl = seo?.canonicalUrl || 'https://shjarabclub.ae/swimming-subscription';

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
export default async function SwimmingSubscriptionPage() {
  const data = await fetchSwimmingSubscriptionPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">اشتراك لنشاط السباحة</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          عذراً، لم نتمكن من تحميل بيانات الصفحة. يرجى المحاولة لاحقاً.
        </p>
      </div>
    );
  }

  const { pageTitle, pageDescription, formId, infoSection, seoOptions } = data;

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={seoOptions?.seoTitle || `${pageTitle || 'اشتراك لنشاط السباحة'} | النادي الثقافي العربي`}
        description={seoOptions?.metaDescription || pageDescription || 'سجل الآن في نشاط السباحة واستمتع بأفضل البرامج الرياضية لدى النادي الثقافي العربي.'}
        url={seoOptions?.canonicalUrl || 'https://shjarabclub.ae/swimming-subscription'}
        breadcrumbs={[
          { name: 'الرئيسية', item: 'https://shjarabclub.ae/' },
          { name: pageTitle || 'اشتراك لنشاط السباحة', item: seoOptions?.canonicalUrl || 'https://shjarabclub.ae/swimming-subscription' },
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
        {/* Subscription Form */}
        {formId ? (
          <SwimmingSubscriptionForm formId={formId} />
        ) : (
          <div className="bg-white p-12 rounded-4xl shadow-lg border border-border text-center">
            <p className="text-muted-foreground text-lg">
              نموذج المشاركة غير متاح حالياً. يرجى المحاولة لاحقاً.
            </p>
          </div>
        )}

        {/* Info Section */}
        {infoSection && infoSection.infoPoints && infoSection.infoPoints.length > 0 && (
          <div className="mt-12 bg-linear-to-l from-club-purple/10 to-club-blue/10 p-8 rounded-4xl border border-club-purple/20">
            {infoSection.sectionTitle && (
              <h3 className="text-xl font-bold mb-4 text-primary">{infoSection.sectionTitle}</h3>
            )}
            <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
              {infoSection.infoPoints.map((point, index) => (
                point.pointText && (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>{point.pointText}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
