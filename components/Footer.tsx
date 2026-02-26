"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUp, Facebook, Twitter, Instagram, Youtube, Linkedin, type LucideIcon } from 'lucide-react';

// Map icon names from WordPress to Lucide components
const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

interface FooterLink {
  title: string;
  url: string;
  target: string;
}

interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

interface FooterContactInfo {
  title: string;
  address: string;
  phone: string;
  email: string;
}

interface FooterAboutSection {
  title: string;
  description: string;
}

interface FooterSocialLink {
  iconName: string;
  url: string;
}

interface FooterCopyright {
  text: string;
  links: FooterLink[];
}

interface FooterProps {
  contactInfo?: FooterContactInfo;
  programs?: FooterLinkSection;
  joinUs?: FooterLinkSection;
  quickLinks?: FooterLinkSection;
  about?: FooterAboutSection;
  socialLinks?: FooterSocialLink[];
  copyright?: FooterCopyright;
}

export const Footer = ({
  contactInfo,
  programs,
  joinUs,
  quickLinks,
  about,
  socialLinks,
  copyright,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-primary text-secondary pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* About / Brand Section */}
          {about && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-xl leading-tight">{about.title}</span>
                </div>
              </div>
              <p className="text-secondary/70 leading-relaxed text-sm">
                {about.description}
              </p>
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map((social, i) => {
                    const IconComponent = iconMap[social.iconName.toLowerCase()];
                    if (!IconComponent) return null;
                    return (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-secondary/20 flex items-center justify-center hover:bg-club-purple hover:border-club-purple transition-all"
                      >
                        <IconComponent size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          {quickLinks && quickLinks.links.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-6 border-r-4 border-club-purple pr-4">{quickLinks.title}</h3>
              <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
                {quickLinks.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.url}
                      target={link.target}
                      className="hover:text-club-blue transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Join Us */}
          {joinUs && joinUs.links.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-6 border-r-4 border-club-purple pr-4">{joinUs.title}</h3>
              <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
                {joinUs.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.url}
                      target={link.target}
                      className="hover:text-club-blue transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Programs */}
          {programs && programs.links.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-6 border-r-4 border-club-purple pr-4">{programs.title}</h3>
              <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
                {programs.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.url}
                      target={link.target}
                      className="hover:text-club-blue transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {contactInfo && (
            <div>
              <h3 className="text-lg font-bold mb-6 border-r-4 border-club-blue pr-4">{contactInfo.title}</h3>
              <ul className="flex flex-col gap-4 text-secondary/70 text-sm">
                {contactInfo.address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="shrink-0 text-club-blue" />
                    <span>{contactInfo.address}</span>
                  </li>
                )}
                {contactInfo.phone && (
                  <li className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-club-blue" />
                    <span dir="ltr">{contactInfo.phone}</span>
                  </li>
                )}
                {contactInfo.email && (
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="shrink-0 text-club-blue" />
                    <span>{contactInfo.email}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

        </div>

        <div className="border-t border-secondary/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary/50">
          {copyright?.text && (
            <p>{copyright.text}</p>
          )}
          {copyright?.links && copyright.links.length > 0 && (
            <div className="flex gap-6">
              {copyright.links.map((link, i) => (
                <Link key={i} href={link.url} target={link.target} className="hover:text-secondary transition-colors">
                  {link.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 bg-club-purple hover:bg-club-purple/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
          aria-label="العودة للأعلى"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </footer>
  );
};
