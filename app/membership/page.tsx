import { Metadata } from 'next';
import { fetchJoinUsPageData } from '@/lib/actions/site/joinUsPageAction';
import JoinUsClient from './JoinUsClient';
import { SEO } from '@/components/SEO';
import { getMetadataImages } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchJoinUsPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'انضم إلينا';
  const pageDescription = data?.pageOptions?.pageDescription || 'انضم إلى النادي الثقافي العربي، تعرف على مزايا العضوية وحجز المرافق بسهولة.';
  const images = await getMetadataImages();

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
    openGraph: {
      title: `${pageTitle} | النادي الثقافي العربي`,
      description: pageDescription,
      url: 'https://shjarabclub.ae/membership',
      siteName: 'النادي الثقافي العربي',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} | النادي الثقافي العربي`,
      description: pageDescription,
      images: images.map(img => img.url),
    },
  };
}


export default async function JoinUs() {
  const data = await fetchJoinUsPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">انضم إلينا</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          جاري التحميل...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${data.pageOptions?.pageTitle || 'انضم إلينا'} | النادي الثقافي العربي`}
        description={data.pageOptions?.pageDescription || 'انضم إلى النادي الثقافي العربي، تعرف على مزايا العضوية وحجز المرافق بسهولة.'}
        url="https://shjarabclub.ae/membership"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: data.pageOptions?.pageTitle || 'انضم إلينا', item: "https://shjarabclub.ae/membership" }
        ]}
      />
      <JoinUsClient data={data} />
    </>
  );
}
