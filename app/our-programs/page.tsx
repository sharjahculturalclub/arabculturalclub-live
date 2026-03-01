import { Metadata } from 'next';
import { fetchOurProgramsPageData } from '@/lib/actions/site/ourProgramsPageAction';
import OurProgramsClient from './OurProgramsClient';
import { SEO } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchOurProgramsPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'برامج النادي';
  const pageDescription = data?.pageOptions?.pageDescription || 'منظومة متكاملة من البرامج التي تخدم الثقافة والمجتمع وتفتح أبواب النادي لكل الأجيال.';

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
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

  return (
    <>
      <SEO
        title={`${data.pageOptions?.pageTitle || 'برامج النادي'} | النادي الثقافي العربي`}
        description={data.pageOptions?.pageDescription || 'منظومة متكاملة من البرامج التي تخدم الثقافة والمجتمع وتفتح أبواب النادي لكل الأجيال.'}
        url="https://shjarabclub.ae/our-programs"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: data.pageOptions?.pageTitle || 'برامج النادي', item: "https://shjarabclub.ae/our-programs" }
        ]}
      />
      <OurProgramsClient data={data} />
    </>
  );
}
