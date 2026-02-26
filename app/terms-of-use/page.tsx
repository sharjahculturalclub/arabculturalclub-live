"use client";

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { FileText, AlertCircle, Shield, Users, Copyright } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="pt-25 pb-25">
      <SEO 
        title="شروط الاستخدام" 
        description="شروط وأحكام استخدام موقع النادي الثقافي العربي." 
      />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">شروط الاستخدام</h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا الإلكتروني
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
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">مقدمة</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              مرحباً بك في موقع النادي الثقافي العربي. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام موقعنا.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.section>

        {/* Acceptance of Terms */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">قبول الشروط</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقر وتوافق على:
            </p>
            <ul className="space-y-3 text-muted-foreground text-lg leading-relaxed pr-6">
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>أنك قد قرأت وفهمت هذه الشروط والأحكام</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>أنك توافق على الالتزام بجميع الشروط والأحكام المذكورة</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>أنك ستستخدم الموقع فقط للأغراض القانونية والمسموح بها</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>أنك مسؤول عن جميع الأنشطة التي تتم تحت حسابك</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Use of Website */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">استخدام الموقع</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">الاستخدام المسموح</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-3">
                  يمكنك استخدام موقعنا للأغراض التالية:
                </p>
                <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>تصفح المعلومات والمواد الثقافية المتاحة</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>التسجيل في الفعاليات والأنشطة الثقافية</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>الاشتراك في النشرات الإخبارية</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>التواصل معنا عبر نماذج الاتصال</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3 text-primary">الاستخدام غير المسموح</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-3">
                  يحظر عليك استخدام الموقع لأي من الأغراض التالية:
                </p>
                <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>نشر أو نقل أي محتوى غير قانوني أو ضار أو مسيء</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>محاولة الوصول غير المصرح به إلى أنظمة الموقع</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>إرسال رسائل غير مرغوب فيها أو بريد عشوائي</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>انتهاك حقوق الملكية الفكرية للآخرين</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-club-purple mt-2">•</span>
                    <span>استخدام الموقع بطريقة قد تعطل أو تتداخل مع عمل الموقع</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Intellectual Property */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <Copyright size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">الملكية الفكرية</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والصور والتصاميم والشعارات والعلامات التجارية، هي ملكية للنادي الثقافي العربي في الشارقة أو مقدمي المحتوى المعتمدين، ومحمية بموجب قوانين حقوق النشر والعلامات التجارية.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              لا يجوز لك نسخ أو إعادة إنتاج أو توزيع أو تعديل أو إنشاء أعمال مشتقة من أي محتوى من هذا الموقع دون الحصول على إذن كتابي مسبق منا.
            </p>
          </div>
        </motion.section>

        {/* User Content */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">المحتوى المقدم من المستخدم</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              عند إرسال أي محتوى (نصوص، صور، تعليقات، إلخ) إلى موقعنا، فإنك:
            </p>
            <ul className="space-y-3 text-muted-foreground text-lg leading-relaxed pr-6">
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>تمنحنا ترخيصاً غير حصري وقابل للتحويل لاستخدام هذا المحتوى</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>تضمن أن المحتوى لا ينتهك حقوق أي طرف ثالث</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>تتحمل المسؤولية الكاملة عن المحتوى الذي تقدمه</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>توافق على أننا قد نحذف أو نعدل أي محتوى نعتبره غير مناسب</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">إخلاء المسؤولية</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              يتم توفير الموقع "كما هو" دون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نضمن:
            </p>
            <ul className="space-y-3 text-muted-foreground text-lg leading-relaxed pr-6 mb-4">
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>أن الموقع سيعمل دون انقطاع أو أخطاء</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>أن الموقع خالٍ من الفيروسات أو المكونات الضارة</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-club-purple mt-2">•</span>
                <span>دقة أو اكتمال أو فائدة أي معلومات على الموقع</span>
              </li>
            </ul>
            <p className="text-muted-foreground text-lg leading-relaxed">
              لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام الموقع.
            </p>
          </div>
        </motion.section>

        {/* Modifications */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">تعديل الشروط</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت دون إشعار مسبق. يُنصح بمراجعة هذه الصفحة بانتظام للاطلاع على أي تغييرات. استمرار استخدامك للموقع بعد نشر التعديلات يعني موافقتك على الشروط المعدلة.
            </p>
          </div>
        </motion.section>

        {/* Governing Law */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-primary">القانون الحاكم</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين دولة الإمارات العربية المتحدة. أي نزاع ينشأ عن أو يتعلق بهذه الشروط سيخضع للاختصاص الحصري لمحاكم إمارة الشارقة.
            </p>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-8 md:p-12 rounded-[2rem] border border-club-purple/20">
            <h2 className="text-2xl font-bold mb-4 text-primary">للاستفسارات</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى التواصل معنا:
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
