import { Metadata } from 'next';
import { fetchMembershipRegistrationPageData } from '@/lib/actions/site/membershipRegistrationPageAction';
import { SEO } from '@/components/SEO';
import MembershipForm from './MembershipForm';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchMembershipRegistrationPageData();
  const seo = data?.sEOOptions;
  const pageTitle = data?.pageTitle || 'تسجيل العضوية';

  const title = seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`;
  const description = seo?.metaDescription || data?.pageDescription || 'انضم إلى النادي الثقافي العربي واستمتع بجميع المزايا والخدمات الثقافية.';
  const canonicalUrl = seo?.canonicalUrl || 'https://shjarabclub.ae/membership-registration';

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
export default async function MembershipRegistrationPage() {
  const data = await fetchMembershipRegistrationPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">تسجيل العضوية</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          عذراً، لم نتمكن من تحميل بيانات الصفحة. يرجى المحاولة لاحقاً.
        </p>
      </div>
    );
  }

  const { pageTitle, pageDescription, formId, sEOOptions } = data;

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={sEOOptions?.seoTitle || `${pageTitle || 'تسجيل العضوية'} | النادي الثقافي العربي`}
        description={sEOOptions?.metaDescription || pageDescription || 'انضم إلى النادي الثقافي العربي واستمتع بجميع المزايا والخدمات الثقافية.'}
        url={sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/membership-registration'}
        breadcrumbs={[
          { name: 'الرئيسية', item: 'https://shjarabclub.ae/' },
          { name: pageTitle || 'تسجيل العضوية', item: sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/membership-registration' },
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
        {formId ? (
          <MembershipForm formId={formId} />
        ) : (
          <div className="bg-white p-12 rounded-[2rem] shadow-lg border border-border text-center">
            <p className="text-muted-foreground text-lg">
              نموذج التسجيل غير متاح حالياً. يرجى المحاولة لاحقاً.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
