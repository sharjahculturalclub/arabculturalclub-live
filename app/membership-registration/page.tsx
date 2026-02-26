"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MembershipRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    occupation: '',
    membershipType: 'regular',
    interests: [] as string[],
    additionalInfo: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const interestsOptions = [
    'الأدب والشعر',
    'الفنون والخط العربي',
    'المسرح',
    'الموسيقى',
    'التراث والثقافة',
    'الفلسفة والفكر',
    'التاريخ',
    'الترجمة'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    toast.success('تم إرسال طلب العضوية بنجاح! سنتواصل معك قريباً.');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        occupation: '',
        membershipType: 'regular',
        interests: [],
        additionalInfo: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="pt-25 pb-25">
      <SEO 
        title="تسجيل العضوية" 
        description="انضم إلى النادي الثقافي العربي واستمتع بجميع المزايا والخدمات الثقافية." 
      />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 text-black">تسجيل العضوية</h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            انضم إلى مجتمع المثقفين والمبدعين العرب واستمتع بجميع المزايا الحصرية
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
              تم استلام طلب العضوية بنجاح. سنقوم بمراجعة طلبك والتواصل معك في أقرب وقت ممكن عبر البريد الإلكتروني أو الهاتف.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-border"
          >
            <h2 className="text-2xl font-bold mb-8 text-primary border-r-4 border-club-purple pr-4">
              نموذج التسجيل
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary mb-4">المعلومات الشخصية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <User size={16} />
                      الاسم الكامل *
                    </label>
                    <input 
                      required
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل" 
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Mail size={16} />
                      البريد الإلكتروني *
                    </label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Phone size={16} />
                      رقم الهاتف *
                    </label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+971 XX XXX XXXX" 
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Calendar size={16} />
                      تاريخ الميلاد
                    </label>
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary flex items-center gap-2">
                    <MapPin size={16} />
                    العنوان
                  </label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="العنوان الكامل" 
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary flex items-center gap-2">
                    <Briefcase size={16} />
                    المهنة
                  </label>
                  <input 
                    type="text" 
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="المهنة أو التخصص" 
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                  />
                </div>
              </div>

              {/* Membership Type */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xl font-bold text-primary mb-4">نوع العضوية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-club-purple transition-all">
                    <input 
                      type="radio" 
                      name="membershipType"
                      value="regular"
                      checked={formData.membershipType === 'regular'}
                      onChange={handleInputChange}
                      className="text-club-purple"
                    />
                    <span className="font-bold">عضوية عادية</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-club-purple transition-all">
                    <input 
                      type="radio" 
                      name="membershipType"
                      value="honorary"
                      checked={formData.membershipType === 'honorary'}
                      onChange={handleInputChange}
                      className="text-club-purple"
                    />
                    <span className="font-bold">عضوية شرفية</span>
                  </label>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-xl font-bold text-primary mb-4">مجالات الاهتمام</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestsOptions.map((interest) => (
                    <label 
                      key={interest}
                      className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:border-club-purple hover:bg-club-purple/5 transition-all"
                    >
                      <input 
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="text-club-purple"
                      />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 pt-6 border-t border-border">
                <label className="text-sm font-bold text-primary">معلومات إضافية</label>
                <textarea 
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="أي معلومات إضافية ترغب في مشاركتها..." 
                  className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3 mt-8"
              >
                <span>إرسال طلب العضوية</span>
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};
