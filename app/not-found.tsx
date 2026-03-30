"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative bg-white">

      {/* Purple blob top-right */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-club-purple opacity-10 blur-[100px] pointer-events-none" />
      {/* Blue blob bottom-left */}
      <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full bg-club-blue opacity-20 blur-[90px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl mx-auto">

        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mb-2 select-none"
        >
          <p className="font-black leading-none text-club-purple"
            style={{ fontSize: "clamp(140px, 25vw, 280px)", fontWeight: 900, WebkitTextStroke: "2px #522387" }}
          >
            404
          </p>
          {/* Floating dot decorations */}
          <span className="absolute top-6 right-4 w-4 h-4 rounded-full bg-club-purple/30 block" />
          <span className="absolute bottom-8 left-6 w-6 h-6 rounded-full bg-club-blue/40 block" />
          <span className="absolute top-1/2 -left-4 w-3 h-3 rounded-full bg-club-purple/20 block" />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-20 h-1 bg-club-purple rounded-full mx-auto mb-8"
        />

        {/* Heading & subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-black text-primary mb-4">
            عذراً، هذه الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            ربما تم نقل الصفحة أو حذفها.<br />
            دعنا نعيدك إلى المسار الصحيح.
          </p>
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-club-purple hover:bg-club-purple/90 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl shadow-club-purple/30 transition-all"
          >
            <Home size={22} />
            <span>العودة للرئيسية</span>
            <ArrowLeft size={20} />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
