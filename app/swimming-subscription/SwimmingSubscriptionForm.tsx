'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    User, Users, Send, CheckCircle2,
    ShieldCheck, AlertCircle, HeartPulse, FileKey
} from 'lucide-react';
import { submitSwimmingSubscriptionAction } from '@/lib/actions/site/submitSwimmingSubscriptionAction';

interface SwimmingSubscriptionFormProps {
    formId: string;
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = 'purple' }: { icon: any; title: string; color?: 'purple' | 'blue' | 'green' | 'orange' }) {
    const styles = {
        purple: 'bg-purple-600/10 text-purple-600',
        blue: 'bg-blue-600/10 text-blue-600',
        green: 'bg-emerald-600/10 text-emerald-600',
        orange: 'bg-orange-500/10 text-orange-500',
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
                style={{ height: '3rem' }}
            />
        </Field>
    );
}

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

function DateInput({ label, name, required, min, max, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <input type="date" name={name} min={min} max={max} className={inputCls(error)} />
        </Field>
    );
}

function SelectInput({ label, name, required, options, placeholder, hint, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <select name={name} defaultValue="" className={`${inputCls(error)} cursor-pointer`}>
                <option value="" disabled>{placeholder || 'اختر...'}</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </Field>
    );
}

function RadioGroup({ label, name, required, options, error }: { label: string; name: string; required?: boolean; options: { value: string; desc: string }[]; error?: string }) {
    return (
        <Field label={label} required={required} error={error}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {options.map(({ value, desc }) => (
                    <label key={value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 has-checked:border-blue-500 has-checked:bg-blue-50 transition-all">
                        <div className="relative w-5 h-5 shrink-0">
                            <input type="radio" name={name} value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-blue-600 transition-all" />
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                    </label>
                ))}
            </div>
        </Field>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SwimmingSubscriptionForm({ formId }: SwimmingSubscriptionFormProps) {
    const topRef = useRef<HTMLDivElement>(null);
    const captchaRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [maxDob, setMaxDob] = useState('');
    useEffect(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 6);
        setMaxDob(d.toISOString().split('T')[0]);
    }, []);

    const [hasFamilyMembership, setHasFamilyMembership] = useState<string | null>(null);
    const [guardianRelationship, setGuardianRelationship] = useState<string>('');
    const [hasHealthIssues, setHasHealthIssues] = useState<string | null>(null);

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

        if (target.name === 'has_family_membership') setHasFamilyMembership((target as HTMLInputElement).value);
        if (target.name === 'guardian_relationship') setGuardianRelationship((target as HTMLSelectElement).value);
        if (target.name === 'has_health_issues') setHasHealthIssues((target as HTMLInputElement).value);

        if (target.name && fieldErrors[target.name]) {
            setFieldErrors(prev => { const n = { ...prev }; delete n[target.name]; return n; });
        }
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

        req('participant_full_name', 'الاسم الكامل', 2);
        req('participant_nationality', 'الجنسية', 2);
        req('participant_date_of_birth', 'تاريخ الميلاد');
        const dob = (data.get('participant_date_of_birth') as string || '').trim();
        if (dob && dob > maxDob)
            errs['participant_date_of_birth'] = 'الحد الأدنى لعمر الاشتراك هو 6 سنوات';
        req('participant_mobile', 'رقم الهاتف المتحرك');
        req('participant_email', 'البريد الإلكتروني');
        req('participant_emirates_id', 'رقم الهوية');
        req('membership_type', 'نوع العضوية');
        req('declaration_name', 'الاسم في الإقرار', 2);

        const emailVal = (data.get('participant_email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['participant_email'] = 'البريد الإلكتروني غير صحيح';

        // UAE Emirates ID: 784-YYYY-XXXXXXX-X
        const eidVal = (data.get('participant_emirates_id') as string || '').trim();
        if (eidVal && !/^784-\d{4}-\d{7}-\d$/.test(eidVal))
            errs['participant_emirates_id'] = 'صيغة الهوية الإماراتية غير صحيحة (مثال: 784-1234-1234567-1)';

        // UAE phone
        const mobileVal = (data.get('participant_mobile') as string || '').trim();
        if (mobileVal && !/^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/.test(mobileVal.replace(/[\s-]/g, '')))
            errs['participant_mobile'] = 'يجب إدخال رقم هاتف إماراتي صحيح (مثال: 501234567)';

        const guardianMobileVal = (data.get('guardian_mobile') as string || '').trim();
        if (guardianMobileVal && !/^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/.test(guardianMobileVal.replace(/[\s-]/g, '')))
            errs['guardian_mobile'] = 'يجب إدخال رقم هاتف إماراتي صحيح (مثال: 501234567)';

        if (!data.get('has_family_membership'))
            errs['has_family_membership'] = 'يجب الإجابة على هذا السؤال';

        if (!data.get('has_health_issues'))
            errs['has_health_issues'] = 'يجب الإجابة على هذا السؤال';

        if (!data.get('declaration_accepted'))
            errs['declaration_accepted'] = 'يجب الموافقة على الشروط للمتابعة.';

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
            setTimeout(() => {
                const firstKey = Object.keys(errs)[0];
                const el = firstKey === '_captcha'
                    ? captchaRef.current
                    : document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 140;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 0);
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData(form);
            formData.append('formId', formId);
            const result = await submitSwimmingSubscriptionAction(formData);

            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setFieldErrors({});
                form.reset();
                setHasFamilyMembership(null);
                setGuardianRelationship('');
                setHasHealthIssues(null);
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
                        <p className="font-bold text-green-800">تم إرسال الطلب بنجاح. سيتم التواصل معكم بعد مراجعة البيانات.</p>
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

                    {/* ══ 1. Participant Info ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={User} title="بيانات المشترك" color="purple" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="الاسم الكامل" name="participant_full_name" required minLength={2} maxLength={150} placeholder="اسم المشترك" error={fieldErrors['participant_full_name']} />
                            <TextInput label="الجنسية" name="participant_nationality" required minLength={2} maxLength={80} placeholder="الجنسية" error={fieldErrors['participant_nationality']} />
                            <DateInput label="تاريخ الميلاد" name="participant_date_of_birth" required max={maxDob} error={fieldErrors['participant_date_of_birth']} hint="الحد الأدنى للعمر 6 سنوات" />
                            <TelInput label="رقم الهاتف المتحرك" name="participant_mobile" required placeholder="5X XXX XXXX" error={fieldErrors['participant_mobile']} />
                            <EmailInput label="البريد الإلكتروني" name="participant_email" required placeholder="example@mail.com" error={fieldErrors['participant_email']} />
                            <TextInput label="رقم الهوية" name="participant_emirates_id" required maxLength={30} placeholder="784-1234-1234567-1" error={fieldErrors['participant_emirates_id']} />
                            <div className="sm:col-span-2">
                                <SelectInput
                                    label="نوع العضوية"
                                    name="membership_type"
                                    required
                                    placeholder="اختر نوع العضوية"
                                    options={['عضوية عائلية', 'أخرى']}
                                    error={fieldErrors['membership_type']}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <RadioGroup
                                    label="هل توجد عضوية عائلية؟"
                                    name="has_family_membership"
                                    required
                                    options={[
                                        { value: 'نعم', desc: 'يوجد رقم عضوية عائلية' },
                                        { value: 'لا', desc: 'لا يوجد' },
                                    ]}
                                    error={fieldErrors['has_family_membership']}
                                />
                            </div>
                            {hasFamilyMembership === 'نعم' && (
                                <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <TextInput label="رقم العضوية العائلية" name="family_membership_number" maxLength={50} placeholder="رقم العضوية" error={fieldErrors['family_membership_number']} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Guardian Info ══════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={Users} title="بيانات ولي الأمر" color="blue" />
                        <p className="text-sm text-gray-400 -mt-4 mb-6">يُرجى تعبئة هذا القسم إذا كان عمر المشترك أقل من 18 سنة</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="اسم ولي الأمر" name="guardian_full_name" maxLength={150} placeholder="الاسم الكامل" error={fieldErrors['guardian_full_name']} />
                            <SelectInput
                                label="صلة القرابة"
                                name="guardian_relationship"
                                placeholder="اختر صلة القرابة"
                                options={['الأب', 'الأم', 'الأخ', 'الأخت', 'الوصي', 'أخرى']}
                                error={fieldErrors['guardian_relationship']}
                            />
                            {guardianRelationship === 'أخرى' && (
                                <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <TextInput label="يرجى التوضيح" name="guardian_relationship_other" maxLength={100} placeholder="اذكر صلة القرابة" error={fieldErrors['guardian_relationship_other']} />
                                </div>
                            )}
                            <TelInput label="رقم هاتف ولي الأمر" name="guardian_mobile" placeholder="5X XXX XXXX" error={fieldErrors['guardian_mobile']} />
                            <EmailInput label="البريد الإلكتروني لولي الأمر" name="guardian_email" placeholder="example@mail.com" error={fieldErrors['guardian_email']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 3. Health Info ════════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={HeartPulse} title="الحالة الصحية" color="orange" />
                        <RadioGroup
                            label="هل يعاني المشترك من أي مشاكل صحية؟"
                            name="has_health_issues"
                            required
                            options={[
                                { value: 'نعم', desc: 'لدي مشاكل صحية يجب التدقيق فيها' },
                                { value: 'لا', desc: 'لا يوجد' },
                            ]}
                            error={fieldErrors['has_health_issues']}
                        />
                        {hasHealthIssues === 'نعم' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                                <AutoTextarea
                                    label="يرجى ذكر المشاكل الصحية"
                                    name="health_issue_details"
                                    maxLength={1000}
                                    placeholder="اكتب التفاصيل هنا..."
                                    error={fieldErrors['health_issue_details']}
                                    hint="سنقوم بمراجعة حالتك بأعلى درجات السرية لضمان سلامتك"
                                />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 4. Declaration ════════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-6">
                        <SectionHeader icon={FileKey} title="الإقرار والموافقة" color="green" />

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-600 leading-relaxed text-justify">
                            أقر أنا / ولي أمر المشترك بأن البيانات المقدمة صحيحة، وأن المشترك لائق طبياً لممارسة النشاط، وأنني أتحمل المسؤولية عن حالته الصحية، وأوافق على شروط الاشتراك.
                        </div>

                        <TextInput label="الاسم كما سيظهر في الإقرار" name="declaration_name" required minLength={2} maxLength={150} placeholder="الاسم الكامل" error={fieldErrors['declaration_name']} />

                        <div className="space-y-2">
                            <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-2xl border transition-all ${fieldErrors['declaration_accepted']
                                ? 'border-red-300 bg-red-50/40'
                                : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                                }`}>
                                <div className="relative w-6 h-6 shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        name="declaration_accepted"
                                        className={`peer appearance-none w-6 h-6 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${fieldErrors['declaration_accepted']
                                            ? 'border-red-400 bg-red-50 checked:border-red-600 checked:bg-red-600'
                                            : 'border-gray-300 checked:border-purple-600 checked:bg-purple-600 bg-white'
                                            }`}
                                    />
                                    <CheckCircle2 size={16} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <p className={`text-sm leading-relaxed select-none transition-colors ${fieldErrors['declaration_accepted'] ? 'text-red-700' : 'text-emerald-900'}`}>
                                    أوافق على الإقرار والشروط <span className="text-red-500">*</span>
                                </p>
                            </label>
                            {fieldErrors['declaration_accepted'] && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 px-1">
                                    <AlertCircle size={11} strokeWidth={2.5} />
                                    {fieldErrors['declaration_accepted']}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ══ 5. Submit Area ════════════════════════════════════════════ */}
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
                                    <span>إرسال طلب الاشتراك</span>
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
