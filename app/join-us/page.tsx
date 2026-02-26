"use client";

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import Link from 'next/link';

import { UserPlus, Gift, Building, MessageSquare } from 'lucide-react';

const joinCards = [
  {
    title: 'تسجيل العضوية',
    description: 'انضم إلى مجتمع المثقفين والمبدعين العرب عبر نموذج تسجيل بسيط وسريع.',
    icon: UserPlus,
    path: '/membership-registration',
  },
  {
    title: 'فوائد العضوية',
    description: 'اكتشف جميع المزايا والخدمات الحصرية التي يتمتع بها أعضاء النادي.',
    icon: Gift,
    path: '/membership-benefits',
  },
  {
    title: 'حجز المرافق',
    description: 'احجز قاعات ومرافق النادي لفعالياتك الثقافية والاجتماعية بسهولة.',
    icon: Building,
    path: '/facility-booking',
  },
  {
    title: 'شارك آراءك',
    description: 'شارك آراءك ومقترحاتك معنا لتحسين الخدمات والفعاليات.',
    icon: MessageSquare,
    path: '/share-opinions',
  },
];

export default function JoinUs() {
  return (
    <div className="pt-25 pb-25">
      <SEO
        title="انضم إلينا"
        description="انضم إلى النادي الثقافي العربي، تعرف على مزايا العضوية وحجز المرافق بسهولة."
      />

      {/* Hero */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">
            انضم إلى عائلة النادي
          </h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            اختر الطريقة التي تناسبك للمشاركة في أنشطة النادي والاستفادة من خدماته المتنوعة.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {joinCards.map((card, index) => (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-[2rem] border border-border shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <Link href={card.path} className="flex flex-col h-full">
                  <div className="p-7 flex-1 flex flex-col gap-4 text-right">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="w-11 h-11 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                        <card.icon size={24} />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-primary">{card.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="px-7 pb-6 pt-2 flex items-center justify-between text-sm font-bold text-club-purple">
                    <span>انتقل إلى الصفحة</span>
                    <span className="text-xs text-muted-foreground">Join Us</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

