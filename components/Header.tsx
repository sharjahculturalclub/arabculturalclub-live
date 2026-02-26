"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { Menu, X, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import fallbackLogo from '@/assets/logo-dark.svg';

interface NavLink {
  title: string;
  path: string;
  children?: NavLink[];
}

interface HeaderProps {
  logoUrl?: string;
  siteName?: string;
  navLinks?: NavLink[];
}

export const Header = ({ logoUrl, siteName, navLinks }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll(); // Check initial scroll position on mount/refresh
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // navLinks and social links come from props (fetched server-side from WordPress)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500  ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-4'}`}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">


          <div className="flex items-center cursor-pointer group">
            <Link href="/" className="flex items-center gap-2 group w-[110px]">
              <img src={logoUrl || fallbackLogo.src} alt={siteName} className="w-full h-full" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-reverse space-x-1 gap-x-2 justify-center">
            {navLinks && navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 font-tajawal text-lg font-medium transition-all relative group overflow-hidden rounded-lg ${pathname === link.path ? 'text-accent-purple bg-accent-purple' : 'text-primary/70 hover:text-accent-purple hover:bg-white/50'
                  }`}
              >
                {link.title}
              </Link>
            ))}

          </nav>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 transition-colors cursor-pointer text-black hover:text-club-purple hidden lg:block"
          >
            <Search size={20} />
          </button>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 cursor-pointer text-black"
            >
              <Search size={20} />
            </button>
            <button
              className="p-2 cursor-pointer text-black"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer (Left to Right) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-background z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">

                  <span className="text-primary font-bold">{siteName}</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-primary">
                  <X size={24} />
                </button>
              </div>

              <div className="grow overflow-y-auto p-6">
                <nav className="flex flex-col gap-2">
                  {navLinks && navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-bold py-3 flex items-center justify-between transition-colors ${pathname === link.path ? 'text-club-purple' : 'text-primary hover:text-club-purple'
                        }`}
                    >
                      <span>{link.title}</span>
                      <motion.div
                        animate={{ x: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-club-blue"
                      >
                        <Globe size={16} />
                      </motion.div>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-8 border-t border-border bg-secondary/20">
                <p className="text-sm text-muted-foreground mb-6 font-bold text-center">تابعونا على منصات التواصل</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Popup */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-4xl"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="ما الذي تبحث عنه؟..."
                  className="w-full bg-transparent border-b-4 border-white/20 pb-4 text-3xl md:text-5xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-club-purple transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute left-0 top-0 h-full flex items-center text-white/50 hover:text-club-purple transition-colors">
                  <Search size={40} />
                </button>
              </form>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="text-white/50 text-sm font-bold ml-4">عمليات بحث شائعة:</span>
                {['الشارقة', 'أمسية شعرية', 'الخط العربي', 'فعاليات 2026', 'سلطان القاسمي'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      router.push(`/search?q=${tag}`);
                      setIsSearchOpen(false);
                    }}
                    className="text-white/80 text-sm hover:text-club-blue hover:underline"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
