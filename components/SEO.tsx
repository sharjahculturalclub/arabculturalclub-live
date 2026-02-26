"use client";

import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  type = 'website',
  image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200' 
}) => {
  const fullTitle = `${title} | النادي الثقافي العربي`;
  
  React.useEffect(() => {
    document.title = fullTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [fullTitle, description]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "النادي الثقافي العربي",
    "url": "https://shjarabclub.ae",
    "logo": "https://shjarabclub.ae/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971-6-567-2222",
      "contactType": "customer service",
      "areaServed": "AE",
      "availableLanguage": "Arabic"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(organizationSchema)}
    </script>
  );
};
