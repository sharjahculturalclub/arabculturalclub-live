import { Metadata } from 'next';
import { fetchPolicyPageData } from '@/lib/actions/site/policyPageAction';
import PrivacyPolicyClient from '../privacy-policy/PrivacyPolicyClient';

export const revalidate = 86400;
import { SEO } from '@/components/SEO';
import { getMetadataImages, stripHtml, SITE_ORIGIN} from '@/lib/utils/seo';
import { normalizeImageUrl } from '@/lib/utils/url';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPolicyPageData(321);
  const pageTitle = data?.pageOptions?.pageTitle;
  const pageDescription = data?.pageOptions?.pageDescription || undefined;

  const seo = data?.seoOptions;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/terms-of-use`;
  const featuredImageUrl = normalizeImageUrl(data?.featuredImage?.node?.sourceUrl ?? "");
  const images = await getMetadataImages(undefined, featuredImageUrl);

  const title = seo?.seoTitle || pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || pageDescription;

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
      siteName: "النادي الثقافي العربي",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(img => img.url),
    },
  };
}


export default async function TermsOfUse() {
  const data = await fetchPolicyPageData(321);

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">شروط الاستخدام</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          جاري التحميل...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={data.pageOptions?.pageTitle || undefined}
        description={data.pageOptions?.pageDescription || undefined}
        url={data?.seoOptions?.canonicalUrl || `${SITE_ORIGIN}/terms-of-use`}
        breadcrumbs={[
          { name: "الرئيسية", item: `${SITE_ORIGIN}/` },
          { name: data.pageOptions?.pageTitle || 'شروط الاستخدام', item: data?.seoOptions?.canonicalUrl || `${SITE_ORIGIN}/terms-of-use` }
        ]}
      />
      <PrivacyPolicyClient data={data} />
    </>
  );
}
