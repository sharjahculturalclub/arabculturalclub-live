import { Metadata } from 'next';
import { fetchCondolenceHallBookingPageData } from '@/lib/actions/site/condolenceHallBookingPageAction';
import { SEO } from '@/components/SEO';
import CondolenceHallBookingForm from './CondolenceHallBookingForm';
import { getMetadataImages, stripHtml, SITE_ORIGIN } from '@/lib/utils/seo';
import { normalizeImageUrl } from '@/lib/utils/url';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchCondolenceHallBookingPageData();
  const seo = data?.seoOptions;
  const pageTitle = data?.pageTitle;

  const title = seo?.seoTitle || pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || data?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/condolence-hall-booking`;
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
export default async function CondolenceHallBookingPage() {
  const data = await fetchCondolenceHallBookingPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">حجز قاعة التعازي</h1>
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
        title={seoOptions?.seoTitle || pageTitle || undefined}
        description={seoOptions?.metaDescription || pageDescription || undefined}
        url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/condolence-hall-booking`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: pageTitle || 'حجز قاعة العزاء', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/condolence-hall-booking` },
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
              <div className="text-xl max-w-2xl mx-auto leading-relaxed text-primary" dangerouslySetInnerHTML={{ __html: pageDescription }} />
            )}
          </div>
        </div>
      )}

      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        {/* Booking Form */}
        {formId ? (
          <CondolenceHallBookingForm formId={formId} />
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
