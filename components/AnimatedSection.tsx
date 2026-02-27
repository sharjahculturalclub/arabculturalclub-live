"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "right" | "left" | "scale";
    delay?: number;
}

/**
 * Lightweight client wrapper for Framer Motion entrance animations.
 * Use this to wrap sections inside Server Components that need animation.
 */
export function AnimatedSection({
    children,
    className,
    direction = "up",
    delay = 0,
}: AnimatedSectionProps) {
    const variants = {
        up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
        right: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
        left: { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
        scale: {
            initial: { opacity: 0, scale: 0.9, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
        },
    };

    const v = variants[direction];

    return (
        <motion.div
            initial={v.initial}
            animate={v.animate}
            transition={{ duration: 0.8, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
