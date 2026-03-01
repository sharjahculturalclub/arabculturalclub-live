"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { NewsCard } from '@/components/Cards';
import { Search, ArrowRight, Filter } from 'lucide-react';

const mockAllData = [
  { id: 1, type: 'news', title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026', excerpt: 'في خطوة تهدف لتعزيز المواهب الشابة، أعلن النادي عن إطلاق سلسلة من الورش التخصصية الموجهة للأطفال واليافعين في مجالات الأدب والفنون...', date: '12 فبراير 2026', category: 'أخبار النادي', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800' },
  { id: 2, type: 'news', title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة', excerpt: 'استقبل النادي الثقافي العربي وفداً رفيع المستوى لبحث سبل التعاون الثقافي المشترك وتبادل الخبرات في تنظيم المهرجانات الأدبية والأنشطة المجتمعية...', date: '10 فبراير 2026', category: 'زيارات', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800' },
  { id: 3, type: 'news', title: 'إصدار العدد الجديد من مجلة "الكلمة": قراءات في الأدب المعاصر', excerpt: 'صدر مؤخراً العدد الجديد من مجلة الكلمة الفصلية التي يصدرها النادي، متضمناً مجموعة من الدراسات النقدية والقصائد والقصص القصيرة لنخبة من الكتاب العرب...', date: '5 فبراير 2026', category: 'إصدارات', image: 'https://images.unsplash.com/photo-1544716278-ca5e3r4abd8c?q=80&w=800' },
  { id: 4, type: 'event', title: 'أمسية شعرية: نبض الحروف في حب الشارقة', date: '25 فبراير 2026', location: 'قاعة المحاضرات الكبرى', category: 'أدب وشعر', image: 'https://images.unsplash.com/photo-1518131359073-ad493c9f7a6a?q=80&w=800' },
  { id: 5, type: 'event', title: 'ورشة عمل: فن الخط العربي والزخرفة الإسلامية', date: '2 مارس 2026', location: 'مرسم النادي', category: 'ورش فنية', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800' },
];

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="pt-25 pb-25 text-center">جاري البحث...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = mockAllData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    (item.excerpt && item.excerpt.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={`نتائج البحث عن: ${query}`}
        description={`نتائج البحث عن ${query} في موقع النادي الثقافي العربي.`}
        url="https://shjarabclub.ae/search"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: "نتائج البحث", item: "https://shjarabclub.ae/search" }
        ]}
      />

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-12">
          <Link href="/" className="text-club-purple font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
            <ArrowRight size={18} />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            نتائج البحث عن: <span className="text-club-purple">"{query}"</span>
          </h1>
          <p className="text-muted-foreground">تم العثور على {results.length} نتيجة</p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((item, idx) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <NewsCard news={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary/20 rounded-[2rem] p-16 text-center border-2 border-dashed border-border">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search size={40} className="text-muted-foreground/30" />
            </div>
            <h2 className="text-2xl font-bold mb-4">لم نجد أي نتائج لـ "{query}"</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              حاول استخدام كلمات مفتاحية أخرى أو تصفح الأقسام الرئيسية للموقع.
            </p>
            <Link href="/news" className="bg-club-purple text-white px-8 py-3 rounded-xl font-bold inline-block">
              تصفح المركز الإعلامي
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
