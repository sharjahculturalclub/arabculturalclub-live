import { Metadata } from 'next';
import { fetchAboutPageData } from '@/lib/actions/site/aboutPageAction';
import AboutClient from './AboutClient';
import { SEO } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchAboutPageData();
  const pageTitle = data?.pageOptions?.pageTitle || 'من نحن';
  const pageDescription = data?.pageOptions?.pageDescription || 'النادي الثقافي العربي هو بيت المبدعين ومنارة الفكر، تأسس ليكون جسراً يربط بين عراقة الماضي وإبداع المستقبل.';

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
  };
}

export default async function About() {
  const data = await fetchAboutPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">من نحن</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black/70">
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
      />
      <AboutClient data={data} />
    </>
  );
}
