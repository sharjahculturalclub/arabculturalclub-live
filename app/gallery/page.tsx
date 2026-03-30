import type { Metadata } from "next";
import { fetchGalleries, fetchGalleryPageOptions } from "@/lib/actions/site/galleryAction";

export const revalidate = 86400;
import { GalleryPageClient } from "./GalleryPageClient";
import { SEO } from "@/components/SEO";
import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, images] = await Promise.all([
    fetchGalleryPageOptions("gallery"),
    getMetadataImages(),
  ]);

  const seo = pageData?.seoOptions;
  const title = seo?.seoTitle || pageData?.pageOptions?.pageTitle || undefined;
  const description = stripHtml(seo?.metaDescription) || pageData?.pageOptions?.pageDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/gallery`;

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


export default async function GalleryPage() {
  const [galleries, pageData] = await Promise.all([
    fetchGalleries(),
    fetchGalleryPageOptions("gallery"),
  ]);

  const seoOptions = pageData?.seoOptions;
  const pageOptions = pageData?.pageOptions;

  return (
    <>
      <SEO
        title={seoOptions?.seoTitle || pageOptions?.pageTitle || undefined}
        description={seoOptions?.metaDescription || pageOptions?.pageDescription || undefined}
        url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/gallery`}
        breadcrumbs={[
          { name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { name: pageOptions?.pageTitle || 'معرض الصور', item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/gallery` },
        ]}
      />
      <GalleryPageClient
        initialGalleries={galleries}
        pageTitle={pageOptions?.pageTitle || null}
        pageDescription={pageOptions?.pageDescription || null}
      />
    </>
  );
}
