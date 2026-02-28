import type { Metadata } from "next";
import { fetchGalleries, fetchGalleryPageOptions } from "@/lib/actions/site/galleryAction";
import { GalleryPageClient } from "./GalleryPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const pageOptions = await fetchGalleryPageOptions("gallery");

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
