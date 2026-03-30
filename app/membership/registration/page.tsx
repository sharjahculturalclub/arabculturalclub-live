import { Metadata } from 'next';
import { fetchMembershipRegistrationPageData } from '@/lib/actions/site/membershipRegistrationPageAction';

export const revalidate = 86400;
import { SEO } from '@/components/SEO';
import MembershipForm from './MembershipForm';
import { getMetadataImages, stripHtml, SITE_ORIGIN} from '@/lib/utils/seo';
import { normalizeImageUrl } from '@/lib/utils/url';

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchMembershipRegistrationPageData();
  const seo = data?.seoOptions;
  const pageTitle = data?.pageTitle;

  const title = seo?.seoTitle || pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || data?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/membership/registration`;
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

  const { pageTitle, pageDescription, formId, seoOptions } = data;

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={seoOptions?.seoTitle || pageTitle || undefined}
        description={seoOptions?.metaDescription || pageDescription || undefined}
        url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/membership/registration`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: pageTitle || 'التسجيل', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/membership/registration` },
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
          <div className="bg-white p-12 rounded-3xl shadow-lg border border-border text-center">
            <p className="text-muted-foreground text-lg">
              نموذج التسجيل غير متاح حالياً. يرجى المحاولة لاحقاً.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
