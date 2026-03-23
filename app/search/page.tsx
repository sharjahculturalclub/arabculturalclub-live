import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SEO } from '@/components/SEO';
import { fetchSearchResults } from '@/lib/actions/site/newsAction';
import { SearchResultsClient } from './SearchResultsClient';
import { Loader2 } from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────── */

import { getMetadataImages } from '@/lib/utils/seo';

/* ─── Types ───────────────────────────────────────────────── */

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/* ─── Dynamic Metadata (SEO) ─────────────────────────────── */

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params?.q;
  const query = typeof q === 'string' ? q : '';
  const images = await getMetadataImages();

  return {
    title: query ? `نتائج البحث عن: ${query} | النادي الثقافي العربي` : 'البحث | النادي الثقافي العربي',
    description: `نتائج البحث عن ${query} في موقع النادي الثقافي العربي.`,
    openGraph: {
      title: query ? `نتائج البحث عن: ${query} | النادي الثقافي العربي` : 'البحث | النادي الثقافي العربي',
      description: `نتائج البحث عن ${query} في موقع النادي الثقافي العربي.`,
      url: `https://shjarabclub.ae/search?q=${encodeURIComponent(query)}`,
      siteName: 'النادي الثقافي العربي',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: query ? `نتائج البحث عن: ${query} | النادي الثقافي العربي` : 'البحث | النادي الثقافي العربي',
      description: `نتائج البحث عن ${query} في موقع النادي الثقافي العربي.`,
      images: images.map(img => img.url),
    },
  };
}


/* ─── Page Component ──────────────────────────────────────── */

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params?.q;
  const query = typeof q === 'string' ? q : '';

  const results = query ? await fetchSearchResults(query) : [];

  return (
    <div className="pt-25 pb-25">
      <SEO
        title={query ? `نتائج البحث عن: ${query}` : 'البحث'}
        description={`نتائج البحث عن ${query} في موقع النادي الثقافي العربي.`}
        url={`https://shjarabclub.ae/search?q=${encodeURIComponent(query)}`}
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: "نتائج البحث", item: "https://shjarabclub.ae/search" }
        ]}
      />
      <Suspense
        fallback={
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-club-purple" size={40} />
          </div>
        }
      >
        <SearchResultsClient query={query} results={results} />
      </Suspense>
    </div>
  );
}
