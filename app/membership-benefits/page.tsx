"use client";

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { 
  Ticket, BookOpen, Users, Calendar, Gift, Star, 
  Library, Video, Mail, Phone, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';


const benefits = [
  {
    icon: Ticket,
    title: 'حضور مجاني للفعاليات',
    description: 'الحضور المجاني لمعظم الفعاليات الثقافية والأدبية التي ينظمها النادي، بما في ذلك الأمسيات الشعرية، الندوات، والمحاضرات.',
    color: 'text-club-purple'
  },
  {
    icon: BookOpen,
    title: 'الوصول إلى المكتبة',
    description: 'إمكانية استعارة الكتب من مكتبة النادي الغنية بالمراجع الثقافية والأدبية، بالإضافة إلى الوصول إلى الموارد الرقمية.',
    color: 'text-club-blue'
  },
  {
    icon: Users,
    title: 'شبكة تواصل ثقافية',
    description: 'الانضمام إلى مجتمع من المثقفين والمبدعين العرب، والمشاركة في الأنشطة الحصرية للأعضاء وورش العمل الخاصة.',
    color: 'text-club-purple'
  },
  {
    icon: Calendar,
    title: 'أولوية في التسجيل',
    description: 'الأولوية في التسجيل للورش التدريبية والدورات المتخصصة، مع خصومات خاصة على البرامج المدفوعة.',
    color: 'text-club-blue'
  },
  {
    icon: Gift,
    title: 'خصومات حصرية',
    description: 'خصومات على الكتب والإصدارات الثقافية، والمنتجات المتعلقة بالفعاليات، بالإضافة إلى خصومات من شركائنا.',
    color: 'text-club-purple'
  },
  {
    icon: Video,
    title: 'محتوى حصري',
    description: 'الوصول إلى المحتوى الحصري مثل تسجيلات الفعاليات، المحاضرات المسجلة، والمواد التعليمية الإضافية.',
    color: 'text-club-blue'
  },
  {
    icon: Mail,
    title: 'النشرة الإخبارية',
    description: 'استلام النشرة الإخبارية الشهرية التي تحتوي على آخر الأخبار، الفعاليات القادمة، والمقالات الثقافية الحصرية.',
    color: 'text-club-purple'
  },
  {
    icon: Star,
    title: 'عضوية شرفية',
    description: 'إمكانية الترقية إلى عضوية شرفية للمساهمين البارزين في الأنشطة الثقافية، مع مزايا إضافية خاصة.',
    color: 'text-club-blue'
  }
];

const membershipTypes = [
  {
    type: 'عضوية عادية',
    price: '200',
    period: 'سنوياً',
    features: [
      'حضور جميع الفعاليات الثقافية',
      'استعارة الكتب من المكتبة',
      'الوصول إلى الموارد الرقمية',
      'النشرة الإخبارية الشهرية',
      'خصومات على الورش والدورات',
      'المشاركة في الأنشطة الحصرية'
    ]
  },
  {
    type: 'عضوية شرفية',
    price: '500',
    period: 'سنوياً',
    features: [
      'جميع مزايا العضوية العادية',
      'أولوية في حجز المرافق',
      'دعوات حصرية للفعاليات الخاصة',
      'خصومات إضافية على جميع الخدمات',
      'إمكانية استضافة فعاليات خاصة',
      'شهادة عضوية شرفية'
    ]
  }
];

export default function MembershipBenefits() {
  return (
    <div className="pt-25 pb-25">
      <SEO 
        title="فوائد العضوية" 
        description="اكتشف جميع المزايا والخدمات الحصرية لأعضاء النادي الثقافي العربي." 
      />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">فوائد العضوية</h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            انضم إلى مجتمع المثقفين واستمتع بمجموعة واسعة من المزايا والخدمات الحصرية
          </p>
        </div>        
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Benefits Grid */}
        <section className="mb-24">
          <div className="text-center mb-12">  
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center">المزايا والخدمات
              <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
            </h2>
            <p className="text-muted-foreground text-lg">اكتشف جميع المزايا التي تحصل عليها كعضو في النادي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 bg-${benefit.color.includes('purple') ? 'club-purple' : 'club-blue'}/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${benefit.color}`}>
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-primary">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

       

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-12 rounded-[2rem] border border-club-purple/20 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-primary">جاهز للانضمام؟</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            انضم إلى مجتمع المثقفين والمبدعين العرب واستمتع بجميع المزايا الحصرية. التسجيل سهل وسريع!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership-registration"
              className="inline-flex items-center gap-2 bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold px-8 py-4 rounded-xl shadow-lg"
            >
              <span>سجل للعضوية الآن</span>
              <ArrowLeft size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-secondary/50 transition-all text-primary font-bold px-8 py-4 rounded-xl border border-border"
            >
              <Phone size={20} />
              <span>تواصل معنا</span>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
