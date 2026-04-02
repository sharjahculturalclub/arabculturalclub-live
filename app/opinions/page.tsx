import type { Metadata } from "next";
import {
    fetchOpinionPosts,
    fetchOpinionCategories,
    fetchOpinionPageOptions,
} from "@/lib/actions/site/opinionsAction";
import { OpinionsPageClient } from "./OpinionsPageClient";
import { SEO } from "@/components/SEO";
import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const [pageData, images] = await Promise.all([
        fetchOpinionPageOptions(),
        getMetadataImages(),
    ]);

    const seo = pageData?.seoOptions;
    const title = seo?.seoTitle || pageData?.pageOptions?.pageTitle || undefined;
    const description =
        stripHtml(seo?.metaDescription) || pageData?.pageOptions?.pageDescription || undefined;
    const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/opinions`;

    return {
        title,
        description,
        keywords: seo?.focusKeyword || undefined,
        alternates: { canonical: canonicalUrl },
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
            images: images.map((img) => img.url),
        },
    };
}

export default async function OpinionsPage() {
    const [opinionsData, categories, pageData] = await Promise.all([
        fetchOpinionPosts(9),
        fetchOpinionCategories(),
        fetchOpinionPageOptions(),
    ]);

    const seoOptions = pageData?.seoOptions;
    const pageOptions = pageData?.pageOptions;

    return (
        <>
            <SEO
                title={seoOptions?.seoTitle || pageOptions?.pageTitle || undefined}
                description={seoOptions?.metaDescription || pageOptions?.pageDescription || undefined}
                url={seoOptions?.canonicalUrl || `${SITE_ORIGIN}/opinions`}
                breadcrumbs={[
                    { name: "الرئيسية", item: `${SITE_ORIGIN}/` },
                    {
                        name: pageData?.title || "المقالات",
                        item: seoOptions?.canonicalUrl || `${SITE_ORIGIN}/opinions`,
                    },
                ]}
            />
            <OpinionsPageClient
                initialPosts={opinionsData.posts}
                initialHasNextPage={opinionsData.hasNextPage}
                initialEndCursor={opinionsData.endCursor}
                categories={categories}
                pageTitle={pageOptions?.pageTitle || null}
                pageDescription={pageOptions?.pageDescription || null}
                canonicalUrl={seoOptions?.canonicalUrl || null}
            />
        </>
    );
}
