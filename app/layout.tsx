import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Umar Farooq | Full Stack Architect & AI Automation Expert",
  description:
    "Portfolio of Umar Farooq — Full Stack Developer specializing in Next.js, React, Node.js, AI automation, and scalable web applications.",
  keywords: [
    "Umar Farooq",
    "Full Stack Developer",
    "Next.js",
    "React",
    "AI Automation",
    "Portfolio",
    "Web Developer",
    "Node.js",
    "TypeScript",
  ],
  authors: [{ name: "Umar Farooq" }],
  openGraph: {
    title: "Umar Farooq | Full Stack Architect",
    description: "Crafting scalable digital experiences with modern web technologies and AI automation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Farooq | Full Stack Architect",
    description: "Crafting scalable digital experiences with modern web technologies and AI automation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="noise-overlay antialiased">
        {children}
      </body>
    </html>
  );
}
