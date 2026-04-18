import { Metadata } from 'next';
import { SEO } from '@/components/SEO';
import { SITE_ORIGIN } from '@/lib/utils/seo';
import { fetchServiceFeesPageData } from '@/lib/actions/site/serviceFeesPageAction';

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchServiceFeesPageData();
  if (!data) return { title: 'قائمة رسوم الخدمات' };

  return {
    title: data.seoOptions?.seoTitle || data.pageOptions?.pageTitle || 'قائمة رسوم الخدمات',
    description: data.seoOptions?.metaDescription || data.pageOptions?.pageDescription,
  };
}

export default async function ServiceFeesPage() {
  const data = await fetchServiceFeesPageData();

  if (!data) {
    return null;
  }

  const { pageOptions, seoOptions, serviceFeesTableData } = data;
  const pageTitle = pageOptions?.pageTitle || 'قائمة رسوم العضوية والاشتراكات واستئجار القاعات والمرافق';

  return (
    <div className="pt-25 pb-25 bg-[#f7f7f7] min-h-screen">
      <SEO
        title={seoOptions?.seoTitle || pageTitle}
        description={seoOptions?.metaDescription || pageOptions?.pageDescription || ""}
        url={`${SITE_ORIGIN}/service-fees`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: 'رسوم الخدمات', item: `${SITE_ORIGIN}/service-fees` },
        ]}
      />

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white p-8 md:p-12 mt-12 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-border">
          <h1 className="text-4xl font-bold text-club-purple mb-4 leading-tight text-right">
            {pageTitle}
          </h1>

          {pageOptions?.pageDescription && (
            <div
              className="text-lg text-gray-600 mb-8 text-right"
              dangerouslySetInnerHTML={{ __html: pageOptions.pageDescription }}
            />
          )}

          {serviceFeesTableData && serviceFeesTableData.map((section, index) => {
            // Avoid repeating the page title as a section heading if it matches exactly
            const isRedundantHeading = section.heading === pageTitle;

            return (
              <section key={index} className="mb-12 last:mb-0">
                {!isRedundantHeading && section.heading && (
                  <h2 className="text-3xl font-bold text-club-purple mb-4 text-right">
                    {section.heading}
                  </h2>
                )}

                {section.subHeading && (
                  <h3 className="text-2xl font-bold text-club-purple mb-4 text-right">
                    {section.subHeading}
                  </h3>
                )}

                {section.table && section.table.header && section.table.header.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-right" style={{ border: '1px solid #d8d8d8' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#4b2e83' }}>
                          {section.table.header.map((header, hIndex) => (
                            <th
                              key={hIndex}
                              style={{
                                border: '1px solid #d8d8d8',
                                padding: '10px 12px',
                                color: '#ffffff',
                                fontWeight: 'bold'
                              }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.body && section.table.body.map((row, rIndex) => (
                          <tr key={rIndex} style={{ backgroundColor: rIndex % 2 === 1 ? '#fafafa' : '#ffffff' }}>
                            {row.map((cell, cIndex) => (
                              <td
                                key={cIndex}
                                style={{
                                  border: '1px solid #d8d8d8',
                                  padding: '10px 12px',
                                  fontSize: '18px'
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.description && (
                  <div
                    className="mt-4 rounded-[6px] text-right"
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#f3f0ff',
                      borderRight: '4px solid #4b2e83'
                    }}
                  >
                    <div
                      className="text-[18px] leading-relaxed text-[#222] text-right
                        [&_p]:mb-2 [&_p]:leading-relaxed
                        [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:my-4
                        [&_li]:list-item [&_li]:mb-1
                        [&_li::marker]:text-club-purple"
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
