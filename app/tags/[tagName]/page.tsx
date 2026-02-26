"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { NewsCard } from '@/components/Cards';
import { Tag, ArrowRight } from 'lucide-react';

const mockDataByTag = [
  { id: 1, title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026', excerpt: 'في خطوة تهدف لتعزيز المواهب الشابة، أعلن النادي عن إطلاق سلسلة من الورش التخصصية الموجهة للأطفال واليافعين في مجالات الأدب والفنون...', date: '12 فبراير 2026', category: 'أخبار النادي', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800' },
  { id: 6, title: 'ندوة "مستقبل اللغة العربية في الفضاء الرقمي" تستقطب الأكاديميين', excerpt: 'عقد النادي الثقافي العربي ندوة فكرية بعنوان مستقبل اللغة العربية في الفضاء الرقمي بمشاركة نخبة من المتخصصين...', date: '20 يناير 2026', category: 'ندوات', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200' },
];

export default function TagsResults() {
  const { tagName } = useParams() as { tagName: string };

  return (
    <div className="pt-25 pb-25 min-h-screen">
      <SEO title={`مواضيع: ${tagName}`} description={`تصفح جميع المقالات والفعاليات المتعلقة بـ ${tagName}.`} />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-12">
          <Link href="/news" className="text-club-purple font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
            <ArrowRight size={18} />
            العودة للمركز الإعلامي
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple">
              <Tag size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              وسم: <span className="text-club-purple">{tagName}</span>
            </h1>
          </div>
          <p className="text-muted-foreground">تصفح المحتوى المرتبط بهذا الوسم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockDataByTag.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <NewsCard news={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
