'use client';

import React, { useState } from 'react';
import { submitNewsletterAction } from '@/lib/actions/site/submitNewsletterAction';
import { FooterNewsletter } from '@/lib/actions/site/footerAction';

interface NewsletterProps {
    newsletter: FooterNewsletter;
}

export default function Newsletter({ newsletter }: NewsletterProps) {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !newsletter.formid) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('formId', newsletter.formid);

            const result = await submitNewsletterAction(formData);

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                setEmail('');
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setSubmitMessage('');
                }, 8000);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.message);
                setTimeout(() => {
                    setSubmitStatus('idle');
                    setSubmitMessage('');
                }, 8000);
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى لاحقاً.');
            setTimeout(() => {
                setSubmitStatus('idle');
                setSubmitMessage('');
            }, 8000);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!newsletter || !newsletter.title || !newsletter.formid) {
        return null;
    }

    return (
        <section className="bg-club-purple p-12 md:p-20 px-4 md:px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 border-40 border-white rounded-full" />
                <div className="absolute bottom-10 left-10 w-96 h-96 border-60 border-white rounded-full" />
            </div>

            <div className="container max-w-2xl mx-auto relative z-10 text-center text-white">
                <h2 className="text-4xl font-bold font-tajawal mb-6">
                    {newsletter.title}
                </h2>
                {newsletter.description && (
                    <p className="text-white/80 mb-10 text-lg">
                        {newsletter.description}
                    </p>
                )}

                {/* Success Message */}
                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-right backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <div className="shrink-0">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-green-800">تم الاشتراك بنجاح!</h3>
                                <p className="mt-1 text-sm text-green-700">{submitMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-right backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <div className="shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800">فشل في الاشتراك</h3>
                                <p className="mt-1 text-sm text-red-700">{submitMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="بريدك الإلكتروني"
                        required
                        className="flex-1 bg-white/20 border border-white/30 px-6 py-4 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-white text-club-purple px-10 py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'جاري الاشتراك...' : 'اشترك الآن'}
                    </button>
                </form>
            </div>
        </section>
    );
}
