'use client';

import React, { useState, useRef } from 'react';
import {
    User, Send, CheckCircle2,
    ShieldCheck, AlertCircle, Activity, FileKey
} from 'lucide-react';
import { submitSwimmingSubscriptionAction } from '@/lib/actions/site/submitSwimmingSubscriptionAction';

interface SwimmingSubscriptionFormProps {
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SwimmingSubscriptionForm({ formId }: SwimmingSubscriptionFormProps) {
    const topRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    
    // Track conditional display
    const [hasHealthIssues, setHasHealthIssues] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const target = e.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        
        // Handle radio explicit state
        if (target.name === 'has_health_issues') {
            setHasHealthIssues((target as HTMLInputElement).value);
        }

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
        req('full_name',       'الاسم', 2);
        req('nationality',     'الجنسية', 2);
        req('id_number',       'رقم الهوية', 5);
        req('date_of_birth',   'تاريخ الميلاد');
        req('user-email',      'البريد الإلكتروني');
        req('mobile_number',   'رقم الهاتف المتحرك');
        req('declarant_name',  'الاسم', 2);

        // Email format
        const emailVal = (data.get('user-email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['user-email'] = 'البريد الإلكتروني غير صحيح';

        // Checkbox & Radios
        if (!data.get('has_health_issues'))
            errs['has_health_issues'] = 'يجب الإجابة على هذا السؤال';

        // Consent
        if (!data.get('declaration_confirm'))
            errs['declaration_confirm'] = 'يجب الموافقة على الإقرار للمتابعة';

        if (!data.get('declaration_acceptance'))
            errs['declaration_acceptance'] = 'يجب الموافقة على الإقرار للمتابعة';

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
            const result = await submitSwimmingSubscriptionAction(formData);

            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setFieldErrors({});
                form.reset();
                setHasHealthIssues(null);
            } else {
                setStatus('error');
                setMessage(result.message);
                // Map CF7 invalid_fields → { fieldName: errorMessage }
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
                        <SectionHeader icon={User} title="بيانات المشترك" color="purple" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="الاسم" name="full_name" required minLength={2} maxLength={150} placeholder="اسم المشترك" error={fieldErrors['full_name']} />
                            <TextInput label="الجنسية" name="nationality" required minLength={2} maxLength={80} placeholder="الجنسية" error={fieldErrors['nationality']} />
                            <DateInput label="تاريخ الميلاد" name="date_of_birth" required error={fieldErrors['date_of_birth']} />
                            <TextInput label="رقم الهوية" name="id_number" required minLength={5} maxLength={30} placeholder="رقم الهوية" error={fieldErrors['id_number']} />
                            <EmailInput label="البريد الإلكتروني" name="user-email" required placeholder="example@mail.com" error={fieldErrors['user-email']} />
                            <TelInput label="رقم الهاتف المتحرك" name="mobile_number" required placeholder="+971 5X XXX XXXX" error={fieldErrors['mobile_number']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Health Info ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={Activity} title="المعلومات الصحية" color="blue" />
                        
                        <Field label="هل تعاني من أي مشاكل صحية؟" required error={fieldErrors['has_health_issues']}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                {[
                                    { value: 'نعم',   desc: 'لدي مشاكل صحية يجب التدقيق فيها' },
                                    { value: 'لا',    desc: 'لا يوجد' },
                                ].map(({ value, desc }) => (
                                    <label key={value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 has-checked:border-blue-500 has-checked:bg-blue-50 transition-all">
                                        <div className="relative w-5 h-5 shrink-0">
                                            <input type="radio" name="has_health_issues" value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-blue-600 transition-all" />
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

                        {hasHealthIssues === 'نعم' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                                <AutoTextarea 
                                    label="إذا كانت الإجابة بنعم، يرجى ذكر المشاكل الصحية" 
                                    name="health_issues_details" 
                                    maxLength={1000} 
                                    placeholder="اكتب التفاصيل هنا..." 
                                    error={fieldErrors['health_issues_details']} 
                                    hint="سنقوم بمراجعة حالتك بأعلى درجات السرية لضمان سلامتك"
                                />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 3. Declaration & Signature ════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-6">
                        <SectionHeader icon={FileKey} title="الإقرار والتوقيع" color="green" />

                        <div className="space-y-2">
                            <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-2xl border transition-all ${fieldErrors['declaration_confirm']
                                    ? 'border-red-300 bg-red-50/40'
                                    : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                                }`}>
                                <div className="relative w-6 h-6 shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        name="declaration_confirm"
                                        className={`peer appearance-none w-6 h-6 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                                            fieldErrors['declaration_confirm']
                                                ? 'border-red-400 bg-red-50 checked:border-red-600 checked:bg-red-600'
                                                : 'border-gray-300 checked:border-purple-600 checked:bg-purple-600 bg-white'
                                        }`}
                                    />
                                    <CheckCircle2 size={16} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <p className={`text-sm leading-relaxed text-justify select-none transition-colors ${fieldErrors['declaration_confirm'] ? 'text-red-700' : 'text-emerald-900'}`}>
                                    أقر أنا / ولي أمر المشترك بأنه لائق طبيا لممارسة الرياضة، وأنني مسؤول مسؤولية كاملة عن الحالة الصحية، وأن المشترك خالٍ من الأمراض العصبية، والتشنجية، والجلدية المعدية، كما أقر بعلمي وموافقتي على جميع شروط الاشتراك، وأنه في حال الإصابة أو حدوث أي حوادث عرضية، فإنني بموجب هذا الإقرار أخلي كل من النادي والعاملين به من كامل المسؤولية. <span className="text-red-500">*</span>
                                </p>
                            </label>
                            {fieldErrors['declaration_confirm'] && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 px-1">
                                    <AlertCircle size={11} strokeWidth={2.5} />
                                    {fieldErrors['declaration_confirm']}
                                </p>
                            )}
                        </div>

                        <TextInput label="الاسم" name="declarant_name" required minLength={2} maxLength={150} placeholder="الاسم الكامل للمقر" error={fieldErrors['declarant_name']} />
                    </div>

                    {/* ══ 4. Submit Area ═══════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-6 bg-gray-50/80 border-t border-gray-100 rounded-b-3xl">
                        
                        <div className="space-y-2">
                            <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-2xl border transition-all ${fieldErrors['declaration_acceptance']
                                    ? 'border-red-300 bg-red-50/40'
                                    : 'border-transparent hover:bg-gray-50'
                                }`}>
                                <div className="relative w-6 h-6 shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        name="declaration_acceptance"
                                        className={`peer appearance-none w-6 h-6 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                                            fieldErrors['declaration_acceptance'] 
                                                ? 'border-red-400 bg-red-50 checked:border-red-600 checked:bg-red-600' 
                                                : 'border-gray-300 checked:border-purple-600 checked:bg-purple-600 bg-white'
                                        }`}
                                    />
                                    <CheckCircle2 size={16} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold select-none transition-colors ${fieldErrors['declaration_acceptance'] ? 'text-red-700' : 'text-gray-900 group-hover:text-purple-700'}`}>
                                        أقر بصحة البيانات وأوافق على الإقرار أعلاه <span className="text-red-500">*</span>
                                    </p>
                                </div>
                            </label>
                            {fieldErrors['declaration_acceptance'] && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 px-1">
                                    <AlertCircle size={11} strokeWidth={2.5} />
                                    {fieldErrors['declaration_acceptance']}
                                </p>
                            )}
                        </div>

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
