'use client';

import React, { useState, useRef } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';
import { submitShareOpinionsAction } from '@/lib/actions/site/submitShareOpinionsAction';

interface ShareOpinionsFormProps {
    formId: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    participationType?: string;
    subject?: string;
    message?: string;
}

const participationTypes = [
    { label: 'اقتراح', value: 'اقتراح' },
    { label: 'ملاحظة', value: 'ملاحظة' },
    { label: 'شكوى', value: 'شكوى' },
    { label: 'استفسار', value: 'استفسار' },
];

const ratingOptions = [
    { label: '⭐ 1', value: '⭐ 1' },
    { label: '⭐⭐ 2', value: '⭐⭐ 2' },
    { label: '⭐⭐⭐ 3', value: '⭐⭐⭐ 3' },
    { label: '⭐⭐⭐⭐ 4', value: '⭐⭐⭐⭐ 4' },
    { label: '⭐⭐⭐⭐⭐ 5', value: '⭐⭐⭐⭐⭐ 5' },
];

export default function ShareOpinionsForm({ formId }: ShareOpinionsFormProps) {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        participationType: '',
        rating: 0,
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRatingClick = (rating: number) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'الرجاء إدخال الاسم الكامل';

        if (!formData.email.trim()) {
            newErrors.email = 'الرجاء إدخال البريد الإلكتروني';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
            }
        }

        if (!formData.participationType) newErrors.participationType = 'الرجاء اختيار نوع المشاركة';
        if (!formData.subject.trim()) newErrors.subject = 'الرجاء إدخال الموضوع';
        if (!formData.message.trim()) newErrors.message = 'الرجاء إدخال رسالتك';

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
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('participationType', formData.participationType);

            // Map star rating to CF7 select value
            if (formData.rating > 0) {
                const ratingValue = ratingOptions[formData.rating - 1]?.value || '';
                formDataToSend.append('rating', ratingValue);
            } else {
                formDataToSend.append('rating', '');
            }

            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('formId', formId);

            const result = await submitShareOpinionsAction(formDataToSend);

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    participationType: '',
                    rating: 0,
                    subject: '',
                    message: '',
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
            setSubmitMessage('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى لاحقاً.');
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                setSubmitStatus('idle');
                setSubmitMessage('');
            }, 8000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClass = 'w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all';
    const inputNormalClass = `${inputBaseClass} border-border focus:border-club-purple focus:ring-club-purple/5`;
    const inputErrorClass = `${inputBaseClass} border-red-400 focus:border-red-500 focus:ring-red-500/10`;

    return (
        <div ref={formRef} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-club-purple" size={32} />
                <h2 className="text-2xl font-bold text-primary">نموذج المشاركة</h2>
            </div>

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
                            <h3 className="text-sm font-medium text-green-800">تم إرسال رسالتك بنجاح!</h3>
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
                            <h3 className="text-sm font-medium text-red-800">فشل إرسال الرسالة</h3>
                            <p className="mt-1 text-sm text-red-700">{submitMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary px-1">
                            الاسم الكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="ادخل اسمك"
                            className={errors.fullName ? inputErrorClass : inputNormalClass}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1 px-1">{errors.fullName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary px-1">
                            البريد الإلكتروني <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@mail.com"
                            className={errors.email ? inputErrorClass : inputNormalClass}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        رقم الهاتف (اختياري)
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+971 XX XXX XXXX"
                        className={inputNormalClass}
                    />
                </div>

                {/* Participation Type */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        نوع المشاركة <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="participationType"
                        value={formData.participationType}
                        onChange={handleChange}
                        className={errors.participationType ? inputErrorClass : inputNormalClass}
                    >
                        <option value="">اختر نوع المشاركة</option>
                        {participationTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                    {errors.participationType && (
                        <p className="text-red-500 text-xs mt-1 px-1">{errors.participationType}</p>
                    )}
                </div>

                {/* Rating */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        تقييمك لخدماتنا (اختياري)
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleRatingClick(rating)}
                                className={`p-2 rounded-lg transition-all ${formData.rating >= rating
                                    ? 'text-club-purple bg-club-purple/10'
                                    : 'text-gray-300 hover:text-club-purple/50'
                                    }`}
                            >
                                <Star
                                    size={32}
                                    fill={formData.rating >= rating ? 'currentColor' : 'none'}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        الموضوع <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="موضوع رسالتك"
                        className={errors.subject ? inputErrorClass : inputNormalClass}
                    />
                    {errors.subject && (
                        <p className="text-red-500 text-xs mt-1 px-1">{errors.subject}</p>
                    )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        رسالتك <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="شاركنا آراءك، اقتراحاتك، أو أي ملاحظات..."
                        className={`${errors.message ? inputErrorClass : inputNormalClass} resize-none`}
                    />
                    {errors.message && (
                        <p className="text-red-500 text-xs mt-1 px-1">{errors.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-club-purple hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3 mt-8"
                >
                    {isSubmitting ? (
                        <span>جاري الإرسال...</span>
                    ) : (
                        <>
                            <span>إرسال الرسالة</span>
                            <Send size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
