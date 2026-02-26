"use client";

import React from 'react';
import { motion } from 'motion/react';
import { SectionTitle } from '@/components/SectionTitle';
import { SEO } from '@/components/SEO';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Target, Eye, Shield, Users, Award, Book, Clock, Quote } from 'lucide-react';
import newsone from '@/assets/news-1.jpg';
import newstwo from '@/assets/news-2.jpg';
import newsthree from '@/assets/news-3.jpg';
import newsfour from '@/assets/news-4.jpg';
import newsfive from '@/assets/news-5.jpg';

const values = [
  { title: 'الأصالة', description: 'التمسك بالجذور الثقافية واللغوية العربية.', icon: Shield },
  { title: 'الإبداع', description: 'دعم الأفكار الخلاقة والمبادرات المبتكرة.', icon: Award },
  { title: 'الحوار', description: 'تعزيز قيم التسامح والتعايش الثقافي.', icon: Users },
  { title: 'المعرفة', description: 'نشر العلم والأدب كركيزة لبناء المجتمع.', icon: Book },
];

const boardMembers = [
  { name: 'Name will be here', role: 'Role will be here', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400' },
  { name: 'Name will be here', role: 'Role will be here', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400' },
  { name: 'Name will be here', role: 'Role will be here', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400' },
  { name: 'Name will be here', role: 'Role will be here', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400' },
];

const milestones = [
  { year: '2025', title: 'التأسيس والبداية', description: 'تأسس النادي الثقافي العربي كأول نادٍ ثقافي يجمع المثقفين العرب في دولة الإمارات العربية المتحدة.', image: newsone },
  { year: '2020', title: 'المقر الجديد', description: 'الافتتاح الرسمي للمقر الدائم للنادي في منطقة الآبار، ليكون مركزاً متكاملاً للأنشطة الثقافية والأدبية.', image: newstwo },
  { year: '2015', title: 'إطلاق مهرجان الشارقة للشعر', description: 'بداية تنظيم المهرجانات الشعرية الكبرى التي استضافت شعراء من كافة أنحاء الوطن العربي.', image: newsthree },
  { year: '2010', title: 'جائزة الشارقة للإبداع العربي', description: 'توسع دور النادي في دعم الجوائز الثقافية التي ترعاها دائرة الثقافة بالشارقة.', image: newsfour },
  { year: '2005', title: 'اليوبيل الأربعيني', description: 'الاحتفال بمرور 40 عاماً على تأسيس النادي، وتدشين الأرشيف الرقمي للثقافة العربية.', image: newsfive },
];

export default function About() {
  return (
    <div className="pt-25 pb-25">
      <SEO title="نبذة عنا" description="تعرف على رسالة ورؤية وأهداف النادي الثقافي العربي." />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">من نحن</h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            النادي الثقافي العربي هو بيت المبدعين ومنارة الفكر، تأسس ليكون جسراً يربط بين عراقة الماضي وإبداع المستقبل.
          </p>
        </div>        
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* CEO Message */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] border border-border shadow-lg overflow-hidden flex flex-col md:flex-row-reverse"
          >
            <div className="md:w-1/2 relative min-h-[260px] md:min-h-full">
              <ImageWithFallback
                src="@/assets/placeholder.png"
                alt="رئيس النادي"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent md:bg-gradient-to-l" />
            </div>

            <div className="md:w-1/2 p-8 md:p-12 text-right flex flex-col justify-center gap-4 bg-white">
              <div className="inline-flex items-center gap-3 justify-end mb-2">
                <span className="w-10 h-10 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                  <Quote size={20} />
                </span>
                <span className="text-sm font-bold text-club-purple">رسالة رئيس النادي</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                معاً نصنع جسراً بين الماضي العريق والمستقبل المشرق
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                يسعدنا في النادي الثقافي العربي أن نكون مساحة مفتوحة لكل صوت مبدع، ولكل فكرة تحمل
                روح التجديد والالتزام بقيمنا العربية الأصيلة. نسعى إلى أن يكون النادي بيتاً ثانياً لكل مثقف،
                وملتقى حيوياً للحوار بين الأجيال، حيث تلتقي الكلمة الجميلة مع الفعل الثقافي المؤثر.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                دعوتنا دائمة للجميع: شاركونا هذه المسيرة، وكونوا جزءاً من قصة الثقافة التي تكتب من الشارقة إلى
                العالم.
              </p>
              <div className="mt-4">
                <p className="font-bold text-primary">رئيس مجلس الإدارة</p>
                <p className="text-muted-foreground text-sm"> النادي الثقافي العربي </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[2rem] shadow-sm border border-border"
          >
            <div className="w-16 h-16 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple mb-8">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-primary">رسالتنا</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              تتمثل رسالتنا في خلق بيئة محفزة للإبداع والابتكار الثقافي، من خلال تنظيم فعاليات وبرامج نوعية تعزز حضور اللغة العربية والأدب والفكر العربي في المجتمع، وتساهم في بناء جيل مثقف وواعٍ بهويته.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-12 rounded-[2rem] shadow-sm border border-border"
          >
            <div className="w-16 h-16 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue mb-8">
              <Eye size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-primary">رؤيتنا</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              نتطلع إلى أن نكون المؤسسة الثقافية الرائدة عربياً وعالمياً في تعزيز الحوار الثقافي الإنساني، وأن تظل الشارقة وجهة لكل مثقف وباحث عن المعرفة والإبداع الأصيل.
            </p>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="mb-24">
          {/* <SectionTitle title="قيمنا الجوهرية" centered /> */}
          <div className="text-center mb-12">  
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center">قيمنا الجوهرية 
              <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-secondary/20 p-8 rounded-2xl text-center flex flex-col items-center"
              >
                <div className="text-club-purple mb-6"><value.icon size={40} strokeWidth={1.5} /></div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>

        
        </section>

        {/* Board Members */}
        <section className="mb-24">
           
          <div className="text-center mb-12">  
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center"> مجلس الإدارة   
              <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">نخبة من القامات الثقافية والأدبية التي تقود مسيرة النادي.</p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
            {boardMembers.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6 mx-auto w-48 h-48">
                  <div className="absolute inset-0 bg-club-purple rounded-full rotate-6 transition-transform group-hover:rotate-12"></div>
                  <ImageWithFallback 
                    src={member.image} 
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-club-purple font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Club History (slider) */}
        <section className="mb-24">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                <Clock size={22} />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
                تاريخ النادي
                <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              رحلة من العطاء الثقافي تمتد لعقود، نروي فيها قصة الإبداع التي انطلقت من الشارقة ووصلت إلى كل بيت عربي.
            </p>
          </div>

          {/* Smooth slider with white card background */}
          <div className="bg-white rounded-[2rem] shadow-lg border border-border p-6 md:p-8">
            <HistorySlider />
          </div>
        </section>
      </div>
    </div>
  );
};

const HistorySlider = () => {
  const [index, setIndex] = React.useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % milestones.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + milestones.length) % milestones.length);
  };

  const visibleMilestones = React.useMemo(
    () =>
      Array.from({ length: 4 }, (_, k) => milestones[(index + k) % milestones.length]),
    [index]
  );

  return (
    <div className="relative max-w-6xl mx-auto">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleMilestones.map((milestone) => (
            <div
              key={milestone.year}
              className="rounded-2xl border border-border/70 overflow-hidden bg-secondary/10 flex flex-col h-full"
            >
              <div className="relative h-40">
                <ImageWithFallback
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Clock size={14} />
                  <span>{milestone.year}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2 text-right">
                <h3 className="text-base font-bold text-primary line-clamp-2">
                  {milestone.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={next}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-club-purple text-white text-sm font-bold hover:bg-club-purple/90 transition-colors shadow-md"
        >
          <span>التالي</span>
        </button>
        <div className="flex items-center gap-2">
          {milestones.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === index ? 'bg-club-purple w-6' : 'bg-club-purple/20'
              }`}
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={prev}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-primary text-sm font-bold hover:bg-secondary/80 transition-colors border border-border"
        >
          <span>السابق</span>
        </button>
      </div>

      <p className="mt-8 text-center text-muted-foreground max-w-3xl mx-auto">
        وما زال العطاء مستمراً، مستندين إلى هذا الإرث العريق وطموحاتنا التي لا تعرف الحدود في خدمة الثقافة العربية والإنسان.
      </p>
    </div>
  );
};

