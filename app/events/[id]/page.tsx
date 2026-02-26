"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Calendar, MapPin, Tag, ArrowLeft, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { events } from '../page';

export default function EventDetail() {
  const { id } = useParams() as { id: string };
  const eventId = Number(id);
  const event = events.find((e) => e.id === eventId);

  const [currentIndex, setCurrentIndex] = React.useState(0);

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

  const gallery: any[] =
    Array.isArray(event.images) && event.images.length > 0 ? event.images : [event.image];
  const hasSlider = gallery.length > 1;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="pt-25 pb-25">
      <SEO title={event.title} description={event.description} />

      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="mb-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-club-purple mb-4"
          >
            <ArrowLeft size={16} />
            <span>العودة إلى الفعاليات</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-3">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-club-purple" />
              <span>{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-club-purple" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-club-purple" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-club-purple" />
              <span>{event.category}</span>
            </div>
          </div>
        </div>

        {/* Content + Gallery */}
        <div className="bg-white rounded-[2rem] border border-border shadow-lg overflow-hidden mb-10">
          <div className="relative h-64 md:h-96">
            <ImageWithFallback
              src={gallery[currentIndex]}
              alt={event.title}
              className="w-full h-full object-cover"
            />

            {hasSlider && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-colors"
                  aria-label="الصورة السابقة"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-colors"
                  aria-label="الصورة التالية"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                  {gallery.map((img: string, index: number) => (
                    <button
                      key={img + index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      aria-label={`صورة رقم ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="p-8 md:p-10 text-right space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {event.description}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              ندعوكم للحضور والمشاركة في هذه الفعالية المميزة التي تجمع بين المتعة والمعرفة، في أجواء ثقافية
              راقية داخل النادي الثقافي العربي.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-l from-club-purple/10 to-club-blue/10 rounded-[2rem] border border-club-purple/20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-right space-y-2">
            <h2 className="text-2xl font-bold text-primary">سجّل حضورك في الفعالية</h2>
            <p className="text-muted-foreground">
              لحجز مقعدك أو الاستفسار عن تفاصيل إضافية، يمكنك التواصل مع فريق النادي عبر نموذج الاتصال.
            </p>
          </div>
          <Link
            href={`/events/${event.id}/join`}
            className="inline-flex items-center gap-2 bg-club-purple hover:bg-opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
          >
            <span>سجل الآن</span>
            <ArrowLeft size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

