'use client';

import React, { useState } from 'react';
import { submitNewsletterAction } from '@/lib/actions/site/submitNewsletterAction';

interface SidebarNewsletterProps {
    title: string;
    description: string;
    formId: string;
}

export function SidebarNewsletter({ title, description, formId }: SidebarNewsletterProps) {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim() || !formId) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('formId', formId);

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

    return (
        <div className="bg-club-purple rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">{title || 'كن أول من يعلم'}</h3>
                {description && (
                    <p className="text-white/80 mb-6 text-sm">
                        {description}
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

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="بريدك الإلكتروني"
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-club-blue"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-club-purple font-bold py-3 rounded-xl hover:bg-club-blue hover:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'جاري الاشتراك...' : 'اشترك الآن'}
                    </button>
                </form>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-club-blue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
    );
}
