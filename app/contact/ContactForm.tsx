'use client';

import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { submitContactFormAction } from '@/lib/actions/site/submitContactFormAction';

interface ContactFormProps {
    formId: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export default function ContactForm({ formId }: ContactFormProps) {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

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

        if (!formData.subject.trim()) {
            newErrors.subject = 'الرجاء إدخال الموضوع';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'الرجاء إدخال الرسالة';
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
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('subject', formData.subject);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('formId', formId);

            const result = await submitContactFormAction(formDataToSend);

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setFormData({
                    name: '',
                    email: '',
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

    return (
        <div ref={formRef} className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-border shadow-lg">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary px-1">
                            الاسم بالكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="أدخل اسمك"
                            className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all ${errors.name
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                                : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 px-1">{errors.name}</p>
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

                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        الموضوع <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="كيف يمكننا مساعدتك؟"
                        className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all ${errors.subject
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                            }`}
                    />
                    {errors.subject && (
                        <p className="text-red-500 text-xs mt-1 px-1">{errors.subject}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">
                        الرسالة <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="اكتب رسالتك هنا .."
                        className={`w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all resize-none ${errors.message
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-border focus:border-club-purple focus:ring-club-purple/5'
                            }`}
                    />
                    {errors.message && (
                        <p className="text-red-500 text-xs mt-1 px-1">{errors.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-club-purple hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3"
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
