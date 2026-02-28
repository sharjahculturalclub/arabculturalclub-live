import { Metadata } from 'next';
import { fetchMembershipBenefitsPageData } from '@/lib/actions/site/membershipBenefitsPageAction';
import MembershipBenefitsClient from './MembershipBenefitsClient';
import { SEO } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchMembershipBenefitsPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'فوائد العضوية';
  const pageDescription = data?.pageOptions?.pageDescription || 'انضم إلى مجتمع المثقفين واستمتع بمجموعة واسعة من المزايا والخدمات الحصرية';

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
  };
}

export default async function MembershipBenefits() {
  const data = await fetchMembershipBenefitsPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">فوائد العضوية</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black/70">
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
      />
      <MembershipBenefitsClient data={data} />
    </>
  );
}
