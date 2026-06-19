import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Umar Farooq | Full Stack Architect",
  description:
    "Portfolio of Umar Farooq — Full Stack Developer specializing in Next.js, React, Node.js, and scalable web applications.",

  verification: {
    google: "36AM3dCi3Bag2st3op9fUzm1L45iMxiic3T_m5o_DwQ",
  },

  keywords: [
    "Umar Farooq",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Portfolio",
    "Web Developer",
    "Node.js",
    "TypeScript",
  ],

  authors: [{ name: "Umar Farooq" }],

  openGraph: {
    title: "Umar Farooq | Full Stack Architect",
    description:
      "Crafting scalable digital experiences with modern web technologies",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Umar Farooq | Full Stack Architect",
    description:
      "Crafting scalable digital experiences with modern web technologies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>

      <GoogleAnalytics gaId="G-YV7KJ8QWKV" />
    </html>
  );
}