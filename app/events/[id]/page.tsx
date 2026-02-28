import type { Metadata } from "next";
import { fetchEventById } from "@/lib/actions/site/eventsAction";
import { EventDetailPageClient } from "./EventDetailPageClient";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return {
      title: "الفعالية غير موجودة | النادي الثقافي العربي",
    };
  }

  return {
    title: `${event.title} | النادي الثقافي العربي`,
    description: event.content.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.content.replace(/<[^>]*>/g, '').substring(0, 160),
      images: event.featuredImage?.node.sourceUrl ? [event.featuredImage.node.sourceUrl] : [],
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

  return <EventDetailPageClient event={event} />;
}
