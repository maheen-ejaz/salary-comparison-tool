import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SiteHeader } from "@/components/ui/site-header";

export const metadata: Metadata = {
  title: "Salary Comparison Tool by GooCampus World",
  description:
    "Compare your real savings potential as an Indian doctor working abroad. See take-home pay, cost of living, and how long to recover migration costs.",
  openGraph: {
    title: "Salary Comparison Tool by GooCampus World",
    description: "How much can you save as an Indian doctor working abroad?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`}>
      <body className="font-[family-name:var(--font-geist-sans)] antialiased bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
