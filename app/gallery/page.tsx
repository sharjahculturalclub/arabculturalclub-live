"use client";

import React, { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { SEO } from '@/components/SEO';
import { SectionTitle } from '@/components/SectionTitle';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import newsone from '@/assets/news-1.jpg';
import newstwo from '@/assets/news-2.jpg';
import newsthree from '@/assets/news-3.jpg';
import newsfour from '@/assets/news-4.jpg';
import newsfive from '@/assets/news-5.jpg';
import newssix from '@/assets/news-6.jpg';

const galleryImages = [
  { id: 1, src: newsone, category: 'فعاليات', title: 'مقر النادي' },
  { id: 2, src: newstwo, category: 'ورش', title: 'ورشة الخط' },
  { id: 3, src: newsthree, category: 'أطفال', title: 'المبدع الصغير' },
  { id: 4, src: newsfour, category: 'فعاليات', title: 'ندوة فكرية' },
  { id: 5, src: newsfive, category: 'فن', title: 'معرض تشكيلي' },
  { id: 6, src: newssix, category: 'أدب', title: 'أمسية شعرية' },

];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('الكل');

  const tabs = ['الكل', 'فعاليات', 'ورش', 'أطفال', 'فن'];

  const filteredImages = activeTab === 'الكل' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeTab);

  return (
    <div className="pt-25 pb-25">
     
        <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary"> 
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10 ">
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-black"> معرض الصور</h1>
          <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
           لحظات توثق حراكنا الثقافي وجماليات الإبداع في نادينا.
          </p>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
         

       

        {/* Filter Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-16 mt-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2 rounded-full font-bold transition-all ${
                activeTab === tab 
                ? 'bg-club-purple text-white shadow-lg' 
                : 'bg-white text-muted-foreground border border-border hover:border-club-purple'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1100: 3}}>
          <Masonry gutter="24px">
            {filteredImages.map((img) => (
              <motion.div 
                layout
                key={img.id}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm"
                onClick={() => setSelectedImage(img)}
              >
                <ImageWithFallback 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                      <Maximize2 size={24} />
                   </div>
                   <div className="text-white text-center">
                      <p className="font-bold text-lg">{img.title}</p>
                      <span className="text-sm opacity-80">{img.category}</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 backdrop-blur-sm flex items-center justify-center p-1"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="max-w-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-6 text-white text-center absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                <p className="text-white/60 mt-2">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
