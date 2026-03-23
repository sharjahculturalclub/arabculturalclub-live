import type { Metadata } from "next";
import { fetchGalleries, fetchGalleryPageOptions } from "@/lib/actions/site/galleryAction";
import { GalleryPageClient } from "./GalleryPageClient";

import { getMetadataImages } from "@/lib/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pageOptions = await fetchGalleryPageOptions("gallery");
  const images = await getMetadataImages();

  return {
    title: pageOptions?.pageTitle || "معرض الصور | النادي الثقافي العربي",
    description: pageOptions?.pageDescription || "لحظات توثق حراكنا الثقافي وجماليات الإبداع في نادينا.",
    alternates: {
      canonical: "https://shjarabclub.ae/gallery",
    },
    openGraph: {
      title: pageOptions?.pageTitle || "معرض الصور | النادي الثقافي العربي",
      description: pageOptions?.pageDescription || "لحظات توثق حراكنا الثقافي وجماليات الإبداع في نادينا.",
      url: "https://shjarabclub.ae/gallery",
      siteName: "النادي الثقافي العربي",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: pageOptions?.pageTitle || "معرض الصور | النادي الثقافي العربي",
      description: pageOptions?.pageDescription || "لحظات توثق حراكنا الثقافي وجماليات الإبداع في نادينا.",
      images: images.map(img => img.url),
    },
  };
}


export default async function GalleryPage() {
  const [galleries, pageOptions] = await Promise.all([
    fetchGalleries(),
    fetchGalleryPageOptions("gallery"),
  ]);

  return (
    <GalleryPageClient
      initialGalleries={galleries}
      pageTitle={pageOptions?.pageTitle || null}
      pageDescription={pageOptions?.pageDescription || null}
    />
  );
}
