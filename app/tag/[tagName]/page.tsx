import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag, ArrowRight, ChevronLeft } from "lucide-react";

import { fetchTagWithPosts } from "@/lib/actions/site/tagAction";
import { NewsCard } from "@/components/Cards";
import { SEO } from "@/components/SEO";

import { getMetadataImages, stripHtml, SITE_ORIGIN } from "@/lib/utils/seo";
import { normalizeImageUrl } from "@/lib/utils/url";

interface PageProps {
  params: Promise<{
    tagName: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tagName } = await params;
  const tagData = await fetchTagWithPosts(tagName, 1);

  if (!tagData) {
    return {
      title: undefined,
    };
  }

  const seo = tagData.seoOptions;
  const images = await getMetadataImages();
  const canonicalUrl = seo?.canonicalUrl || `${SITE_ORIGIN}/tag/${tagName}`;

  const title = seo?.seoTitle || tagData.name || undefined;
  const description = stripHtml(seo?.metaDescription) || stripHtml(tagData.description) || undefined;

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


export default async function TagPage({ params }: PageProps) {
  const { tagName } = await params;

  // Fetch tag data and recent posts associated with it
  const tagData = await fetchTagWithPosts(tagName, 12);

  if (!tagData) {
    notFound();
  }

  const articles = tagData.posts.nodes;

  const canonicalUrl = tagData.seoOptions?.canonicalUrl || `${SITE_ORIGIN}/tag/${tagName}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": tagData.name,
    "description": tagData.description || "",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${SITE_ORIGIN}/${item.categories?.nodes?.[0]?.slug || "uncategorized"}/${item.databaseId}`,
        "name": item.title,
      })),
    },
    "inLanguage": "ar",
  };

  return (
    <div className="pt-25 pb-25 min-h-screen relative z-0">
      <SEO
        title={tagData.seoOptions?.seoTitle || (tagData.name ? `وسم: ${tagData.name}` : undefined)}
        description={tagData.seoOptions?.metaDescription || tagData.description || undefined}
        url={canonicalUrl}
        breadcrumbs={[
          { name: "الرئيسية", item: `${SITE_ORIGIN}/` },
          { name: tagData.name ? `وسم: ${tagData.name}` : undefined, item: canonicalUrl },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="container max-w-7xl mx-auto px-4 md:px-6">

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-reverse space-x-2 text-sm text-primary/40 mb-10 font-tajawal">
          <Link href="/" className="hover:text-accent-purple transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft size={14} />
          <span className="text-primary/70 truncate max-w-[200px]">
            وسم: {tagData.name}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-12">
          <Link href="/news" className="text-club-purple font-bold flex items-center gap-2 mb-6 hover:gap-3 transition-all">
            <ArrowRight size={18} />
            العودة للمركز الإعلامي
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-club-purple/10 rounded-2xl flex items-center justify-center text-club-purple shrink-0">
              <Tag size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold flex items-center flex-wrap gap-3">
              وسم: <span className="text-club-purple break-all">{tagData.name}</span>
            </h1>
          </div>
          {tagData.description ? (
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg leading-relaxed">
              {tagData.description}
            </p>
          ) : (
            <p className="text-muted-foreground">تصفح المحتوى المرتبط بهذا الوسم</p>
          )}
        </div>

        {/* Articles Grid or Empty State */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => {
              // Map related post data format to what NewsCard expects
              const mappedNews = {
                id: item.databaseId,
                title: item.title,
                date: item.date ? new Date(item.date).toLocaleDateString("ar-AE", { year: "numeric", month: "long", day: "numeric" }) : "",
                excerpt: item.excerpt ? item.excerpt.replace(/<[^>]+>/g, '').slice(0, 120) + '...' : '',
                category: item.categories?.nodes?.[0]?.name || "أخبار النادي",
                image: normalizeImageUrl(item.featuredImage?.node?.sourceUrl || ''),
                // Ensure slug is correctly fed so NewsCard constructs proper URL
                categorySlug: item.categories?.nodes?.[0]?.slug || "uncategorized",
              };

              return (
                <div key={`tag-post-${item.databaseId}`}>
                  <NewsCard news={mappedNews as any} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-secondary/20 rounded-4xl p-16 text-center border-2 border-dashed border-border">
            <h2 className="text-2xl font-bold mb-4">لا توجد مقالات مسجلة تحت هذا الوسم</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              عذراً، لم نتمكن من العثور على أي مقالات أو أخبار مرتبطة بهذا الوسم حالياً.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
