'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    User, Send, ShieldCheck, AlertCircle, Calendar, CheckCircle2, FileUp, CheckCircle, Users2
} from 'lucide-react';
import { submitCondolenceHallBookingAction } from '@/lib/actions/site/submitCondolenceHallBookingAction';

interface CondolenceHallBookingFormProps {
    formId: string;
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = 'purple' }: { icon: any; title: string; color?: 'purple' | 'blue' | 'amber' | 'green' }) {
    const styles = {
        purple: 'bg-purple-600/10 text-purple-600',
        blue: 'bg-blue-600/10 text-blue-600',
        amber: 'bg-amber-600/10 text-amber-600',
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

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputCls = (error?: string) =>
    `w-full h-12 px-4 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${error
        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15'
        : 'border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-purple-500/15'
    }`;

function TextInput({ label, name, required, minLength, maxLength, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="text" name={name} minLength={minLength} maxLength={maxLength} placeholder={placeholder} className={inputCls(error)} />
        </Field>
    );
}

function EmailInput({ label, name, required, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="email" name={name} placeholder={placeholder} dir="ltr" className={`${inputCls(error)} text-left`} />
        </Field>
    );
}

function TelInput({ label, name, required, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="tel" name={name} placeholder={placeholder} dir="ltr" className={`${inputCls(error)} text-left`} />
        </Field>
    );
}

function DateInput({ label, name, required, min, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="date" name={name} min={min} className={inputCls(error)} suppressHydrationWarning />
        </Field>
    );
}

function NumberInput({ label, name, required, min, max, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="number" name={name} min={min} max={max} placeholder={placeholder} className={inputCls(error)} />
        </Field>
    );
}

function SelectInput({ label, name, required, options, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <select name={name} defaultValue="" className={`${inputCls(error)} cursor-pointer`}>
                <option value="" disabled>اختر...</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </Field>
    );
}

function AutoTextarea({ label, name, required, maxLength, placeholder, hint, error }: any) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const handleInput = () => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <textarea
                ref={ref}
                name={name}
                maxLength={maxLength}
                placeholder={placeholder}
                rows={1}
                onInput={handleInput}
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all resize-none overflow-hidden leading-6 min-h-12 ${error
                    ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15'
                    : 'bg-gray-50 border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-purple-500/15'
                    }`}
            />
        </Field>
    );
}

function RadioGroup({ label, name, required, options, accentColor = 'blue', error }: any) {
    const accents: Record<string, string> = {
        blue: 'hover:border-blue-400 hover:bg-blue-50/40 has-checked:border-blue-500 has-checked:bg-blue-50',
        purple: 'hover:border-purple-400 hover:bg-purple-50/40 has-checked:border-purple-500 has-checked:bg-purple-50',
        amber: 'hover:border-amber-400 hover:bg-amber-50/40 has-checked:border-amber-500 has-checked:bg-amber-50',
    };
    const dotColors: Record<string, string> = {
        blue: 'checked:border-blue-600 bg-blue-600',
        purple: 'checked:border-purple-600 bg-purple-600',
        amber: 'checked:border-amber-600 bg-amber-600',
    };
    return (
        <Field label={label} required={required} error={error}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {options.map((value: string) => (
                    <label key={value} className={`flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer transition-all ${accentColor ? accents[accentColor] : accents.blue}`}>
                        <div className="relative w-5 h-5 shrink-0">
                            <input type="radio" name={name} value={value} className={`peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none transition-all ${dotColors[accentColor]?.split(' ')[0] || 'checked:border-blue-600'}`} />
                            <div className={`w-2.5 h-2.5 rounded-full absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all ${dotColors[accentColor]?.split(' ').slice(1).join(' ') || 'bg-blue-600'}`} />
                        </div>
                        <p className="text-sm font-bold text-gray-800">{value}</p>
                    </label>
                ))}
            </div>
        </Field>
    );
}

// ─── File Upload ──────────────────────────────────────────────────────────────
function FileUpload({ label, name, required, accept, maxBytes, hint, error }: any) {
    const [file, setFile] = useState<File | null>(null);
    const [sizeError, setSizeError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (f && maxBytes && f.size > maxBytes) {
            setSizeError(`حجم الملف يتجاوز الحد المسموح به (${(maxBytes / 1024 / 1024).toFixed(0)} ميجابايت)`);
            e.target.value = '';
            setFile(null);
        } else {
            setSizeError('');
            setFile(f);
        }
    };

    const displayError = sizeError || error;

    return (
        <Field label={label} required={required} hint={hint} error={displayError}>
            <div className="relative group cursor-pointer">
                <input
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full flex items-center gap-4 px-5 py-4 border-2 border-dashed rounded-2xl transition-all ${displayError
                    ? 'border-red-400 bg-red-50/30'
                    : file
                        ? 'border-purple-400 bg-purple-50/60'
                        : 'border-gray-200 bg-gray-50 group-hover:border-purple-300 group-hover:bg-purple-50/30'
                    }`}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${displayError ? 'bg-red-100 text-red-500' : file ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-400 group-hover:text-purple-500'}`}>
                        {displayError ? <AlertCircle size={20} /> : file ? <CheckCircle size={20} /> : <FileUp size={20} />}
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
                                <p className="text-xs font-medium text-gray-400 mt-0.5">{hint}</p>
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
    const captchaRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [relationshipToDeceased, setRelationshipToDeceased] = useState('');
    const [hasTimeException, setHasTimeException] = useState<string | null>(null);

    const [minDate, setMinDate] = useState('');
    useEffect(() => {
        setMinDate(new Date().toISOString().split('T')[0]);
    }, []);

    const [captcha, setCaptcha] = useState<{ a: number; b: number } | null>(null);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');

    const refreshCaptcha = () => {
        setCaptcha({ a: Math.floor(Math.random() * 9) + 1, b: Math.floor(Math.random() * 9) + 1 });
        setCaptchaInput('');
        setCaptchaError('');
    };
    useEffect(() => { refreshCaptcha(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const target = e.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (target.name === 'applicant_relationship_to_deceased') setRelationshipToDeceased((target as HTMLSelectElement).value);
        if (target.name === 'has_time_exception_request') setHasTimeException((target as HTMLInputElement).value);
        if (target.name && fieldErrors[target.name]) {
            setFieldErrors(prev => { const n = { ...prev }; delete n[target.name]; return n; });
        }
    };

    const scrollToFirstError = (errs: Record<string, string>) => {
        setTimeout(() => {
            const firstKey = Object.keys(errs)[0];
            const el = firstKey === '_captcha'
                ? captchaRef.current
                : document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
            if (el) {
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 180, behavior: 'smooth' });
            }
        }, 0);
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('idle');
        setMessage('');

        const form = e.currentTarget;
        const data = new FormData(form);
        const errs: Record<string, string> = {};

        const req = (key: string, label: string, minLen?: number) => {
            const val = (data.get(key) as string || '').trim();
            if (!val) { errs[key] = `${label} مطلوب`; return; }
            if (minLen && val.length < minLen) errs[key] = `يجب ألا يقل عن ${minLen} أحرف`;
        };

        // Booking
        req('booking_start_date', 'تاريخ بداية الحجز');
        req('booking_duration_days', 'عدد الأيام');
        if (!data.get('booking_slot')) errs['booking_slot'] = 'يجب اختيار الفترة';

        // Applicant
        req('applicant_full_name', 'الاسم الكامل', 2);
        req('applicant_mobile', 'رقم الهاتف المتحرك');
        req('applicant_email', 'البريد الإلكتروني');
        req('applicant_emirates_id', 'رقم بطاقة الهوية');
        req('declaration_name', 'الاسم في الإقرار', 2);

        // Email
        const emailVal = (data.get('applicant_email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['applicant_email'] = 'البريد الإلكتروني غير صحيح';

        // UAE phone - mobile
        const mobileVal = (data.get('applicant_mobile') as string || '').trim();
        if (mobileVal && !/^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/.test(mobileVal.replace(/[\s-]/g, '')))
            errs['applicant_mobile'] = 'يجب إدخال رقم هاتف إماراتي صحيح (مثال: 501234567)';

        // UAE phone - landline (optional)
        const phoneVal = (data.get('applicant_phone') as string || '').trim();
        if (phoneVal && !/^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/.test(phoneVal.replace(/[\s-]/g, '')))
            errs['applicant_phone'] = 'يجب إدخال رقم هاتف إماراتي صحيح';

        // Emirates ID
        const eidVal = (data.get('applicant_emirates_id') as string || '').trim();
        if (eidVal && !/^784-\d{4}-\d{7}-\d$/.test(eidVal))
            errs['applicant_emirates_id'] = 'صيغة الهوية الإماراتية غير صحيحة (مثال: 784-1234-1234567-1)';

        // File
        const attachFile = data.get('applicant_id_attachment') as File;
        if (!attachFile || attachFile.size === 0)
            errs['applicant_id_attachment'] = 'يرجى رفع صورة الهوية';

        // Deceased
        req('deceased_full_name', 'اسم المتوفي', 2);
        if (!data.get('deceased_location_status')) errs['deceased_location_status'] = 'يجب تحديد موقع المتوفي';
        if (!data.get('applicant_relationship_to_deceased') || (data.get('applicant_relationship_to_deceased') as string) === '')
            errs['applicant_relationship_to_deceased'] = 'يجب اختيار صلة القرابة';

        // Declaration
        if (!data.get('rules_accepted'))
            errs['rules_accepted'] = 'يجب الموافقة على الشروط للمتابعة.';

        // Captcha
        if (!captchaInput.trim()) {
            setCaptchaError('يرجى إدخال الجواب');
            errs['_captcha'] = 'captcha';
        } else if (captcha && parseInt(captchaInput.trim()) !== captcha.a + captcha.b) {
            refreshCaptcha();
            setCaptchaError('الجواب غير صحيح، حاول مرة أخرى');
            errs['_captcha'] = 'captcha';
        }

        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            scrollToFirstError(errs);
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
                setRelationshipToDeceased('');
                setHasTimeException(null);
                refreshCaptcha();
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
                window.scrollTo({ top: topRef.current.getBoundingClientRect().top + window.scrollY - 180, behavior: 'smooth' });
            }
        }
    };

    return (
        <div ref={topRef} dir="rtl" className="w-full max-w-4xl mx-auto">

            {/* ── Status Banners ── */}
            {status === 'success' && (
                <div className="mb-6 flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2 bg-green-100 rounded-xl shrink-0">
                        <ShieldCheck size={22} className="text-green-600" />
                    </div>
                    <div>
                        <p className="font-bold text-green-800">{message}</p>
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

            {/* ── Form Card ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm" suppressHydrationWarning>
                <form onSubmit={handleSubmit} onChange={handleChange} noValidate>

                    {/* ══ 1. Booking Details ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={Calendar} title="تفاصيل الحجز" color="blue" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <DateInput label="تاريخ بداية الحجز" name="booking_start_date" required min={minDate} error={fieldErrors['booking_start_date']} />
                            <NumberInput label="عدد الأيام" name="booking_duration_days" required min={1} max={20} placeholder="من 1 إلى 20" error={fieldErrors['booking_duration_days']} />
                        </div>

                        <div className="mt-5">
                            <RadioGroup
                                label="الفترة"
                                name="booking_slot"
                                required
                                accentColor="blue"
                                options={['صباحاً (10:00 صباحاً - 2:00 مساءً)', 'مساءً (6:00 مساءً - 10:00 مساءً)']}
                                error={fieldErrors['booking_slot']}
                            />
                        </div>

                        <div className="mt-5">
                            <RadioGroup
                                label="هل لديكم طلب استثنائي للوقت؟"
                                name="has_time_exception_request"
                                accentColor="blue"
                                options={['نعم', 'لا']}
                                error={fieldErrors['has_time_exception_request']}
                            />
                        </div>

                        {hasTimeException === 'نعم' && (
                            <div className="mt-5">
                                <AutoTextarea
                                    label="تفاصيل الطلب الاستثنائي"
                                    name="time_exception_details"
                                    maxLength={500}
                                    placeholder="اذكر تفاصيل الطلب الاستثنائي..."
                                    error={fieldErrors['time_exception_details']}
                                />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Applicant Data ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={User} title="بيانات مقدم الطلب" color="purple" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="الاسم الكامل" name="applicant_full_name" required minLength={2} maxLength={150} placeholder="الاسم الكامل" error={fieldErrors['applicant_full_name']} />
                            <TelInput label="رقم الهاتف" name="applicant_phone" placeholder="5X XXX XXXX" error={fieldErrors['applicant_phone']} />
                            <TelInput label="رقم الهاتف المتحرك" name="applicant_mobile" required placeholder="5X XXX XXXX" error={fieldErrors['applicant_mobile']} />
                            <EmailInput label="البريد الإلكتروني" name="applicant_email" required placeholder="example@mail.com" error={fieldErrors['applicant_email']} />
                            <TextInput label="رقم بطاقة الهوية" name="applicant_emirates_id" required maxLength={20} placeholder="784-1234-1234567-1" error={fieldErrors['applicant_emirates_id']} />
                            <TextInput label="الوظيفة" name="applicant_job_title" maxLength={120} placeholder="الوظيفة (اختياري)" error={fieldErrors['applicant_job_title']} />
                            <TextInput label="جهة العمل" name="applicant_employer" maxLength={150} placeholder="جهة العمل (اختياري)" error={fieldErrors['applicant_employer']} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                            <FileUpload
                                label="صورة عن بطاقة الهوية"
                                name="applicant_id_attachment"
                                required
                                accept=".pdf,.jpg,.jpeg,.png"
                                maxBytes={2097152}
                                hint="PDF أو JPG أو PNG، بحجم لا يتجاوز 2 ميجابايت"
                                error={fieldErrors['applicant_id_attachment']}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 3. Deceased Data ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={Users2} title="بيانات المتوفي" color="amber" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="اسم المتوفي" name="deceased_full_name" required minLength={2} maxLength={150} placeholder="اسم المتوفي الكامل" error={fieldErrors['deceased_full_name']} />
                            <TextInput label="الجنسية" name="deceased_nationality" maxLength={80} placeholder="الجنسية" error={fieldErrors['deceased_nationality']} />
                        </div>

                        <RadioGroup
                            label="داخل / خارج الدولة"
                            name="deceased_location_status"
                            required
                            accentColor="amber"
                            options={['داخل الدولة', 'خارج الدولة']}
                            error={fieldErrors['deceased_location_status']}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <SelectInput
                                label="صلة القرابة بمقدم الطلب"
                                name="applicant_relationship_to_deceased"
                                required
                                options={['الأب', 'الأم', 'الزوج', 'الزوجة', 'الابن', 'الابنة', 'الأخ', 'الأخت', 'قريب', 'أخرى']}
                                error={fieldErrors['applicant_relationship_to_deceased']}
                            />
                            {relationshipToDeceased === 'أخرى' && (
                                <TextInput label="يرجى التوضيح" name="applicant_relationship_other" maxLength={100} placeholder="اذكر صلة القرابة" error={fieldErrors['applicant_relationship_other']} />
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 4. Declaration ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={ShieldCheck} title="الشروط والإقرار" color="green" />

                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            يلتزم مقدم الطلب باستخدام القاعة المخصصة فقط، وعدم استخدام الساحات أو المرافق غير المخصصة،
                            وعدم استخدام مواقد الغاز أو الأجهزة الكهربائية الخاصة بالطهي، والالتزام بأنظمة النادي والآداب العامة،
                            ويتحمل مسؤولية أي تلفيات.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="الاسم كما سيظهر في الإقرار" name="declaration_name" required minLength={2} maxLength={150} placeholder="الاسم الكامل" error={fieldErrors['declaration_name']} />
                        </div>

                        <div className="space-y-2">
                            <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-2xl border transition-all ${fieldErrors['rules_accepted']
                                ? 'border-red-300 bg-red-50/40'
                                : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                                }`}>
                                <div className="relative w-6 h-6 shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        name="rules_accepted"
                                        className={`peer appearance-none w-6 h-6 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${fieldErrors['rules_accepted']
                                            ? 'border-red-400 bg-red-50 checked:border-red-600 checked:bg-red-600'
                                            : 'border-gray-300 checked:border-purple-600 checked:bg-purple-600 bg-white'
                                            }`}
                                    />
                                    <CheckCircle2 size={16} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <p className={`text-sm leading-relaxed select-none transition-colors ${fieldErrors['rules_accepted'] ? 'text-red-700' : 'text-emerald-900'}`}>
                                    أوافق على شروط استخدام القاعة <span className="text-red-500">*</span>
                                </p>
                            </label>
                            {fieldErrors['rules_accepted'] && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 px-1">
                                    <AlertCircle size={11} strokeWidth={2.5} />
                                    {fieldErrors['rules_accepted']}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ══ 5. Submit Area ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 bg-gray-50/80 border-t border-gray-100 rounded-b-3xl space-y-5">

                        {/* Captcha */}
                        {captcha && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">
                                    التحقق من الهوية <span className="text-red-500 ms-1">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-4 h-12 bg-white border border-gray-200 rounded-xl select-none">
                                        <span className="text-lg font-bold text-gray-800 tabular-nums">{captcha.a}</span>
                                        <span className="text-gray-400 font-medium">+</span>
                                        <span className="text-lg font-bold text-gray-800 tabular-nums">{captcha.b}</span>
                                        <span className="text-gray-400 font-medium">=</span>
                                        <span className="text-gray-400">?</span>
                                    </div>
                                    <input
                                        ref={captchaRef}
                                        type="number"
                                        inputMode="numeric"
                                        value={captchaInput}
                                        onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(''); }}
                                        placeholder="الجواب"
                                        dir="ltr"
                                        className={`w-28 h-12 px-4 border rounded-xl text-gray-900 text-sm font-medium text-center focus:outline-none focus:ring-2 transition-all ${captchaError ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15' : 'bg-gray-50 border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-purple-500/15'}`}
                                    />
                                    <button type="button" onClick={refreshCaptcha} className="h-12 px-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all" title="تغيير السؤال">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
                                    </button>
                                </div>
                                {captchaError && (
                                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                                        <AlertCircle size={11} strokeWidth={2.5} />
                                        {captchaError}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-purple-600/20 active:scale-[0.98] text-base"
                        >
                            {isSubmitting ? (
                                <span className="opacity-90">جاري الإرسال...</span>
                            ) : (
                                <>
                                    <span>إرسال طلب الحجز</span>
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
