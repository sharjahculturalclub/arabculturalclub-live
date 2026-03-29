import type { Metadata } from "next";
import {
    fetchNewsPosts,
    fetchNewsCategories,
    fetchNewsPageOptions,
} from "@/lib/actions/site/newsAction";
import { NewsPageClient } from "./NewsPageClient";
import { SEO } from "@/components/SEO";
import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, images] = await Promise.all([
    fetchNewsPageOptions("news"),
    getMetadataImages(),
  ]);

  const seo = pageData?.seoOptions;
  const title = seo?.seoTitle || pageData?.pageOptions?.pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || pageData?.pageOptions?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/news`;

  return {
    title,
    description,
    keywords: seo?.focusKeyword || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "النادي الثقافي العربي",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(img => img.url),
    },
  };
}


export default async function NewsPage() {
    const [newsData, categories, pageData] = await Promise.all([
        fetchNewsPosts(6),
        fetchNewsCategories(),
        fetchNewsPageOptions("news"),
    ]);

    const seoOptions = pageData?.seoOptions;
    const pageOptions = pageData?.pageOptions;

    return (
        <>
            <SEO
                title={seoOptions?.seoTitle || pageOptions?.pageTitle || undefined}
                description={seoOptions?.metaDescription || pageOptions?.pageDescription || undefined}
                url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/news`}
                breadcrumbs={[
                    { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
                    { name: pageOptions?.pageTitle || 'الأخبار', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/news` },
                ]}
            />
            <NewsPageClient
                initialPosts={newsData.posts}
                initialHasNextPage={newsData.hasNextPage}
                initialEndCursor={newsData.endCursor}
                categories={categories}
                pageTitle={pageOptions?.pageTitle || null}
                pageDescription={pageOptions?.pageDescription || null}
                canonicalUrl={seoOptions?.canonicalUrl || null}
            />
        </>
    );
}
