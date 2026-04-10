"use client";

import React from "react";
import Link from "next/link";

import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  Clock,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleOff,
  WandSparkles,
} from "lucide-react";
import { EventNode } from "@/lib/actions/site/eventsAction";
import { normalizeImageUrl } from "@/lib/utils/url";

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${ARABIC_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface EventDetailPageClientProps {
  event: EventNode;
}

export function EventDetailPageClient({ event }: EventDetailPageClientProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const startDate = formatDate(event.eventOptions.eventStartDateAndTime);
  const endDate = formatDate(event.eventOptions.eventEndDateAndTime);
  const startTime = formatTime(event.eventOptions.eventStartDateAndTime);
  const endTime = formatTime(event.eventOptions.eventEndDateAndTime);

  const dateLabel =
    startDate && endDate && startDate !== endDate
      ? `${startDate} – ${endDate}`
      : startDate;
  const timeLabel =
    startTime && endTime && startTime !== endTime
      ? `${startTime} – ${endTime}`
      : startTime;

  const isOnline = event.eventOptions.eventAttendanceMode?.includes("Online");
  const isOffline = event.eventOptions.eventAttendanceMode?.includes("Offline");
  const attendanceModeLabel =
    isOnline && isOffline
      ? "حضوري وأونلاين"
      : isOnline
        ? "أونلاين"
        : isOffline
          ? "حضوري"
          : null;

  const mappedEvent = {
    id: event.eventId,
    title: event.title,
    dateLabel,
    timeLabel,
    location: event.eventOptions.eventLocation,
    attendanceModeLabel,
    isOnline,
    category: event.categories?.nodes[0]?.name || "عام",
    image: normalizeImageUrl(event.featuredImage?.node.sourceUrl || ""),
    description: event.content,
    registrationHeading: event.eventOptions.eventRegistrationBlockHeading,
    registrationDescription:
      event.eventOptions.eventRegistrationBlockDescription,
    registrationText: "سجل الآن",
    registrationLink: event.eventOptions.registerButtonLink?.startsWith("http")
      ? event.eventOptions.registerButtonLink
      : `/events/${event.eventId}/join`,
  };

  const gallery = [mappedEvent.image];
  const hasSlider = gallery.length > 1;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="pt-25 pb-25 bg-gradient-to-b from-club-purple/[0.06] via-background to-background">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-16 md:mt-20 mb-8 md:mb-10"
        >
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/90 px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-club-purple/35 hover:text-club-purple"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span>العودة إلى الفعاليات</span>
          </Link>

          <div className="mt-6 md:mt-8 flex flex-col items-start w-fit ml-auto text-right md:max-w-4xl ">
            <span className="inline-flex items-center gap-2 rounded-full bg-club-purple/12 px-3.5 py-1 text-xs font-bold text-club-purple ring-1 ring-club-purple/15">
              <WandSparkles size={14} className="opacity-90" />
              {mappedEvent.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-primary md:text-4xl lg:text-[2.5rem] md:leading-[1.15]">
              {mappedEvent.title}
            </h1>
            <span
              className="mt-4 h-1 w-16 rounded-full bg-club-purple md:mr-0 md:ml-auto"
              aria-hidden
            />
          </div>
        </motion.header>

        {/* Main: content (wide) + gallery (narrow) */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-10 overflow-hidden rounded-[2rem] border border-border/80 bg-white shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.03]"
        >
          <div className="flex flex-col md:flex-row min-h-[520px]">
            {/* Content — 66% width */}
            <div className="flex flex-col justify-center border-border/60 p-6 text-right sm:p-8 md:border-e md:p-10 lg:p-12 md:w-[66%]">
              <div
                className="prose prose-p:text-muted-foreground prose-headings:text-primary max-w-none space-y-4 text-base leading-relaxed md:text-lg md:leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: mappedEvent.description }}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {mappedEvent.dateLabel && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border/70 p-1 transition-colors ">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl  text-club-purple">
                      <Calendar size={20} strokeWidth={1.75} />
                    </span>
                    <p className="mt-1 text-sm font-semibold leading-snug text-primary">
                      {mappedEvent.dateLabel}
                    </p>
                  </div>
                )}
                {mappedEvent.timeLabel && (
                  <div className="flex items-center gap-2 rounded-2xl border border-border/70 p-1 transition-colors ">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl  text-club-blue">
                      <Clock size={20} strokeWidth={1.75} />
                    </span>
                    <p className="text-sm font-semibold leading-snug text-primary">
                      {mappedEvent.timeLabel}
                    </p>
                  </div>
                )}
                {mappedEvent.location && (
                  <div className="flex items-center gap-2 rounded-2xl border border-border/70 p-1 transition-colors sm:col-span-2">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl  text-club-purple">
                      <MapPin size={20} strokeWidth={1.75} />
                    </span>
                    <p className="text-sm font-semibold leading-snug text-primary">
                      {mappedEvent.location}
                    </p>
                  </div>
                )}
                {mappedEvent.attendanceModeLabel && (
                  <div className="flex items-center gap-2 rounded-2xl border border-border/70 p-1 transition-colors ">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl  text-club-purple">
                      {mappedEvent.isOnline ? (
                        <Circle size={20} strokeWidth={1.75} />
                      ) : (
                        <CircleOff size={20} strokeWidth={1.75} />
                      )}
                    </span>
                    <p className="mt-1 text-sm font-semibold leading-snug text-primary">
                      {mappedEvent.attendanceModeLabel}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-2xl border border-border/70 p-1 transition-colors ">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl  text-club-blue">
                    <Tag size={20} strokeWidth={1.75} />
                  </span>
                  <p className="mt-1 text-sm font-semibold leading-snug text-primary">
                    {mappedEvent.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery — 33% width */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-secondary/50 via-club-purple/[0.07] to-club-blue/[0.06] p-6 min-h-[320px] md:p-8 md:w-[34%] md:min-h-0">
              <div className="relative w-full max-w-[280px] md:max-w-none">
                <div
                  className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-club-purple/20 to-club-blue/15 blur-2xl opacity-70"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-2xl shadow-club-purple/10 ring-1 ring-black/5">
                  <div className="aspect-[4/5] w-full">
                    <ImageWithFallback
                      src={gallery[currentIndex]}
                      alt={mappedEvent.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {hasSlider && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-primary shadow-lg backdrop-blur-sm transition hover:bg-white md:right-6"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-primary shadow-lg backdrop-blur-sm transition hover:bg-white md:left-6"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2">
                    {gallery.map((img: string, index: number) => (
                      <button
                        key={img + index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-6 bg-white shadow-sm"
                            : "w-2.5 bg-white/45"
                        }`}
                        aria-label={`صورة رقم ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="relative overflow-hidden rounded-[2rem] border border-club-purple/20 bg-gradient-to-l from-club-purple/[0.12] via-white to-club-blue/[0.08] p-8 shadow-lg md:p-10"
        >
          <div
            className="pointer-events-none absolute -start-20 top-0 h-40 w-40 rounded-full bg-club-purple/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -end-16 bottom-0 h-32 w-32 rounded-full bg-club-blue/20 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col items-stretch gap-8 md:flex-row md:items-center md:justify-between">
            <div className="text-right md:max-w-xl md:flex-1">
              <h2 className="text-2xl font-bold text-primary md:text-3xl">
                {mappedEvent.registrationHeading || "سجّل حضورك في الفعالية"}
              </h2>
              <p className="mt-3 text-muted-foreground md:text-lg">
                {mappedEvent.registrationDescription ||
                  "لحجز مقعدك أو الاستفسار عن تفاصيل إضافية، يمكنك التواصل مع فريق النادي عبر نموذج الاتصال."}
              </p>
            </div>
            <Link
              href={mappedEvent.registrationLink}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-club-purple px-8 py-4 text-base font-bold text-white shadow-lg shadow-club-purple/25 transition hover:bg-club-purple/90 hover:shadow-xl hover:shadow-club-purple/20"
            >
              <span>{mappedEvent.registrationText}</span>
              <ArrowLeft size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
