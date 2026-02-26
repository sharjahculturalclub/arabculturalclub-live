import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from 'sonner';
import { fetchLogoData } from "@/lib/actions/site/logoAction";
import { fetchHeaderMenu } from "@/lib/actions/site/headerMenuAction";

export const metadata: Metadata = {
  title: "النادي الثقافي العربي - Sharjah Arab Cultural Club",
  description: "مؤسسة ثقافية عربية رائدة في إمارة الشارقة",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch logo and menu from WordPress in parallel (checklist §2: parallelize)
  let logoUrl: string | undefined;
  let siteName: string | undefined;
  let navLinks: { title: string; path: string; children?: any[] }[] | undefined;

  try {
    const [logoData, menuData] = await Promise.all([
      fetchLogoData(),
      fetchHeaderMenu(),
    ]);

    if (logoData?.siteLogoUrl) {
      logoUrl = encodeURI(logoData.siteLogoUrl);
    }
    if (logoData?.siteInfo?.siteName) {
      siteName = logoData.siteInfo.siteName;
    }
    if (menuData && menuData.length > 0) {
      navLinks = menuData;
    }
  } catch (error) {
    console.error("Error loading layout data:", error);
  }

  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col bg-background selection:bg-club-purple selection:text-white">
        <Header logoUrl={logoUrl} siteName={siteName} navLinks={navLinks} />
        <main className="grow">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

