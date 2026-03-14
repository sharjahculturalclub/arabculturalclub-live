import { Metadata } from 'next';
import { fetchLectureHallBookingPageData } from '@/lib/actions/site/lectureHallBookingPageAction';
import { SEO } from '@/components/SEO';
import LectureHallBookingForm from './LectureHallBookingForm';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchLectureHallBookingPageData();
  const seo = data?.sEOOptions;
  const pageTitle = data?.pageTitle || 'حجز قاعة المحاضرات';

  const title = seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`;
  const description = seo?.metaDescription || data?.pageDescription || 'احجز قاعة المحاضرات الآن.';
  const canonicalUrl = seo?.canonicalUrl || 'https://shjarabclub.ae/lecture-hall-booking';

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
export default async function LectureHallBookingPage() {
  const data = await fetchLectureHallBookingPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">حجز قاعة المحاضرات</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          عذراً، لم نتمكن من تحميل بيانات الصفحة. يرجى المحاولة لاحقاً.
        </p>
      </div>
    );
  }

  const { pageTitle, pageDescription, formId, infoSection, sEOOptions } = data;

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={sEOOptions?.seoTitle || `${pageTitle || 'حجز قاعة المحاضرات'} | النادي الثقافي العربي`}
        description={sEOOptions?.metaDescription || pageDescription || 'احجز قاعة المحاضرات الآن.'}
        url={sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/lecture-hall-booking'}
        breadcrumbs={[
          { name: 'الرئيسية', item: 'https://shjarabclub.ae/' },
          { name: pageTitle || 'حجز قاعة المحاضرات', item: sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/lecture-hall-booking' },
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
        {/* Booking Form */}
        {formId ? (
          <LectureHallBookingForm formId={formId} />
        ) : (
          <div className="bg-white p-12 rounded-4xl shadow-lg border border-border text-center">
            <p className="text-muted-foreground text-lg">
              نموذج الحجز غير متاح حالياً. يرجى المحاولة لاحقاً.
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
