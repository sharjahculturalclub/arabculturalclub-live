"use client";

import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
  breadcrumbs?: { name?: string; item: string }[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  type = 'website',
  image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200',
  url,
  breadcrumbs
}) => {
  const fullTitle = title || undefined;

  React.useEffect(() => {
    if (fullTitle) document.title = fullTitle;
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
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

  const webPageSchema = url ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    ...(fullTitle && { "name": fullTitle }),
    ...(description && { "description": description }),
    "url": url,
    "publisher": {
      "@id": "https://shjarabclub.ae/#organization"
    }
  } : null;

  const validCrumbs = breadcrumbs?.filter(c => c.name) ?? [];
  const breadcrumbSchema = validCrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": validCrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  } : null;

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {webPageSchema && (
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </>
  );
};
