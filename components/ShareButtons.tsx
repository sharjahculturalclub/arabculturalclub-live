"use client";

import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Linkedin, Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Provide a subtle skeleton matching the size to prevent layout shift during SSR compilation
    if (!mounted) {
        return (
            <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white opacity-50 flex items-center justify-center"><Facebook size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white opacity-50 flex items-center justify-center"><Twitter size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white opacity-50 flex items-center justify-center"><Linkedin size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-club-purple text-white opacity-50 flex items-center justify-center"><Share2 size={18} /></div>
            </div>
        );
    }

    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback to copy link
            handleCopy();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // determine whether browser supports native web share for the dynamic icon
    const supportsShare = typeof navigator !== "undefined" && navigator.share;

    return (
        <div className="flex gap-2">
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-all"
                aria-label="مشاركة عبر فيسبوك"
                title="فيسبوك"
            >
                <Facebook size={18} />
            </a>
            <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-80 transition-all"
                aria-label="مشاركة عبر تويتر"
                title="تويتر"
            >
                <Twitter size={18} />
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-80 transition-all"
                aria-label="مشاركة عبر لينكد إن"
                title="لينكد إن"
            >
                <Linkedin size={18} />
            </a>
            <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-club-purple text-white flex items-center justify-center hover:opacity-80 transition-all cursor-pointer"
                aria-label="مشاركة أو نسخ الرابط"
                title="مشاركة"
            >
                {supportsShare ? <Share2 size={18} /> : (copied ? <Check size={18} /> : <LinkIcon size={18} />)}
            </button>
        </div>
    );
};
