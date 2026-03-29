import type { Metadata } from "next";
import { fetchEvents, fetchEventsPageOptions } from "@/lib/actions/site/eventsAction";
import { EventsPageClient } from "./EventsPageClient";
import { SEO } from "@/components/SEO";
import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, images] = await Promise.all([
    fetchEventsPageOptions("events"),
    getMetadataImages(),
  ]);

  const seo = pageData?.seoOptions;
  const title = seo?.seoTitle || pageData?.pageOptions?.pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || pageData?.pageOptions?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/events`;

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
      siteName: "النادي الثقافي العربي",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(img => img.url),
    },
  };
}


export default async function EventsPage() {
  const [eventsData, pageData] = await Promise.all([
    fetchEvents(9),
    fetchEventsPageOptions("events"),
  ]);

  const seoOptions = pageData?.seoOptions;
  const pageOptions = pageData?.pageOptions;

  return (
    <>
      <SEO
        title={seoOptions?.seoTitle || undefined}
        description={seoOptions?.metaDescription || undefined}
        url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/events`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: pageOptions?.pageTitle || 'الفعاليات', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/events` },
        ]}
      />
      <EventsPageClient
        initialNodes={eventsData.nodes}
        initialHasNextPage={eventsData.hasNextPage}
        initialEndCursor={eventsData.endCursor}
        pageTitle={pageOptions?.pageTitle || null}
        pageDescription={pageOptions?.pageDescription || null}
        canonicalUrl={seoOptions?.canonicalUrl || null}
      />
    </>
  );
}
