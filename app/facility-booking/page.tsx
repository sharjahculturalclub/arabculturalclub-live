"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { SEO } from '@/components/SEO';
import { Calendar, Clock, Users, MapPin, Building, Send, CheckCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function FacilityBooking() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipNumber: '',
    facility: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    expectedAttendees: '',
    equipment: [] as string[],
    additionalServices: '',
    specialRequirements: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const facilities = [
    { value: 'main-hall', label: 'قاعة المحاضرات الكبرى', capacity: '200 شخص' },
    { value: 'small-hall', label: 'قاعة المحاضرات الصغيرة', capacity: '50 شخص' },
    { value: 'library', label: 'المكتبة', capacity: '30 شخص' },
    { value: 'art-studio', label: 'المرسم', capacity: '25 شخص' },
    { value: 'meeting-room', label: 'قاعة الاجتماعات', capacity: '15 شخص' },
    { value: 'outdoor-space', label: 'المساحة الخارجية', capacity: '100 شخص' }
  ];

  const eventTypes = [
    'ندوة',
    'أمسية شعرية',
    'ورشة عمل',
    'معرض',
    'حفل',
    'اجتماع',
    'مؤتمر',
    'أخرى'
  ];

  const equipmentOptions = [
    'شاشة عرض',
    'ميكروفونات',
    'نظام صوتي',
    'كاميرا تصوير',
    'إضاءة خاصة',
    'طاولات وكراسي إضافية',
    'معدات عرض',
    'إنترنت عالي السرعة'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الحجز.');
    
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        membershipNumber: '',
        facility: '',
        eventType: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        expectedAttendees: '',
        equipment: [],
        additionalServices: '',
        specialRequirements: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="pt-25 pb-25">
      <SEO 
        title="حجز المرافق" 
        description="احجز قاعات ومرافق النادي الثقافي العربي لفعالياتك الثقافية." 
      />
      
      {/* Hero Banner */}
      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building className="text-club-purple" size={40} />
            <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight text-black">حجز المرافق</h1>
          </div>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
            احجز قاعات ومرافق النادي لفعالياتك الثقافية والأنشطة الخاصة
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
            <h2 className="text-2xl font-bold mb-4 text-primary">تم إرسال طلب الحجز!</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              شكراً لك على طلب الحجز. سنقوم بمراجعة طلبك والتحقق من توفر المرافق والتواصل معك في أقرب وقت ممكن لتأكيد الحجز.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+97165000000" className="inline-flex items-center gap-2 text-club-purple font-bold">
                <Phone size={20} />
                <span>+971 6 500 0000</span>
              </a>
              <a href="mailto:info@shjarabclub.ae" className="inline-flex items-center gap-2 text-club-purple font-bold">
                <Mail size={20} />
                <span>info@shjarabclub.ae</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-8">
              <Building className="text-club-purple" size={32} />
              <h2 className="text-2xl font-bold text-primary">نموذج حجز المرافق</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-6 pb-6 border-b border-border">
                <h3 className="text-xl font-bold text-primary">معلومات الاتصال</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">الاسم الكامل *</label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">رقم الهاتف *</label>
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
                    <label className="text-sm font-bold text-primary">رقم العضوية (إن وجد)</label>
                    <input 
                      type="text" 
                      name="membershipNumber"
                      value={formData.membershipNumber}
                      onChange={handleInputChange}
                      placeholder="رقم العضوية" 
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-6 pb-6 border-b border-border">
                <h3 className="text-xl font-bold text-primary">تفاصيل الفعالية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Building size={16} />
                      المرافق المطلوبة *
                    </label>
                    <select 
                      required
                      name="facility"
                      value={formData.facility}
                      onChange={handleInputChange}
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    >
                      <option value="">اختر المرافق</option>
                      {facilities.map((facility) => (
                        <option key={facility.value} value={facility.value}>
                          {facility.label} ({facility.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">نوع الفعالية *</label>
                    <select 
                      required
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    >
                      <option value="">اختر نوع الفعالية</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Calendar size={16} />
                      تاريخ الفعالية *
                    </label>
                    <input 
                      required
                      type="date" 
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Clock size={16} />
                      وقت البداية *
                    </label>
                    <input 
                      required
                      type="time" 
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary flex items-center gap-2">
                      <Clock size={16} />
                      وقت النهاية *
                    </label>
                    <input 
                      required
                      type="time" 
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary flex items-center gap-2">
                    <Users size={16} />
                    العدد المتوقع للحضور *
                  </label>
                  <input 
                    required
                    type="number" 
                    name="expectedAttendees"
                    value={formData.expectedAttendees}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="عدد الأشخاص" 
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all"
                  />
                </div>
              </div>

              {/* Equipment & Services */}
              <div className="space-y-6 pb-6 border-b border-border">
                <h3 className="text-xl font-bold text-primary">المعدات والخدمات</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">المعدات المطلوبة</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {equipmentOptions.map((equipment) => (
                      <label 
                        key={equipment}
                        className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:border-club-purple hover:bg-club-purple/5 transition-all"
                      >
                        <input 
                          type="checkbox"
                          checked={formData.equipment.includes(equipment)}
                          onChange={() => handleEquipmentToggle(equipment)}
                          className="text-club-purple"
                        />
                        <span className="text-sm">{equipment}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary">خدمات إضافية</label>
                  <textarea 
                    name="additionalServices"
                    value={formData.additionalServices}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="أي خدمات إضافية مطلوبة (مثل: كافيه، ترجمة، تصوير...)" 
                    className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">متطلبات خاصة</label>
                <textarea 
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="أي متطلبات خاصة أو ملاحظات إضافية..." 
                  className="w-full bg-secondary/10 border border-border rounded-xl px-5 py-4 focus:outline-none focus:border-club-purple focus:ring-4 focus:ring-club-purple/5 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-club-purple hover:bg-opacity-90 transition-all text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-club-purple/20 flex items-center justify-center gap-3 mt-8"
              >
                <span>إرسال طلب الحجز</span>
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
          <h3 className="text-xl font-bold mb-4 text-primary">ملاحظات مهمة</h3>
          <ul className="space-y-2 text-muted-foreground text-lg leading-relaxed pr-6">
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>يجب تقديم طلب الحجز قبل أسبوعين على الأقل من تاريخ الفعالية</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>الأعضاء يحصلون على أولوية في الحجز وخصومات خاصة</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>سيتم التواصل معك خلال 3-5 أيام عمل لتأكيد الحجز</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-club-purple mt-2">•</span>
              <span>للاستفسارات العاجلة، يرجى التواصل معنا مباشرة</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
