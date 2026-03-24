import { Metadata } from 'next';
import { fetchPolicyPageData } from '@/lib/actions/site/policyPageAction';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { SEO } from '@/components/SEO';
import { getMetadataImages, stripHtml } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPolicyPageData(3);
  const pageTitle = data?.pageOptions?.pageTitle || 'سياسة الخصوصية';
  const pageDescription = data?.pageOptions?.pageDescription || 'نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية';

  const seo = data?.seoOptions;
  const canonicalUrl = seo?.canonicalUrl || "https://shjarabclub.ae/privacy-policy";
  const featuredImageUrl = data?.featuredImage?.node?.sourceUrl;
  const images = await getMetadataImages(undefined, featuredImageUrl);

  const title = seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`;
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


export default async function PrivacyPolicy() {
  const data = await fetchPolicyPageData(3);

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">سياسة الخصوصية</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          جاري التحميل...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${data.pageOptions?.pageTitle || 'سياسة الخصوصية'} | النادي الثقافي العربي`}
        description={data.pageOptions?.pageDescription || 'نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية'}
        url={data?.seoOptions?.canonicalUrl || "https://shjarabclub.ae/privacy-policy"}
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: data.pageOptions?.pageTitle || 'سياسة الخصوصية', item: data?.seoOptions?.canonicalUrl || "https://shjarabclub.ae/privacy-policy" }
        ]}
      />
      <PrivacyPolicyClient data={data} />
    </>
  );
}
;
