"use client";

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: 'العضوية',
    questions: [
      {
        question: 'كيف يمكنني التسجيل كعضو في النادي الثقافي العربي؟',
        answer: 'يمكنك التسجيل كعضو من خلال ملء نموذج التسجيل الإلكتروني على موقعنا، أو زيارة مقر النادي في الشارقة. نحتاج إلى بعض المعلومات الأساسية مثل الاسم الكامل، البريد الإلكتروني، رقم الهاتف، والمهنة. بعد إتمام التسجيل، ستحصل على بطاقة عضوية تمنحك حق الوصول إلى جميع الفعاليات والخدمات.'
      },
      {
        question: 'ما هي رسوم العضوية السنوية؟',
        answer: 'رسوم العضوية السنوية تختلف حسب نوع العضوية. لدينا عضوية عادية وعضوية شرفية. للتفاصيل الكاملة حول الرسوم والفوائد، يرجى زيارة صفحة "فوائد العضوية" أو التواصل معنا مباشرة.'
      },
      {
        question: 'ما هي مزايا العضوية في النادي؟',
        answer: 'تشمل مزايا العضوية: الحضور المجاني لمعظم الفعاليات الثقافية، الوصول إلى المكتبة والموارد الثقافية، خصومات على الورش والدورات التدريبية، المشاركة في الأنشطة الحصرية للأعضاء، والحصول على النشرات الإخبارية والمواد الثقافية.'
      },
      {
        question: 'هل يمكن للأطفال واليافعين الانضمام؟',
        answer: 'نعم، لدينا برامج خاصة للأطفال واليافعين تشمل ورش عمل وأنشطة ثقافية مناسبة لأعمارهم. يمكن للوالدين تسجيل أطفالهم في برامجنا المخصصة للشباب.'
      }
    ]
  },
  {
    category: 'الفعاليات والأنشطة',
    questions: [
      {
        question: 'كيف يمكنني معرفة الفعاليات القادمة؟',
        answer: 'يمكنك متابعة الفعاليات القادمة من خلال صفحة "الفعاليات" على موقعنا، أو الاشتراك في النشرة الإخبارية للحصول على تحديثات مباشرة. كما ننشر جميع الفعاليات على صفحاتنا في وسائل التواصل الاجتماعي.'
      },
      {
        question: 'هل الفعاليات مجانية أم مدفوعة؟',
        answer: 'معظم الفعاليات الثقافية مفتوحة للجمهور مجاناً. بعض الورش المتخصصة والدورات التدريبية قد تتطلب رسوم رمزية. الأعضاء يحصلون على خصومات خاصة على الفعاليات المدفوعة.'
      },
      {
        question: 'هل يمكنني اقتراح فعالية أو نشاط ثقافي؟',
        answer: 'نعم، نحن نرحب بجميع الاقتراحات! يمكنك مشاركة أفكارك من خلال صفحة "شارك آراءك واقتراحاتك" أو التواصل معنا مباشرة عبر البريد الإلكتروني. فريقنا يدرس جميع الاقتراحات ويعمل على تطويرها.'
      },
      {
        question: 'كيف يمكنني التسجيل في ورشة عمل أو دورة تدريبية؟',
        answer: 'يمكنك التسجيل من خلال صفحة الفعاليات، حيث ستجد تفاصيل كل ورشة أو دورة مع رابط التسجيل. بعض الورش تتطلب التسجيل المسبق بسبب محدودية الأماكن.'
      }
    ]
  },
  {
    category: 'المرافق والخدمات',
    questions: [
      {
        question: 'هل يمكنني حجز قاعة أو مساحة في النادي للفعاليات الخاصة؟',
        answer: 'نعم، يمكنك حجز قاعات النادي للفعاليات الخاصة مثل الندوات، الأمسيات الشعرية، أو المناسبات الثقافية. يرجى استخدام نموذج "حجز المرافق" على موقعنا أو التواصل معنا مباشرة لمعرفة التوفر والأسعار.'
      },
      {
        question: 'ما هي المرافق المتاحة في النادي؟',
        answer: 'يضم النادي قاعات محاضرات متعددة، مكتبة ثقافية، مرسم للفنون، مساحات للاجتماعات، ومقهى ثقافي. جميع المرافق مجهزة بأحدث التقنيات وتتوافق مع معايير السلامة.'
      },
      {
        question: 'هل يمكن الوصول إلى المكتبة؟',
        answer: 'نعم، المكتبة متاحة للأعضاء والزوار. تحتوي على مجموعة واسعة من الكتب والمصادر الثقافية والأدبية. يمكن للأعضاء استعارة الكتب وفقاً للوائح المكتبة.'
      }
    ]
  },
  {
    category: 'التواصل والدعم',
    questions: [
      {
        question: 'كيف يمكنني التواصل مع النادي؟',
        answer: 'يمكنك التواصل معنا عبر البريد الإلكتروني: info@shjarabclub.ae، أو الهاتف: +971 6 500 0000. كما يمكنك زيارة مقرنا في الشارقة، منطقة الآبار، ص.ب 20021. نحن متاحون من الأحد إلى الخميس من 9 صباحاً حتى 5 مساءً.'
      },
      {
        question: 'هل يمكنني التطوع في النادي؟',
        answer: 'نعم، نحن نرحب بالمتطوعين المتحمسين للمساهمة في الأنشطة الثقافية. يمكنك التطوع في تنظيم الفعاليات، إدارة المكتبة، أو المساعدة في البرامج الثقافية. يرجى التواصل معنا لمعرفة فرص التطوع المتاحة.'
      },
      {
        question: 'كيف يمكنني الإبلاغ عن مشكلة أو تقديم شكوى؟',
        answer: 'نقدر ملاحظاتك ونتطلع لتحسين خدماتنا. يمكنك استخدام صفحة "شارك آراءك واقتراحاتك" أو التواصل معنا مباشرة. سنقوم بالرد على جميع الاستفسارات والشكاوى في أقرب وقت ممكن.'
      },
      {
        question: 'هل يمكنني التبرع للنادي؟',
        answer: 'نعم، نقبل التبرعات التي تساعدنا في تطوير برامجنا الثقافية وخدماتنا. يمكنك التواصل معنا لمعرفة طرق التبرع المتاحة. جميع التبرعات تستخدم لدعم الأنشطة الثقافية والبرامج المجتمعية.'
      }
    ]
  }
];

export default function FAQ() {
  return (
    <div className="pt-25 pb-25">
      <SEO 
        title="الأسئلة الشائعة" 
        description="إجابات على الأسئلة الأكثر شيوعاً حول النادي الثقافي العربي." 
      />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="text-club-purple" size={40} />
            <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight text-black">الأسئلة الشائعة</h1>
          </div>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            ابحث عن إجابات لأسئلتك حول العضوية، الفعاليات، والخدمات
          </p>
        </div>        
      </div>

      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        {faqData.map((category, categoryIndex) => (
          <motion.section
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-12"
          >
            <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-border">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary border-r-4 border-club-purple pr-4">
                {category.category}
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${categoryIndex}-${index}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <AccordionTrigger className="text-right text-lg font-bold text-primary hover:text-club-purple py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-lg leading-relaxed pr-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.section>
        ))}

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-8 md:p-12 rounded-[2rem] border border-club-purple/20 text-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">لم تجد إجابتك؟</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              إذا كان لديك سؤال آخر، لا تتردد في التواصل معنا. نحن هنا لمساعدتك!
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg"
            >
              تواصل معنا
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
