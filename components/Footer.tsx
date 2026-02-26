"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-primary text-secondary pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">               
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight"> النادي الثقافي العربي  </span>                
              </div>
            </div>
            <p className="text-secondary/70 leading-relaxed text-sm">
              مؤسسة ثقافية عربية رائدة في إمارة الشارقة، تهدف إلى تعزيز الهوية الثقافية العربية وفتح آفاق الحوار الإبداعي والفكري.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-club-purple hover:border-club-purple transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-club-purple hover:border-club-purple transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-club-purple hover:border-club-purple transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-club-purple hover:border-club-purple transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-r-4 border-club-purple pr-4">روابط سريعة</h3>
            <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
 
          <li><Link href="/about" className="hover:text-club-blue transition-colors">نبذة عنا</Link></li>
          <li><Link href="/our-programs" className="hover:text-club-blue transition-colors">برامجنا</Link></li>
          <li><Link href="/events" className="hover:text-club-blue transition-colors">الفعاليات</Link></li>
          <li><Link href="/news" className="hover:text-club-blue transition-colors">الأخبار</Link></li>    
          <li><Link href="/gallery" className="hover:text-club-blue transition-colors">معرض الصور</Link></li>
 
            </ul>
          </div>

          {/* Membership & Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-r-4 border-club-purple pr-4"> انضم إلينا </h3>
            <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
              <li><Link href="/membership-benefits" className="hover:text-club-blue transition-colors">فوائد العضوية</Link></li>
              <li><Link href="/membership-registration" className="hover:text-club-blue transition-colors">تسجيل العضوية</Link></li>
              <li><Link href="/facility-booking" className="hover:text-club-blue transition-colors">حجز المرافق</Link></li>
              <li><Link href="/share-opinions" className="hover:text-club-blue transition-colors">شارك آراءك</Link></li>
              <li><Link href="/contact" className="hover:text-club-blue transition-colors"> تواصل معنا </Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-r-4 border-club-purple pr-4">  برامجنا </h3>
            <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
              <li><Link href="/our-programs" className="hover:text-club-blue transition-colors"> البرامج الثقافية </Link></li>
              <li><Link href="/our-programs" className="hover:text-club-blue transition-colors"> الأنشطة الاجتماعية </Link></li>
              <li><Link href="/our-programs" className="hover:text-club-blue transition-colors"> برامج الأطفال واليافعين </Link></li>
              
              <li><Link href="/our-programs" className="hover:text-club-blue transition-colors"> البرامج الرياضية </Link></li>
              <li><Link href="/our-programs" className="hover:text-club-blue transition-colors"> ورش التدريب والتأهيل </Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-r-4 border-club-blue pr-4">معلومات الاتصال</h3>
            <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-club-blue" />
                <span>الشارقة، منطقة الآبار، ص.ب 20021، الإمارات العربية المتحدة</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-club-blue" />
                <span dir="ltr">+971 6 500 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-club-blue" />
                <span>info@shjarabclub.ae</span>
              </li>
            </ul>
          </div>

         
        </div>

        <div className="border-t border-secondary/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary/50">
          <p>© {currentYear} النادي الثقافي العربي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-secondary transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms-of-use" className="hover:text-secondary transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 bg-club-purple hover:bg-club-purple/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
          aria-label="العودة للأعلى"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          {/* <span className="font-bold text-sm hidden sm:inline">العودة للأعلى</span> */}
        </button>
      )}
    </footer>
  );
};
