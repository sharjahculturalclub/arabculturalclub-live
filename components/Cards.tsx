"use client";

import React from 'react';
import { Calendar, MapPin, ArrowLeft, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { ImageWithFallback } from './figma/ImageWithFallback';

export const EventCard = ({ event }: { event: any }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-card rounded-2xl overflow-hidden border border-border group flex flex-col h-full shadow-sm hover:shadow-md transition-all"
  >
    <div className="relative h-56 overflow-hidden">
      <ImageWithFallback
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 right-4 bg-club-purple text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
        {event.category}
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <Link href={`/events/${event.id}`}>
        <h3 className="text-xl font-bold mb-4 group-hover:text-club-purple transition-colors line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>
      </Link>
      <div className="flex flex-col gap-3 text-muted-foreground text-sm mb-8">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-club shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-club shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </div>
      <div className="mt-auto">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-club-purple font-bold hover:gap-3 transition-all border-b-2 border-transparent hover:border-club-purple pb-1"
        >
          <span>سجل الآن</span>
          <ArrowLeft size={18} />
        </Link>
      </div>
    </div>
  </motion.div>
);

export const NewsCard = ({ news }: { news: any }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-card rounded-2xl overflow-hidden border border-border group flex flex-col h-full shadow-sm hover:shadow-md transition-all"
  >
    <Link href={`/news/${news.id}`} className="relative h-60 overflow-hidden block">
      <ImageWithFallback
        src={news.image}
        alt={news.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-tl-xl text-xs font-bold text-club-purple">
        {news.category}
      </div>
    </Link>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-club-blue" />
          <span>{news.date}</span>
        </div>
      </div>

      <Link href={`/news/${news.id}`} className="block">
        <h3 className="text-xl font-bold mb-3 group-hover:text-club-purple transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
          {news.title}
        </h3>
      </Link>

      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
        {news.excerpt}
      </p>

      <div className="mt-auto">
        <Link
          href={`/news/${news.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-club-purple group/btn"
        >
          <span className="border-b-2 border-transparent group-hover/btn:border-club-purple transition-all pb-1">اقرأ المزيد</span>
          <ArrowLeft size={16} className="transition-transform group-hover/btn:-translate-x-1" />
        </Link>
      </div>
    </div>
  </motion.div>
);
