import { Metadata } from 'next';
import { fetchPolicyPageData } from '@/lib/actions/site/policyPageAction';
import PrivacyPolicyClient from '../privacy-policy/PrivacyPolicyClient';
import { SEO } from '@/components/SEO';
import { getMetadataImages } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPolicyPageData(321);
  const pageTitle = data?.pageOptions?.pageTitle || 'شروط الاستخدام';
  const pageDescription = data?.pageOptions?.pageDescription || 'شروط وأحكام استخدام موقع النادي الثقافي العربي.';

  const seo = data?.seoOptions;
  const canonicalUrl = seo?.canonicalUrl || "https://shjarabclub.ae/terms-of-use";
  const images = await getMetadataImages(seo?.ogImage?.node?.sourceUrl);

  return {
    title: seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`,
    description: seo?.metaDescription || pageDescription,
    keywords: seo?.focusKeyword || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo?.ogTitle || seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`,
      description: seo?.ogDescription || seo?.metaDescription || pageDescription,
      url: canonicalUrl,
      siteName: "النادي الثقافي العربي",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`,
      description: seo?.twitterDescription || seo?.metaDescription || pageDescription,
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
        title={`${data.pageOptions?.pageTitle || 'شروط الاستخدام'} | النادي الثقافي العربي`}
        description={data.pageOptions?.pageDescription || 'شروط وأحكام استخدام موقع النادي الثقافي العربي.'}
        url={data?.seoOptions?.canonicalUrl || "https://shjarabclub.ae/terms-of-use"}
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: data.pageOptions?.pageTitle || 'شروط الاستخدام', item: data?.seoOptions?.canonicalUrl || "https://shjarabclub.ae/terms-of-use" }
        ]}
      />
      <PrivacyPolicyClient data={data} />
    </>
  );
}
