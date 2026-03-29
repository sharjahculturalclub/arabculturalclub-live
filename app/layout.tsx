import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CustomScripts from "@/components/CustomScripts";
import { Toaster } from 'sonner';
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { fetchLogoData } from "@/lib/actions/site/logoAction";
import { normalizeImageUrl } from "@/lib/utils/url";
import { fetchHeaderMenu } from "@/lib/actions/site/headerMenuAction";
import { fetchFooterSettings } from "@/lib/actions/site/footerAction";

export const metadata: Metadata = {
  title: "النادي الثقافي العربي - Sharjah Arab Cultural Club",
  description: "مؤسسة ثقافية عربية رائدة في إمارة الشارقة",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch logo, menu, and footer from WordPress in parallel (checklist §2: parallelize)
  let logoUrl: string | undefined;
  let siteName: string | undefined;
  let navLinks: { title: string; path: string; children?: any[] }[] | undefined;
  let footerData: Awaited<ReturnType<typeof fetchFooterSettings>> = null;

  try {
    const [logoData, menuData, footerResult] = await Promise.all([
      fetchLogoData(),
      fetchHeaderMenu(),
      fetchFooterSettings(),
    ]);

    if (logoData?.siteLogoUrl) {
      logoUrl = normalizeImageUrl(logoData.siteLogoUrl);
    }
    if (logoData?.siteInfo?.siteName) {
      siteName = logoData.siteInfo.siteName;
    }
    if (menuData && menuData.length > 0) {
      navLinks = menuData;
    }
    footerData = footerResult;
  } catch (error) {
    console.error("Error loading layout data:", error);
  }

  const siteScripts = footerData?.siteScripts;
  const gaId = siteScripts?.googleAnalyticsId;
  const gtmId = siteScripts?.googleTagManagerId;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://shjarabclub.ae/#organization",
    "name": "النادي الثقافي العربي - الشارقة",
    "alternateName": "Arab Cultural Club - Sharjah",
    "url": "https://shjarabclub.ae",
    "logo": logoUrl || "https://shjarabclub.ae/logo.png",
    "email": "info@shjarabclub.ae",
    "telephone": "+97165560077",
    "faxNumber": "+97165570770",
    "sameAs": [
      "https://www.facebook.com/shjarabclub/",
      "https://www.instagram.com/shjarabclub/",
      "https://www.threads.com/@shjarabclub",
      "https://x.com/shjarabclub",
      "https://www.youtube.com/@shjarabclub",
      "https://www.linkedin.com/company/shjarabclub"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+97165560077",
      "contactType": "customer service",
      "areaServed": "AE",
      "availableLanguage": "Arabic"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://shjarabclub.ae/#website",
    "url": "https://shjarabclub.ae",
    "name": "النادي الثقافي العربي - الشارقة",
    "alternateName": "Arab Cultural Club - Sharjah",
    "inLanguage": "ar",
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      {/* Google Tag Manager — via @next/third-parties */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}

      {/* Google Analytics (GA4) — via @next/third-parties */}
      {gaId && <GoogleAnalytics gaId={gaId} />}

      <body className="antialiased min-h-screen flex flex-col bg-background selection:bg-club-purple selection:text-white" suppressHydrationWarning>
        {/* Global structured data — Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Inject custom CMS code into <head>, <body>, and footer positions */}
        <CustomScripts
          headCode={siteScripts?.headTagCode || undefined}
          bodyCode={siteScripts?.bodyTagCode || undefined}
          footerCode={siteScripts?.footerTagCode || undefined}
        />

        <Header logoUrl={logoUrl} siteName={siteName} navLinks={navLinks} />
        <main className="grow">
          {children}
        </main>
        {footerData?.newsletter && (
          <Newsletter newsletter={footerData.newsletter} />
        )}
        <Footer
          contactInfo={footerData?.contactInfo}
          programs={footerData?.programs}
          joinUs={footerData?.joinUs}
          quickLinks={footerData?.quickLinks}
          about={footerData?.about}
          socialLinks={footerData?.socialLinks}
          copyright={footerData?.copyright}
        />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
