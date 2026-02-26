import React from 'react';
import { SEO } from '@/components/SEO';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'; 
import { Book, Award, Globe, Music } from 'lucide-react';
import cultureBanner from '@/assets/acc-banner-3.jpg';



export default function SharjahCulture() {
  return (
    <div className="pt-25 pb-25">
      <SEO title="ثقافة الشارقة" description="اكتشف الهوية الثقافية لشارقة العلم والمعرفة." />
      
     

       <div className="bg-secondary py-10 mb-10 relative overflow-hidden text-center">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          {/* <SectionTitle title="الشارقة: عاصمة الثقافة العربية والإسلامية" subtitle="ثقافة الشارقة" /> */}
          <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight mb-4">  الشارقة..  </h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            بين عراقة التراث وحداثة الفكر
          </p>
        </div>        
      </div>



      <div className="container max-w-4xl mx-auto px-4 md:px-6">
         <div className="relative h-96 rounded-[3rem] overflow-hidden mb-12 shadow-2xl">
        {/* <ImageWithFallback src={sharjahculture}  alt="Sharjah Culture" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> */}
        <ImageWithFallback 
            src={cultureBanner} 
            alt="Culture Banner"
            className="w-full h-full object-cover"
          />
         <span className='caption'>
                    تعتبر إمارة الشارقة منارة ثقافية رائدة في المنطقة العربية، حيث أولى صاحب السمو الشيخ الدكتور سلطان بن محمد القاسمي، عضو المجلس الأعلى حاكم الشارقة، اهتماماً استثنائياً بالثقافة والفكر والفن كركائز أساسية لبناء الإنسان والمجتمع.
                  </span>          
                 
</div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-12">
            <h2 className="text-4xl font-bold mb-8 border-r-8 border-club-purple pr-6">المشروع الثقافي للشارقة</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-loose space-y-6">
              <p>
                تمثل إمارة الشارقة نموذجاً فريداً في العناية بالثقافة، حيث استطاعت بتوجيهات صاحب السمو الشيخ الدكتور سلطان بن محمد القاسمي، عضو المجلس الأعلى حاكم الشارقة، أن تبني مشروعاً ثقافياً متكاملاً يجمع بين الحفاظ على الجذور العربية والإسلامية الأصيلة والانفتاح الواعي على المنجز الإنساني العالمي.
              </p>
              <p>
                لقد نالت الشارقة ألقاباً عالمية مستحقة، منها "عاصمة الثقافة العربية" عام 1998، و"عاصمة الثقافة الإسلامية" عام 2014، و"العاصمة العالمية للكتاب" عام 2019، مما يعكس المكانة المرموقة التي تبوأتها الإمارة كمنارة للعلم والمعرفة.
              </p>
              
              

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
                    <div className="bg-accent-purple p-10 rounded-[2rem] border-r-4 border-accent-purple">
                      <h4 className="text-xl font-bold mb-4 text-accent-purple">الهوية الثقافية</h4>
                      <p className="text-base">تتميز الشارقة بتوازنها الفريد بين الأصالة والمعاصرة، حيث تجد الصروح الثقافية الحديثة جنباً إلى جنب مع المناطق التاريخية المرممة.</p>
                    </div>
                    <div className="bg-accent-blue p-10 rounded-[2rem] border-r-4 border-accent-blue">
                      <h4 className="text-xl font-bold mb-4 text-accent-blue">المبادرات العالمية</h4>
                      <p className="text-base">من معرض الكتاب إلى بينالي الفنون، تطلق الشارقة مبادرات تتجاوز الحدود الجغرافية لتصل إلى عمق الوجدان الإنساني العالمي.</p>
                    </div>
                  </div>

              <p>
                إن النادي الثقافي العربي يفخر بأنه أحد الروافد الأساسية لهذا المشروع الكبير، حيث يعمل جنباً إلى جنب مع المؤسسات الثقافية الأخرى لتعزيز الهوية ونشر قيم الإبداع.
              </p>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};
