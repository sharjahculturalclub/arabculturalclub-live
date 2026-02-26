"use client";

import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';

import { motion } from 'motion/react';
import { Calendar, Tag, User, ArrowRight, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Bookmark, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { SEO } from '@/components/SEO';



// Mock data - in a real app this would come from an API
const newsData = [
  {
    id: 1,
    title: 'النادي الثقافي العربي يطلق برنامج "المبدع الصغير" لعام 2026',
    content: `
      <p>أعلن النادي الثقافي العربي عن إطلاق الدورة الجديدة من برنامج "المبدع الصغير"، وهو مبادرة استراتيجية تهدف إلى اكتشاف وصقل المواهب الإبداعية لدى الأطفال والناشئة في دولة الإمارات العربية المتحدة.</p>
      
      <p>يأتي هذا البرنامج في إطار رؤية النادي الرامية إلى بناء جيل جديد من المثقفين والأدباء القادرين على حمل راية الثقافة العربية والاعتزاز بهويتهم الوطنية. ويتضمن البرنامج سلسلة من الورش التخصصية التي تغطي مجالات متنوعة تشمل القصة القصيرة، الشعر، الخط العربي، والرسم.</p>
      
      <h3>محاور البرنامج الرئيسية:</h3>
      <ul>
        <li><strong>ورشة فن الكتابة الإبداعية:</strong> لتمكين المشاركين من أساسيات بناء القصة والقصيدة.</li>
        <li><strong>مختبر الخط العربي:</strong> لتعليم قواعد الخط العربي والزخرفة الإسلامية.</li>
        <li><strong>نادي القراءة والتحليل:</strong> لمناقشة أهم الأعمال الأدبية الموجهة للطفل.</li>
      </ul>
      
      <p>وصرح سعادة رئيس مجلس إدارة النادي: "إن الاستثمار في عقول أطفالنا هو الاستثمار الأبقى، ومن خلال المبدع الصغير نسعى لتوفير بيئة خصبة تحتضن خيالهم وتوجه طاقاتهم نحو الإبداع المثمر الذي يخدم مجتمعهم."</p>
      
      <p>الجدير بالذكر أن البرنامج متاح لجميع الجنسيات للفئات العمرية من 7 إلى 15 عاماً، وسيقام بمقر النادي في منطقة الآبار بالشارقة خلال الفترة المسائية، مع توفير كافة المستلزمات والأدوات للمشاركين مجاناً.</p>
    `,
    date: '12 فبراير 2026',
    author: 'المركز الإعلامي',
    category: 'أخبار النادي',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200',
    tags: ['الشارقة', 'ثقافة', 'أطفال', 'إبداع', '2026']
  },
  {
    id: 2,
    title: 'وفد ثقافي من مجلس التعاون يزور مقر النادي في الشارقة',
    content: `
      <p>استقبل النادي الثقافي العربي وفداً رسمياً رفيع المستوى يمثل الأمانة العامة لمجلس التعاون لدول الخليج العربية، وذلك في إطار تعزيز التعاون الثقافي المشترك بين المؤسسات الثقافية في المنطقة.</p>
      
      <p>خلال الزيارة، اطلع الوفد على مرافق النادي المتنوعة، بما في ذلك المكتبة الضخمة التي تضم آلاف العناوين النادرة، وقاعات الندوات، والمرسم التابع للنادي. كما قدم مسؤولو النادي شرحاً مفصلاً عن الأنشطة الدورية والمهرجانات التي ينظمها النادي على مدار العام.</p>
      
      <p>وقد أشاد الوفد بالدور الريادي الذي يلعبه النادي في إثراء الساحة الثقافية العربية، وبجهود إمارة الشارقة تحت قيادة صاحب السمو الشيخ الدكتور سلطان بن محمد القاسمي في جعل الثقافة جسراً للتواصل الإنساني الراقي.</p>
    `,
    date: '10 فبراير 2026',
    author: 'قسم العلاقات العامة',
    category: 'زيارات',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200',
    tags: ['مجلس التعاون', 'دبلوماسية ثقافية', 'الشارقة', 'زيارات']
  },
  {
    id: 3,
    title: 'ندوة "مستقبل اللغة العربية في الفضاء الرقمي" تستقطب الأكاديميين',
    content: `<p>عقد النادي الثقافي العربي ندوة فكرية موسعة بعنوان "مستقبل اللغة العربية في الفضاء الرقمي"، بمشاركة نخبة من المتخصصين في اللسانيات وتقنيات المعلومات والذكاء الاصطناعي.</p>`,
    date: '5 فبراير 2026',
    author: 'د. أحمد محمود',
    category: 'ندوات',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200',
    tags: ['اللغة العربية', 'ذكاء اصطناعي', 'تكنولوجيا']
  }
];

export default function NewsDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const article = newsData.find(item => item.id === Number(id)) || newsData[0];

  const relatedNews = newsData.filter(item => item.id !== article.id).slice(0, 2);

  return (
    <div className="pb-30 pt-30 z-0 relative">
      <SEO
        title={article.title}
        description="تفاصيل الخبر من النادي الثقافي العربي"
      />

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-reverse space-x-2 text-sm text-primary/40 mb-10 font-tajawal">
          <button className="hover:text-accent-purple transition-colors" onClick={() => router.push('/')}>الرئيسية</button>
          <ChevronRight size={14} />
          <button className="hover:text-accent-purple transition-colors" onClick={() => router.push('/news')}>أخبار النادي</button>
          <ChevronRight size={14} />
          <span className="text-primary/70 truncate max-w-[200px]"> {article.title}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main Content */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-club-purple/10 text-club-purple px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <Tag size={14} />
                  {article.category}
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-2">
                  <Calendar size={14} className="text-club" />
                  {article.date}
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-2">
                  <User size={14} className="text-club" />
                  {article.author}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                {article.title}
              </h1>

              <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>

              <div
                className="text-lg text-foreground leading-relaxed space-y-8 text-justify"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Author Section */}
              <div className="mt-16 p-8 bg-white rounded-[2rem] border border-border flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow text-center md:text-right">
                  <div className="text-xs font-bold text-club-purple mb-1 uppercase tracking-wider">كاتب المقال</div>
                  <h3 className="text-xl font-bold mb-2">{article.author}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    باحث في الشأن الثقافي العربي ومهتم بتوثيق الحراك الأدبي في الشارقة. يساهم بشكل دوري في مجلة الكلمة.
                  </p>
                  <Link href="/authors" className="text-club-blue text-sm font-bold flex items-center justify-center md:justify-start gap-2 hover:gap-3 transition-all">
                    <span>عرض المزيد من مقالات الكاتب</span>
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>

              {/* Tags and Share */}
              <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag, i) => (
                    <Link
                      key={i}
                      href={`/tags/${tag}`}
                      className="bg-secondary px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-club-purple/10 hover:text-club-purple transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-muted-foreground">مشاركة:</span>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-all">
                      <Facebook size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-80 transition-all">
                      <Twitter size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-80 transition-all">
                      <Linkedin size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-club-purple text-white flex items-center justify-center hover:opacity-80 transition-all">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-12">
              {/* Latest Newsletter / Action Card */}
              <div className="bg-club-purple rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">كن أول من يعلم</h3>
                  <p className="text-white/80 mb-6 text-sm">
                    اشترك في نشرتنا البريدية لتصلك آخر أخبار وفعاليات النادي مباشرة على بريدك.
                  </p>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="بريدك الإلكتروني"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-club-blue"
                    />
                    <button className="w-full bg-white text-club-purple font-bold py-3 rounded-xl hover:bg-club-blue hover:text-white transition-all">
                      اشترك الآن
                    </button>
                  </form>
                </div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-club-blue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>

              {/* Related Articles */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-2 h-8 bg-club-blue rounded-full"></div>
                  أخبار ذات صلة
                </h3>
                <div className="space-y-6">
                  {relatedNews.map((news) => (
                    <Link key={news.id} href={`/news/${news.id}`} className="group flex gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={news.image}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-club-purple mb-1">{news.category}</span>
                        <h4 className="font-bold text-sm line-clamp-2 group-hover:text-club-purple transition-colors">
                          {news.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground mt-2">{news.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cultural Quote */}
              <div className="bg-secondary/50 p-8 rounded-3xl border border-border italic text-center">
                <p className="text-lg text-primary/80 mb-4 font-medium">
                  "الثقافة هي وعاء الحضارة، والشارقة هي حارس هذا الوعاء وأمينه."
                </p>
                <span className="text-club-purple font-bold text-sm">— مأثورة ثقافية</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-24 pt-12 border-t border-border flex justify-between items-center">
          <Link href="/news" className="flex items-center gap-3 text-club-purple font-bold hover:gap-4 transition-all">
            <ArrowRight size={20} />
            <span>العودة لجميع الأخبار</span>
          </Link>

          <button className="flex items-center gap-2 text-muted-foreground hover:text-club-purple transition-all font-medium">
            <Bookmark size={18} />
            <span>حفظ للمراجعة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
