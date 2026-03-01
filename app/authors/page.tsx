import { Metadata } from 'next';
import Link from 'next/link';
import { fetchAuthorsList, getAuthorImageUrl, getAuthorBio } from '@/lib/actions/site/authorsPageAction';
import { SEO } from '@/components/SEO';
import { BookOpen, ArrowLeft, Facebook, Twitter, Instagram, Youtube, Linkedin, Link2, type LucideIcon } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

// Map icon names from WordPress ACF to Lucide components
const socialIconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

// ── SEO Metadata ──────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'أقلام النادي | النادي الثقافي العربي',
    description: 'تعرف على نخبة من الكتاب والمبدعين المساهمين في إثراء المحتوى الثقافي للنادي.',
    alternates: {
      canonical: 'https://shjarabclub.ae/authors',
    },
    openGraph: {
      title: 'أقلام النادي | النادي الثقافي العربي',
      description: 'تعرف على نخبة من الكتاب والمبدعين المساهمين في إثراء المحتوى الثقافي للنادي.',
      url: 'https://shjarabclub.ae/authors',
      siteName: 'النادي الثقافي العربي',
      type: 'website',
    },
  };
}

// ── Page Component ────────────────────────────────────────────────
export default async function AuthorsPage() {
  const authors = await fetchAuthorsList();

  return (
    <div className="pt-25 pb-25">
      <SEO
        title="كتابنا ومبدعونا"
        description="تعرف على نخبة من الكتاب والمبدعين المساهمين في إثراء المحتوى الثقافي للنادي."
        url="https://shjarabclub.ae/authors"
        breadcrumbs={[
          { name: "الرئيسية", item: "https://shjarabclub.ae/" },
          { name: "كتابنا ومبدعونا", item: "https://shjarabclub.ae/authors" }
        ]}
      />

      <div className="py-10 mb-10 relative overflow-hidden text-center bg-secondary">
        <div className="container max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-primary">أقلام النادي</h1>
          <p className="text-x2 leading-relaxed text-primary">
            نخبة من المثقفين والأدباء الذين يساهمون بأفكارهم وإبداعاتهم في إثراء منصتنا الثقافية.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {authors.map((author) => {
              const articlesCount = author.posts?.nodes?.length || 0;
              const avatarUrl = getAuthorImageUrl(author);
              const authorBio = getAuthorBio(author);
              const authorId = author.databaseId.toString();
              const designation = author.userProfileImage?.designation;
              const socialProfiles = author.userProfileImage?.socialProfiles?.filter(s => s.iconName && s.link) || [];

              return (
                <div
                  key={author.id}
                  className="group bg-white rounded-[2.5rem] p-8 border border-border shadow-sm hover:shadow-xl hover:border-club-purple transition-all text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-club-purple transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></div>

                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-club-blue rounded-full rotate-6 group-hover:rotate-12 transition-transform"></div>
                    <ImageWithFallback
                      src={avatarUrl}
                      alt={author.name || ''}
                      className="w-full h-full object-cover rounded-full relative z-10 border-4 border-white shadow-lg"
                    />
                  </div>

                  <h2 className="text-2xl font-bold mb-2 group-hover:text-club-purple transition-colors">{author.name}</h2>
                  {designation && (
                    <p className="text-club-blue font-bold text-sm mb-4">{designation}</p>
                  )}
                  {authorBio && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                      {authorBio}
                    </p>
                  )}

                  <div className="flex items-center justify-center gap-6 mb-8 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span className="text-xs font-bold">{articlesCount} مقال</span>
                    </div>
                    {socialProfiles.length > 0 && (
                      <>
                        <div className="w-px h-4 bg-border"></div>
                        <div className="flex gap-3">
                          {socialProfiles.map((social, idx) => {
                            const IconComponent = socialIconMap[social.iconName?.toLowerCase() || ''] || Link2;
                            return (
                              <a key={idx} href={social.link!} target="_blank" rel="noopener noreferrer" className="hover:text-club-purple transition-colors">
                                <IconComponent size={18} />
                              </a>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/author/${authorId}`}
                    className="inline-flex items-center gap-2 text-club-purple font-bold group/link"
                  >
                    <span>شاهد جميع المساهمات</span>
                    <ArrowLeft size={18} className="transition-transform group-hover/link:-translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">لا يوجد كتّاب حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
