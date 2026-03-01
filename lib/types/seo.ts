export interface ACFImage {
    node: {
        altText: string;
        sourceUrl: string;
    } | null;
}

export interface SEOOptions {
    seoTitle: string | null;
    metaDescription: string | null;
    focusKeyword: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: ACFImage | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: ACFImage | null;
}
