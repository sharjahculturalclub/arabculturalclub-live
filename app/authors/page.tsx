"use client";

import React from 'react';
import Link from 'next/link';

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { User, BookOpen, MessageSquare, ArrowLeft, Twitter, Linkedin } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const authors = [
  {
    id: 1,
    name: 'د. أحمد محمود',
    role: 'كاتب وباحث ثقافي',
    bio: 'متخصص في الأدب العربي المقارن واللسانيات، له العديد من الدراسات المنشورة في مجلة "الكلمة".',
    articlesCount: 12,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400',
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 2,
    name: 'سارة القاسمي',
    role: 'ناقدة فنية',
    bio: 'مهتمة بتوثيق الحراك التشكيلي في دولة الإمارات والشارقة، ومسؤولة قسم الفنون في النادي.',
    articlesCount: 8,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400',
    social: { twitter: '#', linkedin: '#' }
  },
  {
    id: 3,
    name: 'محمد الراشد',
    role: 'صحفي ثقافي',
    bio: 'يغطي أخبار وفعاليات النادي الثقافي العربي منذ عام 2015، متخصص في التقارير الميدانية.',
    articlesCount: 45,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    social: { twitter: '#', linkedin: '#' }
  }
];

export default function Authors() {
  return (
    <div className="pt-25 pb-25">
      <SEO title="كتابنا ومبدعونا" description="تعرف على نخبة من الكتاب والمبدعين المساهمين في إثراء المحتوى الثقافي للنادي." />


      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary"> 
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10 ">
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-black"> أقلام النادي </h1>
          <p className="text-x2 leading-relaxed text-black">
            نخبة من المثقفين والأدباء الذين يساهمون بأفكارهم وإبداعاتهم في إثراء منصتنا الثقافية.
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
         

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {authors.map((author, idx) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2.5rem] p-8 border border-border shadow-sm hover:shadow-xl hover:border-club-purple transition-all text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-club-purple transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></div>
              
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-club-blue rounded-full rotate-6 group-hover:rotate-12 transition-transform"></div>
                <ImageWithFallback 
                  src={author.image} 
                  alt={author.name}
                  className="w-full h-full object-cover rounded-full relative z-10 border-4 border-white shadow-lg"
                />
              </div>

              <h2 className="text-2xl font-bold mb-2 group-hover:text-club-purple transition-colors">{author.name}</h2>
              <div className="text-club-blue font-bold text-sm mb-4">{author.role}</div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                {author.bio}
              </p>

              <div className="flex items-center justify-center gap-6 mb-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span className="text-xs font-bold">{author.articlesCount} مقال</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex gap-3">
                  <a href={author.social.twitter} className="hover:text-club-purple transition-colors"><Twitter size={18} /></a>
                  <a href={author.social.linkedin} className="hover:text-club-purple transition-colors"><Linkedin size={18} /></a>
                </div>
              </div>

              <Link 
                href={`/authors/${author.id}`}
                className="inline-flex items-center gap-2 text-club-purple font-bold group/link"
              >
                <span>شاهد جميع المساهمات</span>
                <ArrowLeft size={18} className="transition-transform group-hover/link:-translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
