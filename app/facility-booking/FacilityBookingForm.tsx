'use client';

import React, { useState, useRef } from 'react';
import { Calendar, Clock, Users, Building, Send } from 'lucide-react';
import { submitFacilityBookingAction } from '@/lib/actions/site/submitFacilityBookingAction';

interface FacilityBookingFormProps {
    formId: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    eventType?: string;
    requiredHall?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    expectedAttendance?: string;
}

const eventTypes = [
    { label: 'محاضرة', value: 'محاضرة' },
    { label: 'ورشة عمل', value: 'ورشة عمل' },
    { label: 'ندوة', value: 'ندوة' },
    { label: 'اجتماع', value: 'اجتماع' },
    { label: 'فعالية ثقافية', value: 'فعالية ثقافية' },
];

const hallOptions = [
    { label: 'القاعة الرئيسية', value: 'القاعة الرئيسية' },
    { label: 'قاعة الاجتماعات', value: 'قاعة الاجتماعات' },
    { label: 'المسرح', value: 'المسرح' },
    { label: 'قاعة متعددة الاستخدام', value: 'قاعة متعددة الاستخدام' },
];

const equipmentOptions = [
    { label: 'شاشة عرض', value: 'شاشة عرض' },
    { label: 'ميكروفونات', value: 'ميكروفونات' },
    { label: 'نظام صوتي', value: 'نظام صوتي' },
    { label: 'كاميرا تصوير', value: 'كاميرا تصوير' },
    { label: 'معدات عرض', value: 'معدات عرض' },
    { label: 'إنترنت عالي السرعة', value: 'إنترنت عالي السرعة' },
    { label: 'طاولات وكراسي إضافية', value: 'طاولات وكراسي إضافية' },
    { label: 'إضاءة خاصة', value: 'إضاءة خاصة' },
];

export default function FacilityBookingForm({ formId }: FacilityBookingFormProps) {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        membershipNumber: '',
        eventType: '',
        requiredHall: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        expectedAttendance: '',
        equipment: [] as string[],
        additionalServices: '',
        specialRequirements: '',
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

    const handleEquipmentToggle = (item: string) => {
        setFormData((prev) => ({
            ...prev,
            equipment: prev.equipment.includes(item)
                ? prev.equipment.filter((e) => e !== item)
                : [...prev.equipment, item],
        }));
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

        if (!formData.phone.trim()) newErrors.phone = 'الرجاء إدخال رقم الهاتف';
        if (!formData.eventType) newErrors.eventType = 'الرجاء اختيار نوع الفعالية';
        if (!formData.requiredHall) newErrors.requiredHall = 'الرجاء اختيار المرافق المطلوبة';
        if (!formData.eventDate) newErrors.eventDate = 'الرجاء تحديد تاريخ الفعالية';
        if (!formData.startTime) newErrors.startTime = 'الرجاء تحديد وقت البداية';
        if (!formData.endTime) newErrors.endTime = 'الرجاء تحديد وقت النهاية';
        if (!formData.expectedAttendance.trim()) newErrors.expectedAttendance = 'الرجاء إدخال العدد المتوقع';

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
            formDataToSend.append('membershipNumber', formData.membershipNumber);
            formDataToSend.append('eventType', formData.eventType);
            formDataToSend.append('requiredHall', formData.requiredHall);
            formDataToSend.append('eventDate', formData.eventDate);
            formDataToSend.append('startTime', formData.startTime);
            formDataToSend.append('endTime', formData.endTime);
            formDataToSend.append('expectedAttendance', formData.expectedAttendance);
            formDataToSend.append('equipment', formData.equipment.join(','));
            formDataToSend.append('additionalServices', formData.additionalServices);
            formDataToSend.append('specialRequirements', formData.specialRequirements);
            formDataToSend.append('formId', formId);

            const result = await submitFacilityBookingAction(formDataToSend);

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    membershipNumber: '',
                    eventType: '',
                    requiredHall: '',
                    eventDate: '',
                    startTime: '',
                    endTime: '',
                    expectedAttendance: '',
                    equipment: [],
                    additionalServices: '',
                    specialRequirements: '',
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
            <div className="flex items-center gap-3 mb-8">
                <Building className="text-club-purple" size={32} />
                <h2 className="text-2xl font-bold text-primary">نموذج حجز المرافق</h2>
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
                            <h3 className="text-sm font-medium text-green-800">تم إرسال طلب الحجز بنجاح!</h3>
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
                {/* Contact Information */}
                <div className="space-y-6 pb-6 border-b border-border">
                    <h3 className="text-xl font-bold text-primary">معلومات الاتصال</h3>

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
                                placeholder="ادخل اسمك الكامل"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary px-1">
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

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary px-1">
                                رقم العضوية (إن وجد)
                            </label>
                            <input
                                type="text"
                                name="membershipNumber"
                                value={formData.membershipNumber}
                                onChange={handleChange}
                                placeholder="رقم العضوية"
                                className={inputNormalClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="space-y-6 pb-6 border-b border-border">
                    <h3 className="text-xl font-bold text-primary">تفاصيل الفعالية</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                                <Building size={16} />
                                المرافق المطلوبة <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="requiredHall"
                                value={formData.requiredHall}
                                onChange={handleChange}
                                className={errors.requiredHall ? inputErrorClass : inputNormalClass}
                            >
                                <option value="">اختر المرافق</option>
                                {hallOptions.map((hall) => (
                                    <option key={hall.value} value={hall.value}>{hall.label}</option>
                                ))}
                            </select>
                            {errors.requiredHall && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.requiredHall}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary px-1">
                                نوع الفعالية <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                className={errors.eventType ? inputErrorClass : inputNormalClass}
                            >
                                <option value="">اختر نوع الفعالية</option>
                                {eventTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                            {errors.eventType && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.eventType}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                                <Calendar size={16} />
                                تاريخ الفعالية <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className={errors.eventDate ? inputErrorClass : inputNormalClass}
                            />
                            {errors.eventDate && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.eventDate}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                                <Clock size={16} />
                                وقت البداية <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className={errors.startTime ? inputErrorClass : inputNormalClass}
                            />
                            {errors.startTime && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.startTime}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                                <Clock size={16} />
                                وقت النهاية <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className={errors.endTime ? inputErrorClass : inputNormalClass}
                            />
                            {errors.endTime && (
                                <p className="text-red-500 text-xs mt-1 px-1">{errors.endTime}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary flex items-center gap-2 px-1">
                            <Users size={16} />
                            العدد المتوقع للحضور <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="expectedAttendance"
                            value={formData.expectedAttendance}
                            onChange={handleChange}
                            min="1"
                            placeholder="عدد الأشخاص"
                            className={errors.expectedAttendance ? inputErrorClass : inputNormalClass}
                        />
                        {errors.expectedAttendance && (
                            <p className="text-red-500 text-xs mt-1 px-1">{errors.expectedAttendance}</p>
                        )}
                    </div>
                </div>

                {/* Equipment & Services */}
                <div className="space-y-6 pb-6 border-b border-border">
                    <h3 className="text-xl font-bold text-primary">المعدات والخدمات</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary px-1">المعدات المطلوبة</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {equipmentOptions.map((item) => (
                                <label
                                    key={item.value}
                                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.equipment.includes(item.value)
                                        ? 'border-club-purple bg-club-purple/5'
                                        : 'border-border hover:border-club-purple hover:bg-club-purple/5'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.equipment.includes(item.value)}
                                        onChange={() => handleEquipmentToggle(item.value)}
                                        className="text-club-purple accent-club-purple"
                                    />
                                    <span className="text-sm">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-primary px-1">خدمات إضافية</label>
                        <textarea
                            name="additionalServices"
                            value={formData.additionalServices}
                            onChange={handleChange}
                            rows={3}
                            placeholder="أي خدمات إضافية مطلوبة (مثل: كافيه، ترجمة، تصوير...)"
                            className={`${inputNormalClass} resize-none`}
                        />
                    </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">متطلبات خاصة</label>
                    <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleChange}
                        rows={4}
                        placeholder="أي متطلبات خاصة أو ملاحظات إضافية..."
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
                            <span>إرسال طلب الحجز</span>
                            <Send size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
