"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { NewsCard } from '@/components/Cards';
import { User, BookOpen, Twitter, Linkedin, ArrowRight, MapPin, Globe } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const authorsData = {
  '1': {
    id: 1,
    name: 'د. أحمد محمود',
    role: 'كاتب وباحث ثقافي',
    bio: 'دكتوراه في الأدب المقارن من جامعة الشارقة، متخصص في دراسة اللسانيات وتحليل الخطاب العربي المعاصر. يساهم بشكل دوري في مجلة الكلمة وله العديد من الأبحاث المنشورة في الدوريات العربية الرصينة.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400',
    social: { twitter: '#', linkedin: '#' },
    articles: [
      { id: 1, title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026', date: '12 فبراير 2026', category: 'أخبار النادي', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800' },
      { id: 3, title: 'إصدار العدد الجديد من مجلة "الكلمة": قراءات في الأدب المعاصر', date: '5 فبراير 2026', category: 'إصدارات', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800' }
    ]
  },
  '2': {
    id: 2,
    name: 'سارة القاسمي',
    role: 'ناقدة فنية',
    bio: 'فنانة تشكيلية وناقدة فنية، تشرف على القسم الفني بالنادي الثقافي العربي. تهتم بتوثيق تاريخ الفن التشكيلي في دولة الإمارات وتنظيم المعارض الفنية العالمية.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400',
    social: { twitter: '#', linkedin: '#' },
    articles: [
      { id: 2, title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة', date: '10 فبراير 2026', category: 'زيارات', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800' }
    ]
  },
  '3': {
    id: 3,
    name: 'محمد الراشد',
    role: 'صحفي ثقافي',
    bio: 'صحفي متخصص في الشأن الثقافي والاجتماعي، يغطي فعاليات إمارة الشارقة الثقافية منذ أكثر من عقد. يتميز بأسلوبه السردي الشيق وقدرته على رصد التفاصيل الدقيقة للأحداث.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    social: { twitter: '#', linkedin: '#' },
    articles: []
  }
};

export default function AuthorDetail() {
  const { id } = useParams() as { id: string };
  const author = authorsData[id as keyof typeof authorsData] || authorsData['1'];

  return (
    <div className="pt-25 pb-25 min-h-screen">
      <SEO title={author.name} description={author.bio} />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-border mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-club-purple/5 -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative">
            <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 relative">
              <div className="absolute inset-0 bg-club-blue rounded-[3rem] rotate-6"></div>
              <ImageWithFallback 
                src={author.image} 
                className="w-full h-full object-cover rounded-[3rem] relative z-10 border-8 border-white shadow-2xl" 
              />
            </div>
            
            <div className="flex-grow text-center md:text-right">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{author.name}</h1>
                  <div className="text-club-purple text-xl font-bold">{author.role}</div>
                </div>
                <div className="flex gap-4">
                  <a href={author.social.twitter} className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary hover:bg-club-purple hover:text-white transition-all">
                    <Twitter size={20} />
                  </a>
                  <a href={author.social.linkedin} className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary hover:bg-club-purple hover:text-white transition-all">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mb-8">
                {author.bio}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-club" />
                  <span>الشارقة، الإمارات</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-club" />
                  <span>عضو النادي الثقافي العربي</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-club" />
                  <span>{author.articles.length} مساهمة منشورة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Content */}
        <div>
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
            <div className="w-2 h-10 bg-club-blue rounded-full"></div>
            مساهمات {author.name}
          </h2>

          {author.articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {author.articles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <NewsCard news={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary/20 rounded-[2rem] p-16 text-center border-2 border-dashed border-border">
              <p className="text-xl text-muted-foreground">لا توجد مقالات منشورة حالياً لهذا الكاتب.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
