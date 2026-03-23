import type { Metadata } from "next";
import { fetchEvents, fetchEventsPageOptions } from "@/lib/actions/site/eventsAction";
import { EventsPageClient } from "./EventsPageClient";

import { getMetadataImages } from "@/lib/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pageOptions = await fetchEventsPageOptions("events");
  const images = await getMetadataImages();

  return {
    title: pageOptions?.pageTitle || "الفعاليات وورش العمل | النادي الثقافي العربي",
    description: pageOptions?.pageDescription || "استكشف الفعاليات والأنشطة الثقافية القادمة في النادي الثقافي العربي.",
    alternates: {
      canonical: "https://shjarabclub.ae/events",
    },
    openGraph: {
      title: pageOptions?.pageTitle || "الفعاليات وورش العمل | النادي الثقافي العربي",
      description: pageOptions?.pageDescription || "استكشف الفعاليات والأنشطة الثقافية القادمة في النادي الثقافي العربي.",
      url: "https://shjarabclub.ae/events",
      siteName: "النادي الثقافي العربي",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: pageOptions?.pageTitle || "الفعاليات وورش العمل | النادي الثقافي العربي",
      description: pageOptions?.pageDescription || "استكشف الفعاليات والأنشطة الثقافية القادمة في النادي الثقافي العربي.",
      images: images.map(img => img.url),
    },
  };
}


export default async function EventsPage() {
  const [eventsData, pageOptions] = await Promise.all([
    fetchEvents(9),
    fetchEventsPageOptions("events"), // Assuming "events" is the URI for the events page
  ]);

  return (
    <EventsPageClient
      initialNodes={eventsData.nodes}
      initialHasNextPage={eventsData.hasNextPage}
      initialEndCursor={eventsData.endCursor}
      pageTitle={pageOptions?.pageTitle || null}
      pageDescription={pageOptions?.pageDescription || null}
    />
  );
}
