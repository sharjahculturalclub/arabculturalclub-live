"use client";

import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { SEO } from '@/components/SEO';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryNode } from '@/lib/actions/site/galleryAction';

interface GalleryPageClientProps {
    initialGalleries: GalleryNode[];
    pageTitle: string | null;
    pageDescription: string | null;
}

export function GalleryPageClient({ initialGalleries, pageTitle, pageDescription }: GalleryPageClientProps) {
    const [selectedGallery, setSelectedGallery] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('الكل');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Extract categories dynamically from galleries
    const categories = ['الكل', ...Array.from(new Set(initialGalleries.flatMap(gallery =>
        gallery.categories?.nodes.map(cat => cat.name) || []
    )))];

    const mappedGalleries = initialGalleries.map((gallery, index) => ({
        id: index + 1,
        src: gallery.featuredImage?.node.sourceUrl || '',
        alt: gallery.featuredImage?.node.altText || gallery.title,
        category: gallery.categories?.nodes[0]?.name || 'عام',
        title: gallery.title,
        images: gallery.galleryOptions?.gallery?.nodes?.map(node => ({
            src: node.sourceUrl,
            alt: node.altText || gallery.title
        })) || []
    }));

    const filteredImages = activeTab === 'الكل'
        ? mappedGalleries
        : mappedGalleries.filter(img => img.category === activeTab);

    const openLightbox = (gallery: any) => {
        setSelectedGallery(gallery);
        setCurrentImageIndex(0);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedGallery || selectedGallery.images.length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedGallery || selectedGallery.images.length === 0) return;
        setCurrentImageIndex((prev) => (prev - 1 + selectedGallery.images.length) % selectedGallery.images.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedGallery) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') setSelectedGallery(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedGallery]);

    return (
        <div className="pt-25 pb-25">
            <SEO
                title={pageTitle || "معرض الصور | النادي الثقافي العربي"}
                description={pageDescription || "لحظات توثق حراكنا الثقافي وجماليات الإبداع في نادينا."}
            />

            <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
                <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10 ">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-black">
                        {pageTitle || "معرض الصور"}
                    </h1>
                    <p className="text-x2 max-w-2xl mx-auto leading-relaxed text-black">
                        {pageDescription || "لحظات توثق حراكنا الثقافي وجماليات الإبداع في نادينا."}
                    </p>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                {/* Filter Tabs */}
                <div className="flex justify-center flex-wrap gap-4 mb-16 mt-8">
                    {categories.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 rounded-full font-bold transition-all ${activeTab === tab
                                ? 'bg-club-purple text-white shadow-lg'
                                : 'bg-white text-muted-foreground border border-border hover:border-club-purple'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                {mounted ? (
                    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3 }}>
                        <Masonry gutter="24px">
                            {filteredImages.map((img) => (
                                <motion.div
                                    layout
                                    key={img.id}
                                    className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm"
                                    onClick={() => openLightbox(img)}
                                >
                                    <ImageWithFallback
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                            <Maximize2 size={24} />
                                        </div>
                                        <div className="text-white text-center px-4">
                                            <p className="font-bold text-lg leading-tight">{img.title}</p>
                                            <span className="text-sm opacity-80">{img.category}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                ) : (
                    <div className="min-h-[400px]" />
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence mode="wait">
                {selectedGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-1"
                        onClick={() => setSelectedGallery(null)}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-all z-20"
                            onClick={() => setSelectedGallery(null)}
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Arrows */}
                        {selectedGallery.images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 md:left-8 text-white p-3 hover:bg-white/10 rounded-full transition-all z-20"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft size={48} />
                                </button>
                                <button
                                    className="absolute right-4 md:right-8 text-white p-3 hover:bg-white/10 rounded-full transition-all z-20"
                                    onClick={nextImage}
                                >
                                    <ChevronRight size={48} />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl w-full h-full flex flex-col items-center justify-center relative p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[65vh] max-h-[65vh] flex items-center justify-center overflow-hidden">
                                <ImageWithFallback
                                    src={selectedGallery.images[currentImageIndex]?.src || selectedGallery.src}
                                    alt={selectedGallery.images[currentImageIndex]?.alt || selectedGallery.title}
                                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
                                />
                            </div>

                            <div className="mt-8 text-white text-center w-full max-w-2xl bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                                <h3 className="text-2xl font-bold mb-2">{selectedGallery.title}</h3>
                                <div className="flex items-center justify-center gap-4 text-white/60">
                                    <span className="bg-club-purple/20 text-club-purple px-3 py-1 rounded-full text-sm font-bold border border-club-purple/30">
                                        {selectedGallery.category}
                                    </span>
                                    {selectedGallery.images.length > 1 && (
                                        <span className="text-sm">
                                            {currentImageIndex + 1} / {selectedGallery.images.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
