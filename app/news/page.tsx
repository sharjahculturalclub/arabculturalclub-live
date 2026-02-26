"use client";

import React, { useState } from 'react';
import { SEO } from '@/components/SEO';
import { NewsCard } from '@/components/Cards';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import newsone from '@/assets/news-1.jpg';
import newstwo from '@/assets/news-2.jpg';
import newsthree from '@/assets/news-3.jpg';
import newsfour from '@/assets/news-4.jpg';
import newsfive from '@/assets/news-5.jpg';
import newssix from '@/assets/news-6.jpg';

const newsCategories = ['الكل', 'أخبار النادي', 'زيارات', 'تقارير', 'ندوات'];

const news = [
  { id: 1, title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026', excerpt: 'في خطوة تهدف لتعزيز المواهب الشابة، أعلن النادي عن إطلاق سلسلة من الورش التخصصية الموجهة للأطفال واليافعين في مجالات الأدب والفنون...', date: '12 فبراير 2026', category: 'أخبار النادي', image: newsone },
  { id: 2, title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة', excerpt: 'استقبل النادي الثقافي العربي وفداً رفيع المستوى لبحث سبل التعاون الثقافي المشترك وتبادل الخبرات في تنظيم المهرجانات الأدبية والأنشطة المجتمعية...', date: '10 فبراير 2026', category: 'زيارات', image: newstwo },
  { id: 3, title: 'إصدار العدد الجديد من مجلة "الكلمة": قراءات في الأدب المعاصر', excerpt: 'صدر مؤخراً العدد الجديد من مجلة الكلمة الفصلية التي يصدرها النادي، متضمناً مجموعة من الدراسات النقدية والقصائد والقصص القصيرة لنخبة من الكتاب العرب...', date: '5 فبراير 2026', category: 'زيارات', image: newsthree },
  { id: 4, title: 'توقيع اتفاقية تعاون مع جامعة الشارقة لدعم البحوث الأدبية', excerpt: 'وقع النادي الثقافي العربي مذكرة تفاهم مع جامعة الشارقة تهدف إلى تعزيز التعاون في مجالات البحث العلمي وتوفير فرص تدريبية لطلاب كلية الآداب...', date: '1 فبراير 2026', category: 'تقارير', image: newsfour },  
  { id: 5, title: 'اختتام فعاليات "أسبوع الخط العربي" بحضور جماهيري لافت', excerpt: 'أسدل الستار مساء أمس على فعاليات أسبوع الخط العربي الذي نظمه النادي على مدار سبعة أيام، وشهد الأسبوع حضوراً كبيراً من المهتمين وعشاق الفن الإسلامي...', date: '28 يناير 2026', category: 'تقارير', image: newsfive },
  { id: 6, title: 'ندوة "مستقبل اللغة العربية في الفضاء الرقمي" تستقطب الأكاديميين', excerpt: 'عقد النادي الثقافي العربي ندوة فكرية بعنوان مستقبل اللغة العربية في الفضاء الرقمي بمشاركة نخبة من المتخصصين...', date: '20 يناير 2026', category: 'ندوات', image: newssix },
];

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  const filteredNews = news.filter(n => {
    const matchesSearch = n.title.includes(searchTerm) || n.excerpt.includes(searchTerm);
    const matchesCategory = activeCategory === 'الكل' || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-25 pb-25">
      <SEO title="أخبار النادي" description="تابع آخر الأخبار والتقارير والفعاليات في النادي الثقافي العربي بالشارقة." />
      
      {/* Hero Header */}
     


       <div className="bg-secondary py-10 mb-10 relative overflow-hidden text-center">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-black">   المركز الإعلامي </h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            نافذتكم على أنشطة النادي، وتقاريرنا الثقافية، وإصداراتنا الأدبية المتنوعة.
          </p>
        </div>        
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex flex-wrap gap-2">
            {newsCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-club-purple text-white shadow-lg' 
                  : 'bg-white border border-border text-muted-foreground hover:border-club-purple hover:text-club-purple'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="ابحث في الأخبار والتقارير..." 
              className="pr-12 pl-4 py-3.5 bg-white border border-border rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-club-purple focus:border-transparent shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <NewsCard news={n} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-muted-foreground mb-4">عذراً، لم نجد نتائج تطابق بحثك.</div>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('الكل');}}
                className="text-club-purple font-bold underline"
              >
                إعادة ضبط البحث
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredNews.length > 0 && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:bg-secondary transition-all">
              &gt;
            </button>
            <button className="w-10 h-10 rounded-lg bg-club-purple text-white font-bold shadow-lg">1</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-border text-primary font-bold hover:bg-secondary transition-all">2</button>
            <button className="w-10 h-10 rounded-lg bg-white border border-border text-primary font-bold hover:bg-secondary transition-all">3</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:bg-secondary transition-all">
              &lt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
