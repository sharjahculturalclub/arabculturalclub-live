"use client";

import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
  /** Schema.org @type for the page (default: "WebPage") */
  pageType?: string;
  breadcrumbs?: { name?: string; item: string }[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  pageType = 'WebPage',
  breadcrumbs,
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

  const webPageSchema = url ? {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${url}#webpage`,
    ...(fullTitle && { "name": fullTitle }),
    ...(description && { "description": description }),
    "url": url,
    "inLanguage": "ar",
    "isPartOf": { "@id": "https://shjarabclub.ae/#website" },
    "about": { "@id": "https://shjarabclub.ae/#organization" },
    "breadcrumb": { "@id": `${url}#breadcrumb` },
  } : null;

  const validCrumbs = breadcrumbs?.filter(c => c.name) ?? [];
  const breadcrumbSchema = validCrumbs.length > 0 && url ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    "itemListElement": validCrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.item,
    })),
  } : null;

  return (
    <>
      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
};
