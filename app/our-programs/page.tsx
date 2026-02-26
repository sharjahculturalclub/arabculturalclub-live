"use client";

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { Palette, Users, Baby, Dumbbell, GraduationCap } from 'lucide-react';

const programs = [
  {
    key: 'cultural',
    title: 'البرامج الثقافية',
    subtitle: 'Cultural Programs',
    icon: Palette,
    description:
      'أمسيات شعرية، ندوات فكرية، لقاءات أدبية ومعارض كتب تعرّف الجمهور على أبرز الأصوات الإبداعية في العالم العربي.',
    points: [
      'أمسيات شعرية وقراءات أدبية',
      'ندوات وحوارات فكرية',
      'إصدارات ولقاءات مع المؤلفين',
    ],
  },
  {
    key: 'social',
    title: 'الأنشطة الاجتماعية',
    subtitle: 'Social Activities',
    icon: Users,
    description:
      'فعاليات تجمع أفراد المجتمع في أجواء حوارية وتفاعلية تعزز روح الانتماء والتعاون.',
    points: [
      'ملتقيات شهرية للأعضاء',
      'لقاءات تعريفية بالثقافات العربية',
      'مبادرات مجتمعية تطوعية',
    ],
  },
  {
    key: 'youth',
    title: 'برامج الأطفال واليافعين',
    subtitle: 'Children & Youth Programs',
    icon: Baby,
    description:
      'مساحات آمنة وإبداعية للأطفال واليافعين لتنمية حب القراءة والفنون واللغة العربية.',
    points: [
      'نوادي قراءة للأطفال',
      'ورش رسم وخط عربي',
      'برامج صيفية للشباب',
    ],
  },
  {
    key: 'sports',
    title: 'البرامج الرياضية',
    subtitle: 'Sports Programs',
    icon: Dumbbell,
    description:
      'أنشطة رياضية وترفيهية تدعم التوازن بين الصحة الجسدية والروح الثقافية.',
    points: [
      'بطولات وأنشطة ترفيهية',
      'فعاليات عائلية رياضية',
      'برامج لياقة مرافقة للفعاليات',
    ],
  },
  {
    key: 'training',
    title: 'ورش التدريب والتأهيل',
    subtitle: 'Training Workshops',
    icon: GraduationCap,
    description:
      'ورش متخصصة في الكتابة، الترجمة، إدارة الفعاليات، وصناعة المحتوى الثقافي.',
    points: [
      'دورات مهارات الكتابة الإبداعية',
      'ورش الترجمة والتحرير',
      'تدريب على تنظيم الفعاليات الثقافية',
    ],
  },
];

export default function OurPrograms() {
  return (
    <div className="pt-25 pb-25">
      <SEO
        title="برامجنا"
        description="تعرف على البرامج الثقافية والاجتماعية والرياضية وبرامج الأطفال والورش التدريبية في النادي الثقافي العربي."
      />

      {/* Hero */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">
            برامج النادي
          </h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            منظومة متكاملة من البرامج التي تخدم الثقافة والمجتمع وتفتح أبواب النادي لكل الأجيال.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-center">
              مجالات برامجنا الرئيسية
              <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full" />
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              تم تصميم هذه البرامج بعناية لتلبي احتياجات الجمهور من المعرفة، والتفاعل الثقافي، وبناء المهارات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white p-7 rounded-[1.75rem] border border-border shadow-sm hover:shadow-lg transition-all flex flex-col gap-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-club-purple/10 flex items-center justify-center text-club-purple">
                      <program.icon size={22} />
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold text-primary">{program.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {program.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {program.description}
                </p>

                <ul className="mt-2 space-y-1 text-sm text-muted-foreground pr-4">
                  {program.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-club-purple" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

