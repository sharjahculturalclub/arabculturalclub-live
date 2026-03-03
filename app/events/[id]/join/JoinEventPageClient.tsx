"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { Calendar, MapPin, Clock, User, Mail, Phone, Users, ArrowLeft } from 'lucide-react';
import { EventNode } from '@/lib/actions/site/eventsAction';
import { submitJoinEventAction } from '@/lib/actions/site/submitJoinEventAction';

const FORM_ID = '434';

interface JoinEventPageClientProps {
    event: EventNode;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    attendees?: string;
}

export function JoinEventPageClient({ event }: JoinEventPageClientProps) {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        attendees: '',
        info: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const mappedEvent = {
        id: event.eventId,
        title: event.title,
        date: event.eventOptions.eventDate,
        time: event.eventOptions.eventTime,
        location: event.eventOptions.eventLocation,
        description: event.content.replace(/<[^>]*>/g, '').substring(0, 160),
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'الرجاء إدخال الاسم بالكامل';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'الرجاء إدخال البريد الإلكتروني';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
            }
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'الرجاء إدخال رقم الهاتف';
        }

        if (formData.attendees && (Number(formData.attendees) < 1 || Number(formData.attendees) > 10)) {
            newErrors.attendees = 'عدد المرافقين يجب أن يكون بين 1 و 10';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('your-name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('attendees', formData.attendees);
            formDataToSend.append('info', formData.info);
            formDataToSend.append('event_name', mappedEvent.title);
            formDataToSend.append('event_date', mappedEvent.date || '');
            formDataToSend.append('event_time', mappedEvent.time || '');
            formDataToSend.append('event_location', mappedEvent.location || '');
            formDataToSend.append('formId', FORM_ID);

            const result = await submitJoinEventAction(formDataToSend);

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    attendees: '',
                    info: '',
                });
                setErrors({});
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setSubmitMessage('');
                }, 8000);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.message);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setSubmitMessage('');
                }, 8000);
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى لاحقاً.');
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                setSubmitStatus('idle');
                setSubmitMessage('');
            }, 8000);
        } finally {
            setIsSubmitting(false);
        }
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
                    {/* Event summary card */}
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
                    <div className="lg:col-span-2" ref={formRef}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] border border-border shadow-lg p-8 md:p-10"
                        >
                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-right">
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0">
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-green-800">تم تسجيل طلبك بنجاح!</h3>
                                            <p className="mt-1 text-sm text-green-700">{submitMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-right">
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0">
                                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-red-800">فشل إرسال الطلب</h3>
                                            <p className="mt-1 text-sm text-red-700">{submitMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary px-1 flex items-center gap-2">
                                            <User size={16} />
                                            الاسم الكامل <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="ادخل اسمك"
                                            className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all ${errors.name
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1 px-1">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary px-1 flex items-center gap-2">
                                            <Mail size={16} />
                                            البريد الإلكتروني <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@mail.com"
                                            className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all ${errors.email
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary px-1 flex items-center gap-2">
                                            <Phone size={16} />
                                            رقم الهاتف <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+971 XX XXX XXXX"
                                            className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all ${errors.phone
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                                                }`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1 px-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Attendees */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary px-1 flex items-center gap-2">
                                            <Users size={16} />
                                            عدد الحضور المرافقين
                                        </label>
                                        <input
                                            type="number"
                                            name="attendees"
                                            value={formData.attendees}
                                            onChange={handleChange}
                                            min={1}
                                            max={10}
                                            placeholder="مثال: 1 أو 2"
                                            className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all ${errors.attendees
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                                : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                                                }`}
                                        />
                                        {errors.attendees && (
                                            <p className="text-red-500 text-xs mt-1 px-1">{errors.attendees}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary px-1">ملاحظات إضافية</label>
                                    <textarea
                                        name="info"
                                        value={formData.info}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="أي احتياجات خاصة أو استفسارات إضافية..."
                                        className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-club-purple hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? (
                                        <span>جاري الإرسال...</span>
                                    ) : (
                                        <>
                                            <span>تأكيد الانضمام للفعالية</span>
                                            <ArrowLeft size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
