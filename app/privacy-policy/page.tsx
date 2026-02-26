"use client";

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-25 pb-25">
      <SEO 
        title="سياسة الخصوصية" 
        description="سياسة الخصوصية للنادي الثقافي العربي في الشارقة - تعرف على كيفية جمع واستخدام بياناتك الشخصية." 
      />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">سياسة الخصوصية</h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية
          </p>
        </div>        
      </div>

      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        {/* Introduction */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">مقدمة</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              يلتزم النادي الثقافي العربي بحماية خصوصية زوار موقعنا الإلكتروني ومستخدميه. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي قد نحصل عليها منك عند استخدام موقعنا.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.section>

        {/* Information We Collect */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">المعلومات التي نجمعها</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">1. المعلومات التي تقدمها لنا</h3>
                <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>الاسم الكامل ومعلومات الاتصال عند التسجيل في الفعاليات</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>عنوان البريد الإلكتروني عند الاشتراك في النشرة الإخبارية</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>معلومات الاتصال عند استخدام نموذج التواصل</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>أي معلومات أخرى تختار مشاركتها معنا طواعية</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3 text-primary">2. المعلومات التي نجمعها تلقائياً</h3>
                <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>عنوان IP الخاص بك</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>نوع المتصفح ونظام التشغيل</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>الصفحات التي تزورها ووقت الزيارة</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>مصدر الإحالة (الموقع الذي أتيت منه)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* How We Use Information */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">كيفية استخدام المعلومات</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              نستخدم المعلومات التي نجمعها للأغراض التالية:
            </p>
            <ul className="space-y-3 text-muted-foreground text-lg leading-relaxed pr-6">
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>تقديم وتحسين خدماتنا الثقافية والفعاليات</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>إرسال النشرات الإخبارية والتحديثات عن الفعاليات</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>الرد على استفساراتك وطلباتك</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>تحليل استخدام الموقع لتحسين تجربة المستخدم</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>الامتثال للقوانين واللوائح المعمول بها</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Data Protection */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">حماية البيانات</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. تشمل هذه التدابير:
            </p>
            <ul className="space-y-3 text-muted-foreground text-lg leading-relaxed pr-6">
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>استخدام تقنيات التشفير لحماية البيانات الحساسة</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>الوصول المحدود للمعلومات الشخصية للموظفين المصرح لهم فقط</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>مراجعة منتظمة لسياسات الأمان وإجراءات جمع البيانات</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>النسخ الاحتياطي الآمن للبيانات</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Your Rights */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">حقوقك</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              لديك الحق في:
            </p>
            <ul className="space-y-3 text-muted-foreground text-lg leading-relaxed pr-6">
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>الوصول إلى معلوماتك الشخصية التي نحتفظ بها</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>طلب تصحيح أي معلومات غير دقيقة</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>طلب حذف معلوماتك الشخصية</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>الاعتراض على معالجة معلوماتك الشخصية</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>إلغاء الاشتراك في النشرات الإخبارية في أي وقت</span>
              </li>
            </ul>
            <p className="text-muted-foreground text-lg leading-relaxed mt-6">
              لممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر البريد الإلكتروني: <a href="mailto:info@shjarabclub.ae" className="text-club-purple hover:underline font-bold">info@shjarabclub.ae</a>
            </p>
          </div>
        </motion.section>

        {/* Cookies */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">ملفات تعريف الارتباط (Cookies)</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              نستخدم ملفات تعريف الارتباط لتحسين تجربة استخدام موقعنا. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك. يرجى ملاحظة أن تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف معينة في الموقع.
            </p>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-8 md:p-12 rounded-[2rem] border border-club-purple/20">
            <h2 className="text-2xl font-bold mb-4 text-primary">للاستفسارات</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى التواصل معنا:
            </p>
            <div className="space-y-2 text-muted-foreground text-lg">
              <p><strong className="text-primary">البريد الإلكتروني:</strong> <a href="mailto:info@shjarabclub.ae" className="text-club-purple hover:underline">info@shjarabclub.ae</a></p>
              <p><strong className="text-primary">الهاتف:</strong> <span dir="ltr">+971 6 500 0000</span></p>
              <p><strong className="text-primary">العنوان:</strong> الشارقة، منطقة الآبار، ص.ب 20021، الإمارات العربية المتحدة</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
