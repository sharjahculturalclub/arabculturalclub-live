import { Metadata } from 'next';
import { fetchOurProgramsPageData } from '@/lib/actions/site/ourProgramsPageAction';

export const revalidate = 86400;
import OurProgramsClient from './OurProgramsClient';
import { SEO } from '@/components/SEO';
import { getMetadataImages, stripHtml, SITE_ORIGIN } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [data, images] = await Promise.all([
    fetchOurProgramsPageData(),
    getMetadataImages(),
  ]);

  const seo = data?.seoOptions;
  const title = seo?.seoTitle || data?.pageOptions?.pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || data?.pageOptions?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/programs`;

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


export default async function OurPrograms() {
  const data = await fetchOurProgramsPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">برامج النادي</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          جاري التحميل...
        </p>
      </div>
    );
  }

  const seoOptions = data.seoOptions;
  const pageOptions = data.pageOptions;

  return (
    <>
      <SEO
        title={seoOptions?.seoTitle || pageOptions?.pageTitle || undefined}
        description={seoOptions?.metaDescription || pageOptions?.pageDescription || undefined}
        url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/programs`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: pageOptions?.pageTitle || 'البرامج', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/programs` }
        ]}
      />
      <OurProgramsClient data={data} />
    </>
  );
}
