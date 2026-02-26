"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { ArrowLeft, Sparkles, Calendar, ChevronLeft, Clock, BookOpen, Users, Star, ArrowRight, Play, X } from 'lucide-react';
import { SectionTitle } from '@/components/SectionTitle';
import { EventCard, NewsCard } from '@/components/Cards';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { SEO } from '@/components/SEO';
import banner from '@/assets/acc-banner-3.jpg';
import arabipattern from '@/assets/acc-background-banner.svg';

// Replace with your video ID for "رحلة في أروقة النادي"
const HERO_VIDEO_ID = 'xn-_snAJKds'; // YouTube video ID – replace with actual club video
import aboutbanner from '@/assets/acc-banner-1.jpg';
//import about from '@/assets/about-banner.jpg';
import newsone from '@/assets/news-1.jpg';
import newstwo from '@/assets/news-2.jpg';
import newsthree from '@/assets/news-3.jpg';
import newsfour from '@/assets/news-4.jpg';
import newsfive from '@/assets/news-5.jpg';
import newssix from '@/assets/news-6.jpg';
import eventone from '@/assets/event-1-u.jpg';
import eventtwo from '@/assets/event-2-u.jpg';
import eventthree from '@/assets/event-3-u.jpg';

const eventsData = [
  {
    id: 1,
    title: 'أمسية شعرية: نبض الحروف في حب الشارقة',
    date: '25 فبراير 2026',
    location: 'قاعة المحاضرات الكبرى',
    category: 'أدب وشعر',
    image: eventone,
  },
  {
    id: 2,
    title: 'ورشة عمل: فن الخط العربي والزخرفة الإسلامية',
    date: '2 مارس 2026',
    location: 'مرسم النادي',
    category: 'ورش فنية',
    image: eventtwo,
  },
  {
    id: 3,
    title: 'ندوة فكرية: الهوية الثقافية العربية في عصر الذكاء الاصطناعي',
    date: '10 مارس 2026',
    location: 'المكتبة الرقمية',
    category: 'ندوات',
    image: eventthree,
  }
];

const newsData = [
  {
    id: 1,
    title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026',
    excerpt: 'في خطوة تهدف لتعزيز المواهب الشابة، أعلن النادي عن إطلاق سلسلة من الورش التخصصية الموجهة للأطفال واليافعين في مجالات الأدب والفنون...',
    date: '12 فبراير 2026',
    category: 'أخبار النادي',
    image: newsone
  },
  {
    id: 2,
    title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة',
    excerpt: 'استقبل النادي الثقافي العربي وفداً رفيع المستوى لبحث سبل التعاون الثقافي المشترك وتبادل الخبرات في تنظيم المهرجانات الأدبية والأنشطة المجتمعية...',
    date: '10 فبراير 2026',
    category: 'زيارات',
    image: newstwo
  },
  {
    id: 3,
    title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026',
    excerpt: 'في خطوة تهدف لتعزيز المواهب الشابة، أعلن النادي عن إطلاق سلسلة من الورش التخصصية الموجهة للأطفال واليافعين في مجالات الأدب والفنون...',
    date: '12 فبراير 2026',
    category: 'أخبار النادي',
    image: newsthree
  },
  {
    id: 4,
    title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة',
    excerpt: 'استقبل النادي الثقافي العربي وفداً رفيع المستوى لبحث سبل التعاون الثقافي المشترك وتبادل الخبرات في تنظيم المهرجانات الأدبية والأنشطة المجتمعية...',
    date: '10 فبراير 2026',
    category: 'زيارات',
    image: newsfour
  },
  {
    id: 5,
    title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026',
    excerpt: 'في خطوة تهدف لتعزيز المواهب الشابة، أعلن النادي عن إطلاق سلسلة من الورش التخصصية الموجهة للأطفال واليافعين في مجالات الأدب والفنون...',
    date: '12 فبراير 2026',
    category: 'أخبار النادي',
    image: newsfive
  },
  {
    id: 6,
    title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة',
    excerpt: 'استقبل النادي الثقافي العربي وفداً رفيع المستوى لبحث سبل التعاون الثقافي المشترك وتبادل الخبرات في تنظيم المهرجانات الأدبية والأنشطة المجتمعية...',
    date: '10 فبراير 2026',
    category: 'زيارات',
    image: newssix
  }
];

export default function Home() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="flex flex-col">
      <SEO 
        title="الرئيسية" 
        description="الموقع الرسمي للد الثقافي العربي في الشارقة - منارة الثقافة والأدب والإبداع العربي."
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-secondary">

     


        <div className="absolute inset-0 opacity-10 pointer-events-none"  style={{ backgroundImage: `url(${arabipattern})`, backgroundSize: 'contain', backgroundPosition: 'center' }}>
          {/* <ImageWithFallback 
            src={arabipattern} 
            alt="Hero Background"
            className="w-full h-full object-contain grayscale"
          /> */}
          {/* Bottom to top shadow */}
          {/* <div className="absolute inset-0 bg-gradient-to-l from-black/90"></div> */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-accent-purple/10 to-transparent z-0" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/50 to-transparent z-0" />
        </div>

         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none rotate-12 z-0">
        {/* <img src={logo} alt="" className="w-full h-full object-contain" /> */}
      </div>

        <div className="container max-w-7xl mx-auto relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* <div className="inline-block px-4 py-1 bg-club-purple rounded-full text-sm font-bold mb-6">
              مرحباً بكم في بيت المثقفين العرب
            </div> */}
             <div className="inline-flex items-center space-x-reverse space-x-3 px-6 py-2.5 bg-white/80 backdrop-blur-md border border-accent-purple/10 text-accent-purple rounded-full text-sm font-bold shadow-sm mb-6">
               <Sparkles size={16} className="text-accent-purple animate-pulse" />
              <span>نحتفي بمرور 45 عاماً من الإبداع الثقافي</span>
            </div>
            <div className="space-y-4 mb-6">
              <h1 className="text-6xl md:text-6xl font-bold text-primary tracking-tight">
                واحة الفكر <span className="text-accent-purple">ومحراب الأدب</span>
              </h1>
              <div className="w-24 h-2 bg-accent-blue rounded-full" />
            </div>

            <p className="text-xl text-primary/70 max-w-xl leading-relaxed font-medium mb-6">
              في قلب الشارقة، يزدهر النادي الثقافي العربي كجسر يربط بين عراقة الماضي وطموح المستقبل، حيث تجتمع العقول لترسم ملامح الغد الثقافي.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="bg-club-purple hover:bg-opacity-90 transition-all text-white px-6 py-2 rounded-xl font-bold text-md flex items-center gap-3"
                onClick={() => window.location.href = '/events'}
              >
                <span>استكشف فعالياتنا</span>
                <ArrowLeft size={20} />
              </button>
              {/* <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 transition-all text-white px-8 py-4 rounded-xl font-bold text-lg">
                تعرف علينا
              </button> */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="group flex items-center px-4 py-2 font-tajawal font-bold text-primary hover:text-accent-purple transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full border-2 border-primary/10 flex items-center justify-center bg-white shadow-lg group-hover:bg-accent-purple group-hover:border-accent group-hover:text-black transition-all duration-500">
                  <Play size={24} fill="currentColor" />
                </div>
                <span className="text-lg pr-3">رحلة في أروقة النادي</span>
              </button>
            </div>

          </motion.div>
        
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="relative"
          >
            <div className="relative z-20">
              {/* Main Image Card */}
              <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-white">
                <ImageWithFallback 
                  src={banner} 
                  alt="ثقافة الشارقة"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                
                {/* Floating Info Badge */}
                

                <div className="absolute bottom-5 right-5 left-5 p-4 bg-white/10 backdrop-blur-md rounded-[1rem] border border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="inline-block px-3 py-1 bg-accent-blue text-primary text-[10px] font-bold rounded-full mb-3 uppercase tracking-tighter">الحدث القادم</span>
                      <h4 className="text-white text-2xl font-bold font-tajawal">مهرجان الشارقة للمسرح العربي</h4>
                    </div>
                    
                  </div>
                </div>
              </div>

              
            
            </div>
          </motion.div>
        </div>
        </div>

       
      </section>

      {/* Stats Section */}
      {/* <section className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl p-10 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 -mt-32 relative z-20 border border-border">
          {[
            { label: 'فعالية سنوية', value: '+120', icon: Star, color: 'text-club-purple' },
            { label: 'عضو نشط', value: '+2,500', icon: Users, color: 'text-club-blue' },
            { label: 'إصدار أدبي', value: '+500', icon: BookOpen, color: 'text-club-purple' },
            { label: 'عام من العطاء', value: '45', icon: Star, color: 'text-club-blue' },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-2">
              <stat.icon size={32} className={`${stat.color} mb-2`} />
              <div className="text-3xl font-black text-primary">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* About Preview */}
      <section className="bg-white py-24 md:px-6 ">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback src={aboutbanner}  alt="Sharjah Culture" className="w-full h-[500px] object-cover" />
            </div>
            {/* <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-club-blue/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-club-purple/20 rounded-full blur-3xl -z-10"></div> */}
          </div>
          <div className="lg:w-1/2">
           
            <SectionTitle 
              title="رسالة النادي ورؤيته" 
              subtitle="نسعى لأن نكون المظلة الجامعة للمثقفين والمبدعين العرب، ومنصة انطلاق للمبادرات الثقافية التي تعزز قيم الانتماء والوعي."
            />
            <ul className="space-y-6 mb-10">
              {[
                'دعم المبدعين في مختلف مجالات الأدب والفكر والفنون.',
                'تنظيم الفعاليات التي تعرّف بالثقافة العربية الأصيلة.',
                'مد جسور التواصل مع المؤسسات الثقافية داخل الدولة وخارجها.',
                'الاحتفاء بكنوز اللغة العربية وتعزيز استخدامها.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-club-purple/10 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-club-purple"></div>
                  </div>
                  <span className="text-lg text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <button className="text-club-purple font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all underline underline-offset-8" onClick={() => window.location.href = '/about'}>
              <span>اقرأ المزيد عن تاريخنا</span>
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </div>
      </section>
      {/* Latest Events */}
      <section className="bg-secondary/30 py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <SectionTitle title="فعالياتنا القادمة" />
            <button className="hidden md:flex items-center gap-2 text-club-purple font-bold border-b-2 border-club-purple pb-1 mb-12" onClick={() => window.location.href = '/events'}>
              عرض كل الفعاليات
              <ArrowLeft size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsData.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="md:hidden mt-10 text-center">
            <button className="bg-club-purple text-white px-8 py-3 rounded-xl font-bold w-full">
              عرض الكل
            </button>
          </div>
        </div>
      </section>

         {/* Sharjah Culture Highlight */}
      <section className="bg-primary text-white py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
           <ImageWithFallback src="https://images.unsplash.com/photo-1764594021930-6930410949b9?q=80&w=1000" alt="Pattern" className="w-[800px]" />
        </div>
        <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">الشارقة: عاصمة عالمية للثقافة والكتاب</h2>
            <p className="text-xl text-secondary/70 mb-12 leading-relaxed">
              تستمد الشارقة قوتها من رؤية صاحب السمو الشيخ الدكتور سلطان بن محمد القاسمي، الذي جعل من الثقافة ركيزة أساسية للتنمية البشرية، ونحن في النادي الثقافي العربي نفخر بأن نكون جزءاً من هذا المشروع الحضاري الكبير.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h4 className="text-club-blue text-2xl font-bold mb-4">التراث</h4>
                  <p className="text-secondary/60 text-sm">الحفا على الهوية الأصيلة في عالم متسارع.</p>
               </div>
               <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h4 className="text-club-blue text-2xl font-bold mb-4">المعرفة</h4>
                  <p className="text-secondary/60 text-sm">مجتمع يقرأ، يبتكر، ويقود المستقبل بالعلم.</p>
               </div>
               <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h4 className="text-club-blue text-2xl font-bold mb-4">الحوار</h4>
                  <p className="text-secondary/60 text-sm">مد جسور التعايش والإبداع مع كافة الثقافات.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <SectionTitle title="آخر الأخبار والتقارير" />
          <Link href="/news" className="hidden md:flex items-center gap-2 text-club-purple font-bold border-b-2 border-club-purple pb-1">
            عرض المركز الإعلامي
            <ArrowLeft size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...newsData, ...newsData].slice(0, 6).map((news, idx) => (
            <NewsCard key={`${news.id}-${idx}`} news={news} />
          ))}
        </div>
        <div className="mt-12 text-center md:hidden">
           <Link href="/news" className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all w-full">
              زيارة المركز الإعلامي
           </Link>
        </div>
      </section>


      
<section className="bg-club-purple p-12 md:p-20 px-4 md:px-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 border-[40px] border-white rounded-full" />
                <div className="absolute bottom-10 left-10 w-96 h-96 border-[60px] border-white rounded-full" />
              </div>
              <div className="container max-w-2xl mx-auto relative z-10 text-center text-white max-w-2xl">
                <h2 className="text-4xl font-bold font-tajawal mb-6">ابقَ على اطلاع دائم</h2>
                <p className="text-white/80 mb-10 text-lg">اشترك في نشرتنا البريدية لتصلك آخر أخبار الفعاليات والنشاطات الثقافية مباشرة إلى بريدك الإلكتروني.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="بريدك الإلكتروني" 
                    className="flex-1 bg-white/20 border border-white/30 px-6 py-4 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30"
                  />
                  <button className="bg-white text-club-purple px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all">اشترك الآن</button>
                </div>
              </div>
            </section>

      {/* Video modal – "رحلة في أروقة النادي" */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowVideoModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="فيديو: رحلة في أروقة النادي"
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="إغلاق"
            >
              <X size={24} />
            </button>
            <iframe
              title="رحلة في أروقة النادي"
              src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
