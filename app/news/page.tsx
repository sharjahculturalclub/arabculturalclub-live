import type { Metadata } from "next";
import {
    fetchNewsPosts,
    fetchNewsCategories,
    fetchNewsPageOptions,
} from "@/lib/actions/site/newsAction";
import { NewsPageClient } from "./NewsPageClient";

export const metadata: Metadata = {
    title: "المركز الإعلامي | النادي الثقافي العربي",
    description:
        "تابع آخر الأخبار والتقارير والفعاليات في النادي الثقافي العربي بالشارقة.",
    alternates: {
        canonical: "https://shjarabclub.ae/news",
    },
    openGraph: {
        title: "المركز الإعلامي | النادي الثقافي العربي",
        description:
            "نافذتكم على أنشطة النادي، وتقاريرنا الثقافية، وإصداراتنا الأدبية المتنوعة.",
        url: "https://shjarabclub.ae/news",
        siteName: "النادي الثقافي العربي",
        type: "website",
    },
};

export default async function NewsPage() {
    // Fetch initial data server-side in parallel for SEO and fast first paint
    const [newsData, categories, pageOptions] = await Promise.all([
        fetchNewsPosts(6),
        fetchNewsCategories(),
        fetchNewsPageOptions("news"),
    ]);

    return (
        <NewsPageClient
            initialPosts={newsData.posts}
            initialHasNextPage={newsData.hasNextPage}
            initialEndCursor={newsData.endCursor}
            categories={categories}
            pageTitle={pageOptions?.pageTitle || null}
            pageDescription={pageOptions?.pageDescription || null}
        />
    );
}
