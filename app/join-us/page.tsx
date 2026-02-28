import { Metadata } from 'next';
import { fetchJoinUsPageData } from '@/lib/actions/site/joinUsPageAction';
import JoinUsClient from './JoinUsClient';
import { SEO } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchJoinUsPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'انضم إلينا';
  const pageDescription = data?.pageOptions?.pageDescription || 'انضم إلى النادي الثقافي العربي، تعرف على مزايا العضوية وحجز المرافق بسهولة.';

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
  };
}

export default async function JoinUs() {
  const data = await fetchJoinUsPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">انضم إلينا</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black/70">
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
      />
      <JoinUsClient data={data} />
    </>
  );
}
