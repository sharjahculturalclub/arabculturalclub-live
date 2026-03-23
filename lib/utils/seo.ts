import { fetchLogoData } from "@/lib/actions/site/logoAction";

/**
 * Standard OG image builder for the project
 * Fallback priority:
 * 1. SEO specific image (ACF/Yoast)
 * 2. Featured Image (for posts/pages)
 * 3. Site logo (Global CMS setting)
 * 4. Hardcoded public favicon/logo
 */
export async function getMetadataImages(seoImageUrl?: string | null, featuredImageUrl?: string | null) {
    const mainImage = seoImageUrl || featuredImageUrl;

    if (mainImage) {
        return [{ url: mainImage }];
    }

    // Attempt to fetch global site logo as final fallback
    const logoData = await fetchLogoData();
    if (logoData?.siteLogoUrl) {
        return [{ url: logoData.siteLogoUrl }];
    }

    // Last resort fallback
    return [{ url: "https://shjarabclub.ae/logo.png" }];
}
