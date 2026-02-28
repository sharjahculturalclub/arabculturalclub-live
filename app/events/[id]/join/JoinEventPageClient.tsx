"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { Calendar, MapPin, Clock, User, Mail, Phone, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { EventNode } from '@/lib/actions/site/eventsAction';

interface JoinEventPageClientProps {
    event: EventNode;
}

export function JoinEventPageClient({ event }: JoinEventPageClientProps) {
    const [submitting, setSubmitting] = useState(false);

    const mappedEvent = {
        id: event.eventId,
        title: event.title,
        date: event.eventOptions.eventDate,
        time: event.eventOptions.eventTime,
        location: event.eventOptions.eventLocation,
        description: event.content.replace(/<[^>]*>/g, '').substring(0, 160),
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        toast.success('تم استلام طلب الانضمام إلى الفعالية، سنتواصل معك لتأكيد الحجز.');
        setTimeout(() => setSubmitting(false), 2000);
    };

    return (
        <div className="pt-25 pb-25">
            <SEO title={`الانضمام إلى الفعالية: ${mappedEvent.title}`} description={mappedEvent.description} />

            <div className="container max-w-5xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href={`/events/${mappedEvent.id}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-club-purple mb-4"
                    >
                        <ArrowLeft size={16} />
                        <span>العودة إلى تفاصيل الفعالية</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-3">
                        الانضمام إلى الفعالية
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        يرجى تعبئة النموذج التالي لحجز مقعدك في هذه الفعالية.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Event summary */}
                    <div className="bg-white rounded-[1.75rem] border border-border shadow-md p-6 space-y-4">
                        <h2 className="text-xl font-bold text-primary mb-2 line-clamp-3">{mappedEvent.title}</h2>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-club-purple" />
                                <span>{mappedEvent.date}</span>
                            </div>
                            {mappedEvent.time && (
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-club-purple" />
                                    <span>{mappedEvent.time}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-club-purple" />
                                <span>{mappedEvent.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Join form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] border border-border shadow-lg p-8 md:p-10"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                                            <User size={16} />
                                            الاسم الكامل *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                                            placeholder="أدخل اسمك"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                                            <Mail size={16} />
                                            البريد الإلكتروني *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                                            placeholder="example@mail.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                                            <Phone size={16} />
                                            رقم الهاتف *
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                                            placeholder="+971 XX XXX XXXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                                            <Users size={16} />
                                            عدد الحضور المرافقين
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                                            placeholder="مثال: 1 أو 2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary">ملاحظات إضافية</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                                        placeholder="أي احتياجات خاصة أو استفسارات إضافية..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-club-purple hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3"
                                >
                                    <span>{submitting ? 'جاري الإرسال...' : 'تأكيد الانضمام للفعالية'}</span>
                                    <ArrowLeft size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
