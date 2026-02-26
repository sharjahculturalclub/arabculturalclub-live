import React from 'react';
import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0, x: centered ? 0 : 20, y: centered ? 20 : 0 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
          {title}
          <span className="absolute -bottom-2 right-0 w-16 h-1 bg-club-purple rounded-full"></span>
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-lg max-w-2xl mt-4 mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
};
