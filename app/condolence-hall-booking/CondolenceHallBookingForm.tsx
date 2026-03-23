'use client';

import React, { useState, useRef } from 'react';
import {
    User, Send, ShieldCheck, AlertCircle, Calendar, CheckCircle, FileUp
} from 'lucide-react';
import { submitCondolenceHallBookingAction } from '@/lib/actions/site/submitCondolenceHallBookingAction';

interface CondolenceHallBookingFormProps {
    formId: string;
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = 'purple' }: { icon: any; title: string; color?: 'purple' | 'blue' | 'green' | 'amber' }) {
    const styles = {
        purple: 'bg-purple-600/10 text-purple-600',
        blue: 'bg-blue-600/10 text-blue-600',
        green: 'bg-emerald-600/10 text-emerald-600',
        amber: 'bg-amber-600/10 text-amber-600',
    };
    return (
        <div className="flex items-center gap-4 mb-8">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${styles[color as keyof typeof styles]}`}>
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

function TimeInput({ label, name, required, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input
                type="time"
                name={name}
                placeholder={placeholder}
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
export default function CondolenceHallBookingForm({ formId }: CondolenceHallBookingFormProps) {
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

        // Booking Info
        req('booking_day', 'عن يوم');
        req('booking_duration_days', 'أيام اعتباراً من يوم');
        req('booking_start_date', 'الموافق');
        req('booking_end_date', 'وحتى يوم الموافق');
        req('booking_start_time', 'من الساعة');
        req('booking_end_time', 'إلى الساعة');

        // Personal Info
        req('renter_name', 'الاسم', 2);
        req('email', 'البريد الإلكتروني');
        req('id_card_number', 'رقم بطاقة الهوية', 5);
        req('phone_number', 'رقم الهاتف');
        req('mobile_number', 'رقم الهاتف المتحرك');
        
        // Deceased Details
        req('deceased_name', 'اسم المتوفي', 2);
        req('deceased_nationality', 'الجنسية', 2);
        if (!data.get('deceased_location')) errs['deceased_location'] = 'مكان الإقامة مطلوب';
        req('relationship_to_renter', 'صلة القرابة למستأجر القاعة', 2);

        // Email format
        const emailVal = (data.get('email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['email'] = 'البريد الإلكتروني غير صحيح';

        // Files
        const idCardCopyFile = data.get('id_card_copy') as File;
        if (!idCardCopyFile || idCardCopyFile.size === 0)
            errs['id_card_copy'] = 'يرجى رفع صورة الهوية';


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
            const result = await submitCondolenceHallBookingAction(formData);

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

                    {/* ══ 1. Booking Info ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={Calendar} title="بيانات الحجز" color="blue" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DateInput label="عن يوم" name="booking_day" required error={fieldErrors['booking_day']} />
                            <NumberInput label="أيام اعتباراً من يوم" name="booking_duration_days" min={1} max={20} required placeholder="عدد الأيام" error={fieldErrors['booking_duration_days']} />
                            <DateInput label="الموافق" name="booking_start_date" required error={fieldErrors['booking_start_date']} />
                            <DateInput label="وحتى يوم الموافق" name="booking_end_date" required error={fieldErrors['booking_end_date']} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 border-t border-gray-50 pt-8">
                            <TimeInput label="من الساعة" name="booking_start_time" required error={fieldErrors['booking_start_time']} />
                            <TimeInput label="إلى الساعة" name="booking_end_time" required error={fieldErrors['booking_end_time']} />
                            <NumberInput label="مقابل مبلغ وقدره (درهم)" name="booking_fee" placeholder="المبلغ (اختياري)" error={fieldErrors['booking_fee']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Renter Info ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={User} title="البيانات الشخصية لمستأجر القاعة" color="purple" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="الاسم" name="renter_name" required minLength={2} maxLength={150} placeholder="اسم المستأجر" error={fieldErrors['renter_name']} />
                            <EmailInput label="البريد الإلكتروني" name="email" required placeholder="example@mail.com" error={fieldErrors['email']} />
                            <TextInput label="رقم بطاقة الهوية" name="id_card_number" required minLength={5} maxLength={30} placeholder="بطاقة الهوية" error={fieldErrors['id_card_number']} />
                            <TelInput label="رقم الهاتف" name="phone_number" required placeholder="الهاتف الثابت" error={fieldErrors['phone_number']} />
                            <TelInput label="رقم الهاتف المتحرك" name="mobile_number" required placeholder="+971 5X XXX XXXX" error={fieldErrors['mobile_number']} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                            <TextInput label="الوظيفة" name="occupation" maxLength={120} placeholder="الوظيفة (اختياري)" error={fieldErrors['occupation']} />
                            <TextInput label="جهة العمل" name="employer" maxLength={150} placeholder="جهة العمل (اختياري)" error={fieldErrors['employer']} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                            <FileUpload label="صورة عن بطاقة الهوية" name="id_card_copy" required accept=".pdf,.jpg,.jpeg,.png,.webp" hint="PDF أو صور بحجم أقصى 5MB" error={fieldErrors['id_card_copy']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 3. Deceased Info ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={ShieldCheck} title="بيانات المتوفي" color="amber" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="اسم المتوفي" name="deceased_name" required minLength={2} maxLength={150} placeholder="اسم المتوفي" error={fieldErrors['deceased_name']} />
                            <TextInput label="الجنسية" name="deceased_nationality" required minLength={2} maxLength={80} placeholder="الجنسية" error={fieldErrors['deceased_nationality']} />
                        </div>

                        <div className="space-y-5">
                            <Field label="داخل / خارج الدولة" required error={fieldErrors['deceased_location']}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                    {['داخل الدولة', 'خارج الدولة'].map((value) => (
                                        <label key={value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-amber-400 hover:bg-amber-50/40 has-checked:border-amber-500 has-checked:bg-amber-50 transition-all">
                                            <div className="relative w-5 h-5 shrink-0">
                                                <input type="radio" name="deceased_location" value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-amber-600 transition-all" />
                                                <div className="w-2.5 h-2.5 bg-amber-600 rounded-full absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{value}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </Field>

                            <TextInput label="صلة القرابة لمستأجر القاعة" name="relationship_to_renter" required minLength={2} maxLength={100} placeholder="صلة القرابة" error={fieldErrors['relationship_to_renter']} />
                        </div>
                    </div>



                    {/* ══ 5. Submit Area ═══════════════════════════════════════════ */}
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
