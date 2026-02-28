import type { Metadata } from "next";
import { fetchEventById } from "@/lib/actions/site/eventsAction";
import { JoinEventPageClient } from "./JoinEventPageClient";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface JoinEventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JoinEventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return {
      title: "الفعالية غير موجودة | النادي الثقافي العربي",
    };
  }

  return {
    title: `الانضمام إلى ${event.title} | النادي الثقافي العربي`,
  };
}

export default async function JoinEventPage({ params }: JoinEventPageProps) {
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

  return <JoinEventPageClient event={event} />;
}
