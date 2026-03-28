'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    User, Send, ShieldCheck, AlertCircle, Calendar, CheckCircle2, FileUp, CheckCircle
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

function TimeInput({ label, name, required, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="time" name={name} dir="ltr" className={`${inputCls(error)} text-left`} />
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
    };
    const dotColors: Record<string, string> = {
        blue: 'checked:border-blue-600 bg-blue-600',
        purple: 'checked:border-purple-600 bg-purple-600',
    };
    return (
        <Field label={label} required={required} error={error}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {options.map((value: string) => (
                    <label key={value} className={`flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer transition-all ${accents[accentColor] || accents.blue}`}>
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
export default function LectureHallBookingForm({ formId }: LectureHallBookingFormProps) {
    const topRef = useRef<HTMLDivElement>(null);
    const captchaRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [selectedHall, setSelectedHall] = useState('');

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
        if (target.name === 'requested_hall') setSelectedHall((target as HTMLInputElement).value);
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

        // Booking details
        req('booking_purpose', 'الغرض من الحجز', 3);
        if (!data.get('requested_hall')) errs['requested_hall'] = 'يجب اختيار القاعة المطلوبة';
        req('requested_event_date', 'التاريخ المطلوب');
        req('requested_days', 'عدد الأيام');
        if (!data.get('booking_period')) errs['booking_period'] = 'يجب اختيار فترة الحجز';
        req('requested_time_from', 'من الساعة');
        req('requested_time_to', 'إلى الساعة');
        const timeFrom = (data.get('requested_time_from') as string || '').trim();
        const timeTo = (data.get('requested_time_to') as string || '').trim();
        if (timeFrom && timeTo && timeTo <= timeFrom)
            errs['requested_time_to'] = 'وقت الانتهاء يجب أن يكون بعد وقت البداية';

        // Applicant
        req('applicant_full_name', 'اسم مقدم الطلب', 2);
        req('applicant_emirates_id', 'رقم بطاقة الهوية');
        req('applicant_mobile', 'الهاتف المتحرك');
        req('applicant_email', 'البريد الإلكتروني');

        // Email format
        const emailVal = (data.get('applicant_email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['applicant_email'] = 'البريد الإلكتروني غير صحيح';

        // UAE phone
        const mobileVal = (data.get('applicant_mobile') as string || '').trim();
        if (mobileVal && !/^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/.test(mobileVal.replace(/[\s-]/g, '')))
            errs['applicant_mobile'] = 'يجب إدخال رقم هاتف إماراتي صحيح (مثال: 0501234567)';

        // Emirates ID
        const eidVal = (data.get('applicant_emirates_id') as string || '').trim();
        if (eidVal && !/^784-\d{4}-\d{7}-\d$/.test(eidVal))
            errs['applicant_emirates_id'] = 'صيغة الهوية الإماراتية غير صحيحة (مثال: 784-1234-1234567-1)';

        // File
        const attachFile = data.get('applicant_id_attachment') as File;
        if (!attachFile || attachFile.size === 0)
            errs['applicant_id_attachment'] = 'يرجى رفع صورة الهوية';

        // Declaration
        req('declaration_name', 'الاسم في الإقرار', 2);
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
            const result = await submitLectureHallBookingAction(formData);

            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setFieldErrors({});
                form.reset();
                setSelectedHall('');
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
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={Calendar} title="تفاصيل الحجز" color="blue" />

                        <TextInput
                            label="الغرض من الحجز"
                            name="booking_purpose"
                            required
                            minLength={3}
                            maxLength={250}
                            placeholder="أدخل الغرض من الحجز"
                            error={fieldErrors['booking_purpose']}
                        />

                        <RadioGroup
                            label="القاعة المطلوبة"
                            name="requested_hall"
                            required
                            accentColor="blue"
                            options={['قاعة المناسبات', 'قاعة المحاضرات', 'القاعة الدائرية', 'أخرى']}
                            error={fieldErrors['requested_hall']}
                        />

                        {selectedHall === 'أخرى' && (
                            <TextInput
                                label="يرجى تحديد القاعة الأخرى"
                                name="requested_hall_other"
                                maxLength={150}
                                placeholder="اذكر اسم القاعة"
                                error={fieldErrors['requested_hall_other']}
                            />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <DateInput label="التاريخ المطلوب" name="requested_event_date" required min={minDate} error={fieldErrors['requested_event_date']} />
                            <NumberInput label="عدد الأيام" name="requested_days" required min={1} placeholder="مثال: 1" error={fieldErrors['requested_days']} />
                        </div>

                        <RadioGroup
                            label="فترة الحجز"
                            name="booking_period"
                            required
                            accentColor="blue"
                            options={['صباحاً', 'مساءً']}
                            error={fieldErrors['booking_period']}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TimeInput label="من الساعة" name="requested_time_from" required error={fieldErrors['requested_time_from']} />
                            <TimeInput label="إلى الساعة" name="requested_time_to" required error={fieldErrors['requested_time_to']} />
                        </div>

                        <AutoTextarea
                            label="ملاحظات إضافية"
                            name="booking_notes"
                            maxLength={500}
                            placeholder="أي ملاحظات إضافية (اختياري)"
                            error={fieldErrors['booking_notes']}
                        />
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Applicant Data ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={User} title="بيانات مقدم الطلب" color="purple" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="اسم مقدم الطلب" name="applicant_full_name" required minLength={2} maxLength={150} placeholder="الاسم الكامل" error={fieldErrors['applicant_full_name']} />
                            <TextInput label="رقم بطاقة الهوية" name="applicant_emirates_id" required maxLength={20} placeholder="784-1234-1234567-1" error={fieldErrors['applicant_emirates_id']} />
                            <TelInput label="الهاتف المتحرك" name="applicant_mobile" required placeholder="0501234567" error={fieldErrors['applicant_mobile']} />
                            <EmailInput label="البريد الإلكتروني" name="applicant_email" required placeholder="example@mail.com" error={fieldErrors['applicant_email']} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                    {/* ══ 3. Declaration ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={ShieldCheck} title="الشروط والإقرار" color="green" />

                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            يلتزم مقدم الطلب باستخدام القاعة المحجوزة فقط، وعدم استخدام الساحات أو الممرات التابعة للنادي،
                            واستخدام القاعة للغرض المحجوز من أجله فقط، ويتحمل مسؤولية أي تلفيات وفقاً لأنظمة النادي.
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
                                    أوافق على شروط الحجز والاستخدام <span className="text-red-500">*</span>
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

                    {/* ══ 4. Submit Area ══════════════════════════════════════ */}
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
