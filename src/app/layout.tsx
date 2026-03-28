import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import TopBar from "@/components/TopBar/TopBar";
import AppDownloadPopup from "@/components/AppDownloadPopup/AppDownloadPopup";

import { Roboto, Playfair_Display } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Nayka Samaj",
  description: "A community platform to empower, connect, and support members of the Nayka community.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <TopBar />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <AppDownloadPopup />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
