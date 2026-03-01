import { Metadata } from 'next';
import { fetchPolicyPageData } from '@/lib/actions/site/policyPageAction';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { SEO } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPolicyPageData(3);
  const pageTitle = data?.pageOptions?.pageTitle || 'سياسة الخصوصية';
  const pageDescription = data?.pageOptions?.pageDescription || 'نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية';

  return {
    title: `${pageTitle} | النادي الثقافي العربي`,
    description: pageDescription,
  };
}

export default async function PrivacyPolicy() {
  const data = await fetchPolicyPageData(3);

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">سياسة الخصوصية</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-black/70">
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
      />
      <PrivacyPolicyClient data={data} />
    </>
  );
}
;
