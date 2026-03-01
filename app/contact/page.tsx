import { Metadata } from 'next';
import { MapPin, Phone, Mail } from 'lucide-react';
import {
  fetchContactPageData,
  findContactSection,
  ContactFormAndInfoSection,
  MapSection,
} from '@/lib/actions/site/contactPageAction';
import { SEO } from '@/components/SEO';
import ContactForm from './ContactForm';

// ── Icon map for dynamic rendering ────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  'map-pin': MapPin,
  'phone': Phone,
  'mail': Mail,
};

const colorMap: Record<string, { bg: string; text: string; hoverBg: string; hoverBorder: string }> = {
  'map-pin': {
    bg: 'bg-club-purple/10',
    text: 'text-club-purple',
    hoverBg: 'group-hover:bg-club-purple',
    hoverBorder: 'hover:border-club-purple',
  },
  'phone': {
    bg: 'bg-club-blue/10',
    text: 'text-club-blue',
    hoverBg: 'group-hover:bg-club-blue',
    hoverBorder: 'hover:border-club-blue',
  },
  'mail': {
    bg: 'bg-club-purple/10',
    text: 'text-club-purple',
    hoverBg: 'group-hover:bg-club-purple',
    hoverBorder: 'hover:border-club-purple',
  },
};

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchContactPageData();
  const seo = data?.sEOOptions;

  const title = seo?.seoTitle || 'اتصل بنا | النادي الثقافي العربي';
  const description = seo?.metaDescription || 'تواصل مع النادي الثقافي العربي.';
  const canonicalUrl = seo?.canonicalUrl || 'https://shjarabclub.ae/contact';

  return {
    title: seo?.seoTitle || `اتصل بنا | النادي الثقافي العربي`,
    description,
    keywords: seo?.focusKeyword || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonicalUrl,
      siteName: 'النادي الثقافي العربي',
      type: 'website',
      images: seo?.ogImage?.node?.sourceUrl
        ? [{ url: seo.ogImage.node.sourceUrl }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: seo?.twitterImage?.node?.sourceUrl
        ? [seo.twitterImage.node.sourceUrl]
        : undefined,
    },
  };
}

// ── Page Component ────────────────────────────────────────────────
export default async function ContactPage() {
  const data = await fetchContactPageData();

  if (!data) {
    return (
      <div className="pt-25 pb-25 container max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">اتصل بنا</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary/70">
          عذراً، لم نتمكن من تحميل بيانات الصفحة. يرجى المحاولة لاحقاً.
        </p>
      </div>
    );
  }

  const { sections, sEOOptions } = data;

  const contactFormAndInfo = findContactSection<ContactFormAndInfoSection>(
    sections,
    'ContactPageBuilderContactPageBuilderContactFormAndInfoLayout'
  );

  const mapSection = findContactSection<MapSection>(
    sections,
    'ContactPageBuilderContactPageBuilderMapSectionLayout'
  );

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={sEOOptions?.seoTitle || 'اتصل بنا | النادي الثقافي العربي'}
        description={sEOOptions?.metaDescription || 'تواصل مع النادي الثقافي العربي.'}
        url={sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/contact'}
        breadcrumbs={[
          { name: 'الرئيسية', item: 'https://shjarabclub.ae/' },
          { name: 'اتصل بنا', item: sEOOptions?.canonicalUrl || 'https://shjarabclub.ae/contact' },
        ]}
      />

      {/* Page Header */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-primary">تواصل معنا</h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed text-primary">
            نحن هنا للإجابة على استفساراتكم واقتراحاتكم.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Contact Form & Info Section */}
        {contactFormAndInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
            {/* Contact Info Cards */}
            {contactFormAndInfo.contactInfoCards && contactFormAndInfo.contactInfoCards.length > 0 && (
              <div className="lg:col-span-1 space-y-6">
                {contactFormAndInfo.contactInfoCards.map((card, index) => {
                  const iconName = card.iconName || 'mail';
                  const IconComponent = iconMap[iconName];
                  const colors = colorMap[iconName] || colorMap['mail'];

                  return (
                    <div
                      key={index}
                      className={`bg-white p-8 rounded-3xl border border-border shadow-sm group ${colors.hoverBorder} transition-all`}
                    >
                      {IconComponent && (
                        <div
                          className={`w-12 h-12 ${colors.bg} rounded-2xl flex items-center justify-center ${colors.text} mb-6 ${colors.hoverBg} group-hover:text-white transition-all`}
                        >
                          <IconComponent size={24} />
                        </div>
                      )}
                      {card.title && (
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                      )}
                      {card.details && (
                        <div
                          className="text-muted-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: card.details }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contact Form */}
            {contactFormAndInfo.contactFormId && (
              <div className="lg:col-span-2">
                <ContactForm formId={contactFormAndInfo.contactFormId} />
              </div>
            )}
          </div>
        )}

        {/* Map Section */}
        {mapSection && (
          <section className="mt-20">
            {(mapSection.sectionTitle || mapSection.sectionDescription) && (
              <div className="mb-6 text-center">
                {mapSection.sectionTitle && (
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary relative inline-block">
                    {mapSection.sectionTitle}
                    <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
                  </h2>
                )}
                {mapSection.sectionDescription && (
                  <p
                    className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4"
                    dangerouslySetInnerHTML={{ __html: mapSection.sectionDescription }}
                  />
                )}
              </div>
            )}
            {mapSection.mapEmbedCode && (
              <div
                className="bg-white rounded-[2rem] border border-border shadow-lg overflow-hidden h-[320px] md:h-[420px] [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: mapSection.mapEmbedCode }}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
