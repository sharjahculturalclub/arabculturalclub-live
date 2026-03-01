'use client';

import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Send } from 'lucide-react';
import { submitMembershipFormAction } from '@/lib/actions/site/submitMembershipFormAction';

interface MembershipFormProps {
    formId: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
}

const interestsOptions = [
    { label: 'الموسيقى', value: 'الموسيقى' },
    { label: 'المسرح', value: 'المسرح' },
    { label: 'الفنون والخط العربي', value: 'الفنون والخط العربي' },
    { label: 'الأدب والشعر', value: 'الأدب والشعر' },
    { label: 'الترجمة', value: 'الترجمة' },
    { label: 'المناظرة', value: 'المناظرة' },
    { label: 'الفلسفة والفكر', value: 'الفلسفة والفكر' },
    { label: 'التراث والثقافة', value: 'التراث والثقافة' },
];

const membershipTypes = [
    { label: 'عضوية عادية', value: 'عضوية عادية' },
    { label: 'عضوية شرفية', value: 'عضوية شرفية' },
];

export default function MembershipForm({ formId }: MembershipFormProps) {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        profession: '',
        membershipType: 'عضوية عادية',
        interests: [] as string[],
        additionalInfo: '',
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

    const handleInterestToggle = (interest: string) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'الرجاء إدخال الاسم الكامل';
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
            formDataToSend.append('dateOfBirth', formData.dateOfBirth);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('profession', formData.profession);
            formDataToSend.append('membershipType', formData.membershipType);
            formDataToSend.append('interests', formData.interests.join(','));
            formDataToSend.append('additionalInfo', formData.additionalInfo);
            formDataToSend.append('formId', formId);

            const result = await submitMembershipFormAction(formDataToSend);

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    dateOfBirth: '',
                    address: '',
                    profession: '',
                    membershipType: 'عضوية عادية',
                    interests: [],
                    additionalInfo: '',
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

    const inputBaseClass = 'w-full bg-secondary/10 border rounded-xl px-5 py-4 focus:outline-none focus:ring-4 transition-all';
    const inputNormalClass = `${inputBaseClass} border-border focus:border-club-purple focus:ring-club-purple/5`;
    const inputErrorClass = `${inputBaseClass} border-red-400 focus:border-red-500 focus:ring-red-500/10`;

    return (
        <div ref={formRef} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-border">
            <h2 className="text-2xl font-bold mb-8 text-primary border-r-4 border-club-purple pr-4">
                نموذج التسجيل
            </h2>

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
                            <h3 className="text-sm font-medium text-green-800">تم إرسال طلب العضوية بنجاح!</h3>
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
                {/* Personal Information */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-primary mb-4">المعلومات الشخصية</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2">
                                <Mail size={16} />
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

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2">
                                <User size={16} />
                                الاسم الكامل <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="أدخل اسمك الكامل"
                                className={errors.fullName ? inputErrorClass : inputNormalClass}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.fullName}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2">
                                <Calendar size={16} />
                                تاريخ الميلاد
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={inputNormalClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2">
                                <Phone size={16} />
                                رقم الهاتف <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+971 XX XXX XXXX"
                                className={errors.phone ? inputErrorClass : inputNormalClass}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                            <MapPin size={16} />
                            العنوان
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="العنوان الكامل"
                            className={inputNormalClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary flex items-center gap-2">
                            <Briefcase size={16} />
                            المهنة
                        </label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            placeholder="المهنة أو التخصص"
                            className={inputNormalClass}
                        />
                    </div>
                </div>

                {/* Membership Type */}
                <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xl font-bold text-primary mb-4">نوع العضوية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {membershipTypes.map((type) => (
                            <label
                                key={type.value}
                                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.membershipType === type.value
                                    ? 'border-club-purple bg-club-purple/5'
                                    : 'border-border hover:border-club-purple'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="membershipType"
                                    value={type.value}
                                    checked={formData.membershipType === type.value}
                                    onChange={handleChange}
                                    className="text-club-purple accent-club-purple"
                                />
                                <span className="font-bold">{type.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Interests */}
                <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xl font-bold text-primary mb-4">مجالات الاهتمام</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {interestsOptions.map((interest) => (
                            <label
                                key={interest.value}
                                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.interests.includes(interest.value)
                                    ? 'border-club-purple bg-club-purple/5'
                                    : 'border-border hover:border-club-purple hover:bg-club-purple/5'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.interests.includes(interest.value)}
                                    onChange={() => handleInterestToggle(interest.value)}
                                    className="text-club-purple accent-club-purple"
                                />
                                <span className="text-sm">{interest.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 pt-6 border-t border-border">
                    <h3 className="text-xl font-bold text-primary mb-4">معلومات إضافية</h3>
                    <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={4}
                        placeholder="أي معلومات إضافية ترغب في مشاركتها..."
                        className={`${inputNormalClass} resize-none`}
                    />
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
                            <span>إرسال طلب العضوية</span>
                            <Send size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
