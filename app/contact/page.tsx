"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { SectionTitle } from '@/components/SectionTitle';
import { Mail, Phone, MapPin, Send, Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  return (
    <Suspense fallback={<div className="pt-25 pb-25 text-center">جاري التحميل...</div>}>
      <ContactContent />
    </Suspense>
  );
}

function ContactContent() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const defaultSubject = searchParams.get('subject');
    if (defaultSubject) {
      setSubject(defaultSubject);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.');
  };

  return (
    <div className="pt-25 pb-25">
      <SEO
        title="اتصل بنا"
        description="تواصل مع النادي الثقافي العربي."
        url="https://shjarabclub.ae/contact"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: "اتصل بنا", item: "https://shjarabclub.ae/contact" }
        ]}
      />

      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10 ">

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-primary"> تواصل معنا </h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-primary">
            نحن هنا للإجابة على استفساراتكم واقتراحاتكم.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm group hover:border-club-purple transition-all">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple mb-6 group-hover:bg-club-purple group-hover:text-white transition-all">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">العنوان</h3>
              <p className="text-muted-foreground leading-relaxed">الشارقة، منطقة الآبار، ص.ب 20021، الإمارات العربية المتحدة</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm group hover:border-club-blue transition-all">
              <div className="w-12 h-12 bg-club-blue/10 rounded-2xl flex items-center justify-center text-club-blue mb-6 group-hover:bg-club-blue group-hover:text-white transition-all">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">اتصل بنا</h3>
              <p className="text-muted-foreground text-right" dir="ltr">+971 6 567 2222</p>
              <p className="text-muted-foreground text-right" dir="ltr">+971 6 567 1111</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm group hover:border-club-purple transition-all">
              <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple mb-6 group-hover:bg-club-purple group-hover:text-white transition-all">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">البريد الإلكتروني</h3>
              <p className="text-muted-foreground">info@shjarabclub.ae</p>
              <p className="text-muted-foreground">support@shjarabclub.ae</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-border shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">الاسم بالكامل</label>
                    <input
                      required
                      type="text"
                      placeholder="أدخل اسمك"
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary px-1">البريد الإلكتروني</label>
                    <input
                      required
                      type="email"
                      placeholder="example@mail.com"
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary px-1">الموضوع</label>
                  <input
                    required
                    type="text"
                    placeholder="كيف يمكننا مساعدتك؟"
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary px-1">الرسالة</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3"
                >
                  <span>إرسال الرسالة</span>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <section className="mt-20">
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary relative inline-block">
              موقعنا على الخريطة
              <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              يمكنكم زيارتنا في مقر النادي الثقافي العربي، كما هو موضح على الخريطة أدناه.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-border shadow-lg overflow-hidden h-[320px] md:h-[420px]">
            <iframe
              title="موقع النادي الثقافي العربي"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.0286405302014!2d55.399!3d25.346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f6a1e5c00001%3A0xabcdef1234567890!2z2KfZhNiq2KzYp9mG2YrYqSDYp9mE2YXYp9mE2KfZhdiqINin2YTYt9io2YrZhA!5e0!3m2!1sar!2sae!4v1700000000000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};
