"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

interface VideoModalProps {
    videoLink: string;
    videoLabel: string;
}

/**
 * Extracts a YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
 */
function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    // If it's already just an ID (11 chars), return as-is
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return null;
}

export function VideoModal({ videoLink, videoLabel }: VideoModalProps) {
    const [showVideoModal, setShowVideoModal] = useState(false);

    const videoId = extractYouTubeId(videoLink);
    if (!videoId) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="group flex items-center px-4 py-2 font-tajawal font-bold text-primary hover:text-accent-purple transition-all cursor-pointer"
            >
                <div className="w-14 h-14 rounded-full border-2 border-primary/10 flex items-center justify-center bg-white shadow-lg group-hover:bg-accent-purple group-hover:border-accent group-hover:text-black transition-all duration-500">
                    <Play size={24} fill="currentColor" />
                </div>
                <span className="text-lg pr-3">{videoLabel}</span>
            </button>

            {showVideoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setShowVideoModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`فيديو: ${videoLabel}`}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setShowVideoModal(false)}
                            className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            aria-label="إغلاق"
                        >
                            <X size={24} />
                        </button>
                        <iframe
                            title={videoLabel}
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}
