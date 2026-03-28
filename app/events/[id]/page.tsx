import type { Metadata } from "next";
import { fetchEventById } from "@/lib/actions/site/eventsAction";
import { EventDetailPageClient } from "./EventDetailPageClient";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";
import { normalizeImageUrl } from "@/lib/utils/url";
import { SEO } from "@/components/SEO";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return {};
  }

  const images = await getMetadataImages(normalizeImageUrl(event.featuredImage?.node?.sourceUrl ?? ""));
  const description = stripHtml(event.content) || undefined;

  return {
    title: event.title || undefined,
    description,
    alternates: {
      canonical: `${SITE_ORIGIN}/events/${id}`,
    },
    openGraph: {
      title: event.title || undefined,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title || undefined,
      description,
      images: images.map(img => img.url),
    },
  };
}


export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return (
      <div className="pt-25 pb-25">
        <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xl text-muted-foreground mb-6">عذراً، لم يتم العثور على هذه الفعالية.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-club-purple font-bold hover:underline"
          >
            <span>العودة إلى قائمة الفعاليات</span>
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const description = stripHtml(event.content) || undefined;
  const canonicalUrl = `${SITE_ORIGIN}/events/${id}`;

  return (
    <>
      <SEO
        title={event.title || undefined}
        description={description}
        url={canonicalUrl}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: 'الفعاليات', item: `${SITE_ORIGIN}/events` },
          { name: event.title || undefined, item: canonicalUrl },
        ]}
      />
      <EventDetailPageClient event={event} />
    </>
  );
}
