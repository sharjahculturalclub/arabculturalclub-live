"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { MessageSquare, Send, CheckCircle, Star, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareOpinions() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'suggestion',
    subject: '',
    message: '',
    rating: 0
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('شكراً لك على مشاركة رأيك! نقدر ملاحظاتك واقتراحاتك.');

    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'suggestion',
        subject: '',
        message: '',
        rating: 0
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="pt-25 pb-25">
      <SEO
        title="شارك آراءك واقتراحاتك"
        description="شاركنا آراءك واقتراحاتك لمساعدتنا في تحسين خدماتنا وبرامجنا الثقافية."
        url="https://shjarabclub.ae/share-opinions"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: "شارك آراءك واقتراحاتك", item: "https://shjarabclub.ae/share-opinions" }
        ]}
      />

      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="text-club-purple" size={40} />
            <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">شارك آراءك واقتراحاتك</h1>
          </div>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-primary">
            رأيك مهم لنا! ساعدنا في تطوير برامجنا وخدماتنا الثقافية
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[2rem] shadow-lg border border-border text-center"
          >
            <CheckCircle className="mx-auto mb-6 text-club-purple" size={64} />
            <h2 className="text-2xl font-bold mb-4 text-primary">شكراً لك!</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              تم استلام رسالتك بنجاح. نقدر وقتك وملاحظاتك القيمة. سنقوم بمراجعة اقتراحك والرد عليك في أقرب وقت ممكن.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="text-club-purple" size={32} />
              <h2 className="text-2xl font-bold text-primary">نموذج المشاركة</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">الاسم الكامل *</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك"
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">البريد الإلكتروني *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">رقم الهاتف (اختياري)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+971 XX XXX XXXX"
                  className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">نوع المشاركة *</label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                >
                  <option value="suggestion">اقتراح</option>
                  <option value="opinion">رأي</option>
                  <option value="complaint">شكوى</option>
                  <option value="compliment">إشادة</option>
                  <option value="idea">فكرة جديدة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">تقييمك لخدماتنا (اختياري)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingClick(rating)}
                      className={`p-2 rounded-lg transition-all ${formData.rating >= rating
                          ? 'text-club-purple bg-club-purple/10'
                          : 'text-gray-300 hover:text-club-purple/50'
                        }`}
                    >
                      <Star
                        size={32}
                        fill={formData.rating >= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">الموضوع *</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="موضوع رسالتك"
                  className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">رسالتك *</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="شاركنا آراءك، اقتراحاتك، أو أي ملاحظات..."
                  className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3 mt-8"
              >
                <span>إرسال الرسالة</span>
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-gradient-to-l from-club-purple/10 to-club-blue/10 p-8 rounded-[2rem] border border-club-purple/20"
        >
          <h3 className="text-xl font-bold mb-4 text-primary">لماذا مشاركة آرائك مهمة؟</h3>
          <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>تساعدنا في تحسين خدماتنا وبرامجنا الثقافية</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>نطور فعاليات وأنشطة تلبي احتياجاتكم واهتماماتكم</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>نستمع إلى جميع الآراء ونأخذها بعين الاعتبار</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>نعمل على بناء مجتمع ثقافي أفضل معاً</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
