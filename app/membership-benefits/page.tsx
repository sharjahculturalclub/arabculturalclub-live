import { Metadata } from 'next';
import { fetchMembershipBenefitsPageData } from '@/lib/actions/site/membershipBenefitsPageAction';
import MembershipBenefitsClient from './MembershipBenefitsClient';
import { SEO } from '@/components/SEO';
import { getMetadataImages } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchMembershipBenefitsPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'فوائد العضوية';
  const pageDescription = data?.pageOptions?.pageDescription || 'انضم إلى مجتمع المثقفين واستمتع بمجموعة واسعة من المزايا والخدمات الحصرية';
  const images = await getMetadataImages();

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
    openGraph: {
      title: `${pageTitle} | النادي الثقافي العربي`,
      description: pageDescription,
      url: 'https://shjarabclub.ae/membership-benefits',
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


export default async function MembershipBenefits() {
  const data = await fetchMembershipBenefitsPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">فوائد العضوية</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          جاري التحميل...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${data.pageOptions?.pageTitle || 'فوائد العضوية'} | النادي الثقافي العربي`}
        description={data.pageOptions?.pageDescription || 'انضم إلى مجتمع المثقفين واستمتع بمجموعة واسعة من المزايا والخدمات الحصرية'}
        url="https://shjarabclub.ae/membership-benefits"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: data.pageOptions?.pageTitle || 'فوائد العضوية', item: "https://shjarabclub.ae/membership-benefits" }
        ]}
      />
      <MembershipBenefitsClient data={data} />
    </>
  );
}
