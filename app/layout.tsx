import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "النادي الثقافي العربي - Sharjah Arab Cultural Club",
  description: "مؤسسة ثقافية عربية رائدة في إمارة الشارقة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col bg-background selection:bg-club-purple selection:text-white">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
