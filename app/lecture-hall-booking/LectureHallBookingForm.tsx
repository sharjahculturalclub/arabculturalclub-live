'use client';

import React, { useState, useRef } from 'react';
import {
    User, Send, ShieldCheck, AlertCircle, FileKey, Calendar, CheckCircle, FileUp
} from 'lucide-react';
import { submitLectureHallBookingAction } from '@/lib/actions/site/submitLectureHallBookingAction';

interface LectureHallBookingFormProps {
    formId: string;
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = 'purple' }: { icon: any; title: string; color?: 'purple' | 'blue' | 'green' }) {
    const styles = {
        purple: 'bg-purple-600/10 text-purple-600',
        blue: 'bg-blue-600/10 text-blue-600',
        green: 'bg-emerald-600/10 text-emerald-600',
    };
    return (
        <div className="flex items-center gap-4 mb-8">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${styles[color]}`}>
                <Icon size={22} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <div className="flex-1 h-px bg-gray-100 ms-2" />
        </div>
    );
}

// ─── Field Wrapper ────────────────────────────────────────────────────────────
function Field({ label, required, children, hint, error }: { label: string; required?: boolean; children: React.ReactNode; hint?: string; error?: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-red-500 ms-1">*</span>}
            </label>
            {children}
            {error ? (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle size={11} strokeWidth={2.5} />
                    {error}
                </p>
            ) : hint ? (
                <p className="text-xs text-gray-400 font-medium mt-0.5">{hint}</p>
            ) : null}
        </div>
    );
}

// ─── Text Input ───────────────────────────────────────────────────────────────
const inputCls = (error?: string) =>
    `w-full h-12 px-4 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${error
        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15'
        : 'border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-purple-500/15'
    }`;

function TextInput({ label, name, required, minLength, maxLength, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input
                type="text"
                name={name}
                minLength={minLength}
                maxLength={maxLength}
                placeholder={placeholder}
                className={inputCls(error)}
            />
        </Field>
    );
}

function EmailInput({ label, name, required, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input
                type="email"
                name={name}
                placeholder={placeholder}
                dir="ltr"
                className={`${inputCls(error)} text-left`}
            />
        </Field>
    );
}

function TelInput({ label, name, required, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input
                type="tel"
                name={name}
                placeholder={placeholder}
                dir="ltr"
                className={`${inputCls(error)} text-left`}
            />
        </Field>
    );
}

function DateInput({ label, name, required, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input
                type="date"
                name={name}
                className={inputCls(error)}
            />
        </Field>
    );
}

function NumberInput({ label, name, required, min, max, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input
                type="number"
                name={name}
                min={min}
                max={max}
                placeholder={placeholder}
                className={inputCls(error)}
            />
        </Field>
    );
}

// ─── File Upload ──────────────────────────────────────────────────────────────
function FileUpload({ label, name, required, accept, hint, error }: any) {
    const [file, setFile] = useState<File | null>(null);

    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <div className="relative group cursor-pointer">
                <input
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full flex items-center gap-4 px-5 py-4 border-2 border-dashed rounded-2xl transition-all ${error
                    ? 'border-red-400 bg-red-50/30'
                    : file
                        ? 'border-purple-400 bg-purple-50/60'
                        : 'border-gray-200 bg-gray-50 group-hover:border-purple-300 group-hover:bg-purple-50/30'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${error ? 'bg-red-100 text-red-500' : file ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-400 group-hover:text-purple-500'
                        }`}>
                        {error ? <AlertCircle size={20} /> : file ? <CheckCircle size={20} /> : <FileUp size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        {file ? (
                            <>
                                <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs font-medium text-purple-600 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-gray-700 group-hover:text-purple-700 transition-colors">اختر ملفاً أو اسحبه هنا</p>
                                <p className="text-xs font-medium text-gray-400 mt-0.5 truncate">{accept}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Field>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LectureHallBookingForm({ formId }: LectureHallBookingFormProps) {
    const topRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const target = e.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        
        if (target.name && fieldErrors[target.name]) {
            setFieldErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[target.name];
                return newErrs;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('idle');
        setMessage('');

        // ── Client-side validation ──────────────────────────────────────────
        const form = e.currentTarget;
        const data = new FormData(form);
        const errs: Record<string, string> = {};

        const req = (key: string, label: string, minLen?: number) => {
            const val = (data.get(key) as string || '').trim();
            if (!val) { errs[key] = `${label} مطلوب`; return; }
            if (minLen && val.length < minLen) errs[key] = `يجب ألا يقل عن ${minLen} أحرف`;
        };

        // Main Fields
        req('applicant_name', 'اسم مقدم الطلب', 2);
        req('email', 'البريد الإلكتروني');
        req('identity_number', 'بطاقة هوية رقم', 5);
        req('mobile_number', 'الهاتف المتحرك');
        req('booking_purpose', 'الغرض من الحجز', 3);

        // Booking details
        if (!data.get('requested_hall')) errs['requested_hall'] = 'القاعة المطلوبة مطلوب';
        req('requested_days_count', 'عدد الأيام المطلوبة');
        req('from_time', 'من الساعة');
        req('to_time', 'إلى الساعة');
        if (!data.get('booking_period')) errs['booking_period'] = 'فترة الحجز مطلوب';
        req('booking_day', 'عن يوم');

        // Email format
        const emailVal = (data.get('email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['email'] = 'البريد الإلكتروني غير صحيح';

        // Files
        const signatureFile = data.get('applicant_signature') as File;
        if (!signatureFile || signatureFile.size === 0)
            errs['applicant_signature'] = 'يرجى رفع التوقيع';

        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            if (topRef.current) {
                const y = topRef.current.getBoundingClientRect().top + window.scrollY - 120;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData(form);
            formData.append('formId', formId);
            const result = await submitLectureHallBookingAction(formData);

            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setFieldErrors({});
                form.reset();
            } else {
                setStatus('error');
                setMessage(result.message);
                const errMap: Record<string, string> = {};
                for (const f of (result as any).invalidFields || []) {
                    if (f.field) errMap[f.field] = f.message || 'هذا الحقل يحتوي على خطأ';
                }
                setFieldErrors(errMap);
            }
        } catch {
            setStatus('error');
            setMessage('حدث خطأ غير متوقع. يرجى المحاولة مجدداً.');
        } finally {
            setIsSubmitting(false);
            if (topRef.current) {
                const y = topRef.current.getBoundingClientRect().top + window.scrollY - 120;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    return (
        <div ref={topRef} dir="rtl" className="w-full max-w-4xl mx-auto">

            {/* ── Status Banners ── */}
            {status === 'success' && (
                <div className="mb-6 flex items-start gap-4 p-5 bg-green-50 border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2 bg-green-100 rounded-xl shrink-0">
                        <ShieldCheck size={22} className="text-green-600" />
                    </div>
                    <div>
                        <p className="font-bold text-green-800">تم إرسال الطلب بنجاح!</p>
                        <p className="text-sm text-green-700 mt-1">{message}</p>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="mb-6 flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2 bg-red-100 rounded-xl shrink-0">
                        <AlertCircle size={22} className="text-red-600" />
                    </div>
                    <div>
                        <p className="font-bold text-red-800">فشل إرسال الطلب</p>
                        <p className="text-sm text-red-700 mt-1">{message}</p>
                    </div>
                </div>
            )}

            {/* ── Single Form Card ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm" suppressHydrationWarning>
                <form onSubmit={handleSubmit} onChange={handleChange} noValidate suppressHydrationWarning>

                    {/* ══ 1. Applicant Info ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={User} title="بيانات مقدم الطلب" color="purple" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="اسم مقدم الطلب" name="applicant_name" required minLength={2} maxLength={150} placeholder="اسم مقدم الطلب" error={fieldErrors['applicant_name']} />
                            <TextInput label="بطاقة هوية رقم" name="identity_number" required minLength={5} maxLength={30} placeholder="بطاقة هوية رقم" error={fieldErrors['identity_number']} />
                            <EmailInput label="البريد الإلكتروني" name="email" required placeholder="example@mail.com" error={fieldErrors['email']} />
                            <TelInput label="الهاتف المتحرك" name="mobile_number" required placeholder="+971 5X XXX XXXX" error={fieldErrors['mobile_number']} />
                        </div>
                        <div className="mt-5">
                            <TextInput label="الغرض من الحجز" name="booking_purpose" required minLength={3} maxLength={250} placeholder="أدخل الغرض من الحجز" error={fieldErrors['booking_purpose']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Booking Details ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={Calendar} title="تفاصيل الحجز" color="blue" />
                        
                        <Field label="القاعة المطلوبة" required error={fieldErrors['requested_hall']}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
                                {[
                                    { value: 'قاعة المناسبات', label: 'قاعة المناسبات' },
                                    { value: 'قاعة المحاضرات', label: 'قاعة المحاضرات' },
                                    { value: 'القاعة الدائرية', label: 'القاعة الدائرية' },
                                    { value: 'أخرى', label: 'أخرى' },
                                ].map(({ value, label }) => (
                                    <label key={value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 has-checked:border-blue-500 has-checked:bg-blue-50 transition-all">
                                        <div className="relative w-5 h-5 shrink-0">
                                            <input type="radio" name="requested_hall" value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-blue-600 transition-all" />
                                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{label}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                            <NumberInput label="عدد الأيام المطلوبة" name="requested_days_count" min={1} max={30} required placeholder="مثال: 3" error={fieldErrors['requested_days_count']} />
                            <DateInput label="عن يوم" name="booking_day" required error={fieldErrors['booking_day']} />
                        </div>
                        
                        <Field label="فترة الحجز" required error={fieldErrors['booking_period']}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                {['صباحا', 'مساء'].map((value) => (
                                    <label key={value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 has-checked:border-blue-500 has-checked:bg-blue-50 transition-all">
                                        <div className="relative w-5 h-5 shrink-0">
                                            <input type="radio" name="booking_period" value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-blue-600 transition-all" />
                                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{value}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                            <TextInput label="من الساعة" name="from_time" required placeholder="00:00" error={fieldErrors['from_time']} />
                            <TextInput label="إلى الساعة" name="to_time" required placeholder="00:00" error={fieldErrors['to_time']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 3. Terms & Signature ════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-6">
                        <SectionHeader icon={FileKey} title="شروط الحجز والتوقيع" color="green" />

                        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-emerald-900 text-sm leading-relaxed text-justify">
                            تشمل الشروط استخدام القاعة المخصصة فقط، خصم التلفيات من مبلغ التأمين 2000 درهم،وفرض 500 درهم عن كل ساعة تأخير.
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            <FileUpload label="توقيع مقدم الطلب" name="applicant_signature" required accept=".png,.jpg,.jpeg,.webp,.pdf" hint="يجب ان يكون الحجم اقل من 5 ميجابايت" error={fieldErrors['applicant_signature']} />
                        </div>
                    </div>

                    {/* ══ 4. Submit Area ═══════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 bg-gray-50/80 border-t border-gray-100 rounded-b-3xl">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-purple-600/20 active:scale-[0.98] py-4 text-base"
                        >
                            {isSubmitting ? (
                                <span className="opacity-90">جاري الإرسال...</span>
                            ) : (
                                <>
                                    <span>إرسال الطلب</span>
                                    <Send size={18} strokeWidth={2.5} className="rotate-180" />
                                </>
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
