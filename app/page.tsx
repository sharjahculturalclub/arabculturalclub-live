import Link from "next/link";
import type { Metadata } from "next";

import { ArrowLeft, Sparkles, Play } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { EventCard, NewsCard } from "@/components/Cards";
import { VideoModal } from "@/components/HomeClient";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  fetchHomePageData,
  type HeroSection,
  type MissionVisionSection,
  type EventsSection,
  type AboutSection,
  type NewsSection,
  type PostNode,
  type HomePageSection,
} from "@/lib/actions/site/homePageAction";

export const metadata: Metadata = {
  title: "الرئيسية | النادي الثقافي العربي",
  description:
    "الموقع الرسمي للنادي الثقافي العربي في الشارقة - منارة الثقافة والأدب والإبداع العربي.",
};

/* ─── Section Renderers ───────────────────────────────────── */

function HeroSectionBlock({ hero }: { hero: HeroSection }) {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-secondary">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-accent-purple/10 to-transparent z-0" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] z-0" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/50 to-transparent z-0" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none rotate-12 z-0" />

      <div className="container max-w-7xl mx-auto relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <AnimatedSection direction="right" className="max-w-3xl">
            {hero.heroContentTag && (
              <div className="inline-flex items-center space-x-reverse space-x-3 px-6 py-2.5 bg-white/80 backdrop-blur-md border border-accent-purple/10 text-accent-purple rounded-full text-sm font-bold shadow-sm mb-6">
                <Sparkles
                  size={16}
                  className="text-accent-purple animate-pulse"
                />
                <span>{hero.heroContentTag}</span>
              </div>
            )}

            {hero.heroContentTitle && (
              <div className="space-y-4 mb-6">
                <h1 className="text-6xl md:text-6xl font-bold text-primary tracking-tight">
                  {hero.heroContentTitle}
                </h1>
                <div className="w-24 h-2 bg-accent-blue rounded-full" />
              </div>
            )}

            {hero.heroContentDescription && (
              <p className="text-xl text-primary/70 max-w-xl leading-relaxed font-medium mb-6">
                {hero.heroContentDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              {hero.heroContentButtoon && (
                <Link
                  href={hero.heroContentButtoon.url}
                  target={hero.heroContentButtoon.target || undefined}
                  className="bg-club-purple hover:bg-opacity-90 transition-all text-white px-6 py-2 rounded-xl font-bold text-md flex items-center gap-3"
                >
                  <span>{hero.heroContentButtoon.title}</span>
                  <ArrowLeft size={20} />
                </Link>
              )}

              {hero.heroVideoLink && hero.heroVideoButtonLabel && (
                <VideoModal
                  videoLink={hero.heroVideoLink}
                  videoLabel={hero.heroVideoButtonLabel}
                />
              )}
            </div>
          </AnimatedSection>

          {/* Image Side */}
          {hero.heroImage?.node?.sourceUrl && (
            <AnimatedSection direction="scale" delay={0.1} className="relative">
              <div className="relative z-20">
                <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-white">
                  <ImageWithFallback
                    src={hero.heroImage.node.sourceUrl}
                    alt={hero.heroImage.node.altText || "ثقافة الشارقة"}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

                  {/* Floating Info Badge */}
                  {(hero.heroImageTag || hero.heroImageTitle) && (
                    <div className="absolute bottom-5 right-5 left-5 p-4 bg-white/10 backdrop-blur-md rounded-[1rem] border border-white/10">
                      <div className="flex justify-between items-end">
                        <div>
                          {hero.heroImageTag && (
                            <span className="inline-block px-3 py-1 bg-accent-blue text-primary text-[10px] font-bold rounded-full mb-3 uppercase tracking-tighter">
                              {hero.heroImageTag}
                            </span>
                          )}
                          {hero.heroImageTitle && (
                            <h4 className="text-white text-2xl font-bold font-tajawal">
                              {hero.heroImageTitle}
                            </h4>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}

function MissionVisionBlock({ data }: { data: MissionVisionSection }) {
  return (
    <section className="bg-white py-24 md:px-6">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image */}
          {data.imageMissionVision?.node?.sourceUrl && (
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={data.imageMissionVision.node.sourceUrl}
                  alt={
                    data.imageMissionVision.node.altText || "رسالة النادي"
                  }
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="lg:w-1/2">
            {(data.heading || data.description) && (
              <SectionTitle
                title={data.heading || ""}
                subtitle={data.description || undefined}
              />
            )}

            {data.lists && data.lists.length > 0 && (
              <ul className="space-y-6 mb-10">
                {data.lists.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-club-purple/10 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-club-purple" />
                    </div>
                    <span className="text-lg text-muted-foreground leading-relaxed">
                      {item.addList}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {data.button && (
              <Link
                href={data.button.url}
                target={data.button.target || undefined}
                className="text-club-purple font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all underline underline-offset-8"
              >
                <span>{data.button.title}</span>
                <ArrowLeft size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventsBlock({ data }: { data: EventsSection }) {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          {data.sectionTitle && (
            <div className="[&>div]:mb-0">
              <SectionTitle title={data.sectionTitle} />
            </div>
          )}
          {data.viewAllButton && (
            <Link
              href={data.viewAllButton.url}
              target={data.viewAllButton.target || undefined}
              className="hidden md:flex items-center gap-2 text-club-purple font-bold border-b-2 border-club-purple pb-1"
            >
              {data.viewAllButton.title}
              <ArrowLeft size={18} />
            </Link>
          )}
        </div>

        {data.selectEvents?.nodes &&
          data.selectEvents.nodes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.selectEvents.nodes.map((event) => (
                <EventCard
                  key={event.eventId}
                  event={{
                    id: event.eventId,
                    title: event.title,
                    image: event.featuredImage?.node?.sourceUrl || "",
                    date: event.eventOptions?.eventDate || "",
                    location: event.eventOptions?.eventLocation || "",
                    category: event.categories?.nodes?.[0]?.name || "",
                  }}
                />
              ))}
            </div>
          )}

        {data.viewAllButton && (
          <div className="md:hidden mt-10 text-center">
            <Link
              href={data.viewAllButton.url}
              target={data.viewAllButton.target || undefined}
              className="bg-club-purple text-white px-8 py-3 rounded-xl font-bold w-full inline-block"
            >
              {data.viewAllButton.title}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutBlock({ data }: { data: AboutSection }) {
  return (
    <section className="bg-primary text-white py-24 overflow-hidden relative">
      {data.sectionBackgroundImage?.node?.sourceUrl && (
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <ImageWithFallback
            src={data.sectionBackgroundImage.node.sourceUrl}
            alt={data.sectionBackgroundImage.node.altText || "Pattern"}
            className="w-[800px]"
          />
        </div>
      )}
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {data.heading && (
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {data.heading}
            </h2>
          )}
          {data.description && (
            <p className="text-xl text-secondary/70 mb-12 leading-relaxed">
              {data.description}
            </p>
          )}

          {data.blocks && data.blocks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.blocks.map((block, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                  {block.blockTitle && (
                    <h4 className="text-club-blue text-2xl font-bold mb-4">
                      {block.blockTitle}
                    </h4>
                  )}
                  {block.blockDescription && (
                    <p className="text-secondary/60 text-sm">
                      {block.blockDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NewsBlock({ data, posts }: { data: NewsSection; posts: PostNode[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="container max-w-7xl mx-auto px-4 md:px-6 py-24">
      <div className="flex justify-between items-center mb-12">
        {data.sectionHeading && (
          <div className="[&>div]:mb-0">
            <SectionTitle title={data.sectionHeading} />
          </div>
        )}
        {data.viewAllButton && (
          <Link
            href={data.viewAllButton.url}
            target={data.viewAllButton.target || undefined}
            className="hidden md:flex items-center gap-2 text-club-purple font-bold border-b-2 border-club-purple pb-1"
          >
            {data.viewAllButton.title}
            <ArrowLeft size={18} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <NewsCard
            key={post.postId}
            news={{
              id: post.postId,
              title: post.title,
              image: post.featuredImage?.node?.sourceUrl || "",
              category: post.categories?.nodes?.[0]?.name || "",
              date: post.date
                ? new Date(post.date).toLocaleDateString("ar-AE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                : "",
              excerpt: post.excerpt?.replace(/<[^>]*>/g, "") || "",
            }}
          />
        ))}
      </div>

      {data.viewAllButton && (
        <div className="mt-12 text-center md:hidden">
          <Link
            href={data.viewAllButton.url}
            target={data.viewAllButton.target || undefined}
            className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all w-full"
          >
            {data.viewAllButton.title}
          </Link>
        </div>
      )}
    </section>
  );
}

/* ─── Section Router ──────────────────────────────────────── */
// Maps each fieldGroupName to its renderer — sections appear
// in whatever order WordPress ACF Flexible Content returns them.

function renderSection(section: HomePageSection, index: number, posts: PostNode[]) {
  switch (section.fieldGroupName) {
    case "HomePageBuilderHomePageBuilderHeroSectionLayout":
      return <HeroSectionBlock key={index} hero={section as HeroSection} />;

    case "HomePageBuilderHomePageBuilderMissionVisionSectionLayout":
      return <MissionVisionBlock key={index} data={section as MissionVisionSection} />;

    case "HomePageBuilderHomePageBuilderEventsLayout":
      return <EventsBlock key={index} data={section as EventsSection} />;

    case "HomePageBuilderHomePageBuilderAboutSectionLayout":
      return <AboutBlock key={index} data={section as AboutSection} />;

    case "HomePageBuilderHomePageBuilderNewsSectionLayout":
      return <NewsBlock key={index} data={section as NewsSection} posts={posts} />;

    default:
      return null;
  }
}

/* ─── Page Component ──────────────────────────────────────── */

export default async function Home() {
  const data = await fetchHomePageData();

  const sections = data?.sections ?? [];
  const posts = data?.posts ?? [];

  return (
    <div className="flex flex-col">
      {/* Dynamic sections — order follows WordPress ACF Flexible Content */}
      {sections.map((section, index) => renderSection(section, index, posts))}

      {/* ─── Newsletter Section (kept hardcoded as requested) ─── */}
      <section className="bg-club-purple p-12 md:p-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 border-[40px] border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-96 h-96 border-[60px] border-white rounded-full" />
        </div>
        <div className="container max-w-2xl mx-auto relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold font-tajawal mb-6">
            ابقَ على اطلاع دائم
          </h2>
          <p className="text-white/80 mb-10 text-lg">
            اشترك في نشرتنا البريدية لتصلك آخر أخبار الفعاليات والنشاطات
            الثقافية مباشرة إلى بريدك الإلكتروني.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 bg-white/20 border border-white/30 px-6 py-4 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30"
            />
            <button className="bg-white text-club-purple px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all">
              اشترك الآن
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
