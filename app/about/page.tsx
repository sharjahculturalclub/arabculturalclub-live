import { Metadata } from 'next';
import { fetchAboutPageData } from '@/lib/actions/site/aboutPageAction';
import AboutClient from './AboutClient';
import { SEO } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchAboutPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'من نحن';
  const pageDescription = data?.pageOptions?.pageDescription || 'النادي الثقافي العربي هو بيت المبدعين ومنارة الفكر، تأسس ليكون جسراً يربط بين عراقة الماضي وإبداع المستقبل.';

  const seo = data?.sEOOptions;
  const canonicalUrl = seo?.canonicalUrl || "https://shjarabclub.ae/about";

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
      images: seo?.ogImage?.node?.sourceUrl
        ? [{ url: seo.ogImage.node.sourceUrl }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.seoTitle || `${pageTitle} | النادي الثقافي العربي`,
      description: seo?.twitterDescription || seo?.metaDescription || pageDescription,
      images: seo?.twitterImage?.node?.sourceUrl
        ? [seo.twitterImage.node.sourceUrl]
        : undefined,
    },
  };
}

export default async function About() {
  const data = await fetchAboutPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">من نحن</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          جاري التحميل...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${data.pageOptions?.pageTitle || 'من نحن'} | النادي الثقافي العربي`}
        description={data.pageOptions?.pageDescription || 'النادي الثقافي العربي هو بيت المبدعين ومنارة الفكر، تأسس ليكون جسراً يربط بين عراقة الماضي وإبداع المستقبل.'}
        url={data?.sEOOptions?.canonicalUrl || "https://shjarabclub.ae/about"}
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: data.pageOptions?.pageTitle || 'من نحن', item: data?.sEOOptions?.canonicalUrl || "https://shjarabclub.ae/about" }
        ]}
      />
      <AboutClient data={data} />
    </>
  );
}
