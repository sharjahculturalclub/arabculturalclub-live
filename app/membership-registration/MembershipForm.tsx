'use client';

import React, { useState, useRef } from 'react';
import {
    User, Phone, Briefcase, Send, FileUp, Users, Plus, Trash2,
    ShieldCheck, Mail, CheckCircle2, ChevronDown,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { submitMembershipFormAction } from '@/lib/actions/site/submitMembershipFormAction';

interface MembershipFormProps {
    formId: string;
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = 'purple' }: { icon: any; title: string; color?: 'purple' | 'blue' }) {
    const styles = {
        purple: 'bg-purple-600/10 text-purple-600',
        blue: 'bg-blue-600/10 text-blue-600',
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
// ─── shared border helper ─────────────────────────────────────────────────────
const inputCls = (error?: string) =>
    `w-full h-12 px-4 bg-gray-50 border rounded-xl text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${error
        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15'
        : 'border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-purple-500/15'
    }`;

// ─── Auto-grow Textarea ───────────────────────────────────────────────────────
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

// ─── Text Input ───────────────────────────────────────────────────────────────
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

// ─── Email Input ──────────────────────────────────────────────────────────────
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

// ─── Tel Input ────────────────────────────────────────────────────────────────
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

// ─── Date Input ───────────────────────────────────────────────────────────────
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

// ─── Select Input ─────────────────────────────────────────────────────────────
function SelectInput({ label, name, required, hint, children, error }: any) {
    return (
        <Field label={label} required={required} hint={hint} error={error}>
            <div className="relative">
                <select
                    name={name}
                    className={`w-full h-12 px-4 ps-4 pe-10 border rounded-xl text-gray-900 text-sm font-medium appearance-none focus:outline-none focus:ring-2 transition-all ${error
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/15'
                        : 'bg-gray-50 border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-purple-500/15'
                        }`}
                >
                    {children}
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
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
                    <div className="min-w-0 flex-1">
                        {file ? (
                            <>
                                <p className="text-sm font-semibold text-purple-700 truncate">{file.name}</p>
                                <p className="text-xs text-purple-500 mt-0.5">تم الاختيار · انقر للتغيير</p>
                            </>
                        ) : (
                            <>
                                <p className={`text-sm font-semibold transition-colors ${error ? 'text-red-500' : 'text-gray-600 group-hover:text-purple-700'}`}>انقر لاختيار ملف</p>
                                <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Field>
    );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
    return <div className="h-px bg-gray-100 my-2" />;
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function MembershipForm({ formId }: MembershipFormProps) {
    const topRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [dependents, setDependents] = useState<number[]>([]);
    const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
    const nextId = useRef(1);

    const addDependent = () => {
        if (dependents.length >= 6) return;
        setDependents(prev => [...prev, nextId.current++]);
    };

    const removeDependent = (id: number) => {
        setDependents(prev => prev.filter(d => d !== id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const target = e.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        if (target.name === 'membership_status') {
            setMembershipStatus((target as HTMLInputElement).value);
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
        req('full_name', 'الاسم الكامل', 2);
        req('nationality', 'الجنسية', 2);
        req('gender', 'الجنس');
        req('passport_number', 'رقم الجواز', 4);
        req('date_of_birth', 'تاريخ الميلاد');
        req('user-email', 'البريد الإلكتروني');
        req('mobile_1', 'رقم المتحرك');

        if (membershipStatus === 'تجديد') {
            req('previous_membership_number', 'رقم العضوية السابقة');
        }

        // Dependents
        dependents.forEach((_, idx) => {
            const pos = idx + 1;
            req(`dependent_${pos}_name`, 'اسم المنتسب', 2);
            req(`dependent_${pos}_gender`, 'الجنس');
            req(`dependent_${pos}_dob`, 'تاريخ الميلاد');
        });

        // Email format
        const emailVal = (data.get('user-email') as string || '').trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
            errs['user-email'] = 'يرجى إدخال بريد إلكتروني صحيح';

        // Membership type — at least one checkbox
        if (data.getAll('membership_type').length === 0)
            errs['membership_type'] = 'يرجى اختيار نوع العضوية واحد على الأقل';

        // Membership status — radio
        if (!data.get('membership_status'))
            errs['membership_status'] = 'يرجى اختيار حالة الطلب';

        // File uploads
        const passportFile = data.get('passport_copy') as File;
        if (!passportFile || passportFile.size === 0)
            errs['passport_copy'] = 'يرجى رفع صورة جواز السفر';

        const photoFile = data.get('personal_photo') as File;
        if (!photoFile || photoFile.size === 0)
            errs['personal_photo'] = 'يرجى رفع الصورة الشخصية';

        // Consent
        if (!data.get('consent_rules_acknowledged'))
            errs['consent_rules_acknowledged'] = 'يجب الموافقة على الشروط والأحكام للمتابعة';

        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            if (topRef.current) {
                const y = topRef.current.getBoundingClientRect().top + window.scrollY - 150;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData(form);
            formData.append('formId', formId);
            formData.append('application_date', new Date().toISOString().split('T')[0]);
            const result = await submitMembershipFormAction(formData);

            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setFieldErrors({});
                form.reset();
                setDependents([]);
                nextId.current = 1;
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
                const y = topRef.current.getBoundingClientRect().top + window.scrollY - 150;
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
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSubmit} onChange={handleChange} noValidate>

                    {/* ══ 1. Applicant Info ══════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={User} title="بيانات مقدم الطلب" color="purple" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TextInput label="الاسم الكامل" name="full_name" required minLength={2} maxLength={150} placeholder="الاسم الكامل كما في جواز السفر" error={fieldErrors['full_name']} />
                            <TextInput label="الجنسية" name="nationality" required minLength={2} maxLength={80} placeholder="الجنسية" error={fieldErrors['nationality']} />
                            <SelectInput label="الجنس" name="gender" required error={fieldErrors['gender']}>
                                <option value="">اختر الجنس...</option>
                                <option value="ذكر">ذكر</option>
                                <option value="أنثى">أنثى</option>
                            </SelectInput>
                            <DateInput label="تاريخ الميلاد" name="date_of_birth" required error={fieldErrors['date_of_birth']} />
                            <TextInput label="رقم الجواز" name="passport_number" required minLength={4} maxLength={30} placeholder="مثال: A12345678" error={fieldErrors['passport_number']} />
                            <TextInput label="المهنة" name="occupation" maxLength={120} placeholder="المهنة الحالية" error={fieldErrors['occupation']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 2. Contact Info ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-5">
                        <SectionHeader icon={Phone} title="بيانات الاتصال" color="blue" />
                        <EmailInput label="البريد الإلكتروني" name="user-email" required placeholder="example@mail.com" error={fieldErrors['user-email']} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <TelInput label="رقم المتحرك (1)" name="mobile_1" required placeholder="+971 5X XXX XXXX" error={fieldErrors['mobile_1']} />
                            <TelInput label="رقم المتحرك (2)" name="mobile_2" placeholder="+971 5X XXX XXXX" error={fieldErrors['mobile_2']} />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 3. Membership Type ════════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-6">
                        <SectionHeader icon={Briefcase} title="نوع وحالة العضوية" color="purple" />

                        <Field label="نوع العضوية" required error={fieldErrors['membership_type']}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                {[
                                    { value: 'عائلية', desc: 'تشمل الزوج/ة والأبناء' },
                                    { value: 'فردية', desc: 'للفرد الواحد فقط' },
                                ].map(({ value, desc }) => (
                                    <label key={value} className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 has-checked:border-purple-500 has-checked:bg-purple-50 transition-all group">
                                        <div className="relative w-5 h-5 shrink-0">
                                            <input type="checkbox" name="membership_type" value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:outline-none checked:border-purple-600 checked:bg-purple-600 transition-all" />
                                            <CheckCircle2 size={14} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-purple-700">{value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </Field>

                        <Divider />

                        <SectionHeader icon={CheckCircle2} title="عضوية نادي السباحة" color="blue" />
                        <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 has-checked:border-blue-500 has-checked:bg-blue-50 transition-all group">
                            <div className="relative w-5 h-5 shrink-0">
                                <input type="checkbox" name="swimming_membership" value="نعم" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:outline-none checked:border-blue-600 checked:bg-blue-600 transition-all" />
                                <CheckCircle2 size={14} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700">الاشتراك في نادي السباحة</p>
                            </div>
                        </label>

                        <Divider />

                        <Field label="نوع الطلب" required error={fieldErrors['membership_status']}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                {[
                                    { value: 'جديد', desc: 'عضوية جديدة' },
                                    { value: 'تجديد', desc: 'تجديد عضوية قائمة' },
                                ].map(({ value, desc }) => (
                                    <label key={value} className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/70 cursor-pointer hover:border-purple-400 hover:bg-purple-50/40 has-checked:border-purple-500 has-checked:bg-purple-50 transition-all">
                                        <div className="relative w-5 h-5 shrink-0">
                                            <input type="radio" name="membership_status" value={value} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:outline-none checked:border-purple-600 transition-all" />
                                            <div className="w-2.5 h-2.5 bg-purple-600 rounded-full absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 scale-0 peer-checked:scale-100 transition-all" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{value}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </Field>

                        <Divider />

                        {membershipStatus === 'تجديد' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <TextInput
                                    label="رقم العضوية السابقة"
                                    name="previous_membership_number"
                                    required
                                    maxLength={50}
                                    placeholder="A-0000"
                                    error={fieldErrors['previous_membership_number']}
                                />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 4. Dependents ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center shrink-0">
                                    <Users size={20} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">أسماء الزوجة والأبناء</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">للعضوية العائلية فقط · الحد الأقصى 6 منتسبين</p>
                                </div>
                            </div>
                            <button type="button" onClick={addDependent} disabled={dependents.length >= 6}
                                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer self-start sm:self-auto">
                                <Plus size={14} /> إضافة منتسب
                            </button>
                        </div>

                        {dependents.length === 0 ? (
                            <div className="py-10 flex flex-col items-center justify-center text-center gap-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                <Users size={32} className="text-gray-300" />
                                <p className="text-sm text-gray-400 font-medium">لا يوجد منتسبون مضافون بعد</p>
                                <p className="text-xs text-gray-300">استخدم زر "إضافة منتسب" أعلاه لإضافة زوجة أو أبناء</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {dependents.map((id, idx) => (
                                    <div key={id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                                                <span className="text-sm font-bold text-gray-700">بيانات المنتسب</span>
                                            </div>
                                            <button type="button" onClick={() => removeDependent(id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl text-red-400 bg-red-50 hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <TextInput label="الاسم الكامل" name={`dependent_${idx + 1}_name`} maxLength={150} placeholder="اسم المنتسب" error={fieldErrors[`dependent_${idx + 1}_name`]} />
                                            <SelectInput label="الجنس" name={`dependent_${idx + 1}_gender`} error={fieldErrors[`dependent_${idx + 1}_gender`]}>
                                                <option value="">اختر الجنس...</option>
                                                <option value="ذكر">ذكر</option>
                                                <option value="أنثى">أنثى</option>
                                            </SelectInput>
                                            <DateInput label="تاريخ الميلاد" name={`dependent_${idx + 1}_dob`} error={fieldErrors[`dependent_${idx + 1}_dob`]} />
                                            <AutoTextarea label="ملاحظات" name={`dependent_${idx + 1}_notes`} maxLength={250} placeholder="أية ملاحظات إضافية (اختياري)" error={fieldErrors[`dependent_${idx + 1}_notes`]} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 5. Attachments ════════════════════════════════════════ */}
                    <div className="p-5 sm:p-8">
                        <SectionHeader icon={FileUp} title="المرفقات المطلوبة" color="blue" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FileUpload
                                label="صورة جواز السفر"
                                name="passport_copy"
                                required
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                hint="PDF, JPG, PNG, WEBP · الحجم الأقصى 5 MB"
                                error={fieldErrors['passport_copy']}
                            />
                            <FileUpload
                                label="صورة شخصية حديثة"
                                name="personal_photo"
                                required
                                accept=".jpg,.jpeg,.png,.webp"
                                hint="JPG, PNG, WEBP · خلفية بيضاء · الحجم الأقصى 5 MB"
                                error={fieldErrors['personal_photo']}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-8" />

                    {/* ══ 6. Consent & Submit ═══════════════════════════════════ */}
                    <div className="p-5 sm:p-8 space-y-6">
                        <div className="space-y-2">
                            <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-2xl border transition-all ${fieldErrors['consent_rules_acknowledged']
                                ? 'border-red-300 bg-red-50/40'
                                : 'border-transparent hover:bg-gray-50'
                                }`}>
                                <div className="relative w-6 h-6 shrink-0 mt-0.5">
                                    <input type="checkbox" name="consent_rules_acknowledged" value="أوافق على الشروط والأحكام الواردة في النموذج"
                                        className={`peer appearance-none w-6 h-6 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 checked:border-purple-600 checked:bg-purple-600 transition-all ${fieldErrors['consent_rules_acknowledged'] ? 'border-red-400' : 'border-gray-300'
                                            }`} />
                                    <CheckCircle2 size={16} strokeWidth={3} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                                        أوافق على الشروط والأحكام الواردة في النموذج <span className="text-red-500">*</span>
                                    </p>
                                    <div className="text-xs text-gray-500 leading-relaxed mt-4 space-y-2">
                                        <p>أقر بأن جميع البيانات المدونة صحيحة، وأتعهد بالالتزام بالنظام الأساسي للنادي الثقافي العربي واللوائح الداخلية.</p>
                                        <p>• يجب إتمام البيانات الموضحة أعلاه، مع تقديم صورة عن جواز السفر وصورة شخصية لكل منتسب لإصدار الهوية.</p>
                                        <p>• أولياء الأمور مسؤولون عن سلامة أطفالهم أثناء تواجدهم في النادي، ولا تتحمل الإدارة أي مسؤولية ناتجة عن ترك الأطفال دون إشراف مباشر منهم.</p>
                                        <p>• يُحظر على الأعضاء التعدي على العاملين أثناء تأدية عملهم، ويحق لهم التقدم بشكوى كتابية إلى الإدارة.</p>
                                        <p>• الالتزام بالملابس المحتشمة، ويُمنع دخول مبنى النادي والكافيتيريا بملابس الرياضة أو الشورت.</p>
                                        <p>• يحق للنادي إلغاء العضوية في حال إخلال العضو بالأنظمة واللوائح، أو إتلاف الممتلكات، أو القيام بنشاط يتعارض مع مبادئ وأهداف النادي.</p>
                                    </div>
                                </div>
                            </label>
                            {fieldErrors['consent_rules_acknowledged'] && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 px-1">
                                    <AlertCircle size={11} strokeWidth={2.5} />
                                    {fieldErrors['consent_rules_acknowledged']}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 active:scale-[.98] disabled:opacity-60 disabled:pointer-events-none text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-purple-600/20 transition-all duration-200 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    <span>جارٍ الإرسال...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} className="rotate-180" />
                                    <span>تقديم طلب العضوية</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
